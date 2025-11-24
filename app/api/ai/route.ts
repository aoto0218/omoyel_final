import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";


const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!apiKey || !supabaseUrl || !supabaseServiceKey) {
    throw new Error("必要な環境変数を設定してください。SUPABASE_URL, SUPABASE_SERVICE_KEY, NEXT_PUBLIC_GOOGLE_AI_API_KEY");
}

const genAI = new GoogleGenerativeAI(apiKey);
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
    try {
        const { input } = await request.json();

        const { data: relatedSalons, error } = await supabase
            .from('salons')
            .select('id, name, address, tags, visit_schedule, instagram, staff_gender_ratio, staff_age_group, atmosphere, customer_gender_ratio, customer_age_group')

        if (error) {
            console.error("Supabase Error:", error.message);
            return NextResponse.json({ error: "データベースの検索中にエラーが発生しました。" }, { status: 500 });
        }

        const context = relatedSalons && relatedSalons.length > 0
            ? relatedSalons.map((salon) => {
                const tagsString = Array.isArray(salon.tags) ? salon.tags.join(', ') : (salon.tags || '情報なし');
                return `
                    ID: ${salon.id}
                    サロン名: ${salon.name}
                    住所: ${salon.address || '情報なし'}
                    タグ: ${tagsString}
                    スタッフ構成（男女比/年代）: ${salon.staff_gender_ratio || '情報なし'} / ${salon.staff_age_group || '情報なし'}
                    お店の雰囲気: ${salon.atmosphere || '情報なし'}
                    顧客構成（男女比/年代）: ${salon.customer_gender_ratio || '情報なし'} / ${salon.customer_age_group || '情報なし'}
                    --------------------------
                `;
            }).join('\n')
            : "ユーザーの質問に関連する具体的な美容サロンの情報はデータベースに見つかりませんでした。";

        const prompt = `
            あなたは就職活動中の求職者向けのAIコンサルタントです。
            以下の「データベース情報」は美容サロンのデータベース情報です。
            
            以下の情報とインターネットで調べた正確な情報でユーザーの質問に「回答形式」に従って必ずJSON形式で回答してください。
            指定された箇所以外は通常テキストで出力し、Markdown形式やコードブロックは使用しないでください。      
            
            データベース情報：
            ${context}
            
            ユーザーの質問：
            ${input}

            回答形式：
            {
                "recom_text": string, // 質問に対する回答、Markdown形式でわかりやすいように記述（サロンの詳細情報は含めない）
                "recom_id": number[], // データベースの情報から関連性が高いと判断したサロンのIDの配列、なければ空の配列
                "quest" : string // アドバイスや追加情報、よりよい回答をするための質問などがあれば記載、なければ空文字列、Markdown形式でわかりやすいように記述
            }
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);

        let geminiResponse: { recom_text: string, recom_id: number[], quest: string };

        try {
            geminiResponse = JSON.parse(result.response.text());
        } catch (e) {
            console.error("Failed to parse Gemini JSON response:", result.response.text());
            return NextResponse.json({
                recommend_text: result.response.text(),
                recommend_id: [],
                question: ""
            });
        }

        const recommend_id = geminiResponse.recom_id
            .map(id => {
                const salon = relatedSalons?.find(s => s.id === id);
                return salon ? { id: salon.id, name: salon.name } : null;
            })
            .filter((item): item is { id: number, name: string } => item !== null);

        return NextResponse.json({
            recommend_text: geminiResponse.recom_text,
            recommend_id: recommend_id,
            question: geminiResponse.quest
        });

    } catch (error: any) {
        console.error("Error generating content:", error.message);

        return NextResponse.json(
            {
                error: error.message || "予期せぬエラーが発生しました。",
            },
            { status: 500 }
        );
    }
}