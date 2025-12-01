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

// 評価項目の定義
const SCORE_LABELS = {
  score_1: "スタッフの対応",
  score_2: "店舗の雰囲気",
  score_3: "店舗の設備",
  score_4: "店舗へのアクセス",
  score_5: "期待していた体験"
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

  // 全体平均と各項目の平均を計算
  const summary = useMemo(() => {
    if (reviews.length === 0) {
      return { 
        avgStars: 0, 
        roundedStars: 0,
        categoryAverages: {
          score_1: 0,
          score_2: 0,
          score_3: 0,
          score_4: 0,
          score_5: 0
        }
      };
    }

    // 各項目の平均を計算
    const categoryAverages = {
      score_1: reviews.reduce((sum, r) => sum + r.score_1, 0) / reviews.length,
      score_2: reviews.reduce((sum, r) => sum + r.score_2, 0) / reviews.length,
      score_3: reviews.reduce((sum, r) => sum + r.score_3, 0) / reviews.length,
      score_4: reviews.reduce((sum, r) => sum + r.score_4, 0) / reviews.length,
      score_5: reviews.reduce((sum, r) => sum + r.score_5, 0) / reviews.length,
    };

    // 全体平均
    const avgStars = Object.values(categoryAverages).reduce((sum, v) => sum + v, 0) / 5;
    const roundedStars = Math.round(avgStars);

    return { avgStars, roundedStars, categoryAverages };
  }, [reviews]);

  // 星を表示するコンポーネント
  const StarRating = ({ value, size = 20 }: { value: number; size?: number }) => {
    const rounded = Math.round(value);
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <FaStar
            key={i}
            size={size}
            className={i <= rounded ? "text-yellow-400" : "text-gray-200"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        このサロンのレビュー
      </h1>

      {reviews.length > 0 && (
        <>
          {/* 総合評価セクション */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">総合評価</h2>
                <div className="flex items-center gap-3">
                  <StarRating value={summary.avgStars} size={28} />
                  <span className="text-2xl font-bold text-gray-800">
                    {summary.avgStars.toFixed(1)}
                  </span>
                  <span className="text-gray-500">
                    ({reviews.length}件のレビュー)
                  </span>
                </div>
              </div>
            </div>

            {/* 各項目の評価 */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-4">項目別評価</h3>
              <div className="space-y-3">
                {Object.entries(SCORE_LABELS).map(([key, label]) => {
                  const score = summary.categoryAverages[key as keyof typeof summary.categoryAverages];
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium w-32">{label}</span>
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-1 max-w-xs">
                          <div className="flex items-center gap-2">
                            <StarRating value={score} size={16} />
                            <span className="text-sm text-gray-600 font-medium">
                              {score.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 各レビューカード */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">レビュー一覧</h2>
            {reviews.map((r) => {
              const scores = [r.score_1, r.score_2, r.score_3, r.score_4, r.score_5];
              const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;

              return (
                <div
                  key={r.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <StarRating value={average} />
                      <span className="text-gray-600 font-medium">
                        {average.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {new Date(r.created_at).toLocaleDateString("ja-JP")}
                    </span>
                  </div>

                  {/* 各項目の詳細評価 */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4 pb-4 border-b">
                    {Object.entries(SCORE_LABELS).map(([key, label]) => {
                      const scoreValue = r[key as keyof Review] as number;
                      return (
                        <div key={key} className="text-center">
                          <p className="text-xs text-gray-500 mb-1">{label}</p>
                          <div className="flex justify-center">
                            <StarRating value={scoreValue} size={14} />
                          </div>
                          <p className="text-xs font-medium text-gray-700 mt-1">
                            {scoreValue.toFixed(1)}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-gray-700 leading-relaxed">{r.comments}</p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {reviews.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500 text-lg">まだレビューがありません</p>
          <p className="text-gray-400 text-sm mt-2">最初のレビューを投稿してみませんか？</p>
        </div>
      )}
    </div>
  );
}