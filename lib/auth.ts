import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function requireAuth() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        console.log('認証失敗、ログインページにリダイレクト');
        redirect('/login');
    }

    return user;
}