import { Company } from '@/types/salon';
import Link from 'next/link';

interface CompanyBasicInfoProps {
    company: Company;
}

export default function CompanyBasicInfo({ company }: CompanyBasicInfoProps) {
    return (
        <div className="space-y-6">
            {/* 基本情報 */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                    企業情報
                </h3>
                <div className="space-y-3">
                    {company.name && (
                        <div className="flex gap-3">
                            <span className="text-sm text-gray-500 min-w-[120px]">企業名</span>
                            <span className="text-sm text-gray-900">{company.name}</span>
                        </div>
                    )}
                    
                    {company.hr && company.hr.length > 0 && (
                        <div className="flex gap-3">
                            <span className="text-sm text-gray-500 min-w-[120px]">募集区分</span>
                            <div className="flex gap-2 flex-wrap">
                                {company.hr.map((hr, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-md border border-gray-300"
                                    >
                                        {hr}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {company.recruit && (
                        <div className="flex gap-3">
                            <span className="text-sm text-gray-500 min-w-[120px]">採用情報</span>
                            <Link
                                href={company.recruit.startsWith('http') ? company.recruit : '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
                            >
                                {company.recruit}
                            </Link>
                        </div>
                    )}
                    
                    {company.salons && (
                        <div className="flex gap-3">
                            <span className="text-sm text-gray-500 min-w-[120px]">店舗一覧</span>
                            <Link
                                href={company.salons.startsWith('http') ? company.salons : '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
                            >
                                {company.salons}
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* 体験・イベント情報 */}
            {(company.experience || company.provided || company.event) && (
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                        体験・イベント
                    </h3>
                    <div className="space-y-3">
                        {company.experience && company.experience.length > 0 && (
                            <div className="flex gap-3">
                                <span className="text-sm text-gray-500 min-w-[120px]">体験可能</span>
                                <div className="flex gap-2 flex-wrap">
                                    {company.experience.map((exp, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-md border border-gray-300"
                                        >
                                            {exp}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {company.provided && (
                            <div className="flex gap-3">
                                <span className="text-sm text-gray-500 min-w-[120px]">交通費支給</span>
                                <span className="text-sm text-gray-900 flex-1">{company.provided}</span>
                            </div>
                        )}
                        
                        {company.event && company.event.length > 0 && (
                            <div className="flex gap-3">
                                <span className="text-sm text-gray-500 min-w-[120px]">イベント</span>
                                <div className="flex gap-2 flex-wrap">
                                    {company.event.map((event, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-md border border-gray-300"
                                        >
                                            {event}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 企業特徴 */}
            {(company.expansion || company.appeal || company.point) && (
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                        企業の特徴
                    </h3>
                    <div className="space-y-4">
                        {company.expansion && (
                            <div>
                                <p className="text-sm text-gray-500 mb-1">店舗展開の仕方</p>
                                <p className="text-sm text-gray-900 whitespace-pre-line">{company.expansion}</p>
                            </div>
                        )}
                        
                        {company.appeal && (
                            <div>
                                <p className="text-sm text-gray-500 mb-1">アピールポイント</p>
                                <p className="text-sm text-gray-900 whitespace-pre-line">{company.appeal}</p>
                            </div>
                        )}
                        
                        {company.point && (
                            <div>
                                <p className="text-sm text-gray-500 mb-1">推しポイント</p>
                                <p className="text-sm text-gray-900 whitespace-pre-line">{company.point}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 文化・雰囲気 */}
            {(company.customer || company.staff) && (
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                        雰囲気
                    </h3>
                    <div className="space-y-4">
                        {company.customer && (
                            <div>
                                <p className="text-sm text-gray-500 mb-1">お客様への向き合い方</p>
                                <p className="text-sm text-gray-900 whitespace-pre-line">{company.customer}</p>
                            </div>
                        )}
                        
                        {company.staff && (
                            <div>
                                <p className="text-sm text-gray-500 mb-1">スタッフの雰囲気</p>
                                <p className="text-sm text-gray-900 whitespace-pre-line">{company.staff}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}