import { useState, useEffect } from "react";
import { db } from "../../../libs/firebase";
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import BottomNav from "../../../components/Nav";

export default function CreateLesson() {
  const { courseId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [externalResource, setExternalResource] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [lessonCount, setLessonCount] = useState(0);
  const navigate = useNavigate();

  // ─── Get current number of lessons ─────────────────
  useEffect(() => {
    const fetchLessonCount = async () => {
      const lessonsRef = collection(db, "courses", courseId, "lessons");
      const q = query(lessonsRef, orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);
      setLessonCount(snapshot.size);
    };
    fetchLessonCount();
  }, [courseId]);

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  const handleCreateLesson = async () => {
    if (!isValid) return;
    setLoading(true);
    setStatus(null);
    try {
      const lessonsRef = collection(db, "courses", courseId, "lessons");
      await addDoc(lessonsRef, {
        title: title.trim(),
        content: content.trim(),
        externalResource: externalResource.trim() || null,
        createdAt: serverTimestamp(),
        order: lessonCount + 1,
      });
      setStatus("success");
      setTitle("");
      setContent("");
      setExternalResource("");
      setTimeout(() => navigate(`/dashboard/${courseId}`), 1000);
    } catch (err) {
      console.error("[CreateLesson]", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .cl-root * { box-sizing: border-box; }

        .cl-root {
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0a;
          min-height: 100vh;
          padding: 48px 16px 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cl-inner {
          width: 100%;
          max-width: 560px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* ── BACK BUTTON ── */
        .cl-back {
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

        .cl-back:hover { color: #aaa; }

        /* ── HEADER ── */
        .cl-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cl-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9333ea;
        }

        .cl-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin: 0;
        }

        /* ── LESSON BADGE ── */
        .cl-badge-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cl-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: #1a0a2e;
          border: 1px solid #9333ea33;
          border-radius: 10px;
        }

        .cl-badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #9333ea;
          flex-shrink: 0;
        }

        .cl-badge-text {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #c084fc;
          letter-spacing: 0.02em;
        }

        /* ── STATUS ── */
        .cl-status {
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          animation: fadeSlideIn 0.3s ease;
        }

        .cl-status-success {
          background: #052e16;
          border: 1px solid #166534;
          color: #4ade80;
        }

        .cl-status-error {
          background: #1a0000;
          border: 1px solid #7f1d1d;
          color: #f87171;
        }

        /* ── FORM ── */
        .cl-form {
          background: #111;
          border: 1px solid #1f1f1f;
          border-radius: 18px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cl-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cl-field-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #555;
        }

        .cl-field-label span {
          color: #9333ea;
          margin-left: 4px;
        }

        .cl-input,
        .cl-textarea {
          width: 100%;
          background: #0a0a0a;
          border: 1px solid #222;
          border-radius: 10px;
          padding: 12px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #e5e5e5;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .cl-input::placeholder,
        .cl-textarea::placeholder {
          color: #333;
        }

        .cl-input:focus,
        .cl-textarea:focus {
          border-color: #9333ea;
          box-shadow: 0 0 0 3px #9333ea1a;
        }

        .cl-textarea {
          resize: vertical;
          min-height: 140px;
          line-height: 1.65;
        }

        /* URL field hint */
        .cl-input-hint {
          font-size: 11px;
          color: #333;
          margin-top: -2px;
        }

        /* ── DIVIDER ── */
        .cl-section-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 2px 0;
        }

        .cl-section-divider-line {
          flex: 1;
          height: 1px;
          background: #1f1f1f;
        }

        .cl-section-divider-label {
          font-size: 10px;
          color: #2a2a2a;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* ── SUBMIT ── */
        .cl-btn-create {
          width: 100%;
          padding: 14px;
          background: #9333ea;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: background 0.2s, transform 0.15s, opacity 0.2s;
          position: relative;
          overflow: hidden;
          margin-top: 4px;
        }

        .cl-btn-create::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #fff2 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .cl-btn-create:hover:not(:disabled)::after { opacity: 1; }
        .cl-btn-create:active:not(:disabled) { transform: scale(0.98); }

        .cl-btn-create:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .cl-btn-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid #fff4;
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="cl-root">
        <div className="cl-inner">

          {/* ── BACK ── */}
          <button className="cl-back" onClick={() => navigate(`/dashboard/${courseId}`)}>
            <FaArrowLeft size={11} /> Back to course
          </button>

          {/* ── HEADER ── */}
          <div className="cl-header">
            <span className="cl-eyebrow">Course Editor</span>
            <h1 className="cl-title">Add a Lesson</h1>
          </div>

          {/* ── LESSON NUMBER BADGE ── */}
          <div className="cl-badge-row">
            <div className="cl-badge">
              <div className="cl-badge-dot" />
              <span className="cl-badge-text">Lesson {lessonCount + 1}</span>
            </div>
          </div>

          {/* ── STATUS ── */}
          {status === "success" && (
            <div className="cl-status cl-status-success">
              ✓ Lesson added — redirecting...
            </div>
          )}
          {status === "error" && (
            <div className="cl-status cl-status-error">
              ✗ Something went wrong. Please try again.
            </div>
          )}

          {/* ── FORM ── */}
          <div className="cl-form">

            <div className="cl-field-group">
              <label className="cl-field-label">Lesson Title <span>*</span></label>
              <input
                className="cl-input"
                type="text"
                placeholder="e.g. Introduction to Variables"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="cl-field-group">
              <label className="cl-field-label">Content <span>*</span></label>
              <textarea
                className="cl-textarea"
                placeholder="Write the lesson content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
              />
            </div>

            <div className="cl-section-divider">
              <div className="cl-section-divider-line" />
              <span className="cl-section-divider-label">Optional</span>
              <div className="cl-section-divider-line" />
            </div>

            <div className="cl-field-group">
              <label className="cl-field-label">External Resource</label>
              <input
                className="cl-input"
                type="text"
                placeholder="https://youtube.com/..."
                value={externalResource}
                onChange={(e) => setExternalResource(e.target.value)}
              />
              <span className="cl-input-hint">YouTube, Google Docs, articles, etc.</span>
            </div>

            <button
              className="cl-btn-create"
              onClick={handleCreateLesson}
              disabled={!isValid || loading}
            >
              {loading && <span className="cl-btn-spinner" />}
              {loading ? "Adding Lesson..." : `Add Lesson ${lessonCount + 1} →`}
            </button>

          </div>

        </div>
      </div>

      <BottomNav/>
    </>
  );
}