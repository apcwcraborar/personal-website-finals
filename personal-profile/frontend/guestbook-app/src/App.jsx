import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { createEntry, deleteEntry, getEntries, login, updateEntry } from "./api";
import Home from "./Home";

const TOKEN_KEY = "guestbookToken";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data = await login(username, password);
      localStorage.setItem(TOKEN_KEY, data.token);
      navigate("/guestbook");
    } catch (submitError) {
      setError(submitError.message);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page">
      <form className="card" onSubmit={handleSubmit}>
        <h1>Guestbook Login</h1>
        <label>
          Username
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
        <button
          type="button"
          className="secondary"
          onClick={() => navigate("/guestbook")}
        >
          Open Guestbook Here
        </button>
      </form>
    </div>
  );
}

function GuestbookPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingMessage, setEditingMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem(TOKEN_KEY);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    async function loadEntries() {
      try {
        const data = await getEntries(token);
        setEntries(data);
      } catch (fetchError) {
        setError(fetchError.message);
      }
    }

    loadEntries();
  }, [navigate, token]);

  async function handleCreate(event) {
    event.preventDefault();
    setError("");

    try {
      await createEntry(token, { name, message });
      const data = await getEntries(token);
      setEntries(data);
      setName("");
      setMessage("");
    } catch (createError) {
      setError(createError.message);
    }
  }

  function startEdit(entry) {
    setEditingId(entry.id);
    setEditingName(entry.name);
    setEditingMessage(entry.message);
  }

  async function handleUpdate(id) {
    setError("");

    try {
      await updateEntry(token, id, {
        name: editingName,
        message: editingMessage,
      });
      const data = await getEntries(token);
      setEntries(data);
      setEditingId(null);
      setEditingName("");
      setEditingMessage("");
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  async function handleDelete(id) {
    setError("");

    try {
      await deleteEntry(token, id);
      setEntries((current) => current.filter((entry) => entry.id !== id));
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    navigate("/");
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Guestbook</h1>
        <p>
          Separate page from your main profile. Use this page for create/read/update/delete.
        </p>

        <form onSubmit={handleCreate} className="entry-form">
          <input
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <textarea
            placeholder="Message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
          />
          <button type="submit">Post</button>
        </form>

        {error ? <p className="error">{error}</p> : null}

        <ul className="entry-list">
          {entries.map((entry) => (
            <li key={entry.id}>
              {editingId === entry.id ? (
                <>
                  <input
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                  />
                  <textarea
                    value={editingMessage}
                    onChange={(event) => setEditingMessage(event.target.value)}
                  />
                  <button onClick={() => handleUpdate(entry.id)}>Save</button>
                  <button
                    className="secondary"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3>{entry.name}</h3>
                  <p>{entry.message}</p>
                  <small>{entry.created_at}</small>
                  <div className="entry-actions">
                    <button onClick={() => startEdit(entry)}>Edit</button>
                    <button
                      className="danger"
                      onClick={() => handleDelete(entry.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        <div className="actions-row">
          <button className="secondary" onClick={handleLogout}>
            Logout
          </button>
          <a href="/">Go to Main Page</a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/guestbook" element={<GuestbookPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
