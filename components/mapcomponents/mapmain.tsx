"use client";

import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { Salon as BaseSalon } from "@/types/salon";

interface Salon extends BaseSalon {
  rating?: number;
  reviewCount?: number;
}

type Location = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lon: number;
  image1?: string;
  averageRatings?: {
    overall: number;
    rating_1: number;
    rating_2: number;
    rating_3: number;
    rating_4: number;
    rating_5: number;
    reviewCount?: number;
  };
  reviewCount?: number;
  rating?: number; // ← ここを追加
};


export type ChildHandle = {
  initMapFromParent: () => void;
};

const Mapmain = forwardRef<ChildHandle, { salons: Salon[] }>(({ salons }, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLatLng, setUserLatLng] = useState<google.maps.LatLng | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // salons -> locations
  useEffect(() => {
    if (salons.length > 0) {
      const locs: Location[] = salons.map(s => ({
        id: s.id,
        name: s.name,
        address: s.address,
        lat: s.lat,
        lon: s.lon,
        image1: s.images?.image1 || "/fallback.png",
        // null の場合は undefined に変換
        averageRatings: s.averageRatings ? s.averageRatings : undefined,
        reviewCount: s.averageRatings?.reviewCount ?? 0,
        rating: s.averageRatings?.overall,
      }));
      setLocations(locs);
    }
  }, [salons]);
  

  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  const initMap = useCallback(() => {
    if (!window.google || !mapRef.current || map) return;

    const mapInstance = new google.maps.Map(mapRef.current, {
      zoom: 13,
      center: { lat: 35.0116, lng: 135.7681 },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

    setMap(mapInstance);

    directionsServiceRef.current = new google.maps.DirectionsService();
    directionsRendererRef.current = new google.maps.DirectionsRenderer({ map: mapInstance });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const userPos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          setUserLatLng(userPos);

          new google.maps.Marker({
            position: userPos,
            map: mapInstance,
            title: "現在地",
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#115EC3",
              fillOpacity: 1,
              strokeColor: "white",
              strokeWeight: 2,
              scale: 7,
            },
          });

          new google.maps.Circle({
            strokeColor: "#115EC3",
            strokeOpacity: 0.2,
            strokeWeight: 1,
            fillColor: "#115EC3",
            fillOpacity: 0.2,
            map: mapInstance,
            center: userPos,
            radius: 100,
          });

          mapInstance.setCenter(userPos);
        },
        err => console.warn("Geolocation error:", err)
      );
    }
  }, [map]);

  // locations -> markers
  useEffect(() => {
    if (!map || locations.length === 0) return;
    let openedInfoWindow: google.maps.InfoWindow | null = null;

    locations.forEach((loc, i) => {
      try {
        const spot = new google.maps.LatLng(loc.lat, loc.lon);
        const marker = new google.maps.Marker({
          position: spot,
          map,
          title: loc.name,
        });

        const content = `
<div style="display:flex;gap:8px;font-family:sans-serif;width:260px;">
  <img src="${loc.image1 || '/fallback.png'}" style="width:120px;height:120px;object-fit:cover;border-radius:6px;" />
  <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;">
    <div>
    <div>
    ${loc.rating && loc.rating > 0
      ? `<div style="color: black; font-size:20px;font-weight:bold;margin:10px 0 5px;">
           ⭐ ${loc.rating.toFixed(1)}
         </div>`
      : `<div style="color:#999;font-size:16px;margin:10px 0 5px;">
           評価がありません
         </div>`
    }
      <div style="font-size:16px;color:#666;margin-bottom:8px;">口コミ ${loc.reviewCount ?? 0}件</div>
    </div>
    <div style="display:flex;gap:6px;">
      <a href="/salon/${loc.id}" style="flex:1;padding:6px;font-size:14px;font-weight:bold;background:#34A853;color:white;border-radius:4px;text-align:center;text-decoration:none;">詳細</a>
      <a href="https://www.google.co.jp/maps/dir/現在地/${encodeURIComponent(loc.address)}" target="_blank" style="flex:1;padding:6px;font-size:14px;font-weight:bold;background:#4285F4;color:white;border-radius:4px;text-align:center;text-decoration:none;">経路</a>
    </div>
  </div>
</div>
`;

const headerEl = document.createElement("div");
headerEl.textContent = loc.name;
headerEl.style.color = "black";        // 文字色を黒
headerEl.style.textAlign = "center";   // 中央揃え
headerEl.style.fontWeight = "bold";    
headerEl.style.fontSize = "16px";
headerEl.style.marginBottom = "8px";

const info = new google.maps.InfoWindow({
  content,
  maxWidth: 300,
  headerContent: headerEl, // ここに反映
});

        marker.addListener("click", () => {
          if (openedInfoWindow && openedInfoWindow !== info) openedInfoWindow.close();
          info.open(map, marker);
          openedInfoWindow = info;
        });
      } catch (err) {
        console.error(`Marker error for ${loc.name}:`, err);
      }
    });
  }, [locations, map]);

  useImperativeHandle(ref, () => ({
    initMapFromParent: () => initMap(),
  }));

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
});

Mapmain.displayName = "Mapmain";

export default Mapmain;
