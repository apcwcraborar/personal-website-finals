import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { createEntry, getEntries } from "./api";
import Home from "./Home";
import "./styles.css";

const galleryImages = [
  "/gallery/comms6.png",
  "/gallery/Jashy_20251225214936.png",
  "/gallery/comms1.png",
  "/gallery/comms4.png",
  "/gallery/cat.jpg",
  "/gallery/comms2.png",
  "/gallery/comms3.png",
  "/gallery/comms 1_wm1.png",
  "/gallery/special.png",
  "/gallery/flins.png",
  "/gallery/comms.png",
  "/gallery/repost_1.png",
  "/gallery/comms5.png",
];

const tracks = [
  {
    title: "Faster N Harder (Instrumental)",
    artist: "6arelyhuman",
    audioSrc: "/Sassy Scene - Faster n Harder (Instrumental).mp3",
    imageSrc: "/internetfame.png",
    imageAlt: "Sassy Scene",
  },
  {
    title: "ON DAT BXTCH [Instrumental]",
    artist: "Lumi Athena",
    audioSrc: "/Lumi Athena - ON DAT BXTCH [INSTRUMENTAL].mp3",
    imageSrc: "/on dat b.jpg",
    imageAlt: "ON DAT BXTCH cover",
  },
  {
    title: "DANCE! Till We Die",
    artist: "6arelyhuman",
    audioSrc: "/DANCE! Till We Die.mp3",
    imageSrc: "/dance til we die.jpg",
    imageAlt: "DANCE! Till We Die cover",
  },
];

function shufflePlaylist(list) {
  const shuffled = [...list];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function GuestbookPage({ onReady }) {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadEntries() {
      try {
        const data = await getEntries();
        if (isMounted) {
          setEntries(data);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message);
        }
      } finally {
        if (isMounted) {
          onReady?.();
        }
      }
    }

    loadEntries();

    return () => {
      isMounted = false;
    };
  }, [onReady]);

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
        <div className="card-header-row">
          <h1>WENSI</h1>
          <Link to="/home" className="header-link">Go to Main Page</Link>
        </div>

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
      </div>
    </div>
  );
}

function GalleryPage({ onReady }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadedGalleryImages, setLoadedGalleryImages] = useState(() => new Set());

  const handleGalleryImageResolved = (imageSrc) => {
    setLoadedGalleryImages((previousLoadedImages) => {
      if (previousLoadedImages.has(imageSrc)) {
        return previousLoadedImages;
      }

      const nextLoadedImages = new Set(previousLoadedImages);
      nextLoadedImages.add(imageSrc);
      return nextLoadedImages;
    });
  };

  useEffect(() => {
    if (loadedGalleryImages.size === galleryImages.length) {
      onReady?.();
    }
  }, [loadedGalleryImages, onReady]);

  return (
    <div className="page gallery-page">
      <div className="card gallery-card">
        <div className="gallery-header-row">
          <Link to="/home" className="gallery-back-link" aria-label="Back to Main Page">←</Link>
          <h1>My Piccys</h1>
        </div>
        <div className="gallery-grid">
          {galleryImages.map((src) => (
            <div key={src} className="gallery-item">
              <button
                type="button"
                className="gallery-image-button"
                onClick={() => setSelectedImage(src)}
              >
                <img
                  src={src}
                  alt="Gallery"
                  className="gallery-image"
                  onLoad={() => handleGalleryImageResolved(src)}
                  onError={() => handleGalleryImageResolved(src)}
                />
              </button>
            </div>
          ))}
        </div>

        {selectedImage && (
          <div
            className="gallery-dialog-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
            onClick={() => setSelectedImage(null)}
          >
            <div className="gallery-dialog-content" onClick={(event) => event.stopPropagation()}>
              <button
                type="button"
                className="gallery-dialog-close"
                aria-label="Close image preview"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </button>
              <img src={selectedImage} alt="Full size gallery" className="gallery-dialog-image" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const playlist = useMemo(() => shufflePlaylist(tracks), []);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isRouteLoading, setIsRouteLoading] = useState(true);
  const currentTrack = playlist[currentTrackIndex];

  const handleRouteReady = useCallback((path) => {
    if (location.pathname === path) {
      setIsRouteLoading(false);
    }
  }, [location.pathname]);

  const onGuestbookReady = useCallback(() => handleRouteReady("/"), [handleRouteReady]);
  const onHomeReady = useCallback(() => handleRouteReady("/home"), [handleRouteReady]);
  const onGalleryReady = useCallback(() => handleRouteReady("/gallery"), [handleRouteReady]);

  useEffect(() => {
    setIsRouteLoading(true);
  }, [location.pathname]);

  const handleTrackEnd = () => {
    setCurrentTrackIndex((previousIndex) => (previousIndex + 1) % playlist.length);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<GuestbookPage onReady={onGuestbookReady} />} />
        <Route
          path="/home"
          element={(
            <Home
              playlist={playlist}
              currentTrackIndex={currentTrackIndex}
              setCurrentTrackIndex={setCurrentTrackIndex}
              onReady={onHomeReady}
            />
          )}
        />
        <Route path="/gallery" element={<GalleryPage onReady={onGalleryReady} />} />
      </Routes>

      <audio key={currentTrack.audioSrc} autoPlay onEnded={handleTrackEnd} style={{ display: "none" }}>
        <source src={currentTrack.audioSrc} type="audio/mpeg" />
      </audio>

      {isRouteLoading && (
        <div className="route-loading-overlay" aria-live="polite" aria-label="Loading">
          <div className="route-loading-heart">❤</div>
          <div className="route-loading-text">Loading...</div>
        </div>
      )}
    </>
  );
}
