"use client";

import { useState, useCallback } from 'react';
import ReactMarkDown from 'react-markdown';

export default function ChatPage() {
    const [input, setInput] = useState<string>('');
    const [response, setResponse] = useState<string>('質問を入力してください...');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        setResponse('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input }),
            });

            const data = await res.json();

            if (res.ok) {
                setResponse(data.response);
            } else {
                setResponse(`エラーが発生しました: ${data.error || '不明なエラー'}`);
            }
        } catch (error) {
            console.error('API通信エラー:', error);
            setResponse('サーバーとの通信に失敗しました。');
        } finally {
            setIsLoading(false);
            setInput(''); 
        }
    }, [input, isLoading]);


    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">aichatデモ</h1>
            <h2 className="text-lg mb-4 text-gray-600">
                　ユーザーの入力<br />
                →supabaseからデータを取得<br />
                →Geminiにユーザーの入力とデータを渡す<br />
                →回答を取得<br />
                →表示
            </h2>

            {/* 質問と回答の表示エリア */}
            <div className="bg-white p-6 rounded-xl shadow-lg h-96 overflow-y-auto mb-6">
                <h2 className="text-xl font-semibold mb-3 text-indigo-600">あなたの質問:</h2>
                <p className="text-gray-700 p-3 bg-indigo-50 rounded-lg mb-4">{input || "入力待ち..."}</p>

                <h2 className="text-xl font-semibold mb-3 text-green-600">AIからの回答:</h2>
                {isLoading ? (
                    <div className="text-gray-500 italic">回答を生成中です...</div>
                ) : (
                    // 回答のテキストをpre-wrapで改行やスペースを保持して表示
                    <div className="whitespace-pre-wrap text-gray-800 bg-green-50 p-4 rounded-lg prose">
                        <ReactMarkDown>{response}</ReactMarkDown>
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