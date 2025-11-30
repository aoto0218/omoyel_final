'use client';

import React from 'react';
import { Search, ArrowLeft, Star } from 'lucide-react';

type RatingFilter = {
    category: 'overall' | 'rating_1' | 'rating_2' | 'rating_3' | 'rating_4' | 'rating_5';
    minRating: number;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedAreas: string[];
    onAreaChange: (area: string) => void;
    selectedMenus: string[];
    onMenuToggle: (menu: string) => void;
    areas: string[];
    onClear: () => void;
    onApply: () => void;
    // 評価フィルター用の新しいprops
    ratingFilters: RatingFilter[];
    onRatingFilterChange: (category: RatingFilter['category'], minRating: number) => void;
    matchedCount: number; 
}

// 評価カテゴリの定義
const RATING_CATEGORIES = [
    { id: 'overall' as const, label: '総評価' },
    { id: 'rating_1' as const, label: 'スタッフの対応' },
    { id: 'rating_2' as const, label: '店舗の雰囲気' },
    { id: 'rating_3' as const, label: '店舗の設備' },
    { id: 'rating_4' as const, label: '店舗へのアクセス' },
    { id: 'rating_5' as const, label: '期待していた体験' }
];

export const FilterModal: React.FC<Props> = ({
    isOpen,
    onClose,
    searchQuery,
    onSearchChange,
    selectedAreas,
    onAreaChange,
    selectedMenus,
    onMenuToggle,
    areas,
    onClear,
    onApply,
    ratingFilters,
    onRatingFilterChange,
    matchedCount, 
}) => {
    if (!isOpen) return null;

    // 特定カテゴリの現在の最低評価を取得
    const getCurrentMinRating = (category: RatingFilter['category']): number => {
        const filter = ratingFilters.find(f => f.category === category);
        return filter ? filter.minRating : 0;
    };

    // スライダーの変更ハンドラ
    const handleSliderChange = (category: RatingFilter['category'], value: number) => {
        onRatingFilterChange(category, value);
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 z-50 flex items-end justify-center">
            <div className="bg-white w-full max-w-2xl h-full overflow-y-auto">
                {/* ヘッダー */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">戻る</span>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* 検索バーとエリア選択 */}
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="店舗名で検索"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full bg-white rounded-lg pl-12 pr-4 py-3 text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 border border-gray-200"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={selectedAreas[0] || ''}
                                onChange={(e) => onAreaChange(e.target.value)}
                                className="appearance-none bg-white rounded-lg px-4 py-3 pr-10 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 border border-gray-200 cursor-pointer"
                            >
                                <option value="">エリア</option>
                                {areas.map((area) => (
                                    <option key={area} value={area}>
                                        {area}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* カラー */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                            <h3 className="text-base font-bold text-gray-900">カラー</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {['ワンカラー', 'ダブルカラー', 'ハイライト', 'ローライト', 'グラデーションカラー', 'インナーカラー', '寒色系', '暖色系'].map((item) => (
                                <label key={item} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedMenus.includes(item)}
                                        onChange={() => onMenuToggle(item)}
                                        className="w-5 h-5 text-indigo-400 rounded border-gray-300 focus:ring-indigo-400"
                                    />
                                    <span className="text-gray-800 text-sm">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* カット */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                            <h3 className="text-base font-bold text-gray-900">カット</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {['ベリーショート', 'ショート', 'ボブ', 'ミディアム', 'ロング'].map((item) => (
                                <label key={item} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedMenus.includes(item)}
                                        onChange={() => onMenuToggle(item)}
                                        className="w-5 h-5 text-indigo-400 rounded border-gray-300 focus:ring-indigo-400"
                                    />
                                    <span className="text-gray-800 text-sm">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* 髪質改善 */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                            <h3 className="text-base font-bold text-gray-900">髪質改善</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {['縮毛矯正', 'トリートメント'].map((item) => (
                                <label key={item} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedMenus.includes(item)}
                                        onChange={() => onMenuToggle(item)}
                                        className="w-5 h-5 text-indigo-400 rounded border-gray-300 focus:ring-indigo-400"
                                    />
                                    <span className="text-gray-800 text-sm">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* パーマ */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                            <h3 className="text-base font-bold text-gray-900">パーマ</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {['ボディーパーマ', 'ニュアンスパーマ', 'スパイラルパーマ', 'ツイストパーマ', 'ツイストスパイラルパーマ', '波巻きパーマ'].map((item) => (
                                <label key={item} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedMenus.includes(item)}
                                        onChange={() => onMenuToggle(item)}
                                        className="w-5 h-5 text-indigo-400 rounded border-gray-300 focus:ring-indigo-400"
                                    />
                                    <span className="text-gray-800 text-sm">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* まつげ・ブロウ */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                            <h3 className="text-base font-bold text-gray-900">まつげ・ブロウ</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {['まつげパーマ', 'まつげエクステ', 'アイブロウ'].map((item) => (
                                <label key={item} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedMenus.includes(item)}
                                        onChange={() => onMenuToggle(item)}
                                        className="w-5 h-5 text-indigo-400 rounded border-gray-300 focus:ring-indigo-400"
                                    />
                                    <span className="text-gray-800 text-sm">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* 特殊ヘア */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                            <h3 className="text-base font-bold text-gray-900">特殊ヘア</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {['編み込み・ブレイズ', 'ドレッド', 'アフロ', 'バリアート'].map((item) => (
                                <label key={item} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedMenus.includes(item)}
                                        onChange={() => onMenuToggle(item)}
                                        className="w-5 h-5 text-indigo-400 rounded border-gray-300 focus:ring-indigo-400"
                                    />
                                    <span className="text-gray-800 text-sm">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* ネイル */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                            <h3 className="text-base font-bold text-gray-900">ネイル</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {['ジェルネイル', 'ネイルアート', 'フットネイル'].map((item) => (
                                <label key={item} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedMenus.includes(item)}
                                        onChange={() => onMenuToggle(item)}
                                        className="w-5 h-5 text-indigo-400 rounded border-gray-300 focus:ring-indigo-400"
                                    />
                                    <span className="text-gray-800 text-sm">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* エステ */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                            <h3 className="text-base font-bold text-gray-900">エステ</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {['フェイシャル', 'ボディ', 'リラクゼーション', '脱毛'].map((item) => (
                                <label key={item} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedMenus.includes(item)}
                                        onChange={() => onMenuToggle(item)}
                                        className="w-5 h-5 text-indigo-400 rounded border-gray-300 focus:ring-indigo-400"
                                    />
                                    <span className="text-gray-800 text-sm">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* その他 */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                            <h3 className="text-base font-bold text-gray-900">その他</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {['ヘアメイク', 'メンズ特化', 'ナチュラル', '着付け', 'なんでも'].map((item) => (
                                <label key={item} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedMenus.includes(item)}
                                        onChange={() => onMenuToggle(item)}
                                        className="w-5 h-5 text-indigo-400 rounded border-gray-300 focus:ring-indigo-400"
                                    />
                                    <span className="text-gray-800 text-sm">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* 評価フィルター（新規追加） */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                            <h3 className="text-base font-bold text-gray-900 w-20">レビュー</h3>
                            <h2 className="text-sm text-gray-900">※レビューはユーザーが投稿したものでありあくまで参考情報です</h2>
                        </div>
                        <div className="space-y-3">
                            {RATING_CATEGORIES.map((category) => {
                                const currentRating = getCurrentMinRating(category.id);
                                const isActive = currentRating > 0;

                                return (
                                    <div key={category.id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                {category.label}
                                            </label>
                                            {isActive && (
                                                <span className="text-sm font-bold text-amber-600 flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                    {currentRating.toFixed(1)}以上
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="range"
                                                min="0"
                                                max="5"
                                                step="0.5"
                                                value={currentRating}
                                                onChange={(e) => handleSliderChange(category.id, parseFloat(e.target.value))}
                                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-400"
                                                style={{
                                                    background: isActive
                                                        ? `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${(currentRating / 5) * 100}%, #e5e7eb ${(currentRating / 5) * 100}%, #e5e7eb 100%)`
                                                        : '#e5e7eb'
                                                }}
                                            />
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 ${star <= currentRating
                                                            ? 'text-amber-400 fill-amber-400'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* フッターボタン */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
                    <button
                        onClick={onClear}
                        className="w-full px-6 py-4 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition text-lg"
                    >
                        クリア
                    </button>
                    <button
    onClick={onApply}
    className="w-full px-6 py-4 bg-amber-300 text-gray-900 font-bold rounded-xl hover:bg-amber-400 transition text-lg flex items-center justify-center gap-3"
>
    決定
    <span className="text-gray-700 text-lg font-bold">
        {matchedCount}件
    </span>
</button>

                </div>
            </div>
        </div>
    );
};