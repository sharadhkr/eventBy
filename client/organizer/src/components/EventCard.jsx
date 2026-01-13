const EventCard = ({ event }) => {
  if (!event) return null;

  return (
    <div className="rounded-xl bg-white shadow hover:shadow-lg transition overflow-hidden">
      {/* Banner */}
      <img
        src={event.banner || "/placeholder.jpg"}
        alt={event.title || "Event Banner"}
        className="w-full h-48 object-cover"
      />

      {/* Content */}
      <div className="p-4 space-y-1">
        <h3 className="text-lg font-semibold line-clamp-1">
          {event.title || "Untitled Event"}
        </h3>

        <p className="text-sm text-gray-500">
          {event.location || "Location not set"}
        </p>

        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-gray-600">
            📅 {event.date ? new Date(event.date).toLocaleDateString() : "TBD"}
          </span>

          <span className="font-semibold text-black">
            ₹{event.price ?? "Free"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
