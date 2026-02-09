"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase_client';

interface RecommendedSalon {
    id: number;
    name: string;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
    salons?: RecommendedSalon[];
    additionalQuestion?: string;
    timestamp: Date;
}

export default function ChatPage() {
    const [input, setInput] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [expandedMessages, setExpandedMessages] = useState<Set<number>>(new Set());
    const [user, setUser] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const INITIAL_SALON_COUNT = 5;

    // 自動スクロール
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const supabase = createClient();

    useEffect(() => {
            const getUser = async () => {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
            };
            getUser();
            const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
                setUser(session?.user ?? null);
            });
            return () => authListener.subscription.unsubscribe();
        }, [supabase]);

    const toggleExpanded = (messageIndex: number) => {
        setExpandedMessages(prev => {
            const newSet = new Set(prev);
            if (newSet.has(messageIndex)) {
                newSet.delete(messageIndex);
            } else {
                newSet.add(messageIndex);
            }
            return newSet;
        });
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // 会話履歴を構築（現在のメッセージを除く）
            const conversationHistory = messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    input,
                    conversationHistory // 会話履歴を追加
                }),
            });

            const data: {
                recommend_text: string,
                recommend_id?: RecommendedSalon[],
                question?: string,
                error?: string
            } = await res.json();

            if (res.ok) {
                const assistantMessage: Message = {
                    role: 'assistant',
                    content: data.recommend_text,
                    salons: data.recommend_id || [],
                    additionalQuestion: data.question,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, assistantMessage]);
            } else {
                const errorMessage: Message = {
                    role: 'assistant',
                    content: `エラーが発生しました: ${data.error || '不明なエラー'}`,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            console.error('API通信エラー:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'サーバーとの通信に失敗しました。',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, messages]); // messagesを依存配列に追加

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-indigo-100">
            {/* ヘッダー */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-700" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                サロン相談AIチャット
                            </h1>
                            <p className="text-sm text-gray-600">
                                ※情報の一部にはAIが生成した内容が含まれます
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* メッセージエリア */}
            <div className="max-w-2xl mx-auto px-4 pt-6 pb-32">
                {messages.length === 0 ? (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                            <div className="text-center text-gray-500">
                                <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <p className="text-lg font-medium text-gray-900">AIへの相談を入力してください</p>
                                <p className="text-sm mt-2">例: 〇〇駅から近く、若いスタッフが多いサロンを教えて</p>
                            </div>
                        </div>
                        { !user && (
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                                <div className="text-center text-gray-500">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-8 h-8 text-indigo-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            {/* 頭部 */}
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
                                            />
                                            {/* 肩・胴体 */}
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 13H8c-2.21 0-4 1.79-4 4v2h16v-2c0-2.21-1.79-4-4-4z"
                                            />
                                        </svg>
                                    </div>
                                    <Link href="/login?next=/ai" className="mt-4 inline-block px-6 py-3 bg-indigo-400 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-500 transition">
                                        アカウントにログインして使いやすく
                                    </Link>
                                    <p className="text-sm mt-2">アカウントにログインすると、あなたのプロフィールに基づいてAIがサロンを提案します</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index}>
                                {message.role === 'user' ? (
                                    /* ユーザーメッセージ */
                                    <div className="flex justify-end mb-4">
                                        <div className="max-w-[80%]">
                                            <div className="bg-indigo-400 text-white rounded-2xl px-4 py-3 shadow-sm">
                                                <p className="break-words">{message.content}</p>
                                            </div>
                                            <div className="text-xs text-right text-gray-500 mt-1 px-2">
                                                {message.timestamp.toLocaleTimeString('ja-JP', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-6">
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                                            {/* AIからの回答セクション */}
                                            <div className="mb-6">
                                                <h2 className="text-lg font-bold mb-3 text-gray-900 flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                    AIからの回答
                                                </h2>
                                                <div className="text-gray-800 prose max-w-none">
                                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                                </div>
                                            </div>

                                            {/* サロンリストセクション */}
                                            {message.salons && message.salons.length > 0 && (
                                                <div className="mt-6 pt-6 border-t border-gray-200">
                                                    <h3 className="text-base font-bold text-gray-900 mb-4">
                                                        おすすめのサロン <span className="text-indigo-400">({message.salons.length}件)</span>
                                                    </h3>
                                                    <div className="space-y-3">
                                                        {message.salons
                                                            .slice(
                                                                0,
                                                                expandedMessages.has(index)
                                                                    ? message.salons.length
                                                                    : INITIAL_SALON_COUNT
                                                            )
                                                            .map((salon) => (
                                                                <div
                                                                    key={salon.id}
                                                                    className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
                                                                >
                                                                    <span className="font-medium text-gray-900 truncate">{salon.name}</span>
                                                                    <Link
                                                                        href={`/salon/${salon.id}`}
                                                                        className="text-indigo-400 hover:text-indigo-500 font-medium text-sm whitespace-nowrap ml-4"
                                                                    >
                                                                        詳細を見る →
                                                                    </Link>
                                                                </div>
                                                            ))}
                                                    </div>

                                                    {/* もっと見る/閉じるボタン */}
                                                    {message.salons.length > INITIAL_SALON_COUNT && (
                                                        <div className="mt-4 text-center">
                                                            <button
                                                                onClick={() => toggleExpanded(index)}
                                                                className="px-6 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm transition border border-gray-200 flex items-center gap-2 mx-auto"
                                                            >
                                                                {expandedMessages.has(index) ? (
                                                                    <>
                                                                        閉じる
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                                        </svg>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        もっと見る ({message.salons.length - INITIAL_SALON_COUNT}件)
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                        </svg>
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* 追加の質問セクション */}
                                            {message.additionalQuestion && (
                                                <div className="mt-6 pt-6 border-t border-gray-200">
                                                    <div className="text-gray-700 bg-gray-50 p-4 rounded-lg prose max-w-none">
                                                        <ReactMarkdown>{message.additionalQuestion}</ReactMarkdown>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-xs text-left text-gray-500 mt-1 px-2">
                                            {message.timestamp.toLocaleTimeString('ja-JP', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* ローディング表示 */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* 入力フォーム */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="相談を入力"
                            disabled={isLoading}
                            className="text-gray-900 flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="px-6 py-3 bg-indigo-400 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-500 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    送信中
                                </>
                            ) : (
                                <>
                                    送信
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}