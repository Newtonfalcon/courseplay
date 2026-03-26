import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../../../libs/firebase";






import { collection, doc, getDoc, setDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import {
  FaArrowLeft,
  FaBook,
  FaLaptopCode,
  FaPaintBrush,
  FaGraduationCap,
  FaExternalLinkAlt,
  FaChevronRight,
  FaLayerGroup,
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

// ── SKELETON ─────────────────────────────────────────
function SkeletonLesson() {
  return (
    <div className="cd-sk-lesson">
      <div className="cd-sk cd-sk-num" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="cd-sk cd-sk-title" />
        <div className="cd-sk cd-sk-desc" />
      </div>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────
export default function CourseDetail() {






  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const navigate = useNavigate();



  const startCourse = async (lesson) => {
  if (!auth.currentUser) return;

  const trackerRef = doc(db, "courseTracker", `${auth.currentUser.uid}_${courseId}`);
  const trackerSnap = await getDoc(trackerRef);

  if (!trackerSnap.exists()) {
    await setDoc(trackerRef, {
      userId: auth.currentUser.uid,
      courseId,
      startedAt: serverTimestamp(),
      completedLessons: [],
      currentLesson: null,
      completedAt: null
    });
  }
  return navigate(`/dashboard/${courseId}/lesson/${lesson.id}`);
  
};

  // ─── Fetch course details ─────────────────────
  useEffect(() => {
    const fetchCourse = async () => {
      const courseRef = doc(db, "courses", courseId);
      const courseSnap = await getDoc(courseRef);
      if (courseSnap.exists()) setCourse({ id: courseSnap.id, ...courseSnap.data() });
    };
    fetchCourse();
  }, [courseId]);

  // ─── Fetch lessons ─────────────────────
  useEffect(() => {
    const fetchLessons = async () => {
      const lessonsRef = collection(db, "courses", courseId, "lessons");
      const q = query(lessonsRef, orderBy("order", "asc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLessons(data);
      setLessonsLoading(false);
    };
    fetchLessons();
  }, [courseId]);

  if (!course) return (
    <div className="cd-loading-screen">
      <div className="cd-loading-spinner" />
    </div>
  );

  const lvlStyle = getLevelStyle(course.level);
  const catIcon = CATEGORY_ICONS[course.category?.toLowerCase()] || CATEGORY_ICONS.default;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .cd-root * { box-sizing: border-box; }

        .cd-root {
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0a;
          min-height: 100vh;
          padding: 48px 16px 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ── FULL-SCREEN LOADER ── */
        .cd-loading-screen {
          background: #0a0a0a;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cd-loading-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid #1f1f1f;
          border-top-color: #9333ea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .cd-inner {
          width: 100%;
          max-width: 640px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* ── BACK ── */
        .cd-back {
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

        .cd-back:hover { color: #aaa; }

        /* ── COURSE HERO CARD ── */
        .cd-hero {
          background: #111;
          border: 1px solid #1f1f1f;
          border-radius: 18px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
          overflow: hidden;
        }

        .cd-hero::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #9333ea55, transparent);
        }

        .cd-hero-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .cd-hero-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #1a0a2e;
          border: 1px solid #9333ea33;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c084fc;
          font-size: 20px;
          flex-shrink: 0;
        }

        .cd-hero-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          line-height: 1.25;
          margin: 0;
          flex: 1;
        }

        .cd-hero-desc {
          font-size: 14px;
          color: #666;
          line-height: 1.7;
          margin: 0;
        }

        .cd-hero-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid #1a1a1a;
        }

        .cd-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.04em;
          border: 1px solid;
        }

        .cd-lessons-count {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
          background: #111;
          border: 1px solid #2a2a2a;
          color: #555;
        }

        /* ── LESSONS SECTION ── */
        .cd-lessons-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cd-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .cd-section-count {
          font-size: 12px;
          color: #444;
          font-weight: 500;
        }

        /* ── LESSON LIST ── */
        .cd-lessons-list {
          display: flex;
          flex-direction: column;
          gap: 0;
          background: #111;
          border: 1px solid #1f1f1f;
          border-radius: 16px;
          overflow: hidden;
        }

        .cd-lesson-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 18px 20px;
          border-bottom: 1px solid #181818;
          cursor: pointer;
          transition: background 0.15s;
          text-decoration: none;
          position: relative;
        }

        .cd-lesson-row:last-child { border-bottom: none; }

        .cd-lesson-row:hover { background: #161616; }

        .cd-lesson-row:hover .cd-lesson-arrow {
          color: #9333ea;
          transform: translateX(3px);
        }

        .cd-lesson-num {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #1a0a2e;
          border: 1px solid #9333ea22;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #9333ea;
          margin-top: 1px;
        }

        .cd-lesson-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .cd-lesson-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cd-lesson-preview {
          font-size: 12px;
          color: #444;
          line-height: 1.5;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .cd-lesson-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 6px;
          font-size: 11px;
          color: #9333ea;
          font-weight: 500;
          text-decoration: none;
          width: fit-content;
          transition: color 0.15s;
        }

        .cd-lesson-link:hover { color: #c084fc; }

        .cd-lesson-arrow {
          flex-shrink: 0;
          color: #2a2a2a;
          font-size: 11px;
          transition: color 0.2s, transform 0.2s;
          margin-top: 6px;
        }

        /* ── EMPTY STATE ── */
        .cd-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 48px 24px;
          border: 1px dashed #1f1f1f;
          border-radius: 16px;
          text-align: center;
        }

        .cd-empty-icon {
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

        .cd-empty-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .cd-empty-sub {
          font-size: 12px;
          color: #444;
          margin: 0;
        }

        /* ── SKELETON ── */
        .cd-sk {
          background: #1a1a1a;
          border-radius: 6px;
          animation: shimmer 1.4s ease-in-out infinite;
        }

        .cd-sk-lesson {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 18px 20px;
          border-bottom: 1px solid #181818;
        }

        .cd-sk-num   { width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0; background: #1a1a1a; animation: shimmer 1.4s ease-in-out infinite; }
        .cd-sk-title { height: 14px; width: 55%; }
        .cd-sk-desc  { height: 11px; width: 80%; }

        @keyframes shimmer {
          0%, 100% { opacity: 0.35; }
          50%       { opacity: 0.7; }
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="cd-root">
        <div className="cd-inner">

          {/* ── BACK ── */}
          <button className="cd-back" onClick={() => navigate(-1)}>
            <FaArrowLeft size={11} /> All Courses
          </button>

          {/* ── HERO CARD ── */}
          <div className="cd-hero">
            <div className="cd-hero-top">
              <div className="cd-hero-icon">{catIcon}</div>
              <h1 className="cd-hero-title">{course.title}</h1>
            </div>
            <p className="cd-hero-desc">{course.description}</p>
            <div className="cd-hero-meta">
              <span
                className="cd-pill"
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
                className="cd-pill"
                style={{
                  background: lvlStyle.bg,
                  borderColor: lvlStyle.border + "88",
                  color: lvlStyle.text,
                }}
              >
                <FaGraduationCap size={9} />
                {course.level || "All Levels"}
              </span>
              <span className="cd-lessons-count">
                <FaLayerGroup size={9} />
                {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* ── LESSONS ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="cd-lessons-header">
              <h2 className="cd-section-title">Lessons</h2>
              {!lessonsLoading && lessons.length > 0 && (
                <span className="cd-section-count">{lessons.length} total</span>
              )}
            </div>

            {/* Skeleton */}
            {lessonsLoading && (
              <div className="cd-lessons-list">
                {[1, 2, 3].map(n => <SkeletonLesson key={n} />)}
              </div>
            )}

            {/* Empty */}
            {!lessonsLoading && lessons.length === 0 && (
              <div className="cd-empty">
                <div className="cd-empty-icon"><FaLayerGroup /></div>
                <p className="cd-empty-title">No lessons yet</p>
                <p className="cd-empty-sub">Lessons added to this course will appear here.</p>
              </div>
            )}

            {/* List */}
            {!lessonsLoading && lessons.length > 0 && (
              <div className="cd-lessons-list">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="cd-lesson-row"
                    onClick={() => startCourse(lesson)}
                  >
                    <div className="cd-lesson-num">{lesson.order}</div>
                    <div className="cd-lesson-body">
                      <p className="cd-lesson-title">{lesson.title}</p>
                      <p className="cd-lesson-preview">
                        {lesson.content?.slice(0, 100)}{lesson.content?.length > 100 ? "…" : ""}
                      </p>
                      {lesson.externalResource && (
                        <a
                          href={lesson.externalResource}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cd-lesson-link"
                          onClick={e => e.stopPropagation()}
                        >
                          <FaExternalLinkAlt size={9} /> External Resource
                        </a>
                      )}
                    </div>
                    <FaChevronRight className="cd-lesson-arrow" />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      <BottomNav />
    </>
  );
}