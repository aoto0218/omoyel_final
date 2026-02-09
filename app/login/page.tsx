"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase_client";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
            setMessage(`ログインに失敗しました: ${error.message}`);
        } else {
            setMessage("ログインしました");
            router.push("/mypage");
        }
        setIsLoading(false);
    };

    return (
        <div className="p-4 max-w-sm mx-auto">
            <h2 className="text-xl font-bold mb-4">ログイン</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレス"
                className="border p-2 w-full mb-2"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
                className="border p-2 w-full mb-2"
            />
            <button
                onClick={handleLogin}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-4"
            >
                {isLoading ? "処理中..." : "ログイン"}
            </button>

            {message && <p className="mt-2 text-sm">{message}</p>}

            <hr className="my-4" />
            <div className="text-center text-sm">
                <p className="text-gray-600">
                    アカウントをお持ちではありませんか？
                </p>
                <Link
                    href="/signup"
                    className="text-blue-600 hover:underline font-semibold"
                >
                    新しくアカウントを作成する
                </Link>
            </div>
        </div>
    );
}