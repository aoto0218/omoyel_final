// app/api/getReviews/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

type Review = {
  id: number;
  salon_id: number;
  score_1: number;
  score_2: number;
  score_3: number;
  score_4: number;
  score_5: number;
  comments: string;
};

export async function GET() {
  const supabase = await createClient();

  const { data: reviews, error } = await supabase
    .from("review")
    .select("*");

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // data が null や undefined の場合に空配列を返す
  return NextResponse.json({ reviews: reviews ?? [] });
}
