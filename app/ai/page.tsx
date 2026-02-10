"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { Send, User, Sparkles } from 'lucide-react'; // アイコンの統一
import { createClient } from '@/lib/supabase_client';
import { Header } from "@/components/Header"; // 既存の共通コンポーネントを参照

// --- Types ---
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

    const INITIAL_SALON_COUNT = 5;
    const supabase = createClient();

    // 自動スクロール
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // 認証状態の取得
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
            const conversationHistory = messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    input,
                    conversationHistory,
                    userId: user?.id
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.recommend_text,
                    salons: data.recommend_id || [],
                    additionalQuestion: data.question,
                    timestamp: new Date(),
                }]);
            } else {
                throw new Error(data.error || '不明なエラー');
            }
        } catch (error: any) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `エラーが発生しました: ${error.message}`,
                timestamp: new Date(),
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, messages, user]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-indigo-100">
            {/* 共通のHeaderコンポーネントを利用 */}
            <Header />
            <Link href="/" className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-full text-gray-500 text-sm font-bold shadow-sm hover:bg-gray-50 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </Link>
            {/* メッセージエリア */}
            <div className="max-w-2xl mx-auto px-4 pt-6 pb-40">
                {messages.length === 0 ? (
                    <div className="space-y-6 animate-in fade-in duration-700">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-indigo-500" />
                            </div>
                            <p className="text-lg font-bold text-gray-900">AIへの相談をする</p>
                            <p className="text-sm mt-2 text-gray-500">例: 〇〇駅から近く、パーマが得意なサロンを教えて</p>
                        </div>
                        
                        {!user && (
                            <div className="bg-indigo-600 rounded-2xl p-6 shadow-lg text-white text-center">
                                <User className="w-10 h-10 mx-auto mb-3 opacity-80" />
                                <h3 className="font-bold text-lg mb-2">ログインして体験使いやすく</h3>
                                <p className="text-sm text-indigo-100 mb-4">プロフィール情報を元に、AIがあなたの興味に合わせた提案をします。</p>
                                <Link href="/login?next=/ai" className="inline-block w-full py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-md hover:bg-gray-50 transition-all active:scale-95">
                                    ログイン・新規登録
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[90%] ${message.role === 'assistant' ? 'w-full' : ''}`}>
                                    {message.role === 'user' ? (
                                        <div className="bg-indigo-500 text-white rounded-2xl rounded-tr-none px-5 py-3 shadow-md">
                                            <p className="whitespace-pre-wrap">{message.content}</p>
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-2xl rounded-tl-none p-6 shadow-sm border border-gray-200">
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-3 text-indigo-600 font-bold">
                                                    <Sparkles className="w-4 h-4" />
                                                    <span>AIからの提案</span>
                                                </div>
                                                <div className="text-gray-800 prose prose-indigo max-w-none">
                                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                                </div>
                                            </div>

                                            {message.salons && message.salons.length > 0 && (
                                                <div className="mt-6 pt-6 border-t border-gray-100">
                                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                                                        おすすめのサロン ({message.salons.length}件)
                                                    </h3>
                                                    <div className="grid gap-3">
                                                        {message.salons
                                                            .slice(0, expandedMessages.has(index) ? message.salons.length : INITIAL_SALON_COUNT)
                                                            .map((salon) => (
                                                                <Link
                                                                    key={salon.id}
                                                                    href={`/salon/${salon.id}`}
                                                                    className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all group"
                                                                >
                                                                    <span className="font-bold text-gray-800 group-hover:text-indigo-700">{salon.name}</span>
                                                                    <span className="text-indigo-500 text-sm font-medium">詳細を見る →</span>
                                                                </Link>
                                                            ))}
                                                    </div>

                                                    {message.salons.length > INITIAL_SALON_COUNT && (
                                                        <button
                                                            onClick={() => toggleExpanded(index)}
                                                            className="mt-4 w-full py-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors"
                                                        >
                                                            {expandedMessages.has(index) ? "閉じる" : `もっと見る (${message.salons.length - INITIAL_SALON_COUNT}件)`}
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {message.additionalQuestion && (
                                                <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                                    <div className="text-indigo-800 text-sm italic prose-sm">
                                                        <ReactMarkdown>{message.additionalQuestion}</ReactMarkdown>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className={`text-[10px] text-gray-400 mt-1 px-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                        {message.timestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-sm flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* 入力フォーム */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-xl">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="AIに相談する..."
                            disabled={isLoading}
                            className="flex-grow px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-gray-900 disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="px-6 py-3 bg-indigo-500 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-600 transition-all disabled:bg-gray-300 flex items-center gap-2 active:scale-95"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}