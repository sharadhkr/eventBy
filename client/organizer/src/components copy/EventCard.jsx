const EventCard = ({ event }) => {
  if (!event || typeof event !== "object") return null;

  const {
    banner,
    title,
    location,
    date,
    price,
  } = event;

  return (
    <div className="rounded-xl bg-white shadow hover:shadow-lg transition overflow-hidden">
      {/* Banner */}
      <img
        src={banner || "/placeholder.jpg"}
        alt={title || "Event Banner"}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = "/placeholder.jpg";
        }}
      />

      {/* Content */}
      <div className="p-4 space-y-1">
        <h3 className="text-lg font-semibold line-clamp-1">
          {title || "Untitled Event"}
        </h3>

        <p className="text-sm text-gray-500">
          {location || "Location not set"}
        </p>

        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-gray-600">
            📅 {date ? new Date(date).toLocaleDateString() : "TBD"}
          </span>

          <span className="font-semibold text-black">
            {price ? `₹${price}` : "Free"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
