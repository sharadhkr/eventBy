import React, { useEffect, useState, useCallback } from "react";
import { userAPI } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  ArrowLeft,
  ChevronRight,
  Users,
  Heart,
  CalendarCheck,
  Shield,
  FileText,
  LogOut,
} from "lucide-react";

/* shadcn */
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

/* vaul drawer */
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import EventCard from "../../components/EventCard";
import Loading from "../../components/Loading";

/* =========================
   PROFILE PAGE
========================= */
export default function UserProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [teamsOpen, setTeamsOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);

  /* FETCH PROFILE */
  const fetchData = useCallback(async () => {
    try {
      const res = await userAPI.getProfile();
      setUser(res.data.data);
      setTeams(res.data.data.teams || []);
      setSavedEvents(res.data.data.savedEvents || []);
    } catch {
      toast.error("Session expired");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* =========================
     SKELETON STATE
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-24 w-full rounded-3xl" />
        <Skeleton className="h-20 w-full rounded-3xl" />
        <Skeleton className="h-20 w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">

      {/* TOP BAR */}
      <div className="sticky top-0 z-20 bg-white px-4 py-3 flex items-center gap-3">
        <ArrowLeft
          className="text-slate-600 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="font-semibold text-lg">My Profile</h1>
      </div>

      <div className="px-4 space-y-6 mt-4 max-w-xl mx-auto">

        {/* PROFILE CARD */}
        <div className="bg-white rounded-3xl p-4 shadow-sm flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.photoURL} />
            <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <p className="font-semibold text-base">{user.displayName}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>

          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 rounded-full"
            onClick={() => navigate("/profile/edit")}
          >
            Edit
          </Button>
        </div>

        {/* ACTION LIST */}
        <div className="bg-white rounded-3xl shadow-sm divide-y">

          {/* TEAMS → DRAWER */}
          <Row
            icon={Users}
            label="My Teams"
            onClick={() => setTeamsOpen(true)}
          />

          {/* SAVED → DRAWER */}
          <Row
            icon={Heart}
            label="Saved Events"
            onClick={() => setSavedOpen(true)}
          />

          {/* JOINED → REDIRECT */}
          <Row
            icon={CalendarCheck}
            label="Joined Events"
            onClick={() => navigate("/events")}
          />
        </div>

        {/* LEGAL */}
        <div className="bg-white rounded-3xl shadow-sm divide-y">
          <Row
            icon={FileText}
            label="Terms & Conditions"
            onClick={() => navigate("/terms")}
          />
          <Row
            icon={Shield}
            label="Privacy Policy"
            onClick={() => navigate("/privacy")}
          />
        </div>

        {/* LOGOUT */}
        <div className="bg-white rounded-3xl shadow-sm">
          <button
            onClick={() => {
              toast.success("Logged out");
              navigate("/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-4 text-red-500 font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* =========================
          TEAMS DRAWER
      ========================= */}
      <Drawer open={teamsOpen} onOpenChange={setTeamsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>My Teams</DrawerTitle>
          </DrawerHeader>

          <div className="px-4 pb-6 space-y-3">
            {teams.length ? (
              teams.map((team) => (
                <div
                  key={team._id}
                  className="bg-slate-50 rounded-2xl p-3"
                >
                  <p className="font-medium">{team.name}</p>
                  <p className="text-xs text-slate-500">
                    {team.event?.title || "Event Team"}
                  </p>
                </div>
              ))
            ) : (
              <Empty text="No teams yet" />
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* =========================
          SAVED EVENTS DRAWER
      ========================= */}
      <Drawer open={savedOpen} onOpenChange={setSavedOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Saved Events</DrawerTitle>
          </DrawerHeader>

          <div className="px-4 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedEvents.length ? (
              savedEvents.map((e) => (
                <EventCard key={e._id} {...e} />
              ))
            ) : (
              <Empty text="No saved events" />
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

/* =========================
   ROW
========================= */
function Row({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-4"
    >
      <div className="flex items-center gap-3 text-slate-700">
        <Icon size={18} />
        <span className="text-sm">{label}</span>
      </div>
      <ChevronRight size={18} className="text-slate-400" />
    </button>
  );
}

/* =========================
   EMPTY STATE
========================= */
function Empty({ text }) {
  return (
    <div className="py-16 text-center text-slate-400 text-sm">
      {text}
    </div>
  );
}
