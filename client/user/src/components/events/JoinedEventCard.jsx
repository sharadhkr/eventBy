import QRCode from "react-qr-code";

export default function JoinedEventCard({ data }) {
  const { event, team, pass } = data;

  return (
    <div className="bg-white rounded-2xl shadow p-4 space-y-3">
      <img
        src={event.banner}
        alt={event.title}
        className="rounded-xl h-40 w-full object-cover"
      />

      <h3 className="font-semibold text-lg">{event.title}</h3>

      <p className="text-sm text-gray-500">
        {event.mode === "offline"
          ? `${event.location.city}, ${event.location.state}`
          : "Online Event"}
      </p>

      {/* PASS */}
      {pass && (
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 mb-2">Your Event Pass</p>
          <QRCode value={pass.qrData} size={120} />
          <p className="text-xs mt-2 font-mono">{pass.passId}</p>
        </div>
      )}

      {team && (
        <p className="text-xs text-indigo-600">
          Team Participation
        </p>
      )}
    </div>
  );
}
