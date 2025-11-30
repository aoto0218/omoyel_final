"use client";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface ReviewFormProps {
  initialSalonId?: number;
}

export default function ReviewForm({ initialSalonId }: ReviewFormProps) {
  const searchParams = useSearchParams();
  const querySalonId = searchParams.get("salonId");
  const router = useRouter();
  const [salonId] = useState(querySalonId || initialSalonId?.toString() || "");
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [score3, setScore3] = useState(0);
  const [score4, setScore4] = useState(0);
  const [score5, setScore5] = useState(0);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const isFormComplete =
    salonId &&
    score1 > 0 &&
    score2 > 0 &&
    score3 > 0 &&
    score4 > 0 &&
    score5 > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/addReview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salon_id: Number(salonId),
          score_1: score1,
          score_2: score2,
          score_3: score3,
          score_4: score4,
          score_5: score5,
          comments,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newReviewId = data?.id;

        setAlert({ type: "success", message: "レビュー登録完了！" });
        setScore1(0);
        setScore2(0);
        setScore3(0);
        setScore4(0);
        setScore5(0);
        setComments("");

        setTimeout(() => setAlert(null), 5000);

        if (newReviewId) router.push(`/review/${newReviewId}`);
      } else {
        setAlert({ type: "error", message: "登録失敗" });
        setTimeout(() => setAlert(null), 5000);
      }
    } catch (error) {
      console.error(error);
      setAlert({ type: "error", message: "通信エラー" });
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  }

  const StarRating = ({ value, setValue }: { value: number; setValue: (v: number) => void }) => {
    const stars = [1, 2, 3, 4, 5];
    return (
      <div className="flex justify-center gap-1">
        {stars.map((star) => (
          <FaStar
            key={star}
            className={`cursor-pointer ${star <= value ? "text-yellow-500" : "text-gray-300"}`}
            size={24}
            onClick={() => setValue(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            戻る
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-lg border border-gray-200 p-6 space-y-4"
      >
        <h1 className="text-lg font-semibold text-gray-900 mb-4">サロンレビュー</h1>

        <input type="hidden" value={salonId} />

        {/* Tailwind アラート */}
        {alert && (
          <div
            className={`mb-4 px-4 py-3 rounded text-center transition ${
              alert.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
            role="alert"
          >
            {alert.message}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-700 mb-2">スタッフの方の対応はいかがでしたか？</p>
            <StarRating value={score1} setValue={setScore1} />
          </div>
          <div>
            <p className="text-sm text-gray-700 mb-2">店舗の雰囲気はいかがでしたか？</p>
            <StarRating value={score2} setValue={setScore2} />
          </div>
          <div>
            <p className="text-sm text-gray-700 mb-2">店舗の設備はいかがでしたか？</p>
            <StarRating value={score3} setValue={setScore3} />
          </div>
          <div>
            <p className="text-sm text-gray-700 mb-2">店舗へのアクセスはいかがでしたか？</p>
            <StarRating value={score4} setValue={setScore4} />
          </div>
          <div>
            <p className="text-sm text-gray-700 mb-2">期待していた体験はできましたか？</p>
            <StarRating value={score5} setValue={setScore5} />
          </div>
        </div>

        <div className="pt-2">
          <p className="text-sm text-gray-700 mb-2">サロンを見学した感想や意見をご記入ください</p>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="こちらにご記入ください"
            className="w-full h-24 border border-gray-300 rounded-md p-3 text-sm resize-none bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!isFormComplete || isSubmitting}
          className={`w-full py-2.5 rounded-md font-medium text-sm transition-all ${
            isFormComplete && !isSubmitting
              ? "bg-gray-900 text-white hover:bg-gray-800"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "送信中..." : "レビュー登録"}
        </button>

        {!isFormComplete && (
          <p className="text-xs text-gray-500 text-center">※全ての評価を選択してください</p>
        )}
      </form>
    </div>
  );
}
