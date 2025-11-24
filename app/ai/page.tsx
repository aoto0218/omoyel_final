"use client";

import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

interface RecommendedSalon {
    id: number;
    name: string;
}

export default function ChatPage() {
    const [input, setInput] = useState<string>('');
    const [recom_text, setRecomText] = useState<string>('質問を入力してください...');
    const [recom_id, setRecomId] = useState<RecommendedSalon[]>([]);
    const [quest, setQuest] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        setRecomText('');
        setRecomId([]);
        setQuest('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input }),
            });

            const data: { recommend_text: string, recommend_id?: RecommendedSalon[], question?: string, error?: string } = await res.json();

            if (res.ok) {
                setRecomText(data.recommend_text);
                setRecomId(data.recommend_id || []);
                setQuest(data.question || '');
            } else {
                setRecomText(`エラーが発生しました: ${data.error || '不明なエラー'}`);
            }
        } catch (error) {
            console.error('API通信エラー:', error);
            setRecomText('サーバーとの通信に失敗しました。');
        } finally {
            setIsLoading(false);
            setInput('');
        }
    }, [input, isLoading]);


    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-8 text-white-700">
                ai demo
            </h1>
            <h2 className="text-center mb-8 text-white-500">
                supabaseからfetch<br />
                geminiにプロンプトを送信<br />
                geminiからfetch<br />
                fetchしたデータをパースして表示
            </h2>

            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 h-auto overflow-y-auto mb-6 transition-all duration-300">

                {/* 質問セクション */}
                <div className="mb-6 pb-4 border-b border-indigo-100">
                    <h2 className="text-xl font-bold mb-3 text-indigo-600 flex items-center">
                        あなたの質問:
                    </h2>
                    <p className="text-gray-700 p-4 bg-indigo-50 rounded-lg border border-indigo-200 shadow-inner break-words">
                        {input || "入力待ち..."}
                    </p>
                </div>

                {/* AIからの回答セクション */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3 text-green-700 flex items-center">
                        AIからの回答:
                    </h2>

                    {isLoading ? (
                        <div className="text-gray-500 italic p-4 bg-gray-100 rounded-lg animate-pulse">
                            回答を生成中です...
                        </div>
                    ) : (
                        <div className="text-gray-800 bg-green-50 p-5 rounded-xl border border-green-200 shadow-md transition-opacity duration-500 prose max-w-none">
                            <ReactMarkdown>{recom_text}</ReactMarkdown>
                        </div>
                    )}
                </div>

                {/* サロンリストセクション */}
                {recom_id.length > 0 && (
                    <div className="mt-6 border-t border-green-200 pt-5">
                        <h3 className="text-lg font-extrabold text-green-800 mb-4 flex items-center">
                            見つかったおすすめのサロン (<strong>{recom_id.length}</strong>件)
                        </h3>
                        <div className="space-y-4">
                            {recom_id.map((salon) => (
                                <div
                                    key={salon.id}
                                    className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200"
                                >
                                    <span className="font-semibold text-lg text-gray-800 truncate">{salon.name}</span>
                                    <Link
                                        href={`/salon/${salon.id}`}
                                        className="text-indigo-600 hover:text-indigo-800 font-bold text-sm py-1 px-3 border border-indigo-200 rounded-full bg-indigo-50 hover:bg-indigo-100 transition-all duration-200 flex-shrink-0"
                                    >
                                        詳細を見る &rarr;
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 追加の質問/誘導セクション */}
                {quest && (
                    <div className="mt-6 border-t border-gray-200 pt-5">
                        <div className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200 prose max-w-none">
                            <ReactMarkdown>{quest}</ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>

            {/* 質問入力フォーム */}
            <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="サロンに関する質問を入力してください..."
                    disabled={isLoading}
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
                >
                    {isLoading ? '送信中...' : '送信'}
                </button>
            </form>
        </div>
    );
}