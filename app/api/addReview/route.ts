import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log("SUPABASE_KEY:", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)

  const { salon_id, score_1, score_2, score_3, score_4, score_5, commets } = await req.json()
  console.log("Received data:", { salon_id, score_1, score_2, score_3, score_4, score_5, commets })

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("review")
    .insert([{ salon_id, score_1, score_2, score_3, score_4, score_5, commets }])

  if (error) {
    console.error("Supabase insert error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}
