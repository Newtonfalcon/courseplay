import { useState, useEffect, useRef } from "react";
import { db, auth } from "../../../libs/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import BottomNav from "../../../components/Nav";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const COLORS = {
  bodyBg: "#0a0a0a",
  cardBg: "#ffffff",
  cardBorder: "#e5e7eb",
  btnPrimary: "#9333ea",
  btnPrimaryText: "#ffffff",
  successBg: "#f0fdf4",
  errorBg: "#fef2f2",
};

const TITLE_MAX = 80;
const DESC_MAX = 500;

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [myCourses, setMyCourses] = useState([]);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const navigate = useNavigate();

  const isValid =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    title.length <= TITLE_MAX &&
    description.length <= DESC_MAX;

  // ─── CHECK SCROLL STATE ─────────────────────
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
  }, [myCourses]);

  const scrollBy = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 240, behavior: "smooth" });
  };

  // ─── FETCH USER'S COURSES ─────────────────────
  useEffect(() => {
    const fetchMyCourses = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "courses"),
        where("createdBy", "==", user.uid)
      );

      const snapshot = await getDocs(q);
      const courses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMyCourses(courses);
    };

    fetchMyCourses();
  }, []);

  // ─── CREATE NEW COURSE ─────────────────────
  const handleCreate = async () => {
    if (!isValid) return;

    setLoading(true);
    setStatus(null);
    setErrorMsg("");

    try {
      const docRef = await addDoc(collection(db, "courses"), {
        title: title.trim(),
        description: description.trim(),
        category: category || null,
        level: level || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid || null,
        isPublished: false,
        lessonsCount: 0,
      });

      const courseId = docRef.id;
      setStatus("success");

      setTimeout(() => {
        navigate(`/dashboard/${courseId}/add-lesson`);
      }, 1000);
    } catch (err) {
      console.error("[CreateCourse]", err);
      setErrorMsg(err.message || "Something went wrong.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setLevel("");
    setStatus(null);
    setErrorMsg("");
  };

  // ─── UI ─────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .cc-root * { box-sizing: border-box; }

        .cc-root {
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0a;
          min-height: 100vh;
          padding: 48px 16px 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cc-inner {
          width: 100%;
          max-width: 560px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        /* ── HEADER ── */
        .cc-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cc-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9333ea;
        }

        .cc-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin: 0;
        }

        /* ── YOUR COURSES STRIP ── */
        .cc-courses-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cc-section-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #555;
        }

        .cc-scroll-wrapper {
          position: relative;
        }

        .cc-scroll-track {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 4px;
          scrollbar-width: none;
        }

        .cc-scroll-track::-webkit-scrollbar { display: none; }

        .cc-course-card {
          flex: 0 0 220px;
          scroll-snap-align: start;
          background: #111;
          border: 1px solid #1f1f1f;
          border-radius: 14px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: border-color 0.2s, transform 0.2s;
        }

        .cc-course-card:hover {
          border-color: #9333ea55;
          transform: translateY(-2px);
        }

        .cc-course-card-top {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .cc-course-card-name {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .cc-course-card-meta {
          font-size: 11px;
          color: #444;
          font-weight: 400;
        }

        .cc-add-lesson-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          background: #9333ea18;
          border: 1px solid #9333ea40;
          border-radius: 8px;
          color: #c084fc;
          font-size: 12px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          text-align: center;
        }

        .cc-add-lesson-btn:hover {
          background: #9333ea30;
          border-color: #9333ea80;
        }

        /* Scroll arrows */
        .cc-scroll-arrows {
          display: flex;
          gap: 6px;
          justify-content: flex-end;
          margin-top: 8px;
        }

        .cc-arrow {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          color: #888;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 10px;
          transition: background 0.15s, color 0.15s;
        }

        .cc-arrow:not(:disabled):hover {
          background: #9333ea;
          border-color: #9333ea;
          color: #fff;
        }

        .cc-arrow:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }

        /* ── DIVIDER ── */
        .cc-divider {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cc-divider-line {
          flex: 1;
          height: 1px;
          background: #1f1f1f;
        }

        .cc-divider-text {
          font-size: 11px;
          color: #333;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        /* ── STATUS ── */
        .cc-status {
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          animation: fadeSlideIn 0.3s ease;
        }

        .cc-status-success {
          background: #052e16;
          border: 1px solid #166534;
          color: #4ade80;
        }

        .cc-status-error {
          background: #1a0000;
          border: 1px solid #7f1d1d;
          color: #f87171;
        }

        /* ── FORM ── */
        .cc-form {
          background: #111;
          border: 1px solid #1f1f1f;
          border-radius: 18px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .cc-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cc-field-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #555;
        }

        .cc-field-label span {
          color: #9333ea;
          margin-left: 4px;
        }

        .cc-input,
        .cc-textarea,
        .cc-select {
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
          appearance: none;
          -webkit-appearance: none;
        }

        .cc-input::placeholder,
        .cc-textarea::placeholder {
          color: #333;
        }

        .cc-input:focus,
        .cc-textarea:focus,
        .cc-select:focus {
          border-color: #9333ea;
          box-shadow: 0 0 0 3px #9333ea1a;
        }

        .cc-textarea {
          resize: vertical;
          min-height: 100px;
          line-height: 1.6;
        }

        .cc-char-count {
          font-size: 11px;
          color: #333;
          text-align: right;
          margin-top: -4px;
        }

        .cc-char-count.near { color: #f59e0b; }
        .cc-char-count.over { color: #ef4444; }

        .cc-select option {
          background: #111;
          color: #e5e5e5;
        }

        .cc-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* ── FORM BUTTONS ── */
        .cc-btn-row {
          display: flex;
          gap: 10px;
          margin-top: 4px;
        }

        .cc-btn-reset {
          flex: 0 0 auto;
          padding: 13px 20px;
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

        .cc-btn-reset:hover {
          border-color: #444;
          color: #aaa;
        }

        .cc-btn-create {
          flex: 1;
          padding: 13px 20px;
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
        }

        .cc-btn-create::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #fff2 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .cc-btn-create:hover:not(:disabled)::after { opacity: 1; }
        .cc-btn-create:active:not(:disabled) { transform: scale(0.98); }

        .cc-btn-create:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .cc-btn-spinner {
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

      <div className="cc-root">
        <div className="cc-inner">

          {/* ── HEADER ── */}
          <div className="cc-header">
            <span className="cc-eyebrow">Dashboard</span>
            <h1 className="cc-title">Create a Course</h1>
          </div>

          {/* ── EXISTING COURSES ── */}
          {myCourses.length > 0 && (
            <div className="cc-courses-section">
              <span className="cc-section-label">Continue editing</span>
              <div className="cc-scroll-wrapper">
                <div
                  className="cc-scroll-track"
                  ref={scrollRef}
                  onScroll={checkScroll}
                >
                  {myCourses.map(course => (
                    <div key={course.id} className="cc-course-card">
                      <div className="cc-course-card-top">
                        <p className="cc-course-card-name">{course.title}</p>
                        <p className="cc-course-card-meta">
                          {course.lessonsCount || 0} lesson{course.lessonsCount !== 1 ? "s" : ""}
                          {course.level ? ` · ${course.level}` : ""}
                        </p>
                      </div>
                      <button
                        className="cc-add-lesson-btn"
                        onClick={() => navigate(`/dashboard/${course.id}/add-lesson`)}
                      >
                        <FaPlus size={10} /> Add Lesson
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {myCourses.length > 2 && (
                <div className="cc-scroll-arrows">
                  <button
                    className="cc-arrow"
                    onClick={() => scrollBy(-1)}
                    disabled={!canScrollLeft}
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    className="cc-arrow"
                    onClick={() => scrollBy(1)}
                    disabled={!canScrollRight}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── DIVIDER ── */}
          {myCourses.length > 0 && (
            <div className="cc-divider">
              <div className="cc-divider-line" />
              <span className="cc-divider-text">New Course</span>
              <div className="cc-divider-line" />
            </div>
          )}

          {/* ── STATUS MESSAGES ── */}
          {status === "success" && (
            <div className="cc-status cc-status-success">
              ✓ Course created — redirecting to lessons...
            </div>
          )}
          {status === "error" && (
            <div className="cc-status cc-status-error">
              ✗ {errorMsg}
            </div>
          )}

          {/* ── FORM ── */}
          <div className="cc-form">

            <div className="cc-field-group">
              <label className="cc-field-label">Title <span>*</span></label>
              <input
                className="cc-input"
                placeholder="e.g. React for Beginners"
                value={title}
                maxLength={TITLE_MAX}
                onChange={(e) => setTitle(e.target.value)}
              />
              <span className={`cc-char-count ${title.length > TITLE_MAX * 0.85 ? "near" : ""}`}>
                {title.length} / {TITLE_MAX}
              </span>
            </div>

            <div className="cc-field-group">
              <label className="cc-field-label">Description <span>*</span></label>
              <textarea
                className="cc-textarea"
                placeholder="What will students learn in this course?"
                value={description}
                maxLength={DESC_MAX}
                onChange={(e) => setDescription(e.target.value)}
              />
              <span className={`cc-char-count ${description.length > DESC_MAX * 0.85 ? "near" : ""}`}>
                {description.length} / {DESC_MAX}
              </span>
            </div>

            <div className="cc-row">
              <div className="cc-field-group">
                <label className="cc-field-label">Category</label>
                <select
                  className="cc-select"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="programming">Programming</option>
                  <option value="design">Design</option>
                </select>
              </div>

              <div className="cc-field-group">
                <label className="cc-field-label">Level</label>
                <select
                  className="cc-select"
                  value={level}
                  onChange={e => setLevel(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                </select>
              </div>
            </div>

            <div className="cc-btn-row">
              <button className="cc-btn-reset" onClick={handleReset}>
                Reset
              </button>
              <button
                className="cc-btn-create"
                onClick={handleCreate}
                disabled={!isValid || loading}
              >
                {loading && <span className="cc-btn-spinner" />}
                {loading ? "Creating..." : "Create Course →"}
              </button>
            </div>

          </div>

        </div>
      </div>

        <BottomNav />
    </>
  );
}