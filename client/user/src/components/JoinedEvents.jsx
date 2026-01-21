import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Ticket, Clock, Users } from "lucide-react";
import api from "../lib/api";

export default function JoinedEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/users/home/details");
        setEvents(res.data.data.joinedEvents || []);
      } catch (err) {
        console.error("Failed to load joined events", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <SkeletonLoader />;

  if (events.length === 0) return null;

  return (
    <section className="py-4">
      <div className="flex justify-between items-center px-4 mb-4">
        <h2 className="text-xl font-black text-slate-800">My Tickets</h2>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
          {events.length} Active
        </span>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 px-4 no-scrollbar snap-x">
        {events.map(({ _id, event, team, timeRemaining, pass }) => (
          <motion.div
            key={_id}
            whileTap={{ scale: 0.98 }}
            className="min-w-[300px] bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm snap-center"
          >
            <div className="relative h-24">
              <img src={event.banner} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-3 text-white">
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                  {event.organiser.organisationName}
                </p>
                <h3 className="font-bold text-sm truncate w-48">{event.title}</h3>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock size={14} />
                  <span className="text-xs font-bold">
                    {timeRemaining === "Started" ? "Live Now" : `${timeRemaining.days}d ${timeRemaining.hours}h left`}
                  </span>
                </div>
                {pass && (
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md">
                    <Ticket size={12} />
                    <span className="text-[10px] font-black">{pass.passId}</span>
                  </div>
                )}
              </div>

              {team && (
                <div className="flex items-center gap-2 text-slate-400 bg-slate-50 p-2 rounded-xl">
                  <Users size={14} />
                  <span className="text-xs font-medium">Team: {team.name}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function SkeletonLoader() {
  return (
    <section className="py-4 px-4">
      <div className="h-6 w-32 bg-slate-200 rounded-md animate-pulse mb-4" />
      <div className="flex gap-4 overflow-hidden">
        {[1, 2].map((i) => (
          <div key={i} className="min-w-[300px] h-48 bg-slate-100 rounded-3xl animate-pulse" />
        ))}
      </div>
    </section>
  );
}
