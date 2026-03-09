// import { useEffect, useRef, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { organiserAPI } from "../api/api";
// import { toast } from "react-hot-toast";
// import { Send, Megaphone, ArrowLeft } from "lucide-react";

// const EventAnnouncements = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const bottomRef = useRef(null);

//   const [messages, setMessages] = useState([]);
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [sending, setSending] = useState(false);

//   /* =========================
//      FETCH ANNOUNCEMENTS
//   ========================= */
//   useEffect(() => {
//     loadAnnouncements();
//   }, [id]);

//   const loadAnnouncements = async () => {
//     try {
//       const res = await organiserAPI.getAnnouncements(id);
//       setMessages(res.data.data || []);
//     } catch {
//       toast.error("Failed to load announcements");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =========================
//      AUTO SCROLL
//   ========================= */
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   /* =========================
//      SEND ANNOUNCEMENT
//   ========================= */
//   const sendAnnouncement = async (e) => {
//     e.preventDefault();
//     if (!content.trim()) return;

//     try {
//       setSending(true);

//       // optimistic UI
//       const optimistic = {
//         _id: Date.now(),
//         content,
//         createdAt: new Date().toISOString(),
//         senderType: "Organiser",
//       };
//       setMessages((prev) => [...prev, optimistic]);
//       setContent("");

//       await organiserAPI.postAnnouncement(id, content);
//     } catch {
//       toast.error("Failed to send announcement");
//       loadAnnouncements();
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto h-[calc(100vh-80px)] flex flex-col p-4">
//       {/* HEADER */}
//       <div className="flex items-center gap-3 mb-4">
//         <button onClick={() => navigate(-1)} className="text-slate-500">
//           <ArrowLeft />
//         </button>
//         <div className="flex items-center gap-2">
//           <Megaphone className="text-indigo-600" />
//           <h1 className="text-xl font-bold">Event Announcements</h1>
//         </div>
//       </div>

//       {/* CHAT BOX */}
//       <div className="flex-1 bg-white rounded-3xl shadow p-4 overflow-y-auto space-y-4">
//         {loading ? (
//           <p className="text-slate-500">Loading...</p>
//         ) : messages.length === 0 ? (
//           <p className="text-slate-500">No announcements yet</p>
//         ) : (
//           messages.map((msg) => (
//             <div key={msg._id} className="flex justify-end">
//               <div className="max-w-[80%] bg-indigo-600 text-white p-4 rounded-2xl rounded-br-sm">
//                 <p className="text-sm leading-relaxed">{msg.content}</p>
//                 <p className="text-[10px] text-indigo-200 mt-1 text-right">
//                   {new Date(msg.createdAt).toLocaleTimeString()}
//                 </p>
//               </div>
//             </div>
//           ))
//         )}
//         <div ref={bottomRef} />
//       </div>

//       {/* INPUT */}
//       <form
//         onSubmit={sendAnnouncement}
//         className="mt-4 flex items-center gap-3"
//       >
//         <input
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="Send an update to all participants…"
//           className="flex-1 input"
//         />
//         <button
//           disabled={sending}
//           className="bg-indigo-600 text-white px-5 py-3 rounded-xl"
//         >
//           <Send size={18} />
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EventAnnouncements;

// /* Tailwind helper
// .input { @apply w-full p-3 rounded-xl bg-slate-50 border focus:ring-2 focus:ring-indigo-500 }
// */
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { organiserAPI } from "../api/api";
import { toast } from "react-hot-toast";
import { Send, Megaphone, ArrowLeft, Radio, Zap } from "lucide-react";

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Epilogue:wght@400;500;700;900&display=swap');

  :root {
    --bg:          #0d0d10;
    --bg-2:        #13131a;
    --bg-3:        #1a1a24;
    --border:      rgba(255,255,255,0.07);
    --border-hot:  rgba(255,214,0,0.35);
    --text:        #e8e8f0;
    --text-soft:   #7a7a99;
    --text-muted:  #44445a;
    --accent:      #ffd600;
    --accent-glow: rgba(255,214,0,0.18);
    --accent-dim:  rgba(255,214,0,0.08);
    --bubble-bg:   #1e1e2e;
    --bubble-border: rgba(255,214,0,0.15);
    --font-mono:   'IBM Plex Mono', monospace;
    --font-display:'Epilogue', sans-serif;
    --r-bubble: 1.25rem;
    --transition: 0.18s cubic-bezier(0.4,0,0.2,1);
  }

  .ann-root {
    font-family: var(--font-display);
    background: var(--bg);
    color: var(--text);
    height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    max-width: 860px;
    margin: 0 auto;
    padding: 1.5rem 1.5rem 1rem;
    position: relative;
    overflow: hidden;
  }

  /* grid-line backdrop */
  .ann-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,214,0,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,214,0,0.025) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  /* ambient glow top-right */
  .ann-root::after {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 360px; height: 360px;
    background: radial-gradient(circle, rgba(255,214,0,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .ann-root > * { position: relative; z-index: 1; }

  /* ── Header ── */
  .ann-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-shrink: 0;
  }

  .ann-back {
    width: 2.5rem; height: 2.5rem;
    background: var(--bg-3);
    border: 1px solid var(--border);
    border-radius: 0.625rem;
    color: var(--text-soft);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all var(--transition);
    flex-shrink: 0;
  }
  .ann-back:hover {
    border-color: var(--border-hot);
    color: var(--accent);
    background: var(--accent-dim);
  }

  .ann-title-group { flex: 1; }

  .ann-eyebrow {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.2rem;
  }

  .ann-dot {
    width: 6px; height: 6px;
    background: var(--accent);
    border-radius: 50%;
    animation: pulse-dot 2s ease-in-out infinite;
    flex-shrink: 0;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }

  .ann-title {
    font-family: var(--font-display);
    font-size: 1.35rem;
    font-weight: 900;
    color: var(--text);
    letter-spacing: -0.03em;
    line-height: 1;
  }

  .ann-count {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--text-muted);
    margin-left: 0.5rem;
    font-weight: 400;
  }

  /* ── Feed ── */
  .ann-feed {
    flex: 1;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: 1.5rem;
    padding: 1.5rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    scrollbar-width: thin;
    scrollbar-color: var(--bg-3) transparent;
    min-height: 0;
  }

  .ann-feed::-webkit-scrollbar { width: 4px; }
  .ann-feed::-webkit-scrollbar-track { background: transparent; }
  .ann-feed::-webkit-scrollbar-thumb { background: var(--bg-3); border-radius: 4px; }

  /* empty / loading states */
  .ann-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }

  .ann-empty-icon {
    width: 3rem; height: 3rem;
    border: 1px dashed var(--border);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
  }

  /* ── Bubble ── */
  .ann-bubble-wrap {
    display: flex;
    justify-content: flex-end;
    animation: bubble-in 0.22s cubic-bezier(0.34,1.56,0.64,1) both;
  }

  @keyframes bubble-in {
    from { opacity: 0; transform: translateY(10px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .ann-bubble {
    max-width: 78%;
    background: var(--bubble-bg);
    border: 1px solid var(--bubble-border);
    border-radius: var(--r-bubble) var(--r-bubble) 0.25rem var(--r-bubble);
    padding: 0.875rem 1.125rem;
    position: relative;
    transition: border-color var(--transition);
  }

  .ann-bubble:hover { border-color: rgba(255,214,0,0.3); }

  /* left accent bar */
  .ann-bubble::before {
    content: '';
    position: absolute;
    left: -1px; top: 0.75rem; bottom: 0.75rem;
    width: 2px;
    background: var(--accent);
    border-radius: 0 2px 2px 0;
    opacity: 0.6;
  }

  .ann-bubble-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .ann-sender-badge {
    font-family: var(--font-mono);
    font-size: 0.58rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent);
    background: var(--accent-dim);
    border: 1px solid rgba(255,214,0,0.2);
    padding: 0.15rem 0.5rem;
    border-radius: 100px;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .ann-bubble-text {
    font-size: 0.9rem;
    font-weight: 400;
    color: var(--text);
    line-height: 1.65;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .ann-bubble-time {
    font-family: var(--font-mono);
    font-size: 0.58rem;
    color: var(--text-muted);
    margin-top: 0.5rem;
    text-align: right;
    letter-spacing: 0.05em;
  }

  /* optimistic shimmer */
  .ann-bubble.optimistic { opacity: 0.7; }
  .ann-bubble.optimistic::after {
    content: '●●●';
    position: absolute;
    right: 1rem; bottom: 0.6rem;
    font-size: 0.4rem;
    color: var(--accent);
    letter-spacing: 0.2em;
    animation: dots 1.2s infinite;
  }

  @keyframes dots {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }

  /* ── Input Bar ── */
  .ann-input-bar {
    display: flex;
    align-items: flex-end;
    gap: 0.75rem;
    margin-top: 1rem;
    flex-shrink: 0;
  }

  .ann-input-wrapper {
    flex: 1;
    position: relative;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: 1rem;
    transition: border-color var(--transition), box-shadow var(--transition);
    display: flex;
    align-items: flex-end;
    overflow: hidden;
  }

  .ann-input-wrapper:focus-within {
    border-color: var(--border-hot);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }

  .ann-input-prefix {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--accent);
    padding: 0.875rem 0 0.875rem 1rem;
    flex-shrink: 0;
    line-height: 1;
    opacity: 0.7;
    user-select: none;
  }

  .ann-textarea {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text);
    font-family: var(--font-display);
    font-size: 0.9rem;
    font-weight: 400;
    padding: 0.875rem 1rem;
    resize: none;
    min-height: 2.75rem;
    max-height: 8rem;
    line-height: 1.5;
    overflow-y: auto;
  }

  .ann-textarea::placeholder {
    color: var(--text-muted);
  }

  .ann-textarea::-webkit-scrollbar { width: 3px; }
  .ann-textarea::-webkit-scrollbar-thumb { background: var(--bg-3); }

  .ann-send-btn {
    width: 2.75rem;
    height: 2.75rem;
    background: var(--accent);
    border: none;
    border-radius: 0.875rem;
    color: #0d0d10;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: all var(--transition);
    box-shadow: 0 4px 20px rgba(255,214,0,0.3);
  }

  .ann-send-btn:hover:not(:disabled) {
    transform: scale(1.06) translateY(-1px);
    box-shadow: 0 8px 28px rgba(255,214,0,0.45);
  }

  .ann-send-btn:active:not(:disabled) { transform: scale(0.96); }
  .ann-send-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; box-shadow: none; }

  /* ── Loading skeleton ── */
  .ann-skeleton {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .ann-skel-bubble {
    border-radius: 1rem 1rem 0.25rem 1rem;
    background: linear-gradient(90deg, var(--bg-3) 25%, var(--bg-2) 50%, var(--bg-3) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    height: 4.5rem;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
const EventAnnouncements = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => { loadAnnouncements(); }, [id]);

  const loadAnnouncements = async () => {
    try {
      const res = await organiserAPI.getAnnouncements(id);
      setMessages(res.data.data || []);
    } catch {
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendAnnouncement = async (e) => {
    e?.preventDefault();
    if (!content.trim()) return;

    try {
      setSending(true);
      const optimistic = {
        _id: `opt_${Date.now()}`,
        content,
        createdAt: new Date().toISOString(),
        senderType: "Organiser",
        isOptimistic: true,
      };
      setMessages((prev) => [...prev, optimistic]);
      setContent("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      await organiserAPI.postAnnouncement(id, content);
      setMessages((prev) =>
        prev.map((m) => m._id === optimistic._id ? { ...m, isOptimistic: false } : m)
      );
    } catch {
      toast.error("Failed to send announcement");
      loadAnnouncements();
    } finally {
      setSending(false);
    }
  };

  /* auto-grow textarea */
  const handleTextareaChange = (e) => {
    setContent(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendAnnouncement();
    }
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
      " · " + d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="ann-root">

        {/* ── Header ── */}
        <header className="ann-header">
          <button className="ann-back" onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft size={16} />
          </button>

          <div className="ann-title-group">
            <div className="ann-eyebrow">
              <span className="ann-dot" />
              <Radio size={10} />
              Broadcast Channel
            </div>
            <h1 className="ann-title">
              Announcements
              {!loading && (
                <span className="ann-count">
                  [{messages.length.toString().padStart(3, "0")}]
                </span>
              )}
            </h1>
          </div>

          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: "var(--text-muted)",
            letterSpacing: "0.05em",
            textAlign: "right",
            lineHeight: 1.6,
          }}>
            <div style={{ color: "var(--accent)", fontWeight: 600 }}>ORGANISER</div>
            <div>BROADCAST</div>
          </div>
        </header>

        {/* ── Feed ── */}
        <div className="ann-feed">
          {loading ? (
            <>
              {[72, 55, 88].map((w, i) => (
                <div key={i} className="ann-skeleton">
                  <div className="ann-skel-bubble" style={{ width: `${w}%`, animationDelay: `${i * 0.15}s` }} />
                </div>
              ))}
            </>
          ) : messages.length === 0 ? (
            <div className="ann-empty">
              <div className="ann-empty-icon"><Megaphone size={20} /></div>
              <div>NO_ANNOUNCEMENTS_YET</div>
              <div style={{ opacity: 0.5 }}>type below to broadcast</div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={msg._id}
                className="ann-bubble-wrap"
                style={{ animationDelay: `${Math.min(idx * 0.04, 0.3)}s` }}
              >
                <div className={`ann-bubble ${msg.isOptimistic ? "optimistic" : ""}`}>
                  <div className="ann-bubble-header">
                    <span className="ann-sender-badge">
                      <Zap size={8} />
                      {msg.senderType || "Organiser"}
                    </span>
                  </div>
                  <p className="ann-bubble-text">{msg.content}</p>
                  <p className="ann-bubble-time">{formatTime(msg.createdAt)}</p>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* ── Input Bar ── */}
        <div className="ann-input-bar">
          <div className="ann-input-wrapper">
            <span className="ann-input-prefix">&gt;_</span>
            <textarea
              ref={textareaRef}
              className="ann-textarea"
              value={content}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Broadcast to all participants… (Enter to send)"
              rows={1}
            />
          </div>
          <button
            className="ann-send-btn"
            onClick={sendAnnouncement}
            disabled={sending || !content.trim()}
            aria-label="Send announcement"
          >
            <Send size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* hint */}
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.58rem",
          color: "var(--text-muted)",
          textAlign: "center",
          marginTop: "0.5rem",
          letterSpacing: "0.08em",
          flexShrink: 0,
        }}>
          ENTER → send &nbsp;·&nbsp; SHIFT+ENTER → new line
        </div>
      </div>
    </>
  );
};

export default EventAnnouncements;