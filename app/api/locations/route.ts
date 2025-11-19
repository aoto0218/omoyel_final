// app/api/locations/route.ts
import { NextRequest, NextResponse } from "next/server";

type Location = { title: string; lat: number; lng: number };

// 一時的にメモリに保存する場所
let locationsMemory: Location[] = [];

export async function GET() {
  // 現在保存されている場所データを返す
  return NextResponse.json(locationsMemory);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newLocations: Location[] = body.locations;

    if (!newLocations || !Array.isArray(newLocations)) {
      return NextResponse.json({ error: "無効なデータ" }, { status: 400 });
    }

    // メモリに追加（DB があればここで保存）
    locationsMemory.push(...newLocations);

    console.log("受け取った場所:", newLocations);

    return NextResponse.json(newLocations);
  } catch (err) {
    return NextResponse.json({ error: "送信中にエラー" }, { status: 500 });
  }
}
