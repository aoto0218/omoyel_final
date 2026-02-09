import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: `あなたは就職活動中の求職者向けのAIコンサルタントです。
    ユーザーとの会話を通じて、以下のプロフィール項目を埋める手伝いをしてください。
    項目：自己紹介(bio)、得意メニュー(specialty)
    
    【ルール】
    - 一度に全ての質問をせず、1つずつ自然に聞いてください。
    - specialtyは
    「ワンカラー, ダブルカラー, ハイライト, ローライト, グラデーション, インナーカラー, 寒色系, 暖色系, ベリーショート, ショート, ボブ, ミディアム, ロング, 縮毛矯正, トリートメント, ボディーパーマ, ニュアンスパーマ, スパイラルパーマ, ツイストパーマ, ツイストスパイラルパーマ, 波巻きパーマ, まつげパーマ, まつげエクステ, アイブロウ, 編み込み・ブレイズ, ドレッド, アフロ, バリアート, ジェルネイル, ネイルアート, フットネイル, フェイシャル, ボディ, リラクゼーション, 脱毛, ヘアメイク, メンズ特化, ナチュラル, 着付け, なんでも」
    から複数選択できます。
    - ユーザーは簡単に早くプロフィールを作成したいので、簡単な質問で「はい」か「いいえ」で答えられる質問にしてください。
    - すべての質問が終わったら「END_OF_QUESTIONS」と伝えてください。`
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