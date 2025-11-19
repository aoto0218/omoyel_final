// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { SalonCard } from '@/components/SalonCard';
import { AREAS, MENUS, MOCK_SALONS } from '@/constants/data';
import { Search, Filter, List, MapPin as MapIcon, ArrowLeft } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // モーダル展開時、バックのスクロール防止
  useEffect(() => {
    if (showFilterModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [showFilterModal]);

  const toggleSelection = (
    item: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleSalonVisit = (salonId: number) => {
    router.push(`/salon/${salonId}`);
  };

  const handleConsult = (salonId: number) => {
    console.log(`サロンID ${salonId} の相談`);
  };

  const applyFilters = () => {
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setSelectedAreas([]);
    setSelectedMenus([]);
  };

  // フィルタリング部
  const filteredSalons = MOCK_SALONS.filter(salon => {
    if (selectedAreas.length > 0 && !selectedAreas.includes(salon.location)) {
      return false;
    }

    if (selectedMenus.length > 0) {
      const hasMenu = salon.tags.some(tag => selectedMenus.includes(tag));
      if (!hasMenu) return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return salon.name.toLowerCase().includes(query) ||
        salon.location.toLowerCase().includes(query);
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-indigo-100">
      <Header />

      {/* 検索バー、フィルターボタン部 */}
      <div className="sticky top-0 z-40 pb-4">
        <div className="max-w-2xl mx-auto px-4 pt-4 space-y-3">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="店舗名で検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white rounded-lg pl-12 pr-4 py-3 text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 border border-gray-200"
              />
            </div>
            <button
              onClick={() => setShowFilterModal(true)}
              className="px-6 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-200 flex items-center gap-2"
            >
              <Filter className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700 font-medium">絞り込み</span>
            </button>
          </div>

          {/* 表示形式選択部 */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setViewMode('list')}
              className={`py-3 rounded-lg font-medium transition ${viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-md border-2 border-indigo-400'
                : 'bg-white text-gray-600 shadow-sm border border-gray-200'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <List className="w-5 h-5" />
                リスト
              </div>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`py-3 rounded-lg font-medium transition ${viewMode === 'map'
                ? 'bg-white text-gray-900 shadow-md border-2 border-indigo-400'
                : 'bg-white text-gray-600 shadow-sm border border-gray-200'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <MapIcon className="w-5 h-5" />
                マップ
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* サロンカード部 */}
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6 pb-8">
        {viewMode === 'list' ? (
          filteredSalons.length > 0 ? (
            filteredSalons.map((salon) => (
              <SalonCard
                key={salon.id}
                salon={salon}
                onVisit={handleSalonVisit}
                onConsult={handleConsult}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                条件に合うサロンが見つかりませんでした
              </p>
            </div>
          )
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center">
            <MapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">マップ表示は準備中です</p>
          </div>
        )}
      </div>

      {/* フィルターモーダル部 */}
      {showFilterModal && (
        <div
          className="fixed inset-0 bg-white bg-opacity-50 z-50 flex items-end justify-center"
          onClick={() => setShowFilterModal(false)}
        >
          <div
            className="bg-white w-full max-w-2xl h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* モーダルヘッダー */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">戻る</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="店舗名で検索"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white rounded-lg pl-12 pr-4 py-3 text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 border border-gray-200"
                  />
                </div>
                <div className="relative">
                  <select
                    value={selectedAreas[0] || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedAreas(value ? [value] : []);
                    }}
                    className="appearance-none bg-white rounded-lg px-4 py-3 pr-10 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 border border-gray-200 cursor-pointer"
                  >
                    <option value="">エリア</option>
                    {AREAS.map((area) => (
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

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <h3 className="text-base font-bold text-gray-900">カラー</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['ワンカラー', 'ダブルカラー', '寒色系', '暖色系'].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMenus.includes(item)}
                        onChange={() => toggleSelection(item, selectedMenus, setSelectedMenus)}
                        className="w-5 h-5 text-indigo-400 rounded border-gray-300 focus:ring-indigo-400"
                      />
                      <span className="text-gray-800 text-sm">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <h3 className="text-base font-bold text-gray-900">カット</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['ロング', 'ボブ'].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMenus.includes(item)}
                        onChange={() => toggleSelection(item, selectedMenus, setSelectedMenus)}
                        className="w-5 h-5 text-indigo-400 rounded border-gray-300 focus:ring-indigo-400"
                      />
                      <span className="text-gray-800 text-sm">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <h3 className="text-base font-bold text-gray-900">髪質改善</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['縮毛矯正', 'トリートメント'].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMenus.includes(item)}
                        onChange={() => toggleSelection(item, selectedMenus, setSelectedMenus)}
                        className="w-5 h-5 text-indigo-400 rounded border-gray-300 focus:ring-indigo-400"
                      />
                      <span className="text-gray-800 text-sm">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <h3 className="text-base font-bold text-gray-900">その他</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['パーマ', 'ヘアメイク', 'メンズ特化', 'ナチュラル', 'まつげ・ブロウ', 'ネイル', '特殊ヘア', 'なんでも'].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMenus.includes(item)}
                        onChange={() => toggleSelection(item, selectedMenus, setSelectedMenus)}
                        className="w-5 h-5 text-indigo-400 rounded border-gray-300 focus:ring-indigo-400"
                      />
                      <span className="text-gray-800 text-sm">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={clearFilters}
                className="w-full px-6 py-4 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition text-lg"
              >
                クリア
              </button>
              <button
                onClick={applyFilters}
                className="w-full px-6 py-4 bg-amber-300 text-gray-900 font-bold rounded-xl hover:bg-amber-400 transition text-lg"
              >
                決定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 相談ボタン部 */}
      {!showFilterModal && (
        <button
          onClick={() => handleConsult(0)}
          className="fixed bottom-6 right-6 bg-indigo-400 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-500 transition flex items-center gap-2 text-sm font-medium z-50"
        >
          マッチするサロンをAIに相談
          <span className="text-xs">💬</span>
        </button>
      )}
    </div>
  );
}