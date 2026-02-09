"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase_client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";

export default function SignUpPage() {
    const router = useRouter();
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                },
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
        } else {
            // 登録成功時。メール確認設定がオンの場合は「メールを確認してください」
            // などのメッセージを表示する方が親切ですが、一旦ログインへ飛ばします。
            router.push("/login");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-indigo-100">
            <Header />
            <div className="flex items-center justify-center min-h-[80vh] px-4">
                {/* 新規登録カード */}
                <div className="bg-white rounded-3xl shadow-sm p-8 w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">新規アカウント登録</h2>

                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="名前"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-gray-700"
                            />
                        </div>

                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="メールアドレス"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-gray-700"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="パスワード（6文字以上）"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-gray-700"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md transition-colors disabled:bg-blue-300 mt-2"
                        >
                            {loading ? "登録中..." : "登録する"}
                        </button>

                        {/* 日本語化したエラー表示 */}
                        {errorMsg && (
                            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                                <p className="text-red-500 text-sm text-center font-medium">
                                    {errorMsg.includes("Password should be at least")
                                        ? "パスワードは最低6文字以上必要です"
                                        : errorMsg.includes("User already registered")
                                            ? "このメールアドレスは既に登録されています"
                                            : "エラーが発生しました。入力内容を確認してください"}
                                </p>
                            </div>
                        )}
                    </form>

                    {/* ログインへ戻るリンク */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-gray-500 text-sm mb-2">
                            すでにアカウントをお持ちですか？
                        </p>
                        <Link
                            href="/login"
                            className="text-blue-500 hover:text-blue-700 font-bold text-sm transition-colors"
                        >
                            ログイン画面に戻る
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}