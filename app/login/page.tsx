"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase_client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setIsLoading(true);
        const supabase = createClient();

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage("ログインしました");
            router.push("/");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-indigo-100">
            <Header />
            <div className="flex items-center justify-center min-h-[80vh] px-4">
                {/* ログインカード */}
                <div className="bg-white rounded-3xl shadow-sm p-8 w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-8 text-gray-800">ログイン</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="メールアドレス"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-gray-700"
                            />
                        </div>
                        
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="パスワード"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-gray-700"
                            />
                        </div>

                        <button
                            onClick={handleLogin}
                            disabled={isLoading}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md transition-colors disabled:bg-blue-300"
                        >
                            {isLoading ? "処理中..." : "ログイン"}
                        </button>

                        {/* エラーメッセージの表示 */}
                        {message && (
                            <div className="mt-4 p-3 bg-red-50 rounded-lg">
                                <p className="text-red-500 text-sm text-center font-medium">
                                    {message.includes("missing email or phone")
                                        ? "メールアドレスを入力してください"
                                        : message.includes("Invalid login credentials")
                                        ? "メールアドレスまたはパスワードが正しくありません"
                                        : message}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* フッターリンク */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-gray-500 text-sm mb-2">
                            アカウントをお持ちではありませんか？
                        </p>
                        <Link
                            href="/signup"
                            className="text-blue-500 hover:text-blue-700 font-bold text-sm transition-colors"
                        >
                            新しくアカウントを作成する
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}