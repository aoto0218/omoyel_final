"use client"
import { useState } from "react"

export default function ReviewForm() {
  const [salonId, setSalonId] = useState("")
  const [score1, setScore1] = useState("")
  const [score2, setScore2] = useState("")
  const [score3, setScore3] = useState("")
  const [score4, setScore4] = useState("")
  const [score5, setScore5] = useState("")
  const [comments, setComments] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const res = await fetch("/api/addReview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        salon_id: Number(salonId),
        score_1: Number(score1),
        score_2: Number(score2),
        score_3: Number(score3),
        score_4: Number(score4),
        score_5: Number(score5),
        commets: comments,
      }),
    })

    if (res.ok) {
      alert("レビュー登録完了！")
      setSalonId("")
      setScore1("")
      setScore2("")
      setScore3("")
      setScore4("")
      setScore5("")
      setComments("")
    } else {
      alert("登録失敗")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
      <input
        value={salonId}
        onChange={e => setSalonId(e.target.value)}
        placeholder="サロンID"
        required
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <div className="grid grid-cols-5 gap-2">
        <input
          value={score1}
          onChange={e => setScore1(e.target.value)}
          placeholder="スコア1"
          required
          className="px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          value={score2}
          onChange={e => setScore2(e.target.value)}
          placeholder="スコア2"
          required
          className="px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          value={score3}
          onChange={e => setScore3(e.target.value)}
          placeholder="スコア3"
          required
          className="px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          value={score4}
          onChange={e => setScore4(e.target.value)}
          placeholder="スコア4"
          required
          className="px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          value={score5}
          onChange={e => setScore5(e.target.value)}
          placeholder="スコア5"
          required
          className="px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <textarea
        value={comments}
        onChange={e => setComments(e.target.value)}
        placeholder="コメント"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        type="submit"
        className="w-full bg-purple-600 text-white font-semibold py-2 rounded-md hover:bg-purple-700 transition-colors"
      >
        レビュー登録
      </button>
    </form>
  )
}
