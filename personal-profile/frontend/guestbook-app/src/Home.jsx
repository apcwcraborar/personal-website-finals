import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
const Home = ({
  playlist,
  currentTrackIndex,
  setCurrentTrackIndex,
  onReady,
  isPlaying,
  onNextTrack,
  onPreviousTrack,
  onTogglePlayPause,
}) => {
  const currentTrack = playlist[currentTrackIndex];
  const otherTracks = playlist
    .map((track, index) => ({ ...track, index }))
    .filter((track) => track.index !== currentTrackIndex);
  const [resolvedImages, setResolvedImages] = useState(() => new Set());
  const hasReportedReady = useRef(false);

  const requiredImageSources = useMemo(() => {
    const uniqueSources = new Set(['/emo.jpg', '/separate.png', ...playlist.map((track) => track.imageSrc)]);
    return Array.from(uniqueSources);
  }, [playlist]);

  const handleImageResolved = (imageSrc) => {
    setResolvedImages((previousResolvedImages) => {
      if (previousResolvedImages.has(imageSrc)) {
        return previousResolvedImages;
      }

      const nextResolvedImages = new Set(previousResolvedImages);
      nextResolvedImages.add(imageSrc);
      return nextResolvedImages;
    });
  };

  useEffect(() => {
    if (!hasReportedReady.current && resolvedImages.size >= requiredImageSources.length) {
      hasReportedReady.current = true;
      onReady?.();
    }
  }, [onReady, requiredImageSources.length, resolvedImages]);

  return (
    <div className="container">
      {/* LEFT: PROFILE */}
      <div className="profile">
        <h1><strong>NO1 LIKE ME</strong></h1>

        <div className="profile-img">
          <img
            src="/emo.jpg"
            alt="Profile Image"
            onLoad={() => handleImageResolved('/emo.jpg')}
            onError={() => handleImageResolved('/emo.jpg')}
          />
        </div>

        <div className="center-align">
          <h2>Wenchie Arhowen Raborar</h2>
          <Link to="/gallery">View my piccys XD</Link>
          <br />
          <Link to="/">Open Guestbook</Link>
        </div>

        <div className="padding-top">
          <img
            src="/separate.png"
            alt="separator"
            width="395.60"
            height="30.9"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
              handleImageResolved('/separate.png');
            }}
            onLoad={() => handleImageResolved('/separate.png')}
          />
        </div>

        <div className="about-card">
          <div className="about-header">ABOUT ME</div>
          <div className="about-body">
            <p className="quote">
              "I've got one DEMAND.<br />
              Show me OVERWHELMING SKILL."
            </p>
            <span className="author">– Narumi Gen</span>
          </div>
        </div>
      </div>

      {/* CENTER: DETAILS */}
      <div className="info-section">
        <div className="info-card">
          <div className="info-header">Education / Achievement</div>
          <div className="info-body">
            <p>
              Brainshire Science School - Grade 3-7<br />
              Pasay City South Highschool - Grade 8-12<br />
              Aia Pacific College - Current<br />
              Animation NCII
            </p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-header">Course</div>
          <div className="info-body">
            <p>Bachelor of Science and Information Technology</p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-header">IT Experience</div>
          <div className="info-body">
            <p>
              Packet Tracer, Outsystems,<br />
              Java Programming, Python<br />
              Senior Highschool Course (ICT)
            </p>
          </div>
        </div>

        <div className="likes-hobbies-table">
          <div className="lh-column">
            <div className="lh-header">LIKES</div>
            <div className="lh-cell">
              <ul className="heart-list">
                <li>PINK</li>
                <li>SCENECORE & EMO</li>
                <li>HAWKS AND NARUMI-TAICHOU!!!</li>
                <li>Ateez (MATZ FTW)</li>
                <li>6arelyhuman</li>
              </ul>
            </div>
          </div>

          <div className="lh-column">
            <div className="lh-header">HOBBIES</div>
            <div className="lh-cell">
              <ul className="heart-list">
                <li>Drawing</li>
                <li>Gaming</li>
                <li>Reading</li>
                <li>Origami</li>
                <li>Doomscrolling</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="goals">
          <strong>Goals:</strong> Get me out of here alive.
        </div>
      </div>

      {/* RIGHT: MUSIC PLAYER */}
      <div className="music">
        <h2>Now Playing</h2>
        <div className="music-img">
          <img
            src={currentTrack.imageSrc}
            alt={currentTrack.imageAlt}
            onLoad={() => handleImageResolved(currentTrack.imageSrc)}
            onError={() => handleImageResolved(currentTrack.imageSrc)}
          />
        </div>
        <div className="center-align">
          <h3>{currentTrack.title}</h3>
          <h4>{currentTrack.artist}</h4>
        </div>

        <div className="music-controls" aria-label="Music controls">
          <button type="button" className="music-control-button" aria-label="Previous track" onClick={onPreviousTrack}>⏮</button>
          <button
            type="button"
            className="music-control-button"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={onTogglePlayPause}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button type="button" className="music-control-button" aria-label="Next track" onClick={onNextTrack}>⏭</button>
        </div>

        <div className="song-list">
          {otherTracks.map((track) => (
            <button
              key={track.audioSrc}
              type="button"
              className="song-card"
              onClick={() => setCurrentTrackIndex(track.index)}
            >
              <img
                src={track.imageSrc}
                alt={track.imageAlt}
                className="song-card-image"
                onLoad={() => handleImageResolved(track.imageSrc)}
                onError={() => handleImageResolved(track.imageSrc)}
              />
              <div className="song-card-info">
                <h3>{track.title}</h3>
                <h4>{track.artist}</h4>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
