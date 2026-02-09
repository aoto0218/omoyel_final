"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase_client";
import { useRouter } from "next/navigation";

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
                // 会員登録後のリダイレクト先を指定（必要に応じて）
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
        } else {
            alert("確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。");
            router.push("/login");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "40px auto", padding: "20px" }}>
            <h1>新規アカウント登録</h1>
            <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label>
                    名前:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </label>
                <label>
                    メールアドレス:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </label>
                <label>
                    パスワード:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </label>

                {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

                <button type="submit" disabled={loading} style={{ padding: "10px", cursor: "pointer" }}>
                    {loading ? "登録中..." : "登録する"}
                </button>
            </form>
        </div>
    );
}