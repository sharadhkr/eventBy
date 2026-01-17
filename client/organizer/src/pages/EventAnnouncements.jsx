import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { organiserAPI } from "../api/api";
import { toast } from "react-hot-toast";
import { Send, Megaphone, ArrowLeft } from "lucide-react";

const EventAnnouncements = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  /* =========================
     FETCH ANNOUNCEMENTS
  ========================= */
  useEffect(() => {
    loadAnnouncements();
  }, [id]);

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

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     SEND ANNOUNCEMENT
  ========================= */
  const sendAnnouncement = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setSending(true);

      // optimistic UI
      const optimistic = {
        _id: Date.now(),
        content,
        createdAt: new Date().toISOString(),
        senderType: "Organiser",
      };
      setMessages((prev) => [...prev, optimistic]);
      setContent("");

      await organiserAPI.postAnnouncement(id, content);
    } catch {
      toast.error("Failed to send announcement");
      loadAnnouncements();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-80px)] flex flex-col p-4">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="text-slate-500">
          <ArrowLeft />
        </button>
        <div className="flex items-center gap-2">
          <Megaphone className="text-indigo-600" />
          <h1 className="text-xl font-bold">Event Announcements</h1>
        </div>
      </div>

      {/* CHAT BOX */}
      <div className="flex-1 bg-white rounded-3xl shadow p-4 overflow-y-auto space-y-4">
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-slate-500">No announcements yet</p>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className="flex justify-end">
              <div className="max-w-[80%] bg-indigo-600 text-white p-4 rounded-2xl rounded-br-sm">
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p className="text-[10px] text-indigo-200 mt-1 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <form
        onSubmit={sendAnnouncement}
        className="mt-4 flex items-center gap-3"
      >
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Send an update to all participants…"
          className="flex-1 input"
        />
        <button
          disabled={sending}
          className="bg-indigo-600 text-white px-5 py-3 rounded-xl"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default EventAnnouncements;

/* Tailwind helper
.input { @apply w-full p-3 rounded-xl bg-slate-50 border focus:ring-2 focus:ring-indigo-500 }
*/