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
        const { input, conversationHistory } = await request.json();

        // 最初の会話かどうかを判定
        const isFirstMessage = !conversationHistory || conversationHistory.length === 0;

        // 会話履歴を構築
        const conversationContent = [];

        // 毎回データベース情報を取得してシステムプロンプトに含める
        const { data: relatedSalons } = await supabase
            .from('salons')
            .select('*');

        const salon_context = relatedSalons && relatedSalons.length > 0 ? relatedSalons.map((salon) => {
            const tagsString = Array.isArray(salon.tags) ? salon.tags.join(', ') : (salon.tags || '情報なし');
            return `
        ID: ${salon.id}
        サロン名: ${salon.name}
        住所: ${salon.address || '情報なし'}
        タグ: ${tagsString}
        スタッフ構成（男女比/年代）: ${salon.staff_gender_ratio || '情報なし'} / ${salon.staff_age_group || '情報なし'}
        お店の雰囲気: ${salon.atmosphere || '情報なし'}
        顧客構成（男女比/年代）: ${salon.customer_gender_ratio || '情報なし'} / ${salon.customer_age_group || '情報なし'}
        企業ID(企業情報のIDと紐づく): ${salon.company_id || '情報なし'}
        --------------------------
    `;
        }).join('\n')
            : "ユーザーの質問に関連する具体的な美容サロンの情報はデータベースに見つかりませんでした。";

        const { data: relatedCompany } = await supabase
            .from('companies')
            .select('*');

        const company_context = relatedCompany && relatedCompany.length > 0 ? relatedCompany.map((company) => {
            const hrString = Array.isArray(company.hr) ? company.hr.join(', ') : (company.hr || '情報なし');
            const experienceString = Array.isArray(company.experience) ? company.experience.join(', ') : (company.experience || '情報なし');
            const eventString = Array.isArray(company.event) ? company.event.join(', ') : (company.event || '情報なし');
            return `
        ID（サロン情報の企業IDと紐づく）: ${company.id}
        企業名: ${company.name}
        募集中の職種: ${hrString}
        見学時に体験できる内容: ${experienceString}
        見学時の交通費支給: ${company.provided || '情報なし'}
        参加、実施しているイベント: ${eventString}
        店舗展開の仕方: ${company.expansion || '情報なし'}
        アピールポイント: ${company.appeal || '情報なし'}
        推しポイント: ${company.point || '情報なし'}
        お客様への向き合い方: ${company.customer || '情報なし'}
        スタッフの雰囲気: ${company.staff || '情報なし'}
        初任給: ${company.start_salary || '情報なし'}
        アシスタント給与: ${company.assist_salary || '情報なし'}
        スタイリスト給与: ${company.stylist_salary || '情報なし'}
        店長給与: ${company.manager_salary || '情報なし'}
        エリアマネージャー給与: ${company.area_salary || '情報なし'}
        ボーナス: ${company.bounus || '情報なし'}
        福利厚生: ${company.benefits || '情報なし'}
        社会保険: ${company.insurance || '情報なし'}
        休暇制度: ${company.vacation_system || '情報なし'}
        有給休暇等: ${company.paid_holiday || '情報なし'}
        シフト: ${company.shift || '情報なし'}
        選考方法: ${company.process || '情報なし'}
        --------------------------
    `;
        }).join('\n')
            : "ユーザーの質問に関連する具体的な企業情報はデータベースに見つかりませんでした。";

        const systemPrompt = `
あなたは就職活動中の求職者向けのAIコンサルタントです。
以下の「データベース情報」は美容サロンのデータベース情報です。

・データベース情報
サロン情報：
${salon_context}

企業情報：
${company_context}

回答形式：
{
    "recom_text": string, // 質問に対する回答、Markdown形式でわかりやすいよう簡潔に記述（サロン情報や企業情報はここには含めない）
    "recom_id": number[], // データベースの情報から関連性が高いと判断したサロンのIDの配列、なければ空の配列
    "quest" : string // アドバイスや追加情報、よりよい回答をするための質問など記載、Markdown形式でわかりやすいよう簡潔に記述
}

データベース情報をもとにユーザーの質問に「回答形式」に従って**JSON形式のみで回答**してください。（**必ず'{'から始まって'}'で終わるような形**、**前後に文言は一切含めない**）
指定された箇所以外は通常テキストで出力し、Markdown形式やコードブロックは使用しないでください。
IDは'recom_id'以外の箇所（recom_textやquest）では一切記述しないでください。
データベースにない情報はインターネットで調べた正確な情報で補完してください。
ユーザーにサロンの詳細情報を案内する際は「**詳細を見るをクリック**してください」と案内してください。
`;

        // システムプロンプトを常に最初に追加
        conversationContent.push({
            role: "user",
            parts: [{ text: systemPrompt }]
        });
        conversationContent.push({
            role: "model",
            parts: [{ text: "理解しました。データベース情報を参照して、ユーザーの質問に適切に回答します。" }]
        });

        // 会話履歴を追加
        if (conversationHistory && conversationHistory.length > 0) {
            conversationHistory.forEach((msg: { role: string, content: string }) => {
                conversationContent.push({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                });
            });
        }

        // 現在の質問を追加
        conversationContent.push({
            role: "user",
            parts: [{ text: input }]
        });

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const chat = model.startChat({
            history: conversationContent.slice(0, -1),
        });

        const result = await chat.sendMessage(conversationContent[conversationContent.length - 1].parts[0].text);

        let geminiResponse: { recom_text: string, recom_id: number[], quest: string };

        try {
            const responseText = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            geminiResponse = JSON.parse(responseText);
        } catch (e) {
            console.error("Failed to parse Gemini JSON response:", result.response.text());
            return NextResponse.json({
                recommend_text: result.response.text(),
                recommend_id: [],
                question: ""
            });
        }

        // サロン情報を取得（IDから名前を取得するため）
        const { data: allSalons } = await supabase
            .from('salons')
            .select('id, name')
            .in('id', geminiResponse.recom_id);

        const recommend_id = geminiResponse.recom_id
            .map(id => {
                const salon = allSalons?.find(s => s.id === id);
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