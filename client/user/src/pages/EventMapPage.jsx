import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import { MapPin, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { eventAPI } from "../lib/api";
import { toast } from "react-hot-toast";
import Loading from "../components/Loading";

/* 👉 YOUR VAUL DRAWER */
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

/* =========================
   MARKER ICONS
========================= */
const eventMarker = (type) =>
  L.divIcon({
    html: `<div class="marker ${type}"></div>`,
    className: "",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });

const userMarker = L.divIcon({
  html: `<div class="user-dot"></div>`,
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

/* =========================
   DISTANCE UTILITY
========================= */
const distanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
  return +(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
};

/* =========================
   ROUTING (GOOGLE MAPS STYLE)
========================= */
function NavigationRoute({ from, to }) {
  const map = useMap();
  const routeRef = useRef(null);

  useEffect(() => {
    if (!from || !to) return;

    if (routeRef.current) {
      map.removeControl(routeRef.current);
    }

    routeRef.current = L.Routing.control({
      waypoints: [L.latLng(from), L.latLng(to)],
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: "#2563eb", weight: 6 }],
      },
    }).addTo(map);

    return () => {
      if (routeRef.current) map.removeControl(routeRef.current);
    };
  }, [from, to, map]);

  return null;
}

/* =========================
   MAIN PAGE
========================= */
export default function EventMapPage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔑 DRAWER CONTROL (IMPORTANT) */
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [filters, setFilters] = useState({
    free: false,
    paid: false,
    hackathon: false,
    workshop: false,
    techevent: false,
  });
  const [radius, setRadius] = useState("all");

  const [userPos, setUserPos] = useState(null);
  const [routeTo, setRouteTo] = useState(null);

  /* LOAD EVENTS + USER LOCATION */
  useEffect(() => {
    (async () => {
      try {
        const res = await eventAPI.getAllEvents();
        setEvents(res.data?.data || []);
      } catch {
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    })();

    navigator.geolocation?.watchPosition(
      (pos) =>
        setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => toast.error("Location permission denied"),
      { enableHighAccuracy: true }
    );
  }, []);

  /* FILTER + DISTANCE LOGIC */
  const filteredEvents = useMemo(() => {
    if (!userPos) return [];

    return events
      .filter((e) => e.mode === "offline")
      .map((e) => {
        const [lng, lat] = e.geoLocation.coordinates;
        return {
          ...e,
          lat,
          lng,
          distance: distanceKm(userPos[0], userPos[1], lat, lng),
        };
      })
      .filter((e) => {
        const active = Object.values(filters).some(Boolean);
        if (!active) return true;
        if (filters.free && e.price === 0) return true;
        if (filters.paid && e.price > 0) return true;
        if (filters.hackathon && e.eventType === "hackathon") return true;
        if (filters.workshop && e.eventType === "workshop") return true;
        if (filters.techevent && e.eventType === "techevent") return true;
        return false;
      })
      .filter((e) => {
        if (radius === "all") return true;
        return e.distance <= Number(radius);
      });
  }, [events, filters, radius, userPos]);

  if (loading || !userPos) return <Loading />;

  return (
    <div className="relative h-screen w-full">

      {/* FILTER BUTTON (FIXED + ABOVE MAP) */}
      <Button
        size="icon"
        onClick={() => setDrawerOpen(true)}
        className="fixed top-4 right-4 z-[2000] rounded-2xl shadow-xl"
      >
        <Filter />
      </Button>

      {/* DRAWER */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="z-[3000]">
          <DrawerHeader>
            <DrawerTitle>Filter Events</DrawerTitle>
          </DrawerHeader>

          <div className="px-4 pb-6 space-y-6">

            {/* EVENT TYPES */}
            <div>
              <p className="text-xs font-bold text-muted-foreground mb-2">
                EVENT TYPE
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(filters).map((key) => (
                  <Button
                    key={key}
                    variant={filters[key] ? "default" : "secondary"}
                    onClick={() =>
                      setFilters((f) => ({ ...f, [key]: !f[key] }))
                    }
                  >
                    {key.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            {/* RADIUS */}
            <div>
              <p className="text-xs font-bold text-muted-foreground mb-2">
                DISTANCE
              </p>
              <div className="grid grid-cols-4 gap-2">
                {["5", "10", "25", "all"].map((r) => (
                  <Button
                    key={r}
                    variant={radius === r ? "default" : "secondary"}
                    onClick={() => setRadius(r)}
                  >
                    {r === "all" ? "ALL" : `${r} KM`}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              className="w-full"
              onClick={() => setDrawerOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* MAP */}
      <MapContainer
        center={userPos}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        {/* USER LOCATION */}
        <Marker position={userPos} icon={userMarker} />

        {/* EVENTS */}
        {filteredEvents.map((event) => (
          <Marker
            key={event._id}
            position={[event.lat, event.lng]}
            icon={eventMarker(event.price > 0 ? "paid" : "free")}
            eventHandlers={{
              click: () => setRouteTo([event.lat, event.lng]),
            }}
          >
            <Popup>
              <div className="w-56">
                <img
                  src={event.banner}
                  className="h-28 w-full rounded-xl object-cover"
                />
                <h3 className="font-black mt-2">{event.title}</h3>
                <p className="text-xs text-muted-foreground">
                  <MapPin size={10} className="inline" />{" "}
                  {event.location?.address}
                </p>
                <p className="text-xs font-bold text-indigo-600">
                  {event.distance} km away
                </p>
                <Button
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => navigate(`/events/${event._id}`)}
                >
                  View Event
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}

        {routeTo && <NavigationRoute from={userPos} to={routeTo} />}
      </MapContainer>

      {/* MARKER STYLES */}
      <style>{`
        .marker {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: white;
          box-shadow: 0 6px 18px rgba(0,0,0,.15);
          position: relative;
        }
        .marker::after {
          content:'';
          position:absolute;
          inset:-7px;
          border-radius:999px;
          opacity:.2;
          background:var(--c);
        }
        .marker.free { --c:#10b981; box-shadow: inset 0 0 0 4px #10b981; }
        .marker.paid { --c:#6366f1; box-shadow: inset 0 0 0 4px #6366f1; }

        .user-dot {
          width: 14px;
          height: 14px;
          background: #2563eb;
          border-radius: 999px;
          box-shadow: 0 0 0 6px rgba(37,99,235,.35);
        }
      `}</style>
    </div>
  );
}
