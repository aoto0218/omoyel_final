"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Script from "next/script";
import { Salon } from "@/types/salon"; import { forwardRef, useImperativeHandle } from "react";
type Location = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lon: number;
  image1?: string;
  rating?: number;
  reviewCount?: number;
};

export type ChildHandle = {
  initMapFromParent: () => void;
};

const Mapmain = forwardRef<ChildHandle, { salons: Salon[] }>(({ salons }, ref) => {

  const mapRef = useRef<HTMLDivElement>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLatLng, setUserLatLng] = useState<google.maps.LatLng | null>(null);

  // --- ここに置く ---
  useEffect(() => {
    if (salons.length > 0) {
      const locs: Location[] = salons.map(s => ({
        id: s.id,
        name: s.name,
        address: s.address,
        lat: s.lat,
        lon: s.lon,
        image1: s.images?.image1 || "/fallback.png",
        rating: s.rating,
        reviewCount: s.reviewCount,
      }));
      setLocations(locs);
    }
  }, [salons]);
  // ------------------

  const google_apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const goalInfoRef = useRef<google.maps.InfoWindow | null>(null);


  // 全件 geocode
  // async function geocodeSalons() {
  //   const requests = salons.map((salon) =>
  //     fetch(
  //       `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
  //         salon.address
  //       )}&key=${google_apiKey}`
  //     )
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data.status === "OK" && data.results.length > 0) {
  //           const pos = data.results[0].geometry.location;
  //           return { 
  //             id: salon.id,          // ← 必須
  //             name: salon.name, 
  //             lat: pos.lat, 
  //             lng: pos.lng,
  //             image1: salon.images?.image1 || "/fallback.png",
  //           } as Location;


  //         }
  //         return null;
  //       })
  //   );

  //   const results = await Promise.all(requests);
  //   const valid = results.filter((v) => v !== null) as Location[];
  //   setLocations(valid);
  // }

  // useEffect(() => {
  //   if (salons.length > 0) geocodeSalons();
  // }, [salons]);

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

            const total = document.createElement("div");
            total.className = "total";

            total.textContent = totalDurationText;

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
              headerContent: total
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



  let openedInfoWindow: google.maps.InfoWindow | null = null;

  useEffect(() => {
    if (!map || !userLatLng || locations.length === 0) return;

    locations.forEach((loc, i) => {
      const spot = new google.maps.LatLng(loc.lat, loc.lon);

      const marker = new google.maps.Marker({
        position: spot,
        map,
        title: loc.name,
      });

      const content = `
  <style>
    .location-card { 
      display: flex;
      flex-direction: row;
      width: 260px; /* 全体の幅も少し広げる */
      font-family: sans-serif;
      color: black; 
      gap: 8px;
    }

    .location-card img {
      width: 120px;   /* ★サイズ変更 */
      height: 120px;  /* ★サイズ変更 */
      object-fit: cover;
      border-radius: 6px;
    }

    .info-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .rating {
      font-size: 20px;
      font-weight: bold;
      margin: 10px 0 5px;
    }

    .review-count {
      font-size: 16px;
      color: #666;
      margin-bottom: 8px;
    }

    .button-row {
      display: flex;
      gap: 6px; /* ボタン間の隙間 */
    }

    .btn-small {
      flex: 1;
      padding: 6px 6px;
      font-size: 14px;
      font-weight: bold;
      background: #4285F4;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-align: center;
    }

    .btn-detail {
      background: #34A853;
    }
  </style>

  <div class="location-card">

    <img src="${loc.image1 || '/fallback.png'}" />

    <div class="info-right">

      <div>
        <div class="rating">⭐ ${loc.rating ?? "0.0"}</div>
        <div class="review-count">口コミ ${loc.reviewCount ?? 0}件</div>
      </div>

      <div class="button-row">
        <a href ="/salon/${loc.id}" class="btn-small btn-detail"">
          詳細
        </a>

        <a href="https://www.google.co.jp/maps/dir/現在地/${loc.address}" class="btn-small" target="_blank">
          経路
        </a>
      </div>

    </div>

  </div>
`;



      const headerEl = document.createElement("div");
      headerEl.textContent = loc.name;
      headerEl.style.color = "black";
      headerEl.style.fontWeight = "bold";
      headerEl.style.padding = "4px 8px";

      const info = new google.maps.InfoWindow({
        headerContent: headerEl,
        content,
        maxWidth: 300,
        minWidth: 300,
      });

      marker.addListener("click", () => {

        // ★ 前に開いていた InfoWindow を閉じる
        if (openedInfoWindow && openedInfoWindow !== info) {
          openedInfoWindow.close();
        }

        info.open(map, marker);

        // ★ 開いた InfoWindow を記録
        openedInfoWindow = info;

        google.maps.event.addListenerOnce(info, "domready", () => {
          const btn = document.getElementById(`routeBtn-${i}`);

          if (btn) {
            btn.addEventListener("click", () => {
              // ★ Google マップへ飛ばす URL
              const url = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lon}`;

              // ★ アプリ or ブラウザで経路案内を開く
              window.open(url, "_blank");
            });
          }
        });
      });
    });
  }, [locations, map, userLatLng]);


  useImperativeHandle(ref, () => ({
    initMapFromParent: () => {

      initMap();
    },
  }));
  // console.log("salons in mapmain:", salons);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${google_apiKey}&language=ja&libraries=geometry`}
        strategy="afterInteractive"
        onLoad={initMap}
      />
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />


      <style jsx>{`
    .infowindow-header {
      background: #fff;
      color: #000;
      font-weight: bold;
      padding: 8px 12px;
      font-size: 16px;
      border-radius: 6px 6px 0 0;
    }
  `}</style>
    </>
  );

})
export default Mapmain;