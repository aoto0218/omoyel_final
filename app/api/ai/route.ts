import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

// 環境変数の設定チェックと初期化
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!apiKey || !supabaseUrl || !supabaseServiceKey) {
    throw new Error("環境変数の設定できてないよ！DiscordにあるAPI関連のsupabseとgoogle geminiのキーが必要です！");
}

const genAI = new GoogleGenerativeAI(apiKey);
const supabase = createClient(supabaseUrl, supabaseServiceKey);


export async function POST(request: Request) {
    try {
        const { input } = await request.json();

        const { data} = await supabase
            .from('salons')
            .select('name, address, tags, visit_schedule, instagram, staff_gender_ratio, staff_age_group, atmosphere, customer_gender_ratio, customer_age_group')

        const context = data && data.length > 0
            ? data.map((salon) => {
                const tagsString = Array.isArray(salon.tags) ? salon.tags.join(', ') : (salon.tags || '情報なし');

                return `
                    サロン名: ${salon.name}
                    住所: ${salon.address || '情報なし'}
                    得意なメニュー: ${tagsString}
                    見学スケジュール: ${salon.visit_schedule || '情報なし'}
                    Instagram: ${salon.instagram || '情報なし'}
                    スタッフ構成（男女比/年代）: ${salon.staff_gender_ratio || '情報なし'} / ${salon.staff_age_group || '情報なし'}
                    お店の雰囲気: ${salon.atmosphere || '情報なし'}
                    顧客構成（男女比/年代）: ${salon.customer_gender_ratio || '情報なし'} / ${salon.customer_age_group || '情報なし'}
                    -------------------------------
                `;
            }).join('\n')
            : "ユーザーの質問に関連する具体的な美容サロンの情報はデータベースに見つかりませんでした。";

        const prompt = `
            以下の「情報」は、美容サロンの求人に関するデータベース情報です。
            
            **以下の情報とインターネットで調べた正確な情報で**ユーザーの質問に回答してください。
            
            データベース情報に関連する内容ではない場合や情報が不足している場合は、インターネットで調べられる範囲で最善の回答を提供してください。
            それでも回答が難しい場合は、その旨を伝えてください。
            回答する際は情報を列挙するだけでなく求職者が求めている情報について回答するための質問を返してください。
            
            情報：
            「${context}」
            
            ユーザーの質問：
            「${input}」
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
        const result = await model.generateContent(prompt);

        return NextResponse.json({
            response: result.response.text(),
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