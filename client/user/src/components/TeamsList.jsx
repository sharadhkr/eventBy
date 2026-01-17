import { Users, CheckCircle, Clock } from "lucide-react";

export default function TeamsList({ teams }) {
  if (!teams.length) return <p className="col-span-full text-center py-10 text-slate-400">No teams found.</p>;

  return teams.map((team) => (
    <div key={team._id} className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-black text-slate-800 text-lg">{team.name}</h3>
        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg">
          {team.size} PERS
        </span>
      </div>

      <div className="space-y-3">
        {team.members.map((member, idx) => (
          <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                {member.user?.displayName?.charAt(0)}
              </div>
              <span className="text-xs font-bold text-slate-700">{member.user?.displayName}</span>
            </div>
            {member.status === 'accepted' ? (
              <span className="text-emerald-500 flex items-center gap-1 text-[10px] font-bold"><CheckCircle size={12}/> OK</span>
            ) : (
              <span className="text-amber-500 flex items-center gap-1 text-[10px] font-bold"><Clock size={12}/> PENDING</span>
            )}
          </div>
        ))}
      </div>
    </div>
  ));
}