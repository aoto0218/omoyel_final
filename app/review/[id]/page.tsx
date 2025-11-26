'use client';
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from 'lucide-react';
interface ReviewFormProps {
  initialSalonId?: number;
}

export default function ReviewForm({ initialSalonId }: ReviewFormProps) {
  const searchParams = useSearchParams();
  const querySalonId = searchParams.get('salonId');
  const router = useRouter();
  const [salonId] = useState(querySalonId || initialSalonId?.toString() || "");
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [score3, setScore3] = useState(0);
  const [score4, setScore4] = useState(0);
  const [score5, setScore5] = useState(0);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // 送信中フラグ

  const isFormComplete =
    salonId &&
    score1 > 0 &&
    score2 > 0 &&
    score3 > 0 &&
    score4 > 0 &&
    score5 > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isSubmitting) return; // 送信中なら何もしない
    setIsSubmitting(true); // フラグを立てる

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
        alert("レビュー登録完了！");
        setScore1(0);
        setScore2(0);
        setScore3(0);
        setScore4(0);
        setScore5(0);
        setComments("");
      } else {
        alert("登録失敗");
      }
    } catch (error) {
      console.error(error);
      alert("通信エラー");
    } finally {
      setIsSubmitting(false); // フラグを戻す
    }
  }

  const StarRating = ({
    value,
    setValue,
  }: {
    value: number;
    setValue: (v: number) => void;
  }) => {
    const stars = [1, 2, 3, 4, 5];
    return (
      <div className="flex justify-center gap-1">
        {stars.map((star) => (
          <FaStar
            key={star}
            className={`cursor-pointer ${star <= value ? "text-yellow-400" : "text-gray-300"}`}
            size={30}
            onClick={() => setValue(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-purple-100 to-purple-300 p-6">

<div className="px-4 py-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-1 text-indigo-500 hover:text-indigo-600 transition text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        戻る
                    </button>
                </div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-6 space-y-6"
      >
        <h1 className="text-xl font-bold text-center text-purple-700">
          OMOYEL サロンレビュー
        </h1>

        {/* サロンIDは非表示 */}
        <input type="hidden" value={salonId} />

        {/* score1 */}
        <div className="p-3 bg-purple-50 rounded-lg">
          <p className="text-gray-700 font-medium mb-3 text-center">🌟 スタッフの対応はいかがでしたか？</p>
          <StarRating value={score1} setValue={setScore1} />
        </div>

        {/* score2 */}
        <div className="p-3 bg-purple-50 rounded-lg">
          <p className="text-gray-700 font-medium mb-3 text-center">✨ お店の雰囲気はどうでしたか？</p>
          <StarRating value={score2} setValue={setScore2} />
        </div>

        {/* score3 */}
        <div className="p-3 bg-purple-50 rounded-lg">
          <p className="text-gray-700 font-medium mb-3 text-center">💛 今後もこのサイトを使いたいと思いますか？</p>
          <StarRating value={score3} setValue={setScore3} />
        </div>

        {/* score4 */}
        <div className="p-3 bg-purple-50 rounded-lg">
          <p className="text-gray-700 font-medium mb-3 text-center">🤩 期待していた機能はありましたか？</p>
          <StarRating value={score4} setValue={setScore4} />
        </div>

        {/* score5 */}
        <div className="p-3 bg-purple-50 rounded-lg">
          <p className="text-gray-700 font-medium mb-3 text-center">⭐ その他の満足度</p>
          <StarRating value={score5} setValue={setScore5} />
        </div>

        {/* コメント */}
        <div>
          <p className="text-gray-700 font-medium mb-2">サロンを見学した感想や意見をご記入ください</p>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="ご自由にご記入ください"
            className="w-full h-28 border rounded-xl p-3 resize-none bg-gray-50 text-gray-900"
          />
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={!isFormComplete || isSubmitting}
          className={`w-full py-3 rounded-xl font-bold text-center transition-all ${
            isFormComplete && !isSubmitting
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "送信中..." : "レビュー登録"}
        </button>

        {!isFormComplete && (
          <p className="text-sm text-red-500 text-center">※全ての評価（星）を選択してください</p>
        )}
      </form>
    </div>
  );
}
