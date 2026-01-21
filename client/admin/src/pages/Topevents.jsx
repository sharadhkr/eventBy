import { useAdminTopEvents } from "../context/Topevent";
import TopEventSlot from "../components/TopEventSlot";

const AdminTopEvents = () => {
  const {
    topEvents,
    allEvents,
    loading,
    setTopEvent,
    removeTopEvent,
  } = useAdminTopEvents();

  const getSlot = (pos) =>
    topEvents.find((t) => t.position === pos) || null;

  if (loading) return <div>Loading top events...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Top Events Control</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((pos) => (
          <TopEventSlot
            key={pos}
            position={pos}
            topEvent={getSlot(pos)}
            allEvents={allEvents}
            onSelect={setTopEvent}
            onRemove={removeTopEvent}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminTopEvents;
