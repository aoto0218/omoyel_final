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
      setIsSubmitting(false);
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
            className={`cursor-pointer ${
              // 星の色はそのまま yellow-400 を使用
              star <= value ? "text-yellow-500" : "text-gray-300"
            }`}
            size={30}
            onClick={() => setValue(star)}
          />
        ))}
      </div>
    );
  };

  return (
    // 1. 全体の背景を白 (bg-gray-50) に設定
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-sm">
        {/* max-w-smに固定 */}
        {/* 2. 戻るボタンの色 (テキストを濃い色に変更) */}
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            戻る
          </button>
        </div>
      </div>

      {/* 3. フォームの背景を白 (bg-white) に設定 */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-6 space-y-6 border border-gray-200"
      >
        {/* フォームタイトル */}
        <h1 className="text-xl font-bold text-center text-gray-900 mb-6">
          OMOYEL サロンレビュー
        </h1>

        {/* サロンIDは非表示 */}
        <input type="hidden" value={salonId} />

        {/* スコアリングセクション */}

        {/* score1 */}
        {/* 背景を薄いグレー (bg-gray-100) にして、コントラストをつける */}
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-800 font-medium mb-3 text-center text-base">
            スタッフの対応はいかがでしたか？
          </p>
          <StarRating value={score1} setValue={setScore1} />
        </div>

        {/* score2 */}
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-800 font-medium mb-3 text-center text-base">
            お店の雰囲気はどうでしたか？
          </p>
          <StarRating value={score2} setValue={setScore2} />
        </div>

        {/* score3 */}
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-800 font-medium mb-3 text-center text-base">
            今後もこのサイトを使いたいと思いますか？
          </p>
          <StarRating value={score3} setValue={setScore3} />
        </div>

        {/* score4 */}
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-800 font-medium mb-3 text-center text-base">
            期待していた機能はありましたか？
          </p>
          <StarRating value={score4} setValue={setScore4} />
        </div>

        {/* score5 */}
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-800 font-medium mb-3 text-center text-base">
            その他の満足度
          </p>
          <StarRating value={score5} setValue={setScore5} />
        </div>

        {/* コメント */}
        <div>
          <p className="text-gray-800 font-medium mb-2">
            サロンを見学した感想や意見をご記入ください
          </p>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="ご自由にご記入ください"
            // 背景色を白 (bg-white) にし、境界線を薄いグレーに
            className="w-full h-28 border border-gray-300 rounded-xl p-3 resize-none bg-white text-gray-800 placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
          />
        </div>

        {/* 送信ボタン（色は維持、非活性時の色を調整） */}
        <button
          type="submit"
          disabled={!isFormComplete || isSubmitting}
          className={`w-full py-3 rounded-xl font-bold text-center transition-all shadow-lg mt-6 ${
            isFormComplete && !isSubmitting
              ? // 画像のボタンに近い、紫のグラデーション（維持）
                "bg-gradient-to-r from-purple-600 to-indigo-500 text-white hover:from-purple-700 hover:to-indigo-600"
              : // 非活性時は薄いグレーと濃いテキストに
                "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "送信中..." : "レビュー登録"}
        </button>

        {!isFormComplete && (
          // 白背景で目立つように赤の色を調整
          <p className="text-sm text-red-600 text-center">
            ※全ての評価（星）を選択してください
          </p>
        )}
      </form>
    </div>
  );
}