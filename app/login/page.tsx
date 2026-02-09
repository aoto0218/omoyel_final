"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase_client";
import { useRouter } from "next/navigation";

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
        <div className="p-4">
            <h2>ログイン</h2>
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
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
                {isLoading ? "処理中..." : "ログイン"}
            </button>
            {message && <p className="mt-2">{message}</p>}
        </div>
    );
}