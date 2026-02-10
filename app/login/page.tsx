"use client";

import { useState, Suspense } from "react";
import { createClient } from "@/lib/supabase_client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";


function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    // クエリパラメータから遷移先を取得
    const nextPath = searchParams.get('next') || "/";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // フォーム送信のデフォルト挙動を防止
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
            router.push(nextPath);
        }
        setIsLoading(false);
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">ログイン</h2>

            <form onSubmit={handleLogin} className="space-y-4">
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
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md transition-colors disabled:bg-blue-300"
                >
                    {isLoading ? "処理中..." : "ログイン"}
                </button>

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
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-gray-500 text-sm mb-2">
                    アカウントをお持ちではありませんか？
                </p>
                <Link
                    href={`/signup?next=${encodeURIComponent(nextPath)}`}
                    className="text-blue-500 hover:text-blue-700 font-bold text-sm transition-colors"
                >
                    新しくアカウントを作成する
                </Link>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-indigo-100">
            <Header />
            <div className="flex items-center justify-center min-h-[80vh] px-4">
                {/* 境界線としてSuspenseを配置 */}
                <Suspense fallback={
                    <div className="bg-white rounded-3xl shadow-sm p-8 w-full max-w-md text-center">
                        <p className="text-gray-500">読み込み中...</p>
                    </div>
                }>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}