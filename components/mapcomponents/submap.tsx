"use client";

import { useEffect, useRef, useState } from "react";
import { Salon } from "@/types/salon";

interface SalonMapProps {
  salon: Salon;
}

export default function SalonMap({ salon }: SalonMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Google Maps スクリプトを動的に読み込む
  useEffect(() => {
    if (typeof window === "undefined") return; // サーバーでは何もしない

    if (!document.querySelector("#google-maps")) {
      const script = document.createElement("script");
      script.id = "google-maps";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !salon.lat || !salon.lon) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: salon.lat, lng: salon.lon },
      zoom: 16,
    });

    new google.maps.Marker({
      position: { lat: salon.lat, lng: salon.lon },
      map,
      title: salon.name,
    });
  }, [isLoaded, salon]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "300px", borderRadius: "12px", overflow: "hidden" }}
    />
  );
}
