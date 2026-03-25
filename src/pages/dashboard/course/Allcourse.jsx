import { useEffect, useState } from "react";
import { db } from "../../../libs/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  FaLaptopCode,
  FaPaintBrush,
  FaBook,
  FaLayerGroup,
  FaChevronRight,
  FaGraduationCap,
  FaStar,
} from "react-icons/fa";
import BottomNav from "../../../components/Nav";

// ── CATEGORY ICONS ───────────────────────────────────
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

// ── SKELETON ─────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="cl-skeleton-card">
      <div className="cl-sk cl-sk-icon" />
      <div className="cl-sk cl-sk-title" />
      <div className="cl-sk cl-sk-desc" />
      <div className="cl-sk cl-sk-desc short" />
      <div className="cl-sk-footer">
        <div className="cl-sk cl-sk-pill" />
        <div className="cl-sk cl-sk-pill" />
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────
export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesRef = collection(db, "courses");
        const q = query(coursesRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .clist-root * { box-sizing: border-box; }

        .clist-root {
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0a;
          min-height: 100vh;
          padding: 48px 16px 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .clist-inner {
          width: 100%;
          max-width: 720px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        /* ── HEADER ── */
        .clist-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .clist-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9333ea;
        }

        .clist-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin: 0;
        }

        .clist-subtitle {
          font-size: 14px;
          color: #555;
          margin: 0;
          font-weight: 400;
        }

        /* ── STATS ROW ── */
        .clist-stats {
          display: flex;
          gap: 10px;
        }

        .clist-stat {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: #111;
          border: 1px solid #1f1f1f;
          border-radius: 10px;
        }

        .clist-stat-icon {
          color: #9333ea;
          font-size: 14px;
          flex-shrink: 0;
        }

        .clist-stat-text {
          font-size: 13px;
          color: #888;
          font-weight: 400;
        }

        .clist-stat-text strong {
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          margin-right: 4px;
        }

        /* ── GRID ── */
        .clist-grid {
          display: grid;
          gap: 14px;
          grid-template-columns: 1fr;
        }

        @media (min-width: 580px) {
          .clist-grid { grid-template-columns: 1fr 1fr; }
        }

        /* ── COURSE CARD ── */
        .clist-card {
          background: #111;
          border: 1px solid #1f1f1f;
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }

        .clist-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #9333ea44, transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .clist-card:hover {
          border-color: #9333ea44;
          transform: translateY(-3px);
          box-shadow: 0 12px 40px #9333ea0d;
        }

        .clist-card:hover::before { opacity: 1; }

        .clist-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .clist-card-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #1a0a2e;
          border: 1px solid #9333ea33;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c084fc;
          font-size: 16px;
          flex-shrink: 0;
        }

        .clist-card-arrow {
          color: #2a2a2a;
          font-size: 12px;
          flex-shrink: 0;
          transition: color 0.2s, transform 0.2s;
          margin-top: 2px;
        }

        .clist-card:hover .clist-card-arrow {
          color: #9333ea;
          transform: translateX(3px);
        }

        /* ── CARD BODY ── */
        .clist-card-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          line-height: 1.35;
          margin: 0;
        }

        .clist-card-desc {
          font-size: 13px;
          color: #555;
          line-height: 1.6;
          margin: 0;
        }

        /* ── CARD FOOTER ── */
        .clist-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid #1a1a1a;
        }

        .clist-pills {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .clist-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.04em;
          border: 1px solid;
        }

        .clist-lessons-count {
          font-size: 11px;
          color: #333;
          font-weight: 500;
        }

        /* ── EMPTY STATE ── */
        .clist-empty {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 64px 24px;
          border: 1px dashed #1f1f1f;
          border-radius: 16px;
          text-align: center;
        }

        .clist-empty-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: #1a0a2e;
          border: 1px solid #9333ea22;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9333ea;
          font-size: 22px;
        }

        .clist-empty-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .clist-empty-sub {
          font-size: 13px;
          color: #444;
          margin: 0;
        }

        /* ── SKELETON ── */
        .cl-skeleton-card {
          background: #111;
          border: 1px solid #1a1a1a;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cl-sk {
          background: #1a1a1a;
          border-radius: 6px;
          animation: shimmer 1.4s ease-in-out infinite;
        }

        .cl-sk-icon  { width: 40px; height: 40px; border-radius: 10px; }
        .cl-sk-title { height: 16px; width: 65%; }
        .cl-sk-desc  { height: 12px; width: 90%; }
        .cl-sk-desc.short { width: 50%; }

        .cl-sk-footer {
          display: flex;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid #1a1a1a;
        }

        .cl-sk-pill { height: 22px; width: 72px; border-radius: 20px; background: #1a1a1a; animation: shimmer 1.4s ease-in-out infinite; }

        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.8; }
        }
      `}</style>

      <div className="clist-root">
        <div className="clist-inner">

          {/* ── HEADER ── */}
          <div className="clist-header">
            <span className="clist-eyebrow">Browse</span>
            <h1 className="clist-title">Courses</h1>
            <p className="clist-subtitle">Explore all available courses</p>
          </div>

          {/* ── STATS ── */}
          {!loading && courses.length > 0 && (
            <div className="clist-stats">
              <div className="clist-stat">
                <span className="clist-stat-icon"><FaLayerGroup /></span>
                <span className="clist-stat-text">
                  <strong>{courses.length}</strong>
                  {courses.length === 1 ? "Course" : "Courses"}
                </span>
              </div>
              <div className="clist-stat">
                <span className="clist-stat-icon"><FaStar /></span>
                <span className="clist-stat-text">
                  <strong>{courses.filter(c => c.isPublished).length}</strong>
                  Published
                </span>
              </div>
            </div>
          )}

          {/* ── GRID ── */}
          <div className="clist-grid">

            {loading && [1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}

            {!loading && courses.length === 0 && (
              <div className="clist-empty">
                <div className="clist-empty-icon"><FaGraduationCap /></div>
                <p className="clist-empty-title">No courses yet</p>
                <p className="clist-empty-sub">Check back later or create your first course.</p>
              </div>
            )}

            {!loading && courses.map(course => {
              const lvlStyle = getLevelStyle(course.level);
              const icon = CATEGORY_ICONS[course.category?.toLowerCase()] || CATEGORY_ICONS.default;
              return (
                <div
                  key={course.id}
                  className="clist-card"
                  onClick={() => navigate(`/dashboard/${course.id}`)}
                >
                  <div className="clist-card-top">
                    <div className="clist-card-icon">{icon}</div>
                    <FaChevronRight className="clist-card-arrow" />
                  </div>

                  <div>
                    <p className="clist-card-title">{course.title}</p>
                    <p className="clist-card-desc" style={{ marginTop: 6 }}>
                      {course.description?.slice(0, 110)}{course.description?.length > 110 ? "…" : ""}
                    </p>
                  </div>

                  <div className="clist-card-footer">
                    <div className="clist-pills">
                      <span
                        className="clist-pill"
                        style={{
                          background: "#0f0f1a",
                          borderColor: "#312e8155",
                          color: "#818cf8",
                        }}
                      >
                        <FaBook size={9} />
                        {course.category || "General"}
                      </span>
                      <span
                        className="clist-pill"
                        style={{
                          background: lvlStyle.bg,
                          borderColor: lvlStyle.border + "88",
                          color: lvlStyle.text,
                        }}
                      >
                        <FaGraduationCap size={9} />
                        {course.level || "All Levels"}
                      </span>
                    </div>
                    <span className="clist-lessons-count">
                      {course.lessonsCount || 0} lesson{course.lessonsCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      <BottomNav/>
    </>
  );
}