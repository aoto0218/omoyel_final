import { requireAuth } from "@/lib/auth";

export default async function HomePage() {
    // 認証チェック
    const user = await requireAuth();
    console.log('ユーザー情報:', { user: user?.email });

    return (
        <main>
            <h1>ようこそ、{user.email}さん</h1>
            {/* ページコンテンツ */}
        </main>
    );
}