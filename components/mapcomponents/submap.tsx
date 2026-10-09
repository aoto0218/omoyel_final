"use client";

import { useEffect, useRef, useState } from "react";
import { getMarkerIcon } from "@/lib/match_colors";
import { getSalonMatch } from "@/lib/salon_match";
import { useMapProfile } from "@/lib/use_map_profile";
import { Salon } from "@/types/salon";

interface SalonMapProps {
  salon: Salon;
}

export default function SalonMap({ salon }: SalonMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const matchProfile = useMapProfile();
  const match = getSalonMatch(matchProfile, salon, matchProfile.favorites.includes(salon.id));
  const [ready, setReady] = useState(false);

  // Google Maps APIがロードされるまで待つ
  useEffect(() => {
    const timer = setInterval(() => {
      if (window.google && window.google.maps) {
        setReady(true);
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "500px",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      />
      {ready && <InitMap salon={salon} mapRef={mapRef} match={match} />}
    </>
  );
}

function InitMap({ salon, mapRef, match }: {
  salon: Salon;
  mapRef: React.RefObject<HTMLDivElement | null>;
  match: ReturnType<typeof getSalonMatch>;
}) {
  const mapInstance = useRef<google.maps.Map | null>(null);
  useEffect(() => {
    if (!window.google || !window.google.maps) return;
    if (!mapRef.current) return;

    const map = mapInstance.current ?? new window.google.maps.Map(mapRef.current, {
      center: { lat: salon.lat, lng: salon.lon },
      zoom: 16,
    });

    mapInstance.current = map;
    map.setCenter({ lat: salon.lat, lng: salon.lon });
    const marker = new window.google.maps.Marker({
      position: { lat: salon.lat, lng: salon.lon },
      map,
      title: [salon.name, match.description].filter(Boolean).join("："),
      icon: getMarkerIcon(match.color),
    });
    return () => marker.setMap(null);
  }, [salon, mapRef, match.color, match.description]);

  return null;
}
