// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Dropdown } from '@/components/Dropdown';
import { SearchBar } from '@/components/SearchBar';
import { ActionButton } from '@/components/ActionButton';
import { SalonCard } from '@/components/SalonCard';
import { AREAS, MENUS, MOCK_SALONS } from '@/constants/data';
import {MessageCircle} from 'lucide-react';

export default function Home() {
  const [areaOpen, setAreaOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = () => {
      setAreaOpen(false);
      setMenuOpen(false);
    };

    if (areaOpen || menuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [areaOpen, menuOpen]);

  const toggleSelection = (
    item: string, 
    selected: string[], 
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelected(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleDropdownChange = (type: 'area' | 'menu', open: boolean) => {
    if (type === 'area') {
      setAreaOpen(open);
      if (open) setMenuOpen(false);
    } else {
      setMenuOpen(open);
      if (open) setAreaOpen(false);
    }
  };

  const handleSalonVisit = () => {
    console.log('サロン見学ページへ遷移');
    // Router.push('/salon-visit') など
  };

  const handleIntern = () => {
    console.log('インターンページへ遷移');
    // Router.push('/intern') など
  };

  const handleVisit = (salonId: number) => {
    console.log(`サロンID ${salonId} の見学予約`);
    // モーダルを開く or 詳細ページへ遷移
  };

  const handleConsult = (salonId: number) => {
    console.log(`サロンID ${salonId} の相談`);
    // 相談フォームモーダルを開く
  };

  // フィルタリングロジック
  const filteredSalons = MOCK_SALONS.filter(salon => {
    // エリアフィルター
    if (selectedAreas.length > 0 && !selectedAreas.includes(salon.location)) {
      return false;
    }
    
    // メニューフィルター
    if (selectedMenus.length > 0) {
      const hasMenu = salon.tags.some(tag => selectedMenus.includes(tag));
      if (!hasMenu) return false;
    }
    
    // 検索クエリフィルター
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return salon.name.toLowerCase().includes(query) || salon.location.toLowerCase().includes(query);
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-indigo-100">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Header />
      </div>

      {/* Search Filters */}
      <div className="sticky top-[88px] z-40">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {/* Area and Menu Dropdowns */}
          <div className="grid grid-cols-2 gap-4" onClick={(e) => e.stopPropagation()}>
            <Dropdown
              label="エリア"
              options={AREAS}
              selected={selectedAreas}
              onToggle={(area) => toggleSelection(area, selectedAreas, setSelectedAreas)}
              isOpen={areaOpen}
              onOpenChange={(open) => handleDropdownChange('area', open)}
            />
            
            <Dropdown
              label="メニュー"
              options={MENUS}
              selected={selectedMenus}
              onToggle={(menu) => toggleSelection(menu, selectedMenus, setSelectedMenus)}
              isOpen={menuOpen}
              onOpenChange={(open) => handleDropdownChange('menu', open)}
            />
          </div>

          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="見学したい店舗名で検索..."
          />

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <ActionButton onClick={handleSalonVisit}>
              サロン見学
            </ActionButton>
            <ActionButton onClick={handleIntern}>
              インターン
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Salon Cards */}
      <div className="max-w-2xl mx-auto px-4 space-y-6 pb-8">
        {filteredSalons.length > 0 ? (
          filteredSalons.map((salon) => (
            <SalonCard 
              key={salon.id} 
              salon={salon} 
              onVisit={handleVisit}
              onConsult={handleConsult}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              条件に合うサロンが見つかりませんでした
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => handleConsult(0)}
        className="fixed bottom-6 right-6 bg-indigo-400 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-500 transition flex items-center gap-2 text-sm font-medium z-50"
      >
        マッチするサロンを相談
        <MessageCircle className="w-5 h-5" />
      </button>
    </div>
  );
}