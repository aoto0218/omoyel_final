"use client";

import { useRef, useEffect, useState } from "react";
import Script from "next/script";

type Location = { name: string; lat: number; lng: number };

export default function Mapmain() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLatLng, setUserLatLng] = useState<google.maps.LatLng | null>(null);

  const fetchLocations = async () => {
    try {
      const res = await fetch("/api/locations");
      if (!res.ok) throw new Error("API取得失敗");
      const data: Location[] = await res.json();
      setLocations(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;

    const mapInstance = new google.maps.Map(mapRef.current, {
      zoom: 13,
      center: { lat: 35.0116, lng: 135.7681 },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });
    setMap(mapInstance);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          setUserLatLng(userPos);

          new google.maps.Marker({
            position: userPos,
            map: mapInstance,
            title: "現在地",
            icon: { url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" },
          });

          mapInstance.setCenter(userPos);
        },
        (error) => console.error(error)
      );
    }
  };

  // locations または userLatLng が更新されたらマーカー描画
  useEffect(() => {
    if (!map || !userLatLng) return;

    for (let i = 0; i < locations.length; i++) {
      const loc = locations[i];
      const spotLatLng = new google.maps.LatLng(loc.lat, loc.lng);
      const distance = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, spotLatLng);
      const distanceText = (distance / 1000).toFixed(2) + " km";

      const marker = new google.maps.Marker({
        position: spotLatLng,
        map,
        title: loc.name,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong>${loc.name}</strong><br>現在地から: ${distanceText}</div>`,
      });

      marker.addListener("click", () => infoWindow.open(map, marker));
    }
  }, [locations, map, userLatLng]);

  const google_apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${google_apiKey}&language=ja&libraries=geometry`}
        strategy="afterInteractive"
        onLoad={initMap}
      />
      <div ref={mapRef} style={{ width: "100%", height: "50vh" }} />
    </>
  );
}
