import os
from datetime import datetime, timezone
from functools import wraps

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from supabase import Client, create_client

load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET_KEY", "dev-secret-change-me")
serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
CORS(app, resources={r"/api/*": {"origins": [frontend_origin]}}, supports_credentials=True)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not supabase_url or not supabase_key:
    raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.")

supabase: Client = create_client(supabase_url, supabase_key)

GUESTBOOK_TABLE = os.getenv("SUPABASE_GUESTBOOK_TABLE", "guestbook_entries")
LOGIN_USERNAME = os.getenv("APP_LOGIN_USERNAME", "admin")
LOGIN_PASSWORD = os.getenv("APP_LOGIN_PASSWORD", "password123")
AFTER_LOGIN_URL = os.getenv("AFTER_LOGIN_URL", "/main.html")
TOKEN_MAX_AGE_SECONDS = int(os.getenv("TOKEN_MAX_AGE_SECONDS", "86400"))


def generate_token(username: str) -> str:
    return serializer.dumps({"username": username})


def verify_token(token: str):
    return serializer.loads(token, max_age=TOKEN_MAX_AGE_SECONDS)


def requires_auth(handler):
    @wraps(handler)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing bearer token"}), 401

        token = auth_header.removeprefix("Bearer ").strip()
        try:
            verify_token(token)
        except SignatureExpired:
            return jsonify({"error": "Token expired"}), 401
        except BadSignature:
            return jsonify({"error": "Invalid token"}), 401

        return handler(*args, **kwargs)

    return wrapper


@app.get("/api/health")
def health_check():
    return jsonify({"status": "ok", "time": datetime.now(timezone.utc).isoformat()})


@app.post("/api/auth/login")
def login():
    payload = request.get_json(silent=True) or {}
    username = payload.get("username", "")
    password = payload.get("password", "")

    if username != LOGIN_USERNAME or password != LOGIN_PASSWORD:
        return jsonify({"error": "Invalid credentials"}), 401

    token = generate_token(username)
    return jsonify({"token": token, "redirectUrl": AFTER_LOGIN_URL})


@app.get("/api/entries")
@requires_auth
def list_entries():
    response = (
        supabase.table(GUESTBOOK_TABLE)
        .select("id,name,message,created_at")
        .order("created_at", desc=True)
        .execute()
    )
    return jsonify(response.data or [])


@app.post("/api/entries")
@requires_auth
def create_entry():
    payload = request.get_json(silent=True) or {}
    name = str(payload.get("name", "")).strip()
    message = str(payload.get("message", "")).strip()

    if not name or not message:
        return jsonify({"error": "name and message are required"}), 400

    response = (
        supabase.table(GUESTBOOK_TABLE)
        .insert({"name": name, "message": message})
        .execute()
    )
    created = (response.data or [None])[0]
    return jsonify(created), 201


@app.put("/api/entries/<entry_id>")
@requires_auth
def update_entry(entry_id):
    payload = request.get_json(silent=True) or {}
    name = str(payload.get("name", "")).strip()
    message = str(payload.get("message", "")).strip()

    update_data = {}
    if name:
        update_data["name"] = name
    if message:
        update_data["message"] = message

    if not update_data:
        return jsonify({"error": "At least one of name or message is required"}), 400

    response = (
        supabase.table(GUESTBOOK_TABLE)
        .update(update_data)
        .eq("id", entry_id)
        .execute()
    )

    updated = (response.data or [None])[0]
    if not updated:
        return jsonify({"error": "Entry not found"}), 404

    return jsonify(updated)


@app.delete("/api/entries/<entry_id>")
@requires_auth
def delete_entry(entry_id):
    response = supabase.table(GUESTBOOK_TABLE).delete().eq("id", entry_id).execute()
    deleted = response.data or []

    if not deleted:
        return jsonify({"error": "Entry not found"}), 404

    return jsonify({"message": "Entry deleted", "id": entry_id})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=True)
