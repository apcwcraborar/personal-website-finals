import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { createEntry, getEntries } from "./api";
import Home from "./Home";
import "./styles.css";

function GuestbookPage() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadEntries() {
      try {
        const data = await getEntries();
        setEntries(data);
      } catch (fetchError) {
        setError(fetchError.message);
      }
    }

    loadEntries();
  }, []);

  async function handleCreate(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await createEntry({ name, message });
      const data = await getEntries();
      setEntries(data);
      setName("");
      setMessage("");
    } catch (createError) {
      setError(createError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Guestbook</h1>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleCreate} className="entry-form">
          <label>
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              disabled={isSubmitting}
            />
          </label>
          <label>
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message"
              required
              disabled={isSubmitting}
              rows="4"
            />
          </label>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Message"}
          </button>
        </form>

        <div className="entries-section">
          <h2>Messages ({entries.length})</h2>
          {entries.length === 0 ? (
            <p>No messages yet. Be the first to leave one!</p>
          ) : (
            <ul className="entry-list">
              {entries.map((entry) => (
                <li key={entry.id} className="entry">
                  <h3>{entry.name}</h3>
                  <p>{entry.message}</p>
                  <small>{new Date(entry.created_at).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="actions-row">
          <a href="/home">Go to Main Page</a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GuestbookPage />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}
