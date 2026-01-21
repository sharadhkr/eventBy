import toast from "react-hot-toast";

const TopEventSlot = ({
  position,
  topEvent,
  allEvents,
  onSelect,
  onRemove,
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-3">
      <h3 className="font-semibold">Top {position}</h3>

      {topEvent ? (
        <>
          <img
            src={topEvent.event.banner}
            alt=""
            className="h-32 w-full object-cover rounded"
          />
          <p className="font-medium">{topEvent.event.title}</p>
          <p className="text-sm text-gray-500">
            {topEvent.event.organiser.organisationName}
          </p>

          <button
            onClick={() => onRemove(topEvent.event._id)}
            className="text-sm text-red-500"
          >
            Remove
          </button>
        </>
      ) : (
        <p className="text-gray-400 text-sm">Empty Slot</p>
      )}

      <select
        className="w-full border p-2 rounded"
        defaultValue=""
        onChange={(e) => {
          if (!e.target.value) return;
          onSelect(e.target.value, position);
          e.target.value = "";
        }}
      >
        <option value="">Select event</option>
        {allEvents.map((e) => (
          <option key={e._id} value={e._id}>
            {e.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TopEventSlot;
