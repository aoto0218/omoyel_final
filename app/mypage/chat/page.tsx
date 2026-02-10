"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase_client";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";

export default function AIChatPage() {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [currentOptions, setCurrentOptions] = useState<string[]>([]);
    const [status, setStatus] = useState<"chatting" | "completed">("chatting");
    const [finalSpecialties, setFinalSpecialties] = useState<string[]>([]);

    const scrollRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();
    const router = useRouter();

    // 自動スクロール
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // 初回マウント時に会話を開始
    useEffect(() => {
        const initChat = async () => {
            const firstTrigger = { role: "user", content: "得意メニューの作成を手伝ってください。" };
            await handleSendMessage([firstTrigger]);
        };
        initChat();
    }, []);

    const handleSendMessage = async (currentMessages: { role: string; content: string }[]) => {
        setIsTyping(true);
        setCurrentOptions([]);

        try {
            const res = await fetch("/api/profile_ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    messages: currentMessages,
                    generationConfig: {
                        responseMimeType: "application/json"
                    }
                }),
            });
            const data = await res.json();

            // AIからのJSONレスポンスをパース
            const parsed = JSON.parse(data.text);

            if (parsed.status === "completed") {
                setStatus("completed");
                setFinalSpecialties(parsed.options || []);
                setMessages([...currentMessages, {
                    role: "assistant",
                    content: "分析が完了しました！あなたの得意メニューはこちらでよろしいですか？「反映する」を押すとプロフィールが更新されます。"
                }]);
            } else {
                setMessages([...currentMessages, { role: "assistant", content: parsed.question }]);
                setCurrentOptions(parsed.options || []);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages([...currentMessages, { role: "assistant", content: "エラーが発生しました。もう一度お試しください。" }]);
        } finally {
            setIsTyping(false);
        }
    };

    const onUserSubmit = (overrideInput?: string) => {
        const messageText = overrideInput || input;
        if (!messageText.trim() || isTyping || status === "completed") return;

        const newMessages = [...messages, { role: "user", content: messageText }];
        setMessages(newMessages);
        setInput("");
        handleSendMessage(newMessages);
    };

    // データベースへの反映
    const handleUpdateDB = async () => {
        setIsTyping(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from("profiles")
            .update({ specialty: finalSpecialties })
            .eq("id", user.id);

        if (!error) {
            router.push("/mypage"); // 成功したらマイページへ
        } else {
            alert("更新に失敗しました。");
            setIsTyping(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center">
            <Header />

            <div className="w-full max-w-2xl flex-1 flex flex-col p-4 h-[calc(100vh-80px)]">
                <div className="bg-white flex-1 rounded-3xl shadow-xl shadow-indigo-100/50 border border-indigo-50 flex flex-col overflow-hidden">

                    {/* ヘッダー */}
                    <div className="p-4 border-b flex justify-between items-center bg-white/50 backdrop-blur-md">
                        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <span className="font-bold text-gray-700">AIメニュー診断</span>
                        <div className="w-6 h-6" /> {/* バランス用 */}
                    </div>

                    {/* チャットエリア */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.map((m, i) => {
                            if (i === 0 && m.role === "user") return null;
                            const isAI = m.role === "assistant";
                            return (
                                <div key={i} className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
                                    <div className={`max-w-[85%] px-4 py-3 shadow-sm text-sm leading-relaxed ${isAI ? "bg-white border border-indigo-50 text-gray-800 rounded-2xl rounded-tl-none"
                                            : "bg-indigo-600 text-white rounded-2xl rounded-tr-none"
                                        }`}>
                                        {m.content}
                                    </div>
                                </div>
                            );
                        })}

                        {/* 完了時のプレビュー表示 */}
                        {status === "completed" && (
                            <div className="flex flex-wrap gap-2 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 animate-in zoom-in-95 duration-300">
                                {finalSpecialties.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-white border border-indigo-200 text-indigo-600 text-xs font-bold rounded-full shadow-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="flex gap-1 bg-white border border-gray-100 px-3 py-2 rounded-full shadow-sm">
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>

                    {/* 下部操作エリア */}
                    <div className="p-4 bg-gray-50/50 border-t space-y-4">
                        {status === "chatting" ? (
                            <>
                                {/* 選択肢ボタン */}
                                <div className="flex flex-wrap gap-2">
                                    {currentOptions.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => onUserSubmit(option)}
                                            className="px-4 py-2 bg-white hover:bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100 shadow-sm transition-all active:scale-95"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                                {/* 入力フォーム */}
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-sm shadow-inner"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && onUserSubmit()}
                                        placeholder="回答を入力..."
                                    />
                                    <button
                                        onClick={() => onUserSubmit()}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200"
                                    >
                                        送信
                                    </button>
                                </div>
                            </>
                        ) : (
                            /* 完了後の反映ボタン */
                            <div className="flex gap-3">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="flex-1 bg-white border border-gray-200 text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                                >
                                    やり直す
                                </button>
                                <button
                                    onClick={handleUpdateDB}
                                    className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
                                >
                                    反映する
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}