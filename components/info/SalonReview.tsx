"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

export type Review = {
  id: number;
  salon_id: number;
  score_1: number;
  score_2: number;
  score_3: number;
  score_4: number;
  score_5: number;
  comments: string;
  created_at: string;
};

export default function MainReview() {
    const params = useParams();
    const salonId = Number(params.id); // URL パラメータ名に合わせる
    

  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/getReviews")
      .then(async (res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        const filtered = (data.reviews ?? []).filter((r: Review) => r.salon_id === salonId);
        console.log("Fetched reviews:", salonId, filtered);
        setReviews(filtered);
      })
      .catch((err) => {
        console.error("Failed to fetch reviews:", err);
        setReviews([]);
      });
  }, [salonId]);

  return (
    <div className=" max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-600">このサロンのレビュー</h1>

      {reviews.length ? (
        <div className="grid gap-6">
          {reviews.map((r) => {
            const totalScore = r.score_1 + r.score_2 + r.score_3 + r.score_4 + r.score_5;
            const maxScore = 5 * 5;
            const starsToShow = Math.round((totalScore / maxScore) * 5);

            return (
              <div
                key={r.id}
                className="relative bg-white p-4 rounded-xl shadow hover:shadow-lg transition duration-200"
              >
                <span className="absolute top-3 right-4 text-gray-400 text-sm">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>

                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FaStar
                      key={i}
                      size={20}
                      className={i <= starsToShow ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                  <span className="ml-2 text-gray-600 text-sm">
                    {totalScore} / {maxScore}
                  </span>
                </div>

                <p className="text-gray-800">{r.comments}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500" >レビューはまだありません</p>
      )}
    </div>
  );
}
