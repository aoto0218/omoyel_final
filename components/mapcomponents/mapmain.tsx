"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Script from "next/script";
import { Salon } from "@/types/salon";import { forwardRef, useImperativeHandle } from "react";
type Location = {
  id: number;
  name: string;
  lat: number;
  lon: number;
  image1?: string;
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

  // --- ここに置く ---
  useEffect(() => {
    if (salons.length > 0) {
      const locs: Location[] = salons.map(s => ({
        id: s.id,
        name: s.name,
        lat: s.lat,
        lon: s.lon,
        image1: s.images?.image1 || "/fallback.png",
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

 


  useEffect(() => {
    if (!map || !userLatLng || locations.length === 0) return;
  
    locations.forEach((loc, i) => {
      const spot = new google.maps.LatLng(loc.lat, loc.lon);
  
      const marker = new google.maps.Marker({
        position: spot,
        map,
        title: loc.name,
      });
  

      // <a href="/salon/${loc.id}">
      // <img src="${loc.image1 || '/fallback.png'}"></img>
      const content = `
      <style>
        .location-card { 
          width: 100%;
          max-width: 240px;
          font-family: sans-serif; 
          color: black; 
          padding-top: 4px;
          overflow: hidden; 
        }
      
        .location-card img {
          width: 100% !important; 
          height: 70px !important; /* ★修正: heightにも !important を追加 */
          object-fit: cover;
          border-radius: 6px;
          margin-bottom: 6px;
        }
      
        @media (max-width: 400px) {
          .location-card {
            width: 90%;
            max-width: 200px; 
          }
          .location-card img {
            height: 60px !important; /* ★これはすでに適用済み */
          }
        }
    
        /* select/buttonのスタイルも、必要であればここに含めますが、
           今回はインラインスタイルで定義されているため省略します。
           インラインCSSと競合する場合は、こちらで !important を使うと効果的です。
        */
      </style>
      
      <div class="location-card">
        
      
        <select id="modeSelect-${i}" style="margin-bottom:6px;">
          <option value="DRIVING">車</option>
          <option value="WALKING">徒歩</option>
          <option value="BICYCLING">自転車</option>
          <option value="TRANSIT">電車</option>
        </select>
      
        <button id="routeButton-${i}" 
        style="
          padding:2px 4px;
          background:#4285F4;
          color:white;
          border:none;
          border-radius:3px;
          cursor:pointer;
          font-size:10px;
        ">
          経路
        </button>
      </div>
    `;
    
    const headerEl = document.createElement("div");
    headerEl.className = "infowindow-header";
    headerEl.textContent = loc.name;
    
    // ★修正点1: インラインスタイルで色を直接指定
    headerEl.style.color = "black"; 
    headerEl.style.fontWeight = "bold"; // 見やすく太字にすることも推奨
    // 必要に応じて余白も調整
    headerEl.style.padding = "4px 8px"; 
    // headerEl.style.backgroundColor = "lightgray"; // 必要に応じて背景色も
    
    // ★修正点2: または、CSSでクラスを定義して適用
    // headerEl.className = "infowindow-header black-text";
const info = new google.maps.InfoWindow({
  headerContent: headerEl,
  content,
  maxWidth: 250,
  
  // maxWidth: 250
});

  
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
            });
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
  // console.log("salons in mapmain:", salons);
   
  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${google_apiKey}&language=ja&libraries=geometry`}
        strategy="afterInteractive"
        onLoad={initMap}
      />
      <div ref={mapRef} style={{ width: "100%", height: "50vh" }} />


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