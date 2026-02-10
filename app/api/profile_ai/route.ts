import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            },
            systemInstruction:
                `ユーザーとの対話を通じて、就活を行う美容学生の得意メニューを見つけ出してください。

【ルール】
        1. 質問は1回につき1つだけ。
        2. 常に { "status": "chatting", "question": "質問文", "options": ["選択肢1", "選択肢2"] } というJSON形式で返答せよ。
        3. ユーザーの回答を分析し、以下の候補リストから合致するものを抽出せよ。
        候補：ワンカラー, ダブルカラー, ハイライト, ローライト, グラデーション, インナーカラー, 寒色系, 暖色系, ベリーショート, ショート, ボブ, ミディアム, ロング, 縮毛矯正, トリートメント, ボディーパーマ, ニュアンスパーマ, スパイラルパーマ, ツイストパーマ, ツイストスパイラルパーマ, 波巻きパーマ, まつげパーマ, まつげエクステ, アイブロウ, 編み込み・ブレイズ, ドレッド, アフロ, バリアート, ジェルネイル, ネイルアート, フットネイル, フェイシャル, ボディ, リラクゼーション, 脱毛, ヘアメイク, メンズ特化, ナチュラル, 着付け, なんでも
        4. 3〜4問程度の質問で十分な得意メニュー（複数可）が特定できたら、質問を終了せよ。
        5. 終了時は必ず { "status": "completed", "question": "END_OF_QUESTIONS", "options": ["特定されたメニュー1", "メニュー2"] } という形式で返せ。プロセスの説明は一切不要。`,
        });

        // Geminiの履歴形式に変換（メッセージが2つ以上ある場合のみ履歴として渡す）
        const chatHistory = messages.length > 1
            ? messages.slice(0, -1).map((m: any) => ({
                role: m.role === "user" ? "user" : "model",
                parts: [{ text: m.content }],
            }))
            : [];

        const chat = model.startChat({ history: chatHistory });
        const lastMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;

        return NextResponse.json({ text: response.text() });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}