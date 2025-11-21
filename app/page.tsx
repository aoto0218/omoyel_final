'use client';

import { useState, useEffect, useMemo } from 'react';

import { Header } from '@/components/Header';

import SearchBar from '@/components/filter/SearchBar';
import SalonCard from '@/components/filter/SalonCard';
import { FilterModal } from '@/components/filter/FilterModal';

import { AREAS } from '@/constants/data';

import { getSalonData } from '@/lib/supabase_client';

import { Salon } from '@/types/salon';

import { Filter, List, MapPin as MapIcon } from 'lucide-react';

//map系
import Mapmain from '@/components/mapcomponents/mapmain';
//map系

export default function Home() {
  // フィルターモーダル表示管理
  const [showFilterModal, setShowFilterModal] = useState(false);
  // 表示形式管理
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  // サロンデータ管理
  const [allSalons,setAllSalons] = useState<Salon[]>([]);
  // サロンデータ読み込み時管理
  const [isLoading,setIsLoading] = useState(true);
  // 検索バーフィルタリング用
  const [searchQuery,setSearchQuery] = useState('');
  // エリアフィルタリング用
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  // メニューフィルタリング用
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);

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

  // サロンデータ取得
  useEffect(()=>{
    async function fetchData(){
      setIsLoading(true);
      const {salonData} =await getSalonData();
      if (salonData){
        setAllSalons(salonData as Salon[]);
      }
      setIsLoading(false);
    }
    fetchData();
  },[]);

  // フィルタリングロジック
  const filteredSalons = useMemo(() => {
    let results = allSalons;

    if (searchQuery){
      const lowerQuery = searchQuery.toLowerCase();
      results=results.filter(salons =>
        salons.name.toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedAreas.length > 0){
      results = results.filter(salon => salon.location && selectedAreas.includes(salon.location));
    }

    if(selectedMenus.length > 0){
      results = results.filter(salon => {
        const hasMenu = salon.tags.some((tag: string) => selectedMenus.includes(tag));
        return hasMenu;
      });
    }

    
    return results;
  },[allSalons,searchQuery,selectedAreas,selectedMenus]);


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
          isLoading ? (
            <div className="p-8">サロン情報を読み込み中</div>
          ) : (
            <SalonCard
              salons={filteredSalons}
            />
          )
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center">
            {/* <MapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" /> */}
            {/* <p className="text-gray-500">マップ表示は準備中です</p> */}

            <Mapmain />

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

          // ここにonClickハンドラを追加
          className="fixed bottom-6 right-6 bg-indigo-400 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-500 transition flex items-center gap-2 text-sm font-medium z-50"
        >
          マッチするサロンをAIに相談
          <span className="text-xs">💬</span>
        </button>
      )}
    </div>
  );
}