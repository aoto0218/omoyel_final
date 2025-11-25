'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getSalonData, getCompanyData } from '@/lib/supabase_client';
import { Salon, Company } from '@/types/salon';
import SalonBasicInfo from '@/components/info/SalonBasicInfo';
import SalonInfo from '@/components/info/SalonInfo';
import CompanyBasicInfo from '@/components/info/CompanyBasicInfo';
import CompanySalary from '@/components/info/CompanySalary';
import CompanyBenefits from '@/components/info/CompanyBenefits';
import CompanyLesson from '@/components/info/CompanyLesson';

type TabType = 'basic' | 'salon' | 'company' | 'salary' | 'benefits' | 'lesson';

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const salonId = Number(params.id);

    const [salon, setSalon] = useState<Salon | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('basic');

    useEffect(() => {
        const fetchSalon = async () => {
            setIsLoading(true);
            const salondata = await getSalonData();
            const companydata = await getCompanyData();

            const foundSalon = salondata.salonData?.find((s: Salon) => s.id === salonId) || null;
            setSalon(foundSalon);

            if (foundSalon) {
                setCompany(companydata.companyData?.find((c: Company) => c.id === foundSalon?.company_id) || null);
            }

            setIsLoading(false);
        };

        fetchSalon();
    }, [salonId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-500">読み込み中</p>
            </div>
        );
    }

    if (!salon) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">サロンが見つかりません</h1>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-indigo-400 text-white rounded-full hover:bg-indigo-500 transition"
                    >
                        トップページに戻る
                    </button>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'basic' as TabType, label: '見学詳細' },
        { id: 'salon' as TabType, label: 'サロンの特徴' },
        { id: 'company' as TabType, label: '企業情報' },
        { id: 'salary' as TabType, label: '給与・待遇' },
        { id: 'benefits' as TabType, label: '福利厚生・休暇' },
        { id: 'lesson' as TabType, label: '働き方・教育' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200">
                {/* Back Button */}
                <div className="px-4 py-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-1 text-indigo-500 hover:text-indigo-600 transition text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        戻る
                    </button>
                </div>

                {/* Salon Name - 中央揃え */}
                <div className="px-4 pb-4 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                        {salon.name}
                    </h1>
                </div>

                {/* Tabs - 中央揃え */}
                <div className="border-t border-gray-200">
                    <div className="flex overflow-x-auto scrollbar-hide justify-center">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content with top padding to account for fixed header */}
            <div className="pt-[180px] pb-32">
                <div className="max-w-3xl mx-auto px-4">
                    {activeTab === 'basic' && <SalonBasicInfo salon={salon} />}
                    {activeTab === 'salon' && <SalonInfo salon={salon} />}
                    {activeTab === 'company' && company && <CompanyBasicInfo company={company} />}
                    {activeTab === 'salary' && company && <CompanySalary company={company} />}
                    {activeTab === 'benefits' && company && <CompanyBenefits company={company} />}
                    {activeTab === 'lesson' && company && <CompanyLesson company={company} />}
                </div>
            </div>

            {/* Fixed Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-50">
                <div className="max-w-3xl mx-auto">
                    <button className="w-full px-8 py-4 bg-indigo-400 text-white font-medium rounded-full hover:bg-indigo-500 transition">
                        サロン見学に申し込む
                    </button>
                </div>
            </div>
        </div>
    );
}