"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase_client";

export default function AIChatPage() {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    // 自動スクロール
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 初回マウント時に会話を開始
    useEffect(() => {
        const initChat = async () => {
            const firstTrigger = { role: "user", content: "プロフィールの作成を手伝ってください。" };
            await handleSendMessage([firstTrigger]);
        };
        initChat();
    }, []);

    const handleSendMessage = async (currentMessages: { role: string; content: string }[]) => {
        setIsTyping(true);
        try {
            const res = await fetch("/api/profile_ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: currentMessages }),
            });
            const data = await res.json();
            const aiContent = data.text;

            setMessages([...currentMessages, { role: "assistant", content: aiContent }]);
        } catch (error) {
            console.error("Chat Error:", error);
        } finally {
            setIsTyping(false);
        }
    };

    const onUserSubmit = () => {
        if (!input.trim() || isTyping) return;
        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");
        handleSendMessage(newMessages);
    };

    return (
        <div className="min-h-screen bg-blue-50 flex flex-col items-center pt-8 px-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-sm flex flex-col h-[85vh] overflow-hidden border border-gray-100">
                <div className="bg-white border-b p-4 flex items-center justify-between">
                    <span className="text-indigo-500 font-bold">AIプロフィール作成</span>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-[10px] text-gray-400">Online</span>
                    </div>
                </div>

                {/* チャットエリア */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-blue-50/30">
                    {messages.map((m, i) => {
                        // 最初の「隠しメッセージ」を表示したくない場合はここでスキップ
                        if (i === 0 && m.role === "user") return null;

                        return (
                            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[85%] px-4 py-3 shadow-sm ${m.role === "user"
                                        ? "bg-indigo-500 text-white rounded-2xl rounded-tr-none"
                                        : "bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100"
                                    }`}>
                                    <p className="text-sm whitespace-pre-wrap">
                                        {m.content}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-200 px-3 py-1 rounded-full text-[10px] text-gray-500 animate-bounce">AI入力中...</div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>

                {/* 入力エリア */}
                <div className="p-4 bg-white border-t">
                    <div className="flex gap-2">
                        <input
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-sm"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && onUserSubmit()}
                            placeholder="メッセージを入力..."
                            disabled={isTyping}
                        />
                        <button
                            onClick={onUserSubmit}
                            disabled={isTyping}
                            className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white px-6 rounded-2xl font-bold transition-all shadow-md active:scale-95"
                        >
                            送信
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}