import { useEffect, useState } from "react";
import { userAPI } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userAPI.getProfile();
        setUser(res.data.data); // ✅ IMPORTANT
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load profile
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

      {/* ================= PROFILE HEADER ================= */}
      <div className="bg-white rounded-3xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        <div className="flex items-center gap-5">
          <img
            src={user.photoURL || "/avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hello, {user.displayName || "User"} 👋
            </h1>
            <p className="text-gray-500 capitalize">
              {user.role || "user"}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/editprofile")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
        >
          <Pencil size={18} />
          Edit Profile
        </button>
      </div>

      {/* ================= QUICK STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        <StatCard
          label="Joined Events"
          value={user.joinedEvents?.length || 0}
        />

        <StatCard
          label="Skills"
          value={user.skills?.length || 0}
        />

        <StatCard
          label="Portfolio Links"
          value={
            Object.values(user.portfolio || {}).filter(Boolean).length
          }
        />

      </div>

      {/* ================= JOINED EVENTS ================= */}
      <Section title="Joined Events">
        {user.joinedEvents?.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {user.joinedEvents.map((event) => (
              <div
                key={event._id}
                className="border rounded-xl p-4 hover:shadow transition"
              >
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(event.eventDate).toDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState text="You haven’t joined any events yet." />
        )}
      </Section>

      {/* ================= ORGANISER SECTION ================= */}
      {user.role === "organiser" && (
        <Section title="Organised Events">
          {user.organizedEvents?.length ? (
            <div>Organiser events here</div>
          ) : (
            <EmptyState text="No organised events yet." />
          )}
        </Section>
      )}
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 text-center">
      <p className="text-3xl font-bold text-indigo-600">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-3xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <p className="text-gray-500 text-sm">{text}</p>
  );
}
