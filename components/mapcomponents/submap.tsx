"use client";

import { useEffect, useRef, useState } from "react";
import { Salon } from "@/types/salon";

interface SalonMapProps {
  salon: Salon;
}

export default function SalonMap({ salon }: SalonMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
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
      {ready && <InitMap salon={salon} mapRef={mapRef} />}
    </>
  );
}

function InitMap({ salon, mapRef }: any) {
  useEffect(() => {
    if (!window.google || !window.google.maps) return;
    if (!mapRef.current) return;
    if ((mapRef.current as any)._mapInitialized) return;
    (mapRef.current as any)._mapInitialized = true;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: salon.lat, lng: salon.lon },
      zoom: 16,
    });

    new window.google.maps.Marker({
      position: { lat: salon.lat, lng: salon.lon },
      map,
      title: salon.name,
    });
  }, [salon, mapRef]);

  return null;
}
