"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
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
  const salonId = Number(params.id);

  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/getReviews")
      .then(async (res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        const filtered = (data.reviews ?? []).filter(
          (r: Review) => r.salon_id === salonId
        );
        setReviews(filtered);
      })
      .catch(() => setReviews([]));
  }, [salonId]);

  // ⭐ 全体平均の計算（5段階評価）
  const summary = useMemo(() => {
    if (reviews.length === 0) return { avgStars: 0, roundedStars: 0 };

    // 各レビューの 5段階平均スコア
    const starValues = reviews.map((r) => {
      const scores = [r.score_1, r.score_2, r.score_3, r.score_4, r.score_5];
      const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
      return parseFloat(average.toFixed(1)); // 小数第1位まで
    });

    const avg = starValues.reduce((sum, v) => sum + v, 0) / starValues.length;
    const rounded = Math.round(avg); // 星マーク表示用

    return { avgStars: avg, roundedStars: rounded };
  }, [reviews]);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-600">
        このサロンのレビュー
      </h1>

      {/* ⭐ 上の平均表示（カード無し） */}
      {reviews.length > 0 && (
        <div className="mb-6 flex items-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <FaStar
              key={i}
              size={22}
              className={i <= summary.roundedStars ? "text-yellow-400" : "text-gray-300"}
            />
          ))}

          <span className="ml-3 text-gray-700 text-sm">
            {summary.avgStars.toFixed(1)} / 5
          </span>

          <span className="ml-3 text-gray-500 text-sm">
            ({reviews.length}件)
          </span>
        </div>
      )}

      {/* ⭐ 各レビュー */}
      {reviews.length ? (
        <div className="grid gap-6">
          {reviews.map((r) => {
            // 5段階平均に修正
            const scores = [r.score_1, r.score_2, r.score_3, r.score_4, r.score_5];
            const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
            const starsToShow = Math.round(average); // 星マーク用

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
                      className={
                        i <= starsToShow ? "text-yellow-400" : "text-gray-300"
                      }
                    />
                  ))}
                  <span className="ml-2 text-gray-600 text-sm">
                    {average.toFixed(1)} / 5
                  </span>
                </div>

                <p className="text-gray-800">{r.comments}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">レビューはまだありません</p>
      )}
    </div>
  );
}
