"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase_client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ChevronLeft, X, Sparkles, Heart, Trash2, AlertTriangle } from "lucide-react";

export default function MyPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [originalProfile, setOriginalProfile] = useState<any>(null);
    const [favoriteSalons, setFavoriteSalons] = useState<any[]>([]);

    const specialtyGroups = [
        {
            category: "カラー",
            options: ["ワンカラー", "ダブルカラー", "ハイライト", "ローライト", "グラデーション", "インナーカラー", "寒色系", "暖色系"]
        },
        {
            category: "カット",
            options: ["ベリーショート", "ショート", "ボブ", "ミディアム", "ロング"]
        },
        {
            category: "髪質改善",
            options: ["縮毛矯正", "トリートメント"]
        },
        {
            category: "パーマ",
            options: ["ボディーパーマ", "ニュアンスパーマ", "スパイラルパーマ", "ツイストパーマ", "ツイストスパイラルパーマ", "波巻きパーマ"]
        },
        {
            category: "まつげ・ブロウ",
            options: ["まつげパーマ", "まつげエクステ", "アイブロウ"]
        },
        {
            category: "ネイル",
            options: ["ジェルネイル", "ネイルアート", "フットネイル"]
        },
        {
            category: "エステ",
            options: ["フェイシャル", "ボディ", "リラクゼーション", "脱毛"]
        },
        {
            category: "その他",
            options: ["ヘアメイク", "メンズ特化", "ナチュラル", "着付け", "なんでも"]
        }
    ];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push("/login");
            return;
        }

        const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        setProfile(profileData);
        setOriginalProfile(profileData);

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

        if (!error) {
            setOriginalProfile(profile);
            setIsEditing(false);
        }
        setLoading(false);
    };

    const handleCancel = () => {
        setProfile(originalProfile);
        setIsEditing(false);
    };

    const toggleSpecialty = (item: string) => {
        const current = profile.specialty || [];
        const next = current.includes(item)
            ? current.filter((s: string) => s !== item)
            : [...current, item];
        setProfile({ ...profile, specialty: next });
    };

    const handleRemoveFavorite = async (e: React.MouseEvent, salonId: number, salonName: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (!window.confirm(`「${salonName}」をお気に入りから削除しますか？`)) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !profile) return;

        const newFavorites = (profile.favorite || []).filter((id: number) => id !== salonId);

        const { error } = await supabase
            .from("profiles")
            .update({ favorite: newFavorites })
            .eq("id", user.id);

        if (!error) {
            setProfile({ ...profile, favorite: newFavorites });
            setFavoriteSalons(prev => prev.filter(s => s.id !== salonId));
        }
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error: profileError } = await supabase
                .from("profiles")
                .delete()
                .eq("id", user.id);

            if (profileError) throw profileError;

            await supabase.auth.signOut();
            window.location.href = "/";
        } catch (error: any) {
            console.error(error);
            alert("エラーが発生しました: " + error.message);
            setShowDeleteModal(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-indigo-100">
                <Header />
                <div className="max-w-2xl mx-auto space-y-6 mt-5 px-4 animate-pulse">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100">
                            <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
                            <div className="h-20 bg-gray-100 rounded-xl w-full" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-indigo-100 pb-20">
            <Header />
            <div className="max-w-2xl mx-auto space-y-6 mt-5 px-4">

                {/* 1. プロフィールカード */}
                <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <Link
                            href="/"
                            className="p-2 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-gray-600 shadow-sm transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <h2 className="text-xl font-bold text-gray-800">プロフィール</h2>
                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <button onClick={handleCancel} className="px-4 py-2 rounded-full font-bold text-sm bg-gray-100 text-gray-600 active:scale-95 transition-all">
                                        戻す
                                    </button>
                                    <button onClick={handleSave} className="px-5 py-2 rounded-full font-bold text-sm bg-green-500 text-white active:scale-95 transition-all shadow-md">
                                        保存
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="px-5 py-2 rounded-full font-bold text-sm bg-indigo-50 text-indigo-600 active:scale-95 transition-all">
                                    編集
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest block mb-2 ml-1">名前</label>
                            {isEditing ? (
                                <input
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700 transition-all shadow-inner"
                                    value={profile.name}
                                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                                />
                            ) : (
                                <p className="text-lg font-bold text-gray-800 ml-1">{profile.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest block mb-2 ml-1">自己紹介</label>
                            {isEditing ? (
                                <textarea
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-400 h-32 text-gray-700 resize-none transition-all shadow-inner"
                                    value={profile.bio}
                                    onChange={e => setProfile({ ...profile, bio: e.target.value })}
                                />
                            ) : (
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap ml-1 text-sm">{profile.bio || "未設定"}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest block mb-4 ml-1">得意メニュー</label>
                            <div className="space-y-6">
                                {specialtyGroups.map((group) => {
                                    const selectedInGroup = profile.specialty?.filter((item: string) =>
                                        group.options.includes(item)
                                    );
                                    if (!isEditing && (!selectedInGroup || selectedInGroup.length === 0)) return null;

                                    return (
                                        <div key={group.category} className="space-y-3">
                                            <p className="text-[11px] font-bold text-indigo-300 uppercase ml-1 tracking-tighter">{group.category}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {isEditing ? (
                                                    group.options.map(option => {
                                                        const isChecked = profile.specialty?.includes(option);
                                                        return (
                                                            <button
                                                                key={option}
                                                                onClick={() => toggleSpecialty(option)}
                                                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${isChecked
                                                                    ? "bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-100"
                                                                    : "bg-white border-gray-200 text-gray-400"
                                                                    }`}
                                                            >
                                                                {option}
                                                            </button>
                                                        );
                                                    })
                                                ) : (
                                                    selectedInGroup.map((option: string) => (
                                                        <span key={option} className="px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                                                            {option}
                                                        </span>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {!isEditing && (
                                <Link
                                    href="/mypage/chat"
                                    className="mt-8 flex items-center justify-between gap-3 px-5 py-4 bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 rounded-2xl group active:scale-[0.98] transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-indigo-500 text-white p-2 rounded-xl shadow-md">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-indigo-700 tracking-tight">AIチャットで得意メニューを見つける</span>
                                    </div>
                                    <ChevronLeft className="w-4 h-4 text-indigo-300 rotate-180" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. お気に入りサロンセクション */}
                <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">お気に入りサロン</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {favoriteSalons.length > 0 ? (
                            favoriteSalons.map(salon => (
                                <div key={salon.id} className="relative overflow-visible">
                                    <Link href={`/salon/${salon.id}`}>
                                        <div className="flex items-center p-3 bg-white border border-gray-100 rounded-2xl active:bg-gray-50 transition-colors shadow-sm">
                                            <div className="relative w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                                {salon.images && (typeof salon.images === 'string' ? JSON.parse(salon.images) : salon.images).image1 ? (
                                                    <Image
                                                        src={(typeof salon.images === 'string' ? JSON.parse(salon.images) : salon.images).image1}
                                                        alt={salon.name}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <Heart className="w-6 h-6 opacity-20" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4 pr-10">
                                                <p className="font-bold text-gray-700 text-sm line-clamp-1">{salon.name}</p>
                                                <p className="text-[10px] text-gray-400 mt-1">詳細を見る</p>
                                            </div>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={(e) => handleRemoveFavorite(e, salon.id, salon.name)}
                                        className="absolute -top-2 -right-2 p-2 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-red-500 active:scale-110 transition-all shadow-md z-10"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                <p className="text-gray-400 text-sm">お気に入りはまだありません</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. 設定・退会カード（ここを別カードに分離しました） */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-4 h-4 text-gray-300" />
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">アカウント</h2>
                    </div>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full py-4 rounded-2xl border border-red-50 text-red-400 text-sm font-bold hover:bg-red-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                    >
                        <Trash2 className="w-4 h-4 text-red-300 group-hover:text-red-400 transition-colors" />
                        アカウント削除
                    </button>
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
                    <div className="relative bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">本当にアカウントを削除しますか？</h3>
                            <p className="text-sm text-gray-500 leading-relaxed mb-8">
                                この操作は取り消せません。<br />
                                お気に入りやプロフィールなどの<br />
                                すべてのデータが削除されます。
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={handleDeleteAccount}
                                    className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold text-sm active:scale-95 transition-all shadow-lg shadow-red-200"
                                >
                                    アカウントを削除する
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm active:scale-95 transition-all"
                                >
                                    キャンセル
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}