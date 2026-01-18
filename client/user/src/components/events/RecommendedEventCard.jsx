import { useNavigate } from "react-router-dom";

export default function RecommendedEventCard({ event }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/events/${event._id}`)}
      className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition p-4"
    >
      <img
        src={event.banner}
        alt={event.title}
        className="rounded-lg h-36 w-full object-cover"
      />

      <h3 className="font-semibold mt-3">{event.title}</h3>

      <p className="text-sm text-gray-500">
        {event.mode === "offline"
          ? `${event.location.city}, ${event.location.state}`
          : "Online"}
      </p>

      <p className="text-sm mt-1 font-semibold">
        {event.isPaid ? `₹${event.price}` : "Free"}
      </p>
    </div>
  );
}
