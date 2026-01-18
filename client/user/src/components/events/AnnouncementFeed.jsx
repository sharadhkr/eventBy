export default function AnnouncementFeed({ announcements }) {
  if (!announcements.length) {
    return <p className="text-gray-500">No announcements yet.</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow divide-y">
      {announcements.map((a, i) => (
        <div key={i} className="p-4 space-y-1">
          <div className="flex items-center gap-2">
            <img
              src={a.event.banner}
              alt=""
              className="h-8 w-8 rounded"
            />
            <p className="text-sm font-semibold">{a.event.title}</p>
          </div>

          <p className="text-gray-700">{a.content}</p>

          <p className="text-xs text-gray-400">
            {new Date(a.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
