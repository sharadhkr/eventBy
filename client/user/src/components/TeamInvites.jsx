import { BellRing, Check, X } from "lucide-react";
import { teamAPI } from "../lib/api";
import { toast } from "react-hot-toast";

export default function TeamInvites({ invites, onAction }) {
  if (!invites.length) return null;

  const handleResponse = async (id, action) => {
    try {
      await teamAPI.respondToInvite(id, action);
      toast.success(`Invite ${action}ed`);
      onAction(); // This refreshes the data in the parent, not the browser page
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="bg-indigo-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200">
      <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
        <BellRing size={16} /> New Team Invites
      </h3>
      <div className="grid gap-3">
        {invites.map(inv => (
          <div key={inv._id} className="bg-white/10 p-4 rounded-2xl flex items-center justify-between">
            <p className="font-bold">{inv.name} <span className="opacity-60 font-normal text-sm">by {inv.leader?.displayName}</span></p>
            <div className="flex gap-2">
              <button onClick={() => handleResponse(inv._id, 'accept')} className="p-2 bg-white text-indigo-600 rounded-lg"><Check size={16}/></button>
              <button onClick={() => handleResponse(inv._id, 'reject')} className="p-2 bg-red-400 text-white rounded-lg"><X size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}