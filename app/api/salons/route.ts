import { NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function GET() {
  // ここは DB に置き換えてもOK
  const salons = [
    { name: "サロンA", address: "東京都渋谷区渋谷1-2-3" },
    { name: "サロンB", address: "大阪府大阪市北区梅田1-1-1" },
  ];

  const results = [];

  for (const s of salons) {
    const geo = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        s.address
      )}&key=${GOOGLE_API_KEY}`
    );

    const data = await geo.json();

    if (data.status === "OK") {
      const loc = data.results[0].geometry.location;
      results.push({
        name: s.name,
        lat: loc.lat,
        lng: loc.lng,
        address: s.address,
      });
    } else {
      results.push({
        name: s.name,
        lat: null,
        lng: null,
        error: "Geocode failed",
      });
    }
  }

  return NextResponse.json(results);
}
