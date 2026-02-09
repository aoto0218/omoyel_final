import { requireAuth } from "@/lib/auth";
import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
    const user = await requireAuth();
    const supabase = await createClient();

    const { data: profiles} = await supabase.from('profiles').select('name').eq('id', user.id).single();

    return (
        <main>
            <h1>ようこそ、{profiles?.name}さん</h1>
            {/* ページコンテンツ */}
        </main>
    );
}