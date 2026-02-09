"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase_client';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => authListener.subscription.unsubscribe();
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsOpen(false);
        router.push('/login');
    };

    const pathname = usePathname();
    
    return (
        <header className="py-6 px-6 bg-white border-b border-gray-100 relative w-full">
            {/* 全体を包含するコンテナ：flexで左右の端を確保 */}
            <div className="flex items-center justify-between w-full">
                
                {/* 1. 左端：ロゴのずれを防ぐためのダミー（または戻るボタン用） */}
                <div className="w-10"></div>

                {/* 2. 中央：常に画面の真ん中に配置 */}
                <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-center">
                    <h1 className="text-3xl font-bold flex flex-col sm:flex-row items-center justify-center">
                        <span className="text-indigo-400">OMOYEL</span>
                        <span className="text-indigo-300 text-xl sm:ml-2 whitespace-nowrap">サロン見学予約</span>
                    </h1>
                </Link>

                {/* 3. 右端：常に画面の右端に固定されるボタン */}
                <div className="relative">
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-10 h-10 flex flex-col justify-center items-center z-50 focus:outline-none"
                    >
                        <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                        <span className={`block w-6 h-0.5 bg-gray-600 my-0.5 transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                        <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
                    </button>

                    {/* メニュー：ボタンのすぐ下に表示 */}
                    {isOpen && (
                        <>
                            <div className="absolute top-full right-0 mt-4 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden py-2 animate-in fade-in zoom-in duration-200">
                                <Link href="/" className="block px-6 py-3 text-gray-700 hover:bg-indigo-50" onClick={() => setIsOpen(false)}>サロン検索</Link>
                                <Link href="/ai" className="block px-6 py-3 text-gray-700 hover:bg-indigo-50" onClick={() => setIsOpen(false)}>AIチャット</Link>
                                
                                {user ? (
                                    <>
                                        <Link href="/mypage" className="block px-6 py-3 text-gray-700 hover:bg-indigo-50" onClick={() => setIsOpen(false)}>マイプロフィール</Link>
                                        <button onClick={handleLogout} className="w-full text-left px-6 py-3 text-red-400 hover:bg-red-50 font-medium border-t border-gray-50">ログアウト</button>
                                    </>
                                ) : (
                                    <Link href={`/login?next=${encodeURIComponent(pathname)}`} className="block px-6 py-3 text-indigo-500 font-bold hover:bg-indigo-50" onClick={() => setIsOpen(false)}>ログイン</Link>
                                )}
                            </div>
                            {/* 背景クリックで閉じる */}
                            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};