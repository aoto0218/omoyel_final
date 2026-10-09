import Link from "next/link";

type MatchRegistrationPromptProps = {
    isAuthenticated: boolean;
};

export function MatchRegistrationPrompt({ isAuthenticated }: MatchRegistrationPromptProps) {
    return (
        <div className="absolute left-1/2 top-4 z-30 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-indigo-100 bg-white/95 p-4 text-center shadow-lg backdrop-blur">
            <p className="text-sm font-bold text-gray-800">あなたに合うサロンを見つけましょう</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
                {isAuthenticated
                    ? "得意メニュー、または希望条件を2項目以上登録するとマッチ度を表示できます。"
                    : "ログインして得意メニューを登録すると、サロンとのマッチ度を表示できます。"}
            </p>
            <Link href={isAuthenticated ? "/mypage" : "/login"} className="mt-3 inline-flex rounded-full bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-indigo-600">
                {isAuthenticated ? "得意メニューを登録する" : "ログインする"}
            </Link>
        </div>
    );
}
