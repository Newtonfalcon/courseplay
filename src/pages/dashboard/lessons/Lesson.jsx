import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../../../libs/firebase";
import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import {
  FaArrowLeft,
  FaPlayCircle,
  FaExternalLinkAlt,
  FaFileAlt,
  FaGlobe,
  FaCode,
  FaCheckCircle,
  FaSpinner,
  FaExclamationCircle,
  FaTrophy,
} from "react-icons/fa";
import BottomNav from "../../../components/Nav";
import { ROUTES } from "../../../libs/constants";

// ── EMBED HELPERS ─────────────────────────────────────

function getYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("?")[0];
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
  } catch {}
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
    return (
      <div className="lp-embed-wrapper">
        <iframe
          className="lp-embed-frame"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title="Lesson video"
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

// ── FINISH STATUS BANNER ─────────────────────────────
// idle | saving | success | error
function FinishCourseBanner({ status, errorMsg }) {
  if (status === "idle") return null;

  const states = {
    saving: {
      bg: "#0f0a1a",
      border: "#9333ea44",
      icon: (
        <span style={{
          display: "inline-block",
          width: 14, height: 14,
          border: "2px solid #9333ea44",
          borderTopColor: "#9333ea",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
          flexShrink: 0,
        }} />
      ),
      text: "Saving your progress…",
      color: "#c084fc",
    },
    success: {
      bg: "#052e16",
      border: "#166534",
      icon: <FaCheckCircle size={13} style={{ color: "#4ade80", flexShrink: 0 }} />,
      text: "Course completed! Redirecting…",
      color: "#4ade80",
    },
    error: {
      bg: "#1a0000",
      border: "#7f1d1d",
      icon: <FaExclamationCircle size={13} style={{ color: "#f87171", flexShrink: 0 }} />,
      text: errorMsg || "Something went wrong. Please try again.",
      color: "#f87171",
    },
  };

  const s = states[status];
  if (!s) return null;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "12px 16px",
      background: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: 10,
      animation: "lp-fade-in 0.25s ease",
    }}>
      {s.icon}
      <span style={{ fontSize: 13, fontWeight: 500, color: s.color }}>{s.text}</span>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────
export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [finishStatus, setFinishStatus] = useState("idle"); // idle | saving | success | error
  const [finishError, setFinishError] = useState("");
  const navigate = useNavigate();

  // ── Mark lesson visited
  const markLessonVisited = async () => {
    if (!auth.currentUser) return;
    try {
      const trackerRef = doc(db, "courseTracker", `${auth.currentUser.uid}_${courseId}`);
      await updateDoc(trackerRef, {
        currentLesson: lessonId,
        completedLessons: arrayUnion(lessonId),
      });
    } catch (err) {
      console.error("[markLessonVisited]", err);
    }
  };

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

  useEffect(() => {
    if (lesson && auth.currentUser) {
      markLessonVisited();
    }
  }, [lesson]);

  // ── Finish course handler
  const handleFinishCourse = async () => {
    if (finishStatus === "saving" || finishStatus === "success") return;
    setFinishStatus("saving");
    setFinishError("");

    try {
      const trackerRef = doc(db, "courseTracker", `${auth.currentUser.uid}_${courseId}`);
      await updateDoc(trackerRef, {
        completedAt: serverTimestamp(),
        completedLessons: arrayUnion(lessonId),
        currentLesson: lessonId,
      });
      setFinishStatus("success");
      setTimeout(() => navigate(ROUTES.completed), 1400);
    } catch (err) {
      console.error("[handleFinishCourse]", err);
      setFinishError(err.message || "Could not save progress.");
      setFinishStatus("error");
    }
  };

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

  const isSaving = finishStatus === "saving";
  const isDone   = finishStatus === "success";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

        .lp-root * { box-sizing: border-box; }

        .lp-root {
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0a;
          min-height: 100vh;
          padding: 48px 16px 120px;
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

        @keyframes lp-fade-in {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes lp-shimmer-btn {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

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
        .lp-header { display: flex; flex-direction: column; gap: 6px; }

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
        .lp-embed-section { display: flex; flex-direction: column; gap: 10px; }
        .lp-embed-label { display: flex; align-items: center; justify-content: space-between; }

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
          padding-top: 56.25%;
          background: #0d0d0d;
          border: 1px solid #1f1f1f;
          border-radius: 14px;
          overflow: hidden;
        }

        .lp-embed-tall { padding-top: 75%; }

        .lp-embed-frame {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 14px;
        }

        /* fallback */
        .lp-resource-fallback {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 18px; background: #111;
          border: 1px solid #1f1f1f; border-radius: 12px;
          text-decoration: none; transition: border-color 0.2s; cursor: pointer;
        }
        .lp-resource-fallback:hover { border-color: #9333ea44; }
        .lp-resource-fallback-icon {
          width: 36px; height: 36px; border-radius: 8px;
          background: #1a0a2e; border: 1px solid #9333ea33;
          display: flex; align-items: center; justify-content: center;
          color: #c084fc; font-size: 15px; flex-shrink: 0;
        }
        .lp-resource-fallback-title { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:#fff; margin:0; }
        .lp-resource-fallback-url { font-size:11px; color:#444; margin:2px 0 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:340px; }

        /* ── DIVIDER ── */
        .lp-divider { display: flex; align-items: center; gap: 10px; }
        .lp-divider-line { flex: 1; height: 1px; background: #1a1a1a; }
        .lp-divider-label { font-size: 10px; color: #2a2a2a; letter-spacing: 0.08em; text-transform: uppercase; }

        /* ── CONTENT ── */
        .lp-content-card { background: #111; border: 1px solid #1f1f1f; border-radius: 16px; padding: 24px; }
        .lp-content-inner { font-size: 15px; color: #aaa; line-height: 1.8; white-space: pre-wrap; word-break: break-word; margin: 0; }

        /* ── ACTION PANEL ── */
        .lp-action-panel {
          background: #111;
          border: 1px solid #1f1f1f;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .lp-action-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        /* Back */
        .lp-btn-back {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 18px;
          background: transparent; border: 1px solid #2a2a2a; border-radius: 10px;
          color: #666; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: border-color 0.2s, color 0.2s;
        }
        .lp-btn-back:hover { border-color: #444; color: #aaa; }

        /* Code editor */
        .lp-btn-code {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 18px;
          background: #1a0a2e; border: 1px solid #9333ea33; border-radius: 10px;
          color: #c084fc; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: background 0.2s, border-color 0.2s;
        }
        .lp-btn-code:hover { background: #2a0f42; border-color: #9333ea66; }

        /* Finish course */
        .lp-btn-finish {
          display: inline-flex; align-items: center; justify-content: center; gap: 9px;
          padding: 13px 22px;
          background: #14532d; border: 1px solid #166534; border-radius: 10px;
          color: #4ade80; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
          cursor: pointer; letter-spacing: 0.02em;
          transition: background 0.2s, border-color 0.2s, transform 0.1s, opacity 0.2s;
          position: relative; overflow: hidden;
          margin-left: auto;
        }
        .lp-btn-finish:hover:not(:disabled) { background: #166534; border-color: #22c55e88; }
        .lp-btn-finish:active:not(:disabled) { transform: scale(0.97); }
        .lp-btn-finish:disabled { opacity: 0.5; cursor: not-allowed; }

        .lp-btn-finish.saving {
          background: #1a0a2e;
          border-color: #9333ea44;
          color: #c084fc;
        }

        .lp-btn-finish.done {
          background: #052e16;
          border-color: #166534;
          color: #4ade80;
          pointer-events: none;
        }

        .lp-btn-spin {
          display: inline-block;
          width: 13px; height: 13px;
          border: 2px solid #c084fc44;
          border-top-color: #c084fc;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
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

          {/* ── ACTION PANEL ── */}
          <div className="lp-action-panel">

            {/* Status banner — only shows when not idle */}
            <FinishCourseBanner status={finishStatus} errorMsg={finishError} />

            <div className="lp-action-row">

              {/* Back */}
              <button
                className="lp-btn-back"
                onClick={() => navigate(`/dashboard/${courseId}`)}
                disabled={isSaving}
              >
                <FaArrowLeft size={10} /> Lessons
              </button>

              {/* Code editor */}
              <button
                className="lp-btn-code"
                onClick={() => navigate(`/dashboard/${courseId}/lesson/${lessonId}/code`)}
                disabled={isSaving}
              >
                <FaCode size={11} /> Code Editor
              </button>

              {/* Finish Course */}
              <button
                className={`lp-btn-finish ${isSaving ? "saving" : ""} ${isDone ? "done" : ""}`}
                onClick={handleFinishCourse}
                disabled={isSaving || isDone}
              >
                {isSaving && <span className="lp-btn-spin" />}
                {!isSaving && !isDone && <FaTrophy size={12} />}
                {isDone    && <FaCheckCircle size={12} />}
                {isSaving ? "Saving…" : isDone ? "Completed!" : "Finish Course"}
              </button>

            </div>
          </div>

        </div>
      </div>

      <BottomNav />
    </>
  );
}