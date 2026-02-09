"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase_client";
import Link from "next/link";
import Image from "next/image";

export default function MyPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [favoriteSalons, setFavoriteSalons] = useState<any[]>([]);

    // 得意メニューの選択肢
    const specialtyOptions = ["ワンカラー", "ダブルカラー", "ハイライト", "ローライト", "グラデーション", "インナーカラー","寒色系","暖色系","ベリーショート","ショート","ボブ","ミディアム","ロング","縮毛矯正","トリートメント","ボディーパーマ","ニュアンスパーマ","スパイラルパーマ","ツイストパーマ","ツイストスパイラルパーマ","波巻きパーマ","まつげパーマ","まつげエクステ","アイブロウ","編み込み・ブレイズ","ドレッド","アフロ","バリアート","ジェルネイル","ネイルアート","フットネイル","フェイシャル","ボディ","リラクゼーション","脱毛","ヘアメイク","メンズ特化","ナチュラル","着付け","なんでも"];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. プロフィール取得 (profilesテーブルを想定)
        const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        setProfile(profileData);

        // 2. お気に入りサロンの詳細を取得
        if (profileData?.favorite?.length > 0) {
            const { data: salons } = await supabase
                .from("salons")
                .select("id, name, images")
                .in("id", profileData.favorite);
            setFavoriteSalons(salons || []);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setLoading(true);
        const { error } = await supabase
            .from("profiles")
            .update({
                name: profile.name,
                bio: profile.bio,
                specialty: profile.specialty
            })
            .eq("id", profile.id);

        if (!error) setIsEditing(false);
        setLoading(false);
    };

    const toggleSpecialty = (item: string) => {
        const current = profile.specialty || [];
        const next = current.includes(item)
            ? current.filter((s: string) => s !== item)
            : [...current, item];
        setProfile({ ...profile, specialty: next });
    };

    if (loading && !profile) return <div className="p-8 text-center text-gray-500">読み込み中...</div>;

    return (
        <div className="min-h-screen bg-blue-50 pt-8 pb-12 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
                
                {/* プロフィールカード */}
                <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">マイプロフィール</h2>
                        <button 
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className={`px-6 py-2 rounded-full font-bold transition-all ${
                                isEditing ? "bg-green-500 text-white" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                            }`}
                        >
                            {isEditing ? "保存する" : "編集する"}
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* 名前 */}
                        <div>
                            <label className="text-sm font-bold text-gray-400 block mb-1">名前</label>
                            {isEditing ? (
                                <input 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                                    value={profile.name}
                                    onChange={e => setProfile({...profile, name: e.target.value})}
                                />
                            ) : (
                                <p className="text-lg font-medium text-gray-700">{profile.name}</p>
                            )}
                        </div>

                        {/* 自己紹介 */}
                        <div>
                            <label className="text-sm font-bold text-gray-400 block mb-1">自己紹介</label>
                            {isEditing ? (
                                <textarea 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 h-24"
                                    value={profile.bio}
                                    onChange={e => setProfile({...profile, bio: e.target.value})}
                                />
                            ) : (
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{profile.bio || "未設定"}</p>
                            )}
                        </div>

                        {/* 得意メニュー（チェックボックス形式） */}
                        <div>
                            <label className="text-sm font-bold text-gray-400 block mb-2">得意メニュー</label>
                            <div className="flex flex-wrap gap-2">
                                {specialtyOptions.map(option => {
                                    const isChecked = profile.specialty?.includes(option);
                                    return (
                                        <button
                                            key={option}
                                            disabled={!isEditing}
                                            onClick={() => toggleSpecialty(option)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                                                isChecked 
                                                    ? "bg-indigo-500 border-indigo-500 text-white" 
                                                    : "bg-white border-gray-200 text-gray-500"
                                            } ${!isEditing && "cursor-default opacity-80"}`}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* お気に入りサロン */}
                <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">お気に入りサロン</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {favoriteSalons.length > 0 ? (
                            favoriteSalons.map(salon => (
                                <Link key={salon.id} href={`/salon/${salon.id}`}>
                                    <div className="flex items-center p-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors group">
                                        <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                                            {salon.images?.[0] && (
                                                <img src={'@/public' + salon.images[0]} alt={salon.name} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-bold text-gray-700 group-hover:text-indigo-500 transition-colors">{salon.name}</p>
                                            <p className="text-xs text-gray-400">詳細を見る →</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm">お気に入りのサロンはまだありません。</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}