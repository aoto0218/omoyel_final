'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Mapmain, { ChildHandle } from "@/components/mapcomponents/mapmain";

import { Header } from '@/components/Header';

import SearchBar from '@/components/filter/SearchBar';
import SalonCard from '@/components/filter/SalonCard';
import { FilterModal } from '@/components/filter/FilterModal';

import { getSalonDataWithRatings } from '@/lib/supabase_client';

import { Salon } from '@/types/salon';

import { Filter, List, MapPin as MapIcon } from 'lucide-react';
import Link from 'next/link';

// 型定義を追加
type RatingFilter = {
  category: 'overall' | 'rating_1' | 'rating_2' | 'rating_3' | 'rating_4' | 'rating_5';
  minRating: number;
};

const AREAS = [
  '北海道', '茨城県', '栃木県', '埼玉県', '千葉県',
  '東京都', '神奈川県', '岐阜県', '愛知県', '京都府',
  '大阪府', '兵庫県', '奈良県', '和歌山県', '岡山県',
  '広島県', '愛媛県', '高知県', '福岡県', '海外'
];

export default function Home() {
  // フィルターモーダル表示管理
  const [showFilterModal, setShowFilterModal] = useState(false);
  // 表示形式管理
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  // サロンデータ管理
  const [allSalons, setAllSalons] = useState<Salon[]>([]);
  // サロンデータ読み込み時管理
  const [isLoading, setIsLoading] = useState(true);
  // 検索バーフィルタリング用
  const [searchQuery, setSearchQuery] = useState('');
  // エリアフィルタリング用
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  // メニューフィルタリング用
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  // 評価フィルタリング用
  const [ratingFilters, setRatingFilters] = useState<RatingFilter[]>([]);

  const childRef = useRef<ChildHandle>(null);

  // フィルターが適用されているかチェック（新規追加）
  const hasActiveFilters = useMemo(() => {
    return selectedAreas.length > 0 ||
      selectedMenus.length > 0 ||
      ratingFilters.length > 0;
  }, [selectedAreas, selectedMenus, ratingFilters]);

  // モーダル展開時BGスクロール防止
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

  // サロンデータ取得（評価データ付き）
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const { salonData } = await getSalonDataWithRatings();
      if (salonData) {
        setAllSalons(salonData as Salon[]);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  // 評価フィルターのハンドラ
  const handleRatingFilterChange = (
    category: RatingFilter['category'],
    minRating: number
  ) => {
    setRatingFilters(prev => {
      // 0の場合はフィルターを削除
      if (minRating === 0) {
        return prev.filter(f => f.category !== category);
      }

      // 既存の同じカテゴリのフィルターを更新または追加
      const existingIndex = prev.findIndex(f => f.category === category);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { category, minRating };
        return updated;
      }
      return [...prev, { category, minRating }];
    });
  };

  // フィルタリングロジック
  const filteredSalons = useMemo(() => {
    let results = allSalons;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      results = results.filter(salons =>
        salons.name.toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedAreas.length > 0) {
      results = results.filter(salon => salon.location && selectedAreas.includes(salon.location));
    }

    if (selectedMenus.length > 0) {
      results = results.filter(salon => {
        const hasMenu = salon.tags.some((tag: string) => selectedMenus.includes(tag));
        return hasMenu;
      });
    }

    // 評価フィルター
    if (ratingFilters.length > 0) {
      results = results.filter(salon => {
        // averageRatingsがnullまたは未定義の場合は除外
        if (!salon.averageRatings) return false;

        // すべての評価フィルター条件を満たすかチェック
        return ratingFilters.every(filter => {
          const rating = salon.averageRatings![filter.category];
          return rating >= filter.minRating;
        });
      });
    }

    return results;
  }, [allSalons, searchQuery, selectedAreas, selectedMenus, ratingFilters]);

  // フィルターモーダル関連のハンドラ
  const toggleMenuSelection = (item: string) => {
    setSelectedMenus(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleAreaChange = (area: string) => {
    setSelectedAreas(area ? [area] : []);
  };

  const applyFilters = () => {
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setSelectedAreas([]);
    setSelectedMenus([]);
    setRatingFilters([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-indigo-100">
      <Header />

      {/* 検索バー、フィルターボタン部 */}
      <div className="sticky top-0 z-40 pb-4">
        <div className="max-w-2xl mx-auto px-4 pt-4 space-y-3">
          <div className="flex gap-3">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <button
              onClick={() => setShowFilterModal(true)}
              className={`px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition flex items-center gap-2 relative ${hasActiveFilters
                  ? 'bg-indigo-400 text-white border-2 border-indigo-500'
                  : 'bg-white text-gray-700 border border-gray-200'
                }`}
            >
              <Filter className="w-5 h-5" />
              <span className="font-medium">絞り込み</span>
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {selectedAreas.length + selectedMenus.length + ratingFilters.length}
                </span>
              )}
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
              onClick={() => {
                setViewMode('map');
                setTimeout(() => {
                  childRef.current?.initMapFromParent();
                }, 0);
              }}
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
          isLoading ? (
            <div className="p-8">サロン情報を読み込み中</div>
          ) : (
            <SalonCard salons={filteredSalons} />
          )
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center">
            <div style={{ display: viewMode === "map" ? "block" : "none" }}>
              <Mapmain salons={filteredSalons} ref={childRef} />
            </div>
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
        ratingFilters={ratingFilters}
        onRatingFilterChange={handleRatingFilterChange}
      />

      {/* 相談ボタン部 */}
      {!showFilterModal && (
        <Link href="/ai" className="fixed bottom-6 right-6 bg-indigo-400 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-500 transition flex items-center gap-2 text-sm font-medium z-50">
          マッチするサロンをAIに相談
          <span className="text-xs">💬</span>
        </Link>
      )}
    </div>
  );
}