"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";



export default function Mapmain(){

    const mapRef = useRef<HTMLDivElement>(null);

  const initMap = () => {
    if (!mapRef.current) return;

    const center = new google.maps.LatLng(35.6811673, 139.7670516);

    const map = new google.maps.Map(mapRef.current, {
      zoom: 15,
      center: center,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

};

    return (
        <>
          {/* Google Maps API 読み込み */}
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDs91HWUQpY8lY9VKPkGEvcpDj_yYAFLK4 &language=ja`}
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