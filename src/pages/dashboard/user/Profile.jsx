import { useEffect, useState } from "react";
import { auth, db } from "../../../libs/firebase";
import { signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaBook,
  FaPlus,
  FaChevronRight,
  FaLayerGroup,
  FaLaptopCode,
  FaPaintBrush,
  FaGraduationCap,
} from "react-icons/fa";
import BottomNav from "../../../components/Nav";

// ── HELPERS ──────────────────────────────────────────
const CATEGORY_ICONS = {
  programming: <FaLaptopCode />,
  design: <FaPaintBrush />,
  default: <FaBook />,
};

const LEVEL_COLORS = {
  beginner:     { bg: "#052e16", border: "#166534", text: "#4ade80" },
  intermediate: { bg: "#1c1207", border: "#92400e", text: "#fbbf24" },
  advanced:     { bg: "#1a0000", border: "#7f1d1d", text: "#f87171" },
  default:      { bg: "#0f0f1a", border: "#312e81", text: "#a5b4fc" },
};

function getLevelStyle(level) {
  return LEVEL_COLORS[level?.toLowerCase()] || LEVEL_COLORS.default;
}

function getInitials(name, email) {
  if (name) return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  if (email) return email[0].toUpperCase();
  return "U";
}

// ── SKELETON ─────────────────────────────────────────
function SkeletonCourse() {
  return (
    <div className="pf-sk-row">
      <div className="pf-sk pf-sk-icon" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="pf-sk pf-sk-title" />
        <div className="pf-sk pf-sk-sub" />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <div className="pf-sk pf-sk-btn" />
        <div className="pf-sk pf-sk-btn" />
      </div>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────
export default function Profile() {
  const user = auth.currentUser;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;
      const q = query(collection(db, "courses"), where("createdBy", "==", user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (!user) return (
    <div className="pf-loading-screen">
      <p style={{ color: "#555", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>Not logged in.</p>
    </div>
  );

  const totalLessons = courses.reduce((sum, c) => sum + (c.lessonsCount || 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .pf-root * { box-sizing: border-box; }

        .pf-root {
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0a;
          min-height: 100vh;
          padding: 48px 16px 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .pf-loading-screen {
          background: #0a0a0a;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pf-inner {
          width: 100%;
          max-width: 580px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ── HEADER ── */
        .pf-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9333ea;
          margin-bottom: 4px;
          display: block;
        }

        /* ── USER CARD ── */
        .pf-user-card {
          background: #111;
          border: 1px solid #1f1f1f;
          border-radius: 18px;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .pf-user-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #9333ea55, transparent);
        }

        .pf-user-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* Avatar */
        .pf-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .pf-avatar-img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #1f1f1f;
          display: block;
        }

        .pf-avatar-fallback {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #1a0a2e;
          border: 2px solid #9333ea33;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #c084fc;
          flex-shrink: 0;
        }

        .pf-online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid #111;
        }

        /* User info */
        .pf-user-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .pf-user-name {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #fff;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pf-user-email {
          font-size: 13px;
          color: #666;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pf-user-id {
          font-size: 11px;
          color: #333;
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          margin: 0;
        }

        /* Logout */
        .pf-logout-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 16px;
          background: transparent;
          border: 1px solid #2a2a2a;
          border-radius: 10px;
          color: #666;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .pf-logout-btn:hover {
          border-color: #ef444455;
          color: #f87171;
          background: #1a000088;
        }

        /* ── STATS ROW ── */
        .pf-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .pf-stat-card {
          background: #111;
          border: 1px solid #1f1f1f;
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .pf-stat-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #1a0a2e;
          border: 1px solid #9333ea22;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c084fc;
          font-size: 13px;
        }

        .pf-stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #fff;
          line-height: 1;
        }

        .pf-stat-label {
          font-size: 11px;
          color: #444;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* ── COURSES SECTION ── */
        .pf-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pf-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .pf-new-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: #9333ea18;
          border: 1px solid #9333ea33;
          border-radius: 8px;
          color: #c084fc;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }

        .pf-new-btn:hover {
          background: #9333ea30;
          border-color: #9333ea66;
        }

        /* ── COURSE LIST ── */
        .pf-courses-list {
          background: #111;
          border: 1px solid #1f1f1f;
          border-radius: 16px;
          overflow: hidden;
        }

        .pf-course-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          border-bottom: 1px solid #181818;
          transition: background 0.15s;
        }

        .pf-course-row:last-child { border-bottom: none; }
        .pf-course-row:hover { background: #161616; }

        .pf-course-icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: #1a0a2e;
          border: 1px solid #9333ea22;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c084fc;
          font-size: 14px;
          flex-shrink: 0;
        }

        .pf-course-body {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .pf-course-title {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pf-course-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pf-course-lessons {
          font-size: 11px;
          color: #444;
        }

        .pf-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 500;
          border: 1px solid;
          letter-spacing: 0.03em;
        }

        .pf-course-actions {
          display: flex;
          gap: 7px;
          flex-shrink: 0;
        }

        .pf-btn-view {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          background: transparent;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          color: #666;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
          white-space: nowrap;
        }

        .pf-btn-view:hover { border-color: #444; color: #aaa; }

        .pf-btn-lesson {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          background: #9333ea18;
          border: 1px solid #9333ea33;
          border-radius: 8px;
          color: #c084fc;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          white-space: nowrap;
        }

        .pf-btn-lesson:hover { background: #9333ea30; border-color: #9333ea66; }

        /* ── EMPTY ── */
        .pf-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 48px 24px;
          border: 1px dashed #1f1f1f;
          border-radius: 16px;
          text-align: center;
        }

        .pf-empty-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #1a0a2e;
          border: 1px solid #9333ea22;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9333ea;
          font-size: 20px;
        }

        .pf-empty-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .pf-empty-sub { font-size: 12px; color: #444; margin: 0; }

        .pf-empty-cta {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          background: #9333ea;
          border: none;
          border-radius: 9px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 4px;
          transition: background 0.15s;
        }

        .pf-empty-cta:hover { background: #7e22ce; }

        /* ── SKELETON ── */
        .pf-sk {
          background: #1a1a1a;
          border-radius: 6px;
          animation: pf-shimmer 1.4s ease-in-out infinite;
        }

        .pf-sk-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          border-bottom: 1px solid #181818;
        }

        .pf-sk-icon  { width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0; }
        .pf-sk-title { height: 13px; width: 50%; }
        .pf-sk-sub   { height: 11px; width: 30%; }
        .pf-sk-btn   { height: 30px; width: 64px; border-radius: 8px; }

        @keyframes pf-shimmer {
          0%, 100% { opacity: 0.35; }
          50%       { opacity: 0.7; }
        }

        @media (max-width: 480px) {
          .pf-course-actions { flex-direction: column; }
          .pf-user-row { flex-wrap: wrap; }
        }
      `}</style>

      <div className="pf-root">
        <div className="pf-inner">

          {/* ── EYEBROW ── */}
          <span className="pf-eyebrow">Account</span>

          {/* ── USER CARD ── */}
          <div className="pf-user-card">
            <div className="pf-user-row">
              <div className="pf-avatar-wrap">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="profile" className="pf-avatar-img" />
                ) : (
                  <div className="pf-avatar-fallback">
                    {getInitials(user.displayName, user.email)}
                  </div>
                )}
                <div className="pf-online-dot" />
              </div>

              <div className="pf-user-info">
                <p className="pf-user-name">{user.displayName || "User"}</p>
                <p className="pf-user-email">{user.email}</p>
                <p className="pf-user-id">ID: {user.uid.slice(0, 10)}…</p>
              </div>

              <button className="pf-logout-btn" onClick={handleLogout}>
                <FaSignOutAlt size={11} /> Logout
              </button>
            </div>
          </div>

          {/* ── STATS ── */}
          {!loading && (
            <div className="pf-stats">
              <div className="pf-stat-card">
                <div className="pf-stat-icon"><FaLayerGroup /></div>
                <div className="pf-stat-value">{courses.length}</div>
                <div className="pf-stat-label">Courses</div>
              </div>
              <div className="pf-stat-card">
                <div className="pf-stat-icon"><FaBook /></div>
                <div className="pf-stat-value">{totalLessons}</div>
                <div className="pf-stat-label">Total Lessons</div>
              </div>
            </div>
          )}

          {/* ── COURSES SECTION ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="pf-section-header">
              <h2 className="pf-section-title">My Courses</h2>
              {!loading && courses.length > 0 && (
                <button className="pf-new-btn" onClick={() => navigate("/dashboard/create")}>
                  <FaPlus size={9} /> New Course
                </button>
              )}
            </div>

            {/* Skeleton */}
            {loading && (
              <div className="pf-courses-list">
                {[1, 2, 3].map(n => <SkeletonCourse key={n} />)}
              </div>
            )}

            {/* Empty */}
            {!loading && courses.length === 0 && (
              <div className="pf-empty">
                <div className="pf-empty-icon"><FaLayerGroup /></div>
                <p className="pf-empty-title">No courses yet</p>
                <p className="pf-empty-sub">Start building your first course.</p>
                <button className="pf-empty-cta" onClick={() => navigate("/dashboard/create")}>
                  <FaPlus size={10} /> Create Course
                </button>
              </div>
            )}

            {/* List */}
            {!loading && courses.length > 0 && (
              <div className="pf-courses-list">
                {courses.map(course => {
                  const lvlStyle = getLevelStyle(course.level);
                  const icon = CATEGORY_ICONS[course.category?.toLowerCase()] || CATEGORY_ICONS.default;
                  return (
                    <div key={course.id} className="pf-course-row">
                      <div className="pf-course-icon">{icon}</div>
                      <div className="pf-course-body">
                        <p className="pf-course-title">{course.title}</p>
                        <div className="pf-course-meta">
                          <span className="pf-course-lessons">
                            {course.lessonsCount || 0} lesson{course.lessonsCount !== 1 ? "s" : ""}
                          </span>
                          {course.level && (
                            <span
                              className="pf-pill"
                              style={{
                                background: lvlStyle.bg,
                                borderColor: lvlStyle.border + "88",
                                color: lvlStyle.text,
                              }}
                            >
                              <FaGraduationCap size={8} />
                              {course.level}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="pf-course-actions">
                        <button
                          className="pf-btn-view"
                          onClick={() => navigate(`/dashboard/${course.id}`)}
                        >
                          <FaChevronRight size={9} /> View
                        </button>
                        <button
                          className="pf-btn-lesson"
                          onClick={() => navigate(`/dashboard/${course.id}/add-lesson`)}
                        >
                          <FaPlus size={9} /> Lesson
                        </button>
                      </div>
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