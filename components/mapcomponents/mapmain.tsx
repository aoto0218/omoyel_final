"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Script from "next/script";
import { Salon as BaseSalon } from "@/types/salon";
import { forwardRef, useImperativeHandle } from "react";

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
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

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

  const google_apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  const initMap = useCallback(() => {
    // Google Maps APIが読み込まれているか確認
    if (typeof window === 'undefined' || !window.google || !window.google.maps) {
      console.warn('Google Maps API is not loaded yet');
      return;
    }
    
    if (!mapRef.current) {
      console.warn('Map container ref is not ready');
      return;
    }

    try {
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
          (pos) => {
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
          (error) => {
            console.warn('Geolocation error:', error);
          }
        );
      }
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, []);

  useEffect(() => {
    if (isScriptLoaded) {
      initMap();
    }
  }, [isScriptLoaded, initMap]);

  let openedInfoWindow: google.maps.InfoWindow | null = null;

  useEffect(() => {
    if (!map || locations.length === 0) return;

    locations.forEach((loc, i) => {
      try {
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
              width: 260px;
              font-family: sans-serif;
              color: black; 
              gap: 8px;
            }

            .location-card img {
              width: 120px;
              height: 120px;
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
              gap: 6px;
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
              text-decoration: none;
            }

            .btn-detail {
              background: #34A853;
            }
          </style>

          <div class="location-card">
            <img src="${loc.image1 || '/fallback.png'}" alt="${loc.name}" />
            <div class="info-right">
              <div>
                <div class="rating">⭐ ${loc.rating ?? "0.0"}</div>
                <div class="review-count">口コミ ${loc.reviewCount ?? 0}件</div>
              </div>
              <div class="button-row">
                <a href="/salon/${loc.id}" class="btn-small btn-detail">
                  詳細
                </a>
                <a href="https://www.google.co.jp/maps/dir/現在地/${encodeURIComponent(loc.address)}" class="btn-small" target="_blank">
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
          if (openedInfoWindow && openedInfoWindow !== info) {
            openedInfoWindow.close();
          }
          info.open(map, marker);
          openedInfoWindow = info;
        });
      } catch (error) {
        console.error(`Error creating marker for location ${loc.name}:`, error);
      }
    });
  }, [locations, map, userLatLng]);

  useImperativeHandle(ref, () => ({
    initMapFromParent: () => {
      if (isScriptLoaded) {
        initMap();
      } else {
        console.warn('Script not loaded yet, cannot initialize map');
      }
    },
  }));

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${google_apiKey}&language=ja&libraries=geometry`}
        strategy="afterInteractive"
        onLoad={() => {
          setIsScriptLoaded(true);
        }}
        onError={(e) => {
          console.error('Failed to load Google Maps script:', e);
        }}
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
});

Mapmain.displayName = "Mapmain";

export default Mapmain;