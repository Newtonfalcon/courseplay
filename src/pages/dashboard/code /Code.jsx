import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaPlay,
  FaTrash,
  FaExpand,
  FaCompress,
  FaTerminal,
  FaCopy,
  FaCheck,
} from "react-icons/fa";

import BottomNav from "../../../components/Nav";

// ── TAB CONFIG ────────────────────────────────────────
const TABS = [
  { id: "html", label: "HTML",  Icon: FaHtml5,   color: "#f97316", placeholder: "<h1>Hello World</h1>" },
  { id: "css",  label: "CSS",   Icon: FaCss3Alt,  color: "#3b82f6", placeholder: "h1 { color: red; }" },
  { id: "js",   label: "JS",    Icon: FaJs,       color: "#eab308", placeholder: "console.log('Hello')" },
];

// ── COPY HOOK ─────────────────────────────────────────
function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return { copied, copy };
}

// ── LINE NUMBERS ──────────────────────────────────────
function LineNumbers({ value }) {
  const lines = (value || "").split("\n").length;
  return (
    <div className="ce-line-numbers" aria-hidden="true">
      {Array.from({ length: Math.max(lines, 1) }, (_, i) => (
        <span key={i}>{i + 1}</span>
      ))}
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────
export default function CodeEditor() {
  const { lessonId } = useParams();

  const [html, setHtml] = useState("<h1>Hello World</h1>\n<p>Edit the code on the left to see changes live [powered by Netech].</p>");
  const [css,  setCss]  = useState("body {\n  font-family: sans-serif;\n  padding: 24px;\n  background: #f8f8f8;\n}\nh1 { color: #9333ea; }\np  { color: #555; }");
  const [js,   setJs]   = useState("console.log('Hello from lesson!');\ndocument.querySelector('h1').addEventListener('click', () => {\n  alert('You clicked the heading!');\n});");

  const [activeTab, setActiveTab]   = useState("html");
  const [srcDoc, setSrcDoc]         = useState("");
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [autoRun, setAutoRun]       = useState(true);
  const textareaRef                 = useRef(null);
  const { copied, copy }            = useCopy();

  const values = { html, css, js };
  const setters = { html: setHtml, css: setCss, js: setJs };
  const activeValue = values[activeTab];

  // ── BUILD srcDoc ──────────────────────────────────
  const buildSrc = () => {
    const interceptConsole = `
      <script>
        (function() {
          const _log = console.log.bind(console);
          const _err = console.error.bind(console);
          const _warn = console.warn.bind(console);
          function send(type, args) {
            window.parent.postMessage({ type: '__console__', level: type, data: args.map(String) }, '*');
          }
          console.log   = (...a) => { send('log',   a); _log(...a); };
          console.error = (...a) => { send('error', a); _err(...a); };
          console.warn  = (...a) => { send('warn',  a); _warn(...a); };
          window.onerror = (msg, src, line) => {
            send('error', [\`\${msg} (line \${line})\`]);
          };
        })();
      <\/script>
    `;
    return `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}${interceptConsole}<script>${js}<\/script></body></html>`;
  };

  // ── LIVE RUN ──────────────────────────────────────
  useEffect(() => {
    if (!autoRun) return;
    const t = setTimeout(() => {
      setConsoleLogs([]);
      setSrcDoc(buildSrc());
    }, 400);
    return () => clearTimeout(t);
  }, [html, css, js, autoRun]);

  // ── INTERCEPT CONSOLE ─────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === "__console__") {
        const { level, data } = e.data;
        setConsoleLogs(prev => [
          ...prev.slice(-49),
          { level, text: data.join(" "), id: Date.now() + Math.random() },
        ]);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // ── TAB INDENTATION ───────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = textareaRef.current;
      const start = ta.selectionStart;
      const end   = ta.selectionEnd;
      const val   = activeValue;
      const next  = val.substring(0, start) + "  " + val.substring(end);
      setters[activeTab](next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  };

  const handleReset = () => {
    setHtml("<h1>Hello World</h1>\n<p>Edit the code on the left to see changes live.</p>");
    setCss("body {\n  font-family: sans-serif;\n  padding: 24px;\n  background: #f8f8f8;\n}\nh1 { color: #9333ea; }\np  { color: #555; }");
    setJs("console.log('Hello from lesson!');");
    setConsoleLogs([]);
  };

  const activeTabMeta = TABS.find(t => t.id === activeTab);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');

        .ce-root * { box-sizing: border-box; margin: 0; padding: 0; }

        .ce-root {
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0a;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 24px 16px 40px;
          gap: 20px;
        }

        /* ── TOP BAR ── */
        .ce-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }

        .ce-topbar-left {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .ce-eyebrow {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9333ea;
        }

        .ce-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          line-height: 1.2;
        }

        .ce-topbar-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .ce-auto-toggle {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          color: #555;
          cursor: pointer;
          user-select: none;
        }

        .ce-toggle-track {
          width: 32px;
          height: 18px;
          border-radius: 9px;
          background: #222;
          border: 1px solid #333;
          position: relative;
          transition: background 0.2s;
          flex-shrink: 0;
        }

        .ce-toggle-track.on {
          background: #7e22ce;
          border-color: #9333ea;
        }

        .ce-toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #555;
          transition: transform 0.2s, background 0.2s;
        }

        .ce-toggle-track.on .ce-toggle-thumb {
          transform: translateX(14px);
          background: #fff;
        }

        .ce-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: #111;
          border: 1px solid #222;
          border-radius: 8px;
          color: #555;
          cursor: pointer;
          font-size: 12px;
          transition: color 0.15s, border-color 0.15s, background 0.15s;
        }

        .ce-icon-btn:hover {
          color: #fff;
          border-color: #9333ea55;
          background: #1a0a2e;
        }

        .ce-run-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 16px;
          background: #9333ea;
          border: none;
          border-radius: 8px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: background 0.15s, transform 0.1s;
        }

        .ce-run-btn:hover { background: #7e22ce; }
        .ce-run-btn:active { transform: scale(0.96); }

        /* ── LAYOUT ── */
        .ce-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          flex: 1;
        }

        @media (max-width: 700px) {
          .ce-layout { grid-template-columns: 1fr; }
        }

        /* ── LEFT PANE ── */
        .ce-left {
          display: flex;
          flex-direction: column;
          gap: 0;
          background: #0e0e0e;
          border: 1px solid #1f1f1f;
          border-radius: 14px;
          overflow: hidden;
          min-height: 420px;
        }

        /* ── TABS ── */
        .ce-tabs {
          display: flex;
          align-items: center;
          background: #0a0a0a;
          border-bottom: 1px solid #1a1a1a;
          padding: 0 4px;
        }

        .ce-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 14px;
          font-size: 12px;
          font-weight: 500;
          color: #444;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: color 0.15s, border-color 0.15s;
          user-select: none;
          white-space: nowrap;
        }

        .ce-tab:hover { color: #888; }
        .ce-tab.active { color: #fff; }

        .ce-tab-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* ── EDITOR AREA ── */
        .ce-editor-body {
          display: flex;
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        .ce-line-numbers {
          display: flex;
          flex-direction: column;
          padding: 14px 0 14px 0;
          min-width: 36px;
          text-align: right;
          background: #0a0a0a;
          border-right: 1px solid #161616;
          user-select: none;
          overflow: hidden;
        }

        .ce-line-numbers span {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #2a2a2a;
          line-height: 1.6;
          padding-right: 10px;
          display: block;
        }

        .ce-editor-wrap {
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        .ce-textarea {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          padding: 14px 14px 14px 14px;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          line-height: 1.6;
          color: #d4d4d4;
          caret-color: #9333ea;
          tab-size: 2;
          white-space: pre;
          overflow: auto;
          scrollbar-width: thin;
          scrollbar-color: #222 transparent;
        }

        .ce-textarea::selection { background: #9333ea33; }

        .ce-tab-actions {
          margin-left: auto;
          padding-right: 8px;
          display: flex;
          gap: 6px;
        }

        /* ── RIGHT PANE ── */
        .ce-right {
          display: flex;
          flex-direction: column;
          gap: 0;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #1f1f1f;
          min-height: 420px;
        }

        .ce-preview-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: #0a0a0a;
          border-bottom: 1px solid #1a1a1a;
          flex-shrink: 0;
        }

        .ce-preview-bar-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 500;
          color: #555;
        }

        .ce-preview-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 6px #22c55e88;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .ce-iframe {
          flex: 1;
          width: 100%;
          border: none;
          background: #fff;
          display: block;
        }

        .ce-iframe.expanded {
          position: fixed;
          inset: 0;
          z-index: 100;
          height: 100vh;
          width: 100vw;
        }

        /* ── CONSOLE ── */
        .ce-console {
          background: #080808;
          border-top: 1px solid #1a1a1a;
          flex-shrink: 0;
          max-height: 140px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #222 transparent;
        }

        .ce-console-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          border-bottom: 1px solid #111;
          position: sticky;
          top: 0;
          background: #080808;
          z-index: 1;
        }

        .ce-console-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #333;
        }

        .ce-console-count {
          margin-left: auto;
          font-size: 10px;
          color: #333;
        }

        .ce-console-clear {
          font-size: 10px;
          color: #333;
          cursor: pointer;
          background: none;
          border: none;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.15s;
        }

        .ce-console-clear:hover { color: #888; }

        .ce-log-line {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 4px 14px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          line-height: 1.5;
          border-bottom: 1px solid #0e0e0e;
          animation: fadeSlideIn 0.15s ease;
        }

        .ce-log-line.log   { color: #aaa; }
        .ce-log-line.warn  { color: #fbbf24; background: #1c120700; }
        .ce-log-line.error { color: #f87171; background: #1a000000; }

        .ce-log-prefix {
          flex-shrink: 0;
          opacity: 0.4;
          font-size: 10px;
          margin-top: 1px;
        }

        /* ── BOTTOM ROW ── */
        .ce-bottom {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .ce-reset-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 14px;
          background: transparent;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          color: #555;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }

        .ce-reset-btn:hover { border-color: #ef444455; color: #f87171; }

        .ce-hint {
          font-size: 11px;
          color: #2a2a2a;
          margin-left: auto;
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="ce-root">

        {/* ── TOP BAR ── */}
        <div className="ce-topbar">
          <div className="ce-topbar-left">
            <span className="ce-eyebrow">Lesson {lessonId} · Playground</span>
            <h1 className="ce-title">Code Editor</h1>
          </div>
          <div className="ce-topbar-actions">
            <label className="ce-auto-toggle" onClick={() => setAutoRun(v => !v)}>
              <div className={`ce-toggle-track ${autoRun ? "on" : ""}`}>
                <div className="ce-toggle-thumb" />
              </div>
              Live
            </label>
            {!autoRun && (
              <button
                className="ce-run-btn"
                onClick={() => { setConsoleLogs([]); setSrcDoc(buildSrc()); }}
              >
                <FaPlay size={10} /> Run
              </button>
            )}
          </div>
        </div>

        {/* ── LAYOUT ── */}
        <div className="ce-layout">

          {/* LEFT: EDITOR */}
          <div className="ce-left">
            <div className="ce-tabs">
              {TABS.map(tab => (
                <div
                  key={tab.id}
                  className={`ce-tab ${activeTab === tab.id ? "active" : ""}`}
                  style={activeTab === tab.id ? { borderBottomColor: tab.color } : {}}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className="ce-tab-dot" style={{ background: tab.color }} />
                  <tab.Icon size={12} style={{ color: activeTab === tab.id ? tab.color : undefined }} />
                  {tab.label}
                </div>
              ))}
              <div className="ce-tab-actions">
                <button
                  className="ce-icon-btn"
                  title="Copy code"
                  onClick={() => copy(activeValue)}
                >
                  {copied ? <FaCheck size={10} style={{ color: "#22c55e" }} /> : <FaCopy size={10} />}
                </button>
              </div>
            </div>

            <div className="ce-editor-body" style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                <LineNumbers value={activeValue} />
                <div className="ce-editor-wrap">
                  <textarea
                    ref={textareaRef}
                    key={activeTab}
                    className="ce-textarea"
                    value={activeValue}
                    onChange={e => setters[activeTab](e.target.value)}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    placeholder={activeTabMeta?.placeholder}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: PREVIEW + CONSOLE */}
          <div className="ce-right">
            <div className="ce-preview-bar">
              <div className="ce-preview-bar-title">
                <div className="ce-preview-dot" />
                Preview
              </div>
              <button
                className="ce-icon-btn"
                title={previewExpanded ? "Collapse" : "Expand"}
                onClick={() => setPreviewExpanded(v => !v)}
              >
                {previewExpanded ? <FaCompress size={11} /> : <FaExpand size={11} />}
              </button>
            </div>

            <iframe
              key={srcDoc}
              srcDoc={srcDoc}
              title="preview"
              sandbox="allow-scripts"
              className={`ce-iframe ${previewExpanded ? "expanded" : ""}`}
              style={{ flex: 1 }}
            />

            {/* CONSOLE */}
            <div className="ce-console">
              <div className="ce-console-bar">
                <span className="ce-console-label">
                  <FaTerminal size={9} /> Console
                </span>
                {consoleLogs.length > 0 && (
                  <span className="ce-console-count">{consoleLogs.length} output{consoleLogs.length !== 1 ? "s" : ""}</span>
                )}
                {consoleLogs.length > 0 && (
                  <button className="ce-console-clear" onClick={() => setConsoleLogs([])}>
                    clear
                  </button>
                )}
              </div>
              {consoleLogs.length === 0 ? (
                <div style={{ padding: "10px 14px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#2a2a2a" }}>
                  — no output
                </div>
              ) : (
                consoleLogs.map(log => (
                  <div key={log.id} className={`ce-log-line ${log.level}`}>
                    <span className="ce-log-prefix">
                      {log.level === "error" ? "✖" : log.level === "warn" ? "⚠" : "›"}
                    </span>
                    <span>{log.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── BOTTOM ROW ── */}
        <div className="ce-bottom">
          <button className="ce-reset-btn" onClick={handleReset}>
            <FaTrash size={10} /> Reset
          </button>
          <span className="ce-hint">Tab = 2 spaces · Auto-save in memory</span>
        </div>

      </div>

      <BottomNav />
    </>
  );
}