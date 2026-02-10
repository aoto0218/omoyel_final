import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
      user_id: user.id, 
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