"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Script from "next/script";
import { Salon } from "@/types/salon";import { forwardRef, useImperativeHandle } from "react";
type Location = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  images?: { image1?: string; image2?: string };
};

type Props = { salons: Salon[] };

export type ChildHandle = {
  initMapFromParent: () => void;
};

const Mapmain = forwardRef<ChildHandle, { salons: Salon[] }>(({ salons }, ref) => {
  
  const mapRef = useRef<HTMLDivElement>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLatLng, setUserLatLng] = useState<google.maps.LatLng | null>(null);

  const google_apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const goalInfoRef = useRef<google.maps.InfoWindow | null>(null);
console.log("salons in mapmain:", salons);
  // 全件 geocode
  async function geocodeSalons() {
    const requests = salons.map((salon) =>
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          salon.address
        )}&key=${google_apiKey}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "OK" && data.results.length > 0) {
            const pos = data.results[0].geometry.location;
            return { 
              id: salon.id,          // ← 必須
              name: salon.name, 
              lat: pos.lat, 
              lng: pos.lng,
              image1: salon.images?.image1 || "/fallback.png",
            } as Location;
            
          }
          return null;
        })
    );

    const results = await Promise.all(requests);
    const valid = results.filter((v) => v !== null) as Location[];
    setLocations(valid);
  }

  useEffect(() => {
    if (salons.length > 0) geocodeSalons();
  }, [salons]);

  const initMap = () => {
    if (!window.google) return;
    if (!mapRef.current) return;

    const mapInstance = new google.maps.Map(mapRef.current, {
      zoom: 13,
      center: { lat: 35.0116, lng: 135.7681 },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

    setMap(mapInstance);

    directionsServiceRef.current = new google.maps.DirectionsService();
    directionsRendererRef.current = new google.maps.DirectionsRenderer({ map: mapInstance });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
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
      });
    }
  };

  const calculateAndDisplayRoute = useCallback(
    (
      origin: google.maps.LatLng,
      destination: google.maps.LatLng,
      mode: google.maps.TravelMode
    ) => {
      if (!directionsServiceRef.current || !directionsRendererRef.current) return;

      directionsServiceRef.current.route(
        {
          origin,
          destination,
          travelMode: mode,
          transitOptions: { departureTime: new Date() },
        },
        (result, status) => {
          if (status === "OK" && result) {
            directionsRendererRef.current!.setDirections(result);

            // ゴールまでの時間を取得
            const leg = result.routes[0].legs[0];
            const totalDurationText = leg.duration?.text || "";

            // 既存の InfoWindow を消す
            if (goalInfoRef.current) goalInfoRef.current.close();

            goalInfoRef.current = new google.maps.InfoWindow({
              content: `
                <div style="
                  font-weight: bold; 
                  background-color: #115EC3; /* 青い背景 */
                  color: white;              /* 白文字 */
                  padding: 6px 10px;
                  border-radius: 4px;
                ">
                  所要時間: ${totalDurationText}
                </div>
              `,
              position: destination,
            });
            goalInfoRef.current.open(map);
            
          } else {
            alert("経路が見つかりません: " + status);
          }
        }
      );
    },
    [map]
  );

  useEffect(() => {
    if (!map || !userLatLng || locations.length === 0) return;

    locations.forEach((loc, i) => {
      const spot = new google.maps.LatLng(loc.lat, loc.lng);

      const marker = new google.maps.Marker({
        position: spot,
        map,
        title: loc.name,
      });

      const content = `
      <a href="/salon/${loc.id}">
        <div style="font-family: sans-serif; color: black; width: 240px; padding-top: 4px;">
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">${loc.name}</div>
    
          <img 
            src="${loc.images?.image1 || '/fallback.png'}" 
            style="width:100%; height:120px; object-fit:cover; border-radius:6px; margin-bottom:6px;"
          >
    
          <select id="modeSelect-${i}" style="margin-bottom:6px;">
            <option value="DRIVING">車</option>
            <option value="WALKING">徒歩</option>
            <option value="BICYCLING">自転車</option>
            <option value="TRANSIT">電車</option>
          </select>
    
          <button id="routeButton-${i}" 
            style="padding:6px 10px; background:#4285F4; color:white; border:none; border-radius:4px; cursor:pointer; font-size:13px;">
            経路
          </button>
        </div>
      </a>
    `;
    

      const info = new google.maps.InfoWindow({ content });

      marker.addListener("click", () => {
        info.open(map, marker);

        google.maps.event.addListenerOnce(info, "domready", () => {
          const btn = document.getElementById(`routeButton-${i}`);
          const select = document.getElementById(`modeSelect-${i}`) as HTMLSelectElement;
          if (btn && select) {
            btn.addEventListener("click", () => {
              const modeStr = select.value as keyof typeof google.maps.TravelMode;
              const mode = google.maps.TravelMode[modeStr];
              calculateAndDisplayRoute(userLatLng, spot, mode);
              // info.close(); ← これをコメントアウト
            });
            // btn.addEventListener("click", () => {
            //   const searchQuery = encodeURIComponent(loc.name); // サロン名を検索ワードに
            //   const url = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
            //   window.open(url, "_blank"); // 新しいタブで開く
            // });
            
           
          }
        });
      });
    });
  }, [locations, map, userLatLng, calculateAndDisplayRoute]);

  useImperativeHandle(ref, () => ({
    initMapFromParent: () => {
     
      initMap();
    },
  }));
  
   
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
 
})
export default Mapmain;