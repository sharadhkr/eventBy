import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  PlusCircle,
  Users,
  Ticket,
  LogOut,
  LayoutDashboard,
  Eye,
  Edit3,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { organiserAPI } from "../api/api";
import { useOrganiserAuth } from "../context/organiser.auth.context";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const { organiser, logout } = useOrganiserAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH EVENTS
  ========================= */
  useEffect(() => {
    (async () => {
      try {
        const res = await organiserAPI.getMyEvents();
        setEvents(res.data.data || []);
      } catch (err) {
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* =========================
     STATS (DERIVED)
  ========================= */
  const stats = useMemo(() => {
    const totalEvents = events.length;
    const published = events.filter((e) => e.status === "published").length;
    const draft = events.filter((e) => e.status === "draft").length;

    const totalParticipants = events.reduce(
      (sum, e) => sum + (e.soldSeats || 0),
      0
    );

    const revenue = events.reduce((sum, e) => {
  if (!e.pricing) return sum;
  if (e.pricing.isFree) return sum;

  const amount = Number(e.pricing.amount || 0);
  const sold = Number(e.soldSeats || 0);

  return sum + amount * sold;
}, 0);


    return { totalEvents, published, draft, totalParticipants, revenue };
  }, [events]);

  /* =========================
     ACTIONS
  ========================= */
  const toggleStatus = async (event) => {
    try {
      const next = event.status === "published" ? "draft" : "published";
      await organiserAPI.toggleStatus(event._id, next);
      setEvents((prev) =>
        prev.map((e) => (e._id === event._id ? { ...e, status: next } : e))
      );
      toast.success(`Event ${next}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-slate-100">
      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-indigo-600" />
            <h1 className="text-xl font-bold">Organiser Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 hidden sm:block">
              {organiser?.organisationName}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-1 text-sm text-red-600"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* WELCOME */}
        <div>
          <h2 className="text-2xl font-bold">Welcome back 👋</h2>
          <p className="text-slate-500">
            Create, publish and manage your events
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <Stat label="Total Events" value={stats.totalEvents} icon={Calendar} />
          <Stat label="Published" value={stats.published} icon={Eye} />
          <Stat label="Drafts" value={stats.draft} icon={Edit3} />
          <Stat label="Participants" value={stats.totalParticipants} icon={Users} />
          <Stat label="Revenue (₹)" value={stats.revenue} icon={Ticket} />
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            title="Create Event"
            description="Publish a new event"
            icon={PlusCircle}
            onClick={() => navigate("/events/create")}
          />
          <ActionCard
            title="Manage Events"
            description="Edit, publish or unpublish"
            icon={Calendar}
            onClick={() => navigate("/events/manage")}
          />
          <ActionCard
            title="View Participants"
            description="Check joined users"
            icon={Users}
            onClick={() => navigate("/organiser/participants")}
          />
        </div>

        {/* EVENTS TABLE (INLINE MANAGE) */}
        <section className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold">Your Events</h3>
          </div>

          {loading ? (
            <div className="p-6 text-slate-500">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="p-6 text-slate-500">No events created yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left">Title</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Participants</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event._id} className="border-t">
                      <td className="px-6 py-3 font-medium">{event.title}</td>
                      <td className="px-6 py-3 capitalize">{event.status}</td>
                      <td className="px-6 py-3 text-center">{event.soldSeats || 0}</td>
                      <td className="px-6 py-3 flex items-center justify-center gap-3">
                        <button
                          onClick={() => navigate(`/events/edit/${event._id}`)}
                          className="icon-btn"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => toggleStatus(event)}
                          className="icon-btn"
                        >
                          {event.status === "published" ? (
                            <ToggleRight size={18} />
                          ) : (
                            <ToggleLeft size={18} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

/* =========================
   UI HELPERS
========================= */

const Stat = ({ label, value, icon: Icon }) => (
  <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
    <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
      <Icon size={22} />
    </div>
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

const ActionCard = ({ title, description, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white rounded-xl shadow p-6 text-left hover:shadow-lg transition"
  >
    <div className="flex items-center gap-3 mb-2">
      <Icon className="text-indigo-600" />
      <h3 className="font-semibold">{title}</h3>
    </div>
    <p className="text-sm text-slate-500">{description}</p>
  </button>
);
