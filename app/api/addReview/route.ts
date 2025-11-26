import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();

  const {
    salon_id,
    score_1,
    score_2,
    score_3,
    score_4,
    score_5,
    comments,
  } = body;

  const { error } = await supabase.from("review").insert([
    {
      salon_id,
      score_1,
      score_2,
      score_3,
      score_4,
      score_5,
      comments,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "success" });
}
