#!/usr/bin/env python3
"""Small loopback-only password/session service for the private MarknPost log."""

from collections import deque
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import hashlib
import hmac
import json
import os
import threading
import time


HOST = "127.0.0.1"
PORT = int(os.environ.get("LOG_AUTH_PORT", "8767"))
COOKIE_NAME = "MNP_LOG_SESSION"
SESSION_TTL = 4 * 60 * 60
PASSWORD_ROUNDS = int(os.environ.get("LOG_PASSWORD_ROUNDS", "600000"))
PASSWORD_SALT = bytes.fromhex(os.environ["LOG_PASSWORD_SALT"])
PASSWORD_DERIVED = bytes.fromhex(os.environ["LOG_PASSWORD_DERIVED"])
SESSION_SECRET = bytes.fromhex(os.environ["LOG_SESSION_SECRET"])

ATTEMPT_WINDOW = 10 * 60
MAX_FAILED_ATTEMPTS = 5
attempts = {}
attempts_lock = threading.Lock()


def password_matches(candidate):
    if not isinstance(candidate, str) or not candidate or len(candidate) > 256:
        candidate = "\0" * 257
    first_hash = hashlib.sha256(candidate.encode("utf-8", errors="replace")).digest()
    derived = hashlib.pbkdf2_hmac("sha256", first_hash, PASSWORD_SALT, PASSWORD_ROUNDS)
    return hmac.compare_digest(derived, PASSWORD_DERIVED)


def valid_session(cookie_header):
    jar = SimpleCookie()
    try:
        jar.load(cookie_header or "")
        value = jar[COOKIE_NAME].value
        expires_text, nonce, signature = value.split(".", 2)
        expires = int(expires_text)
    except (KeyError, ValueError, TypeError):
        return False

    now = int(time.time())
    if expires <= now or expires > now + SESSION_TTL + 30 or len(nonce) < 24:
        return False
    payload = f"{expires}.{nonce}".encode("ascii")
    expected = hmac.new(SESSION_SECRET, payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


def allowed_attempt(remote_addr):
    now = time.monotonic()
    with attempts_lock:
        queue = attempts.setdefault(remote_addr, deque())
        while queue and queue[0] <= now - ATTEMPT_WINDOW:
            queue.popleft()
        if len(queue) >= MAX_FAILED_ATTEMPTS:
            return False
        if len(attempts) > 2048:
            for address in list(attempts):
                old = attempts[address]
                while old and old[0] <= now - ATTEMPT_WINDOW:
                    old.popleft()
                if not old:
                    attempts.pop(address, None)
        return True


def record_failure(remote_addr):
    now = time.monotonic()
    with attempts_lock:
        queue = attempts.setdefault(remote_addr, deque())
        while queue and queue[0] <= now - ATTEMPT_WINDOW:
            queue.popleft()
        queue.append(now)


class Handler(BaseHTTPRequestHandler):
    server_version = ""
    sys_version = ""

    def log_message(self, _format, *_args):
        # Never write passwords, cookies, or IP addresses to service logs.
        return

    def send_json(self, status, payload, extra_headers=()):
        body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        for name, value in extra_headers:
            self.send_header(name, value)
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path != "/check":
            self.send_error(404)
            return
        if valid_session(self.headers.get("Cookie", "")):
            self.send_response(204)
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
        else:
            self.send_json(401, {"ok": False})

    def do_POST(self):
        if self.path != "/login":
            self.send_error(404)
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            self.send_json(400, {"ok": False})
            return
        if length < 1 or length > 2048:
            self.send_json(400, {"ok": False})
            return
        try:
            body = json.loads(self.rfile.read(length))
        except (json.JSONDecodeError, UnicodeDecodeError):
            self.send_json(400, {"ok": False})
            return

        remote_addr = self.headers.get("X-Real-IP", "unknown")[:64]
        if not allowed_attempt(remote_addr):
            self.send_json(429, {"ok": False, "error": "rate_limited"})
            return
        if not password_matches(body.get("password") if isinstance(body, dict) else None):
            record_failure(remote_addr)
            self.send_json(401, {"ok": False, "error": "invalid_password"})
            return

        with attempts_lock:
            attempts.pop(remote_addr, None)
        expires = int(time.time()) + SESSION_TTL
        nonce = os.urandom(24).hex()
        payload = f"{expires}.{nonce}".encode("ascii")
        signature = hmac.new(SESSION_SECRET, payload, hashlib.sha256).hexdigest()
        value = f"{expires}.{nonce}.{signature}"
        cookie = (
            f"{COOKIE_NAME}={value}; Path=/log; Max-Age={SESSION_TTL}; "
            "HttpOnly; Secure; SameSite=Strict"
        )
        self.send_json(200, {"ok": True}, (("Set-Cookie", cookie),))


class Server(ThreadingHTTPServer):
    daemon_threads = True
    allow_reuse_address = True


if __name__ == "__main__":
    Server((HOST, PORT), Handler).serve_forever()
