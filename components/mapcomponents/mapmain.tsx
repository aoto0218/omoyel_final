"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";



export default function Mapmain(){

    const mapRef = useRef<HTMLDivElement>(null);

  const initMap = () => {
    if (!mapRef.current) return;

    const center = new google.maps.LatLng(35.0116, 135.7681);

    const map = new google.maps.Map(mapRef.current, {
      zoom: 15,
      center: center,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

   

};
const google_apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    return (
        <>
          {/* Google Maps API 読み込み */}
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${google_apiKey}&language=ja`}
            strategy="afterInteractive"
            onLoad={initMap}
          />
    
          {/* マップを表示する div */}
          <div
            ref={mapRef}
            style={{ width: "100%", height: "50vh" }}
          />
        </>
      );
};