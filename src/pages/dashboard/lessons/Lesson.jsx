import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../libs/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  FaArrowLeft,
  FaPlayCircle,
  FaExternalLinkAlt,
  FaFileAlt,
  FaGlobe,
} from "react-icons/fa";
import BottomNav from "../../../components/Nav";

// ── EMBED HELPERS ─────────────────────────────────────


function getYouTubeId(url) {
  try {
    const u = new URL(url);

    // youtu.be/abc123
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1).split("?")[0];
    }

    // youtube.com/watch?v=abc123
    if (u.searchParams.get("v")) {
      return u.searchParams.get("v");
    }

    // youtube.com/embed/abc123
    if (u.pathname.includes("/embed/")) {
      return u.pathname.split("/embed/")[1].split("?")[0];
    }

    // youtube.com/shorts/abc123
    if (u.pathname.includes("/shorts/")) {
      return u.pathname.split("/shorts/")[1].split("?")[0];
    }

    // youtube.com/live/abc123
    if (u.pathname.includes("/live/")) {
      return u.pathname.split("/live/")[1].split("?")[0];
    }

  } catch (err) {
    console.error("Invalid URL:", url);
  }

  return null;
}

function getGoogleDocsEmbedUrl(url) {
  // Docs, Sheets, Slides — append /preview or /embed
  if (/docs\.google\.com\/(document|spreadsheets|presentation)/.test(url)) {
    const clean = url.split("?")[0].replace(/\/(edit|pub|view|preview|embed)$/, "");
    if (/spreadsheets/.test(url)) return `${clean}/preview`;
    if (/presentation/.test(url)) return `${clean}/embed?start=false&loop=false&delayms=3000`;
    return `${clean}/preview`;
  }
  return null;
}

function getEmbedType(url) {
  if (!url) return null;
  if (getYouTubeId(url)) return "youtube";
  if (getGoogleDocsEmbedUrl(url)) return "gdoc";
  // Generic iframeable: try to embed, fallback gracefully
  return "iframe";
}

function EmbedPlayer({ url }) {
  const [iframeError, setIframeError] = useState(false);
  const type = getEmbedType(url);

  if (!url) return null;

  if (type === "youtube") {
  const videoId = getYouTubeId(url);

  if (!videoId) {
    return (
      <p style={{ color: "#888", fontSize: 13 }}>
        Invalid YouTube link
      </p>
    );
  }

  return (
    <div className="lp-embed-wrapper">
      <iframe
        className="lp-embed-frame"
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title="Lesson video"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

  if (type === "gdoc") {
    const embedUrl = getGoogleDocsEmbedUrl(url);
    return (
      <div className="lp-embed-wrapper lp-embed-tall">
        <iframe
          className="lp-embed-frame"
          src={embedUrl}
          title="Lesson resource"
          allowFullScreen
        />
      </div>
    );
  }

  // Generic iframe fallback — if it can't load, show an open-in-new button
  if (!iframeError) {
    return (
      <div className="lp-embed-wrapper lp-embed-tall">
        <iframe
          className="lp-embed-frame"
          src={url}
          title="Lesson resource"
          onError={() => setIframeError(true)}
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    );
  }

  // Fallback: can't embed — show a styled link card
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="lp-resource-fallback"
    >
      <div className="lp-resource-fallback-icon"><FaGlobe /></div>
      <div>
        <p className="lp-resource-fallback-title">Open Resource</p>
        <p className="lp-resource-fallback-url">{url}</p>
      </div>
      <FaExternalLinkAlt size={12} style={{ color: "#555", marginLeft: "auto" }} />
    </a>
  );
}

// ── RESOURCE LABEL ────────────────────────────────────
function ResourceTypeLabel({ url }) {
  if (!url) return null;
  const type = getEmbedType(url);
  const labels = {
    youtube: { icon: <FaPlayCircle size={10} />, text: "YouTube Video" },
    gdoc:    { icon: <FaFileAlt size={10} />,    text: "Google Doc" },
    iframe:  { icon: <FaGlobe size={10} />,      text: "External Resource" },
  };
  const label = labels[type] || labels.iframe;
  return (
    <span className="lp-resource-type-badge">
      {label.icon}
      {label.text}
    </span>
  );
}

// ── MAIN ─────────────────────────────────────────────
export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const lessonRef = doc(db, "courses", courseId, "lessons", lessonId);
        const lessonSnap = await getDoc(lessonRef);
        if (lessonSnap.exists()) {
          setLesson({ id: lessonSnap.id, ...lessonSnap.data() });
        } else {
          console.warn("Lesson not found");
        }
      } catch (err) {
        console.error("Error fetching lesson:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [courseId, lessonId]);

  if (loading) return (
    <div className="lp-loading-screen">
      <div className="lp-loading-spinner" />
    </div>
  );

  if (!lesson) return (
    <div className="lp-loading-screen">
      <p style={{ color: "#555", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
        Lesson not found.
      </p>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

        .lp-root * { box-sizing: border-box; }

        .lp-root {
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0a;
          min-height: 100vh;
          padding: 48px 16px 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ── LOADING ── */
        .lp-loading-screen {
          background: #0a0a0a;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lp-loading-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid #1f1f1f;
          border-top-color: #9333ea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .lp-inner {
          width: 100%;
          max-width: 680px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* ── BACK ── */
        .lp-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: #555;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s;
          width: fit-content;
        }
        .lp-back:hover { color: #aaa; }

        /* ── HEADER ── */
        .lp-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .lp-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9333ea;
        }

        .lp-title {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #fff;
          line-height: 1.2;
          margin: 0;
        }

        /* ── EMBED ── */
        .lp-embed-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .lp-embed-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .lp-resource-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          background: #1a0a2e;
          border: 1px solid #9333ea33;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
          color: #c084fc;
          letter-spacing: 0.04em;
        }

        .lp-embed-wrapper {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 */
          background: #0d0d0d;
          border: 1px solid #1f1f1f;
          border-radius: 14px;
          overflow: hidden;
        }

        .lp-embed-tall {
          padding-top: 75%;
        }

        .lp-embed-frame {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 14px;
        }

        /* Fallback resource card */
        .lp-resource-fallback {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          background: #111;
          border: 1px solid #1f1f1f;
          border-radius: 12px;
          text-decoration: none;
          transition: border-color 0.2s;
          cursor: pointer;
        }
        .lp-resource-fallback:hover { border-color: #9333ea44; }

        .lp-resource-fallback-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #1a0a2e;
          border: 1px solid #9333ea33;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c084fc;
          font-size: 15px;
          flex-shrink: 0;
        }

        .lp-resource-fallback-title {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .lp-resource-fallback-url {
          font-size: 11px;
          color: #444;
          margin: 2px 0 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 340px;
        }

        /* ── DIVIDER ── */
        .lp-divider {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .lp-divider-line { flex: 1; height: 1px; background: #1a1a1a; }
        .lp-divider-label {
          font-size: 10px;
          color: #2a2a2a;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* ── CONTENT CARD ── */
        .lp-content-card {
          background: #111;
          border: 1px solid #1f1f1f;
          border-radius: 16px;
          padding: 24px;
        }

        .lp-content-inner {
          font-size: 15px;
          color: #aaa;
          line-height: 1.8;
          white-space: pre-wrap;
          word-break: break-word;
          margin: 0;
        }

        /* ── FOOTER ── */
        .lp-footer {
          display: flex;
          gap: 10px;
          padding-top: 4px;
        }

        .lp-btn-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: transparent;
          border: 1px solid #2a2a2a;
          border-radius: 10px;
          color: #666;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .lp-btn-back:hover { border-color: #444; color: #aaa; }
      `}</style>

      <div className="lp-root">
        <div className="lp-inner">

          {/* ── BACK ── */}
          <button className="lp-back" onClick={() => navigate(`/dashboard/${courseId}`)}>
            <FaArrowLeft size={11} /> Back to Lessons
          </button>

          {/* ── HEADER ── */}
          <div className="lp-header">
            <span className="lp-eyebrow">Lesson {lesson.order}</span>
            <h1 className="lp-title">{lesson.title}</h1>
          </div>

          {/* ── EMBEDDED RESOURCE ── */}
          {lesson.externalResource && (
            <div className="lp-embed-section">
              <div className="lp-embed-label">
                <ResourceTypeLabel url={lesson.externalResource} />
              </div>
              <EmbedPlayer url={lesson.externalResource} />
            </div>
          )}

          {/* ── DIVIDER ── */}
          {lesson.externalResource && (
            <div className="lp-divider">
              <div className="lp-divider-line" />
              <span className="lp-divider-label">Lesson Notes</span>
              <div className="lp-divider-line" />
            </div>
          )}

          {/* ── CONTENT ── */}
          <div className="lp-content-card">
            <p className="lp-content-inner">{lesson.content}</p>
          </div>

          {/* ── FOOTER ── */}
          <div className="lp-footer">
            <button
              className="lp-btn-back"
              onClick={() => navigate(`/dashboard/${courseId}`)}
            >
              <FaArrowLeft size={11} /> Back to Lessons
            </button>

            <button
                onClick={() => navigate(`/dashboard/${courseId}/lesson/${lessonId}/code`)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-500 transition"
              >
                Open Code Editor 💻
              </button>
          </div>

        </div>
      </div>
      <BottomNav />
    </>
  );
}