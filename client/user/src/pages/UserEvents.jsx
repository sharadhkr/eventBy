import { useEffect, useState } from "react";
import { dashboardAPI } from "../lib/api";
import JoinedEventCard from "../components/events/JoinedEventCard";
import RecommendedEventCard from "../components/events/RecommendedEventCard";
import AnnouncementFeed from "../components/events/AnnouncementFeed";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function UserEvents() {
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [
          joinedRes,
          recommendedRes,
          announcementRes,
        ] = await Promise.all([
          dashboardAPI.getDashboardEvents(),
          dashboardAPI.getRecommendedEvents(),
          dashboardAPI.getDashboardAnnouncements(),
        ]);

        setJoined(joinedRes.data.data || []);
        setRecommended(recommendedRes.data.data || []);
        setAnnouncements(announcementRes.data.data || []);
      } catch {
        toast.error("Failed to load events dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      {/* JOINED EVENTS */}
      <section>
        <h2 className="text-2xl font-bold mb-4">My Events</h2>

        {joined.length === 0 ? (
          <p className="text-gray-500">You haven’t joined any events yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joined.map((item) => (
              <JoinedEventCard key={item._id} data={item} />
            ))}
          </div>
        )}
      </section>

      {/* RECOMMENDED */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Recommended For You</h2>

        {recommended.length === 0 ? (
          <p className="text-gray-500">No recommendations yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {recommended.map((event) => (
              <RecommendedEventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* ANNOUNCEMENTS */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Announcements</h2>
        <AnnouncementFeed announcements={announcements} />
      </section>
    </div>
  );
}
