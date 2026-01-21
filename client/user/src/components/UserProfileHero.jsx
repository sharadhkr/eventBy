import { motion } from "framer-motion";
import { Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserProfileHero({ user, teamsCount, onCreateTeam }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-slate-50 border border-slate-100 p-5 sm:p-6"
    >
      {/* BACKGROUND DECOR */}
      <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-indigo-100 blur-3xl opacity-50" />
      <div className="absolute bottom-0 -left-20 h-48 w-48 rounded-full bg-sky-100 blur-3xl opacity-40" />

      {/* CONTENT */}
      <div className="relative flex items-center gap-4">

        {/* AVATAR */}
        <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-4 ring-white shadow-lg">
          <AvatarImage src={user.photoURL} />
          <AvatarFallback>
            {user.displayName?.[0]}
          </AvatarFallback>
        </Avatar>

        {/* USER INFO */}
        <div className="flex-1">
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">
            {user.displayName}
          </h1>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mt-1">
            <MapPin size={14} />
            <span>{user.location || "India"}</span>
          </div>

          {/* STATS */}
          <div className="flex gap-4 mt-3">
            <Stat label="Events" value={user.joinedEvents?.length || 0} />
            <Stat label="Teams" value={teamsCount} />
            <Stat label="Saved" value={user.savedEvents?.length || 0} />
          </div>
        </div>

        {/* CREATE TEAM BUTTON */}
        <Button
          onClick={onCreateTeam}
          size="icon"
          className="rounded-full h-11 w-11 shadow-lg"
        >
          <Plus />
        </Button>
      </div>
    </motion.div>
  );
}

/* ---------- SMALL STAT ---------- */
function Stat({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-sm sm:text-base font-black text-slate-900">
        {value}
      </p>
      <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wide">
        {label}
      </p>
    </div>
  );
}
