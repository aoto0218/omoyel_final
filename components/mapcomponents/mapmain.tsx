"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Script from "next/script";
// React Iconsのインポート (例としてFaCarを使用)
import { FaCar, FaBus, FaWalking } from 'react-icons/fa';


const carIconSvg = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M499.989 184.225l-71.554-136C423.771 34.02 408.832 24 392.593 24H119.407c-16.239 0-31.178 10.02-38.397 24.225l-71.554 136C2.302 192.834 0 200.758 0 208v200c0 22.091 17.909 40 40 40h20V488c0 13.255 10.745 24 24 24h64c13.255 0 24-10.745 24-24v-48h20c22.091 0 40-17.909 40-40V208c0-7.242-2.302-15.166-6.011-23.775zM292 456c0 4.418-3.582 8-8 8h-64c-4.418 0-8-3.582-8-8v-24h80v24zm-12-112H232v-32c0-13.255 10.745-24 24-24h16c13.255 0 24 10.745 24 24v32zm148 0H312v-32c0-39.761-32.239-72-72-72h-16c-39.761 0-72 32.239-72 72v32H72V207.828l61.637-117.113C135.253 87.202 143.088 88 144 88h224c.912 0 8.747-0.798 10.363 2.685L440 207.828V344zm-98.058-208l-23.235-47.38c-1.396-2.846-4.222-4.62-7.307-4.62h-58.8c-3.085 0-5.911 1.774-7.307 4.62L150.058 136h211.884z"/></svg>`;

// FaBusのSVG (例)
const transitIconSvg = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M416 384c-35.32 0-64 28.68-64 64s28.68 64 64 64 64-28.68 64-64-28.68-64-64-64zm-192-320c-35.32 0-64 28.68-64 64s28.68 64 64 64 64-28.68 64-64-28.68-64-64-64zm-32 320c-35.32 0-64 28.68-64 64s28.68 64 64 64 64-28.68 64-64-28.68-64-64-64zm384-256V88c0-13.255-10.745-24-24-24H276.104c-12.784 0-24.897 5.177-33.805 14.129L192 120H24c-13.255 0-24 10.745-24 24v208c0 13.255 10.745 24 24 24h32c0 53.056 42.944 96 96 96s96-42.944 96-96h128c0 53.056 42.944 96 96 96s96-42.944 96-96h32c13.255 0 24-10.745 24-24V192zM64 192h320v32H64v-32zm416 160h-32V160h32v192z"/></svg>`;

// FaWalkingのSVG (例)
const walkingIconSvg = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M304 32c0 28.91-23.1 52.33-51.48 56C275.64 121.72 288 158.6 288 192c0 41.38-23.36 67.24-52.54 97.43C221.16 303.46 208 328.78 208 352c0 17.67 14.33 32 32 32h112c17.67 0 32-14.33 32-32s-14.33-32-32-32H256c-8.84 0-16-7.16-16-16 0-7.79 5.37-14.19 12.8-15.65C270.62 267.14 320 232.06 320 192c0-48.4-44.15-88-96-88-46.72 0-83.33 30.64-90.89 71.16C97.1 200.7 64 256.74 64 316.96 64 345.5 86.6 376 128 376h32c17.67 0 32-14.33 32-32s-14.33-32-32-32H133.58c-10.02-3.14-19.58-9.01-26.47-16.71C94.59 270.47 89 250.75 89 231.54 89 203.02 108.56 168.3 147.16 142.33 151.77 145.88 160 156.41 160 168.04c0 35.35-28.65 64-64 64-17.67 0-32 14.33-32 32s14.33 32 32 32h16c17.67 0 32-14.33 32-32s-14.33-32-32-32H144c-17.67 0-32-14.33-32-32s14.33-32 32-32h16c17.67 0 32-14.33 32-32s-14.33-32-32-32H160c-17.67 0-32-14.33-32-32s14.33-32 32-32h80c52.01 0 96-43.04 96-96z"/></svg>`;

/// <reference types="google.maps" />

type Location = { name: string; lat: number; lng: number };

export default function Mapmain() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLatLng, setUserLatLng] = useState<google.maps.LatLng | null>(null);

  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

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
    
    directionsServiceRef.current = new google.maps.DirectionsService();
    directionsRendererRef.current = new google.maps.DirectionsRenderer({ map: mapInstance });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          setUserLatLng(userPos);

          // new google.maps.Marker({
          //   position: userPos,
          //   map: mapInstance,
          //   title: "現在地",
          //   icon: {
          //       url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          //   },
          // });


          function setCurrentLocationMaker(map: google.maps.Map, position: google.maps.LatLng) {
          new google.maps.Marker({
            position: position,
            map: map,
            title: "現在地",
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#115EC3',
              fillOpacity: 1,
              strokeColor: 'white',
              strokeWeight: 2,
              scale: 7
            }, 
        });

        new google.maps.Circle({
          strokeColor: '#115EC3',
          strokeOpacity: 0.2,
          strokeWeight: 1,
          fillColor: '#115EC3',
          fillOpacity: 0.2,
          map: map,
          center: position,
          radius: 100
      });   
    }

          setCurrentLocationMaker(mapInstance, userPos);

          mapInstance.setCenter(userPos);
        },
        (error) => console.error(error)
      );
    }
  };

  const calculateAndDisplayRoute = useCallback(
    (
      origin: google.maps.LatLng,
      destination: google.maps.LatLng
    ) => {
        const directionsService = directionsServiceRef.current;
        const directionsRenderer = directionsRendererRef.current;

        if (!directionsService || !directionsRenderer) return;

        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
        }, (response, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
            } else {
                window.alert('経路が見つかりませんでした: ' + status);
            }
        });
    },
    []
  );

  useEffect(() => {
    if (!map || !userLatLng || locations.length === 0) return;

    const carIconSvg = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M499.989 184.225l-71.554-136C423.771 34.02 408.832 24 392.593 24H119.407c-16.239 0-31.178 10.02-38.397 24.225l-71.554 136C2.302 192.834 0 200.758 0 208v200c0 22.091 17.909 40 40 40h20V488c0 13.255 10.745 24 24 24h64c13.255 0 24-10.745 24-24v-48h20c22.091 0 40-17.909 40-40V208c0-7.242-2.302-15.166-6.011-23.775zM292 456c0 4.418-3.582 8-8 8h-64c-4.418 0-8-3.582-8-8v-24h80v24zm-12-112H232v-32c0-13.255 10.745-24 24-24h16c13.255 0 24 10.745 24 24v32zm148 0H312v-32c0-39.761-32.239-72-72-72h-16c-39.761 0-72 32.239-72 72v32H72V207.828l61.637-117.113C135.253 87.202 143.088 88 144 88h224c.912 0 8.747-0.798 10.363 2.685L440 207.828V344zm-98.058-208l-23.235-47.38c-1.396-2.846-4.222-4.62-7.307-4.62h-58.8c-3.085 0-5.911 1.774-7.307 4.62L150.058 136h211.884z"/></svg>`;
    
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

<<<<<<< HEAD
      const contentString = `
        <div style="color: black; font-family: sans-serif;">
          <strong>${loc.name}</strong><br>
          現在地から: ${distanceText}<br><br>
          <button 
            id="routeButton-${i}" 
            style="
              display: inline-flex;
              align-items: center;
              gap: 5px;
              background-color: #4285F4; 
              color: white; 
              border: none; 
              padding: 5px 10px; 
              border-radius: 4px;
              cursor: pointer;
              font-weight: bold;
              font-size: 14px;
            "
          >
            ${carIconSvg}
            経路を表示
          </button>
        </div>
      `;
=======
      
>>>>>>> feature/mapui

      const contentString = `

      <div style="font-family: sans-serif; color: black; width: 240px; padding-top: 4px;">

  <!-- タイトル（× と高さを合わせるため margin を調整） -->
  <div style="font-size: 18px; font-weight: bold; margin: 0 0 8px 0;">
    〇〇スポット
  </div>

  <!-- 写真 -->
  <div
  id="spot-photo"
  style="
    width: 100%;
    height: 120px;
    background-image: url('/salon8-1.png');
    background-size: cover;
    background-position: center;
    border-radius: 6px;
    margin-bottom: 10px;
  "
></div>

  <!-- 星 + 経路ボタン -->
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
    <div style="font-size: 12px; color: #777;">
      ★★★★☆
    </div>

    <button
      id="open-route-select"
      style="
        padding: 6px 10px;
        background: #4285F4;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        font-weight: bold;
      "
    >
      経路
    </button>
  </div>

  <!-- 手段UI（非表示） -->
  <div id="route-options" style="display: none; margin-top: 8px;">
    <button
      style="
        width: 100%;
        padding: 8px;
        background: #4285F4;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        margin-bottom: 6px;
      "
      data-mode="DRIVING"
    >🚗 車で行く</button>

    <button
      style="
        width: 100%;
        padding: 8px;
        background: #f4b400;
        color: black;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        margin-bottom: 6px;
      "
      data-mode="TRANSIT"
    >🚉 公共交通機関</button>

    <button
      style="
        width: 100%;
        padding: 8px;
        background: #0F9D58;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
      "
      data-mode="WALKING"
    >🚶 徒歩</button>
  </div>

</div>


    `;


    //マーカの詳細
      const infoWindow = new google.maps.InfoWindow({
        content: contentString,
      });

<<<<<<< HEAD
=======
     
>>>>>>> feature/mapui
      marker.addListener("click", () => {
        infoWindow.open(map, marker);
        
        google.maps.event.addListener(infoWindow, 'domready', () => {
          const routeButton = document.getElementById(`routeButton-${i}`);
          if (routeButton) {
            routeButton.addEventListener('click', () => {
              calculateAndDisplayRoute(userLatLng, spotLatLng);
              infoWindow.close();
            });
          }
        });
      });
    }
  }, [locations, map, userLatLng, calculateAndDisplayRoute]);


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