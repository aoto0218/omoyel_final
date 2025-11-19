'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { SalonList } from '@/components/SalonList';
import { FilterModal } from '@/components/FilterModal';
import { AREAS } from '@/constants/data';
import { MOCK_SALONS } from '@/constants/salondata';
import { Search, Filter, List, MapPin as MapIcon } from 'lucide-react';

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

  const toggleMenuSelection = (item: string) => {
    setSelectedMenus(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleAreaChange = (area: string) => {
    setSelectedAreas(area ? [area] : []);
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

  // フィルタリングロジック
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

      {/* サロン表示部 */}
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-8">
        {viewMode === 'list' ? (
          <SalonList
            salons={filteredSalons}
            onVisit={handleSalonVisit}
            onConsult={handleConsult}
          />
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center">
            <MapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">マップ表示は準備中です</p>
          </div>
        )}
      </div>

      {/* フィルターモーダル */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedAreas={selectedAreas}
        onAreaChange={handleAreaChange}
        selectedMenus={selectedMenus}
        onMenuToggle={toggleMenuSelection}
        areas={AREAS}
        onClear={clearFilters}
        onApply={applyFilters}
      />

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