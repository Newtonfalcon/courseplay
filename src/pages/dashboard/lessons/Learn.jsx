import { useEffect, useState } from "react";
import { db, auth } from "../../../libs/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  FaPlay,
  FaBookOpen,
  FaCheckCircle,
  FaCompass,
  FaChevronRight,
} from "react-icons/fa";
import BottomNav from "../../../components/Nav";

// ── SKELETON ─────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="ln-sk-card">
      <div className="ln-sk ln-sk-icon" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="ln-sk ln-sk-title" />
        <div className="ln-sk ln-sk-bar" />
        <div className="ln-sk ln-sk-sub" />
      </div>
      <div className="ln-sk ln-sk-btn" />
    </div>
  );
}

// ── PROGRESS BAR ─────────────────────────────────────
function ProgressBar({ completed, total }) {
  const pct = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  return (
    <div className="ln-progress-wrap">
      <div className="ln-progress-track">
        <div className="ln-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="ln-progress-label">{pct}%</span>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────
export default function Learn() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrackedCourses = async () => {
      if (!auth.currentUser) return;
      const q = query(
        collection(db, "courseTracker"),
        where("userId", "==", auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(data);
      setLoading(false);
    };
    fetchTrackedCourses();
  }, []);

  const totalCompleted = courses.reduce((s, c) => s + (c.completedLessons?.length || 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .ln-root * { box-sizing: border-box; }

        .ln-root {
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0a;
          min-height: 100vh;
          padding: 48px 16px 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ln-inner {
          width: 100%;
          max-width: 580px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* ── HEADER ── */
        .ln-header { display: flex; flex-direction: column; gap: 4px; }

        .ln-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9333ea;
        }

        .ln-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin: 0;
        }

        .ln-subtitle {
          font-size: 13px;
          color: #444;
          margin: 0;
        }

        /* ── STATS ── */
        .ln-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .ln-stat {
          background: #111;
          border: 1px solid #1f1f1f;
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ln-stat-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: #1a0a2e;
          border: 1px solid #9333ea22;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c084fc;
          font-size: 12px;
        }

        .ln-stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #fff;
          line-height: 1;
        }

        .ln-stat-label {
          font-size: 11px;
          color: #444;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* ── SECTION HEADER ── */
        .ln-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ln-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .ln-section-count {
          font-size: 12px;
          color: #333;
        }

        /* ── COURSE LIST ── */
        .ln-list {
          background: #111;
          border: 1px solid #1f1f1f;
          border-radius: 16px;
          overflow: hidden;
        }

        .ln-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 20px;
          border-bottom: 1px solid #181818;
          cursor: pointer;
          transition: background 0.15s;
          position: relative;
        }

        .ln-card:last-child { border-bottom: none; }
        .ln-card:hover { background: #161616; }
        .ln-card:hover .ln-card-arrow { color: #9333ea; transform: translateX(3px); }

        .ln-card-icon {
          width: 42px;
          height: 42px;
          border-radius: 11px;
          background: #1a0a2e;
          border: 1px solid #9333ea22;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c084fc;
          font-size: 16px;
          flex-shrink: 0;
        }

        .ln-card-body {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ln-card-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── PROGRESS BAR ── */
        .ln-progress-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ln-progress-track {
          flex: 1;
          height: 4px;
          background: #1f1f1f;
          border-radius: 99px;
          overflow: hidden;
        }

        .ln-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #7e22ce, #9333ea);
          border-radius: 99px;
          transition: width 0.6s ease;
        }

        .ln-progress-label {
          font-size: 11px;
          color: #555;
          font-weight: 500;
          min-width: 28px;
          text-align: right;
        }

        .ln-card-meta {
          font-size: 11px;
          color: #444;
        }

        .ln-card-meta strong {
          color: #666;
          font-weight: 500;
        }

        .ln-card-arrow {
          color: #2a2a2a;
          font-size: 12px;
          flex-shrink: 0;
          transition: color 0.2s, transform 0.2s;
        }

        /* ── CONTINUE PILL (replaces old button) ── */
        .ln-continue-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          background: #9333ea18;
          border: 1px solid #9333ea33;
          border-radius: 8px;
          color: #c084fc;
          font-size: 11px;
          font-weight: 500;
          flex-shrink: 0;
          white-space: nowrap;
          transition: background 0.15s;
          cursor: pointer;
        }

        .ln-card:hover .ln-continue-pill {
          background: #9333ea30;
          border-color: #9333ea66;
        }

        /* completed badge */
        .ln-done-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: #4ade80;
          font-weight: 500;
          flex-shrink: 0;
        }

        /* ── EMPTY ── */
        .ln-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 64px 24px;
          border: 1px dashed #1f1f1f;
          border-radius: 16px;
          text-align: center;
        }

        .ln-empty-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #1a0a2e;
          border: 1px solid #9333ea22;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9333ea;
          font-size: 22px;
        }

        .ln-empty-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .ln-empty-sub { font-size: 13px; color: #444; margin: 0; }

        .ln-browse-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          background: #9333ea;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 4px;
          transition: background 0.15s;
        }

        .ln-browse-btn:hover { background: #7e22ce; }

        /* ── SKELETON ── */
        .ln-sk {
          background: #1a1a1a;
          border-radius: 6px;
          animation: ln-shimmer 1.4s ease-in-out infinite;
        }

        .ln-sk-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 20px;
          border-bottom: 1px solid #181818;
        }

        .ln-sk-icon  { width: 42px; height: 42px; border-radius: 11px; flex-shrink: 0; }
        .ln-sk-title { height: 14px; width: 55%; }
        .ln-sk-bar   { height: 4px; width: 80%; border-radius: 99px; }
        .ln-sk-sub   { height: 11px; width: 35%; }
        .ln-sk-btn   { height: 30px; width: 80px; border-radius: 8px; flex-shrink: 0; }

        @keyframes ln-shimmer {
          0%, 100% { opacity: 0.35; }
          50%       { opacity: 0.7; }
        }
      `}</style>

      <div className="ln-root">
        <div className="ln-inner">

          {/* ── HEADER ── */}
          <div className="ln-header">
            <span className="ln-eyebrow">Learning</span>
            <h1 className="ln-title">Continue Learning</h1>
            <p className="ln-subtitle">Pick up where you left off</p>
          </div>

          {/* ── STATS ── */}
          {!loading && courses.length > 0 && (
            <div className="ln-stats">
              <div className="ln-stat">
                <div className="ln-stat-icon"><FaBookOpen /></div>
                <div className="ln-stat-value">{courses.length}</div>
                <div className="ln-stat-label">In Progress</div>
              </div>
              <div className="ln-stat">
                <div className="ln-stat-icon"><FaCheckCircle /></div>
                <div className="ln-stat-value">{totalCompleted}</div>
                <div className="ln-stat-label">Lessons Done</div>
              </div>
            </div>
          )}

          {/* ── LIST ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="ln-section-header">
              <h2 className="ln-section-title">My Courses</h2>
              {!loading && courses.length > 0 && (
                <span className="ln-section-count">{courses.length} active</span>
              )}
            </div>

            {/* Skeleton */}
            {loading && (
              <div className="ln-list">
                {[1, 2, 3].map(n => <SkeletonCard key={n} />)}
              </div>
            )}

            {/* Empty */}
            {!loading && courses.length === 0 && (
              <div className="ln-empty">
                <div className="ln-empty-icon"><FaCompass /></div>
                <p className="ln-empty-title">Nothing here yet</p>
                <p className="ln-empty-sub">You haven't started any course yet.</p>
                <button className="ln-browse-btn" onClick={() => navigate("/dashboard/courses")}>
                  <FaCompass size={11} /> Browse Courses
                </button>
              </div>
            )}

            {/* Courses */}
            {!loading && courses.length > 0 && (
              <div className="ln-list">
                {courses.map(course => {
                  const completed = course.completedLessons?.length || 0;
                  const total = course.totalLessons || 0;
                  const isDone = total > 0 && completed >= total;

                  return (
                    <div
                      key={course.courseId}
                      className="ln-card"
                      onClick={() => navigate(`/dashboard/${course.courseId}`)}
                    >
                      <div className="ln-card-icon">
                        {isDone ? <FaCheckCircle style={{ color: "#4ade80" }} /> : <FaPlay />}
                      </div>

                      <div className="ln-card-body">
                        <p className="ln-card-title">
                          {course.courseTitle || `Course`}
                        </p>
                        <ProgressBar completed={completed} total={total} />
                        <span className="ln-card-meta">
                          <strong>{completed}</strong>
                          {total > 0 ? ` of ${total}` : ""} lessons completed
                        </span>
                      </div>

                      {isDone ? (
                        <div className="ln-done-badge">
                          <FaCheckCircle size={11} /> Done
                        </div>
                      ) : (
                        <div className="ln-continue-pill">
                          <FaPlay size={8} /> Continue
                        </div>
                      )}

                      <FaChevronRight className="ln-card-arrow" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

      <BottomNav />
    </>
  );
}