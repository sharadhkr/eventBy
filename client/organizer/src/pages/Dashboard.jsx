import { useOrganiserAuth } from "../context/organiser.auth.context";
import {
  Calendar,
  PlusCircle,
  Users,
  Ticket,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { organiser, logout } = useOrganiserAuth();
  const navigate = useNavigate();

  const stats = [
    {
      label: "Total Events",
      value: 12,
      icon: Calendar,
    },
    {
      label: "Tickets Sold",
      value: 842,
      icon: Ticket,
    },
    {
      label: "Attendees",
      value: 615,
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ─── HEADER ───────────────────────────── */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-800">
              Organiser Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              {organiser?.organisationName || organiser?.name}
            </span>

            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ─── MAIN ─────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome, {organiser?.name} 👋
          </h2>
          <p className="text-gray-500">
            Manage your events, tickets and attendees
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl shadow p-6 flex items-center gap-4"
              >
                <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            title="Create Event"
            description="Publish a new event"
            icon={PlusCircle}
            onClick={() => navigate("/organiser/events/create")}
          />

          <ActionCard
            title="Manage Events"
            description="Edit or delete events"
            icon={Calendar}
            onClick={() => navigate("/organiser/events")}
          />

          <ActionCard
            title="View Bookings"
            description="Check tickets & attendees"
            icon={Users}
            onClick={() => navigate("/organiser/bookings")}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

/* ─────────────────────────────────────────── */

const ActionCard = ({ title, description, icon: Icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow p-6 text-left hover:shadow-lg transition group"
    >
      <div className="flex items-center gap-3 mb-3">
        <Icon className="text-indigo-600 group-hover:scale-110 transition" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-sm text-gray-500">{description}</p>
    </button>
  );
};
