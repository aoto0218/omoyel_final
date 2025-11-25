"use client";
import { useEffect, useState } from "react";

// API で返ってくるレビューの型
export type Review = {
  id: number;
  salon_id: number;
  score_1: number;
  score_2: number;
  score_3: number;
  score_4: number;
  score_5: number;
  comments: string;
};

export default function MainReview() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/getReviews")
      .then(async res => {
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setReviews(data.reviews ?? []);
      })
      .catch(err => {
        console.error("Failed to fetch reviews:", err);
        setReviews([]);
      });
  }, []);
  

  return (
    <div>
      <h1>Main Review Component</h1>
      {reviews.length ? (
        <ul>
          {reviews.map(r => (
            <li key={r.id}>
              サロンID: {r.salon_id} | スコア1: {r.score_1} |スコア2: {r.score_2}| スコア3: {r.score_3} |スコア4: {r.score_4}|スコア5: {r.score_5}| |コメント: {r.comments}
            </li>
          ))}
        </ul>
      ) : (
        <p>レビューはまだありません</p>
      )}
    </div>
  );
}
