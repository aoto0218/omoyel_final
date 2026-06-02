"use client";

import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { Salon as BaseSalon } from "@/types/salon";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, X, Navigation } from "lucide-react";

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
  rating?: number;
};

export type ChildHandle = {
  initMapFromParent: () => void;
};

// 座標を画面のパーセンテージに変換する設定 (渋谷・原宿・銀座エリア用)
const MAP_BOUNDS = {
  minLat: 35.658,
  maxLat: 35.678,
  minLon: 139.693,
  maxLon: 139.770,
};

const Mapmain = forwardRef<ChildHandle, { salons: Salon[] }>(({ salons }, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLatLng, setUserLatLng] = useState<google.maps.LatLng | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [useMockMap, setUseMockMap] = useState(false);
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);

  // salons -> locations
  useEffect(() => {
    const locs: Location[] = salons.map(s => ({
      id: s.id,
      name: s.name,
      address: s.address,
      lat: s.lat,
      lon: s.lon,
      image1: s.images?.image1 || "/fallback.png",
      averageRatings: s.averageRatings ? s.averageRatings : undefined,
      reviewCount: s.averageRatings?.reviewCount ?? 0,
      rating: s.averageRatings?.overall,
    }));
    setLocations(locs);
  }, [salons]);

  // Google Maps API キーの有無によってモックマップにフォールバックする
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Google Maps の認証エラー (InvalidKeyMapError 等) を検知してモックに切り替える
      (window as any).gm_authFailure = () => {
        setUseMockMap(true);
      };

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey || apiKey.includes("YOUR_GOOGLE_MAPS_API_KEY")) {
        setUseMockMap(true);
      } else {
        // 2秒待ってgoogleオブジェクトがロードされなければモックを表示
        const timer = setTimeout(() => {
          if (!window.google || !window.google.maps) {
            setUseMockMap(true);
          } else {
            setIsScriptLoaded(true);
          }
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  const initMap = useCallback(() => {
    if (useMockMap) return;
    if (!window.google || !mapRef.current || map) return;

    const mapInstance = new google.maps.Map(mapRef.current, {
      zoom: 13,
      center: { lat: 35.668, lng: 139.73 }, // 東京エリアを中心に
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
  }, [map, useMockMap]);

  // Google Maps のマーカー配置
  useEffect(() => {
    if (useMockMap || !map || locations.length === 0) return;
    let openedInfoWindow: google.maps.InfoWindow | null = null;

    locations.forEach((loc) => {
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
        headerEl.style.color = "black";
        headerEl.style.textAlign = "center";
        headerEl.style.fontWeight = "bold";
        headerEl.style.fontSize = "16px";
        headerEl.style.marginBottom = "8px";

        const info = new google.maps.InfoWindow({
          content,
          maxWidth: 300,
          headerContent: headerEl,
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
  }, [locations, map, useMockMap]);

  useImperativeHandle(ref, () => ({
    initMapFromParent: () => {
      if (!useMockMap) {
        initMap();
      }
    },
  }));

  // モックマップ上の座標計算関数
  const getCoords = (lat: number, lon: number) => {
    const x = ((lon - MAP_BOUNDS.minLon) / (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon)) * 100;
    const y = (1 - (lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
    return {
      left: `${Math.max(5, Math.min(95, x))}%`,
      top: `${Math.max(5, Math.min(95, y))}%`,
    };
  };

  if (useMockMap) {
    return (
      <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
        {/* モックマップのグリッド背景 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-30" />
        <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

        {/* 鉄道線路を模したモック路線 (山手線・地下鉄をイメージ) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          {/* 渋谷から原宿、新宿への路線 */}
          <path d="M 50 450 Q 150 250 200 100" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="8,6" />
          {/* 原宿から銀座への路線 */}
          <path d="M 150 250 Q 400 200 850 150" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="8,6" />
        </svg>

        {/* エリア名表示タグ */}
        <div className="absolute left-[10%] bottom-[25%] px-3 py-1 bg-slate-800/80 backdrop-blur border border-slate-700 text-slate-400 text-xs font-bold rounded-full select-none">
          渋谷エリア
        </div>
        <div className="absolute left-[20%] top-[45%] px-3 py-1 bg-slate-800/80 backdrop-blur border border-slate-700 text-slate-400 text-xs font-bold rounded-full select-none">
          原宿・表参道エリア
        </div>
        <div className="absolute right-[15%] top-[35%] px-3 py-1 bg-slate-800/80 backdrop-blur border border-slate-700 text-slate-400 text-xs font-bold rounded-full select-none">
          銀座エリア
        </div>

        {/* 案内インフォ */}
        <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur border border-slate-800 text-white rounded-2xl px-4 py-2.5 shadow-lg max-w-[280px]">
          <p className="text-xs font-bold text-indigo-400">🗺️ デモ用シミュレータマップ</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Google Mapsキー未設定のため、ローカルのピン位置を可視化したシミュレーターを表示しています。</p>
        </div>

        {/* ピンの配置 */}
        {locations.map((loc) => {
          const coords = getCoords(loc.lat, loc.lon);
          const isActive = activeLocation?.id === loc.id;
          return (
            <button
              key={loc.id}
              onClick={() => setActiveLocation(loc)}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-300"
              style={{ left: coords.left, top: coords.top }}
            >
              {/* ピンの波紋エフェクト */}
              <span className={`absolute inline-flex h-10 w-10 -left-3 -top-3 rounded-full bg-indigo-400/30 opacity-75 animate-ping ${isActive ? "scale-125" : ""}`} />
              
              {/* ピン本体 */}
              <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-lg transition-transform ${
                isActive 
                  ? "bg-amber-400 border-amber-300 text-slate-950 scale-125 z-20" 
                  : "bg-indigo-500 border-indigo-400 text-white hover:scale-110"
              }`}>
                <MapPin className="w-4 h-4" />
              </div>
            </button>
          );
        })}

        {/* 詳細ポップアップカード (モバイル用の下部スライドイン風) */}
        {activeLocation && (
          <div className="absolute bottom-6 left-4 right-4 z-30 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom-8 duration-300 max-w-md mx-auto">
            {/* 閉じるボタン */}
            <button 
              onClick={() => setActiveLocation(null)}
              className="absolute top-4 right-4 p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex gap-4">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-800 flex-shrink-0">
                <Image 
                  src={activeLocation.image1 || "/fallback.png"}
                  alt={activeLocation.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="font-bold text-white text-base truncate pr-6">{activeLocation.name}</h3>
                  <p className="text-xs text-slate-400 truncate mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {activeLocation.address}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  {activeLocation.rating && activeLocation.rating > 0 ? (
                    <>
                      <div className="flex items-center text-amber-400 gap-0.5">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span className="font-bold text-sm">{activeLocation.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">({activeLocation.reviewCount}件の口コミ)</span>
                    </>
                  ) : (
                    <span className="text-[11px] text-slate-500">まだレビューはありません</span>
                  )}
                </div>

                <div className="flex gap-2 mt-3">
                  <Link 
                    href={`/salon/${activeLocation.id}`}
                    className="flex-1 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl text-center shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                  >
                    詳細を見る
                  </Link>
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeLocation.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl text-center border border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-1"
                  >
                    <Navigation className="w-3 h-3 text-slate-400" />
                    経路案内
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
});

Mapmain.displayName = "Mapmain";

export default Mapmain;
