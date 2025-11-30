import { Company } from '@/types/salon';

interface CompanySalaryProps {
    company: Company;
}

export default function CompanySalary({ company }: CompanySalaryProps) {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                    給与体系
                </h3>
                <div className="space-y-3">
                    {company.start_salary && (
                        <div className="flex gap-3">
                            <span className="text-sm text-gray-500 min-w-[140px]">初任給</span>
                            <span className="text-sm text-gray-900">{company.start_salary}</span>
                        </div>
                    )}

                    {company.assist_salary && (
                        <div className="flex gap-3">
                            <span className="text-sm text-gray-500 min-w-[140px]">アシスタント</span>
                            <span className="text-sm text-gray-900">{company.assist_salary}</span>
                        </div>
                    )}

                    {company.stylist_salary && (
                        <div className="flex gap-3">
                            <span className="text-sm text-gray-500 min-w-[140px]">スタイリスト</span>
                            <span className="text-sm text-gray-900">{company.stylist_salary}</span>
                        </div>
                    )}

                    {company.manager_salary && (
                        <div className="flex gap-3">
                            <span className="text-sm text-gray-500 min-w-[140px]">店長</span>
                            <span className="text-sm text-gray-900">{company.manager_salary}</span>
                        </div>
                    )}

                    {company.area_salary && (
                        <div className="flex gap-3">
                            <span className="text-sm text-gray-500 min-w-[140px]">エリアマネージャー</span>
                            <span className="text-sm text-gray-900">{company.area_salary}</span>
                        </div>
                    )}

                    {company.ten_million !== null && company.ten_million !== undefined && (
                        <div className="flex gap-3">
                            <span className="text-sm text-gray-500 min-w-[140px]">年収1000万円以上</span>
                            <span className="text-sm text-gray-900">{company.ten_million ? 'はい' : 'いいえ'}</span>
                        </div>
                    )}

                    {company.bonus && (
                        <div className="flex gap-3">
                            <span className="text-sm text-gray-500 min-w-[140px]">賞与・ボーナス</span>
                            <span className="text-sm text-gray-900 flex-1 whitespace-pre-line">{company.bonus}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                    福利厚生・休暇制度
                </h3>
                <div className="space-y-4">
                    {company.benefits && (
                        <div>
                            <p className="text-sm text-gray-500 mb-1">福利厚生</p>
                            <p className="text-sm text-gray-900 whitespace-pre-line">{company.benefits}</p>
                        </div>
                    )}

                    {company.insurance && (
                        <div>
                            <p className="text-sm text-gray-500 mb-1">社会保険</p>
                            <p className="text-sm text-gray-900 whitespace-pre-line">{company.insurance}</p>
                        </div>
                    )}

                    {company.vacation_system && (
                        <div>
                            <p className="text-sm text-gray-500 mb-1">休暇制度</p>
                            <p className="text-sm text-gray-900 whitespace-pre-line">{company.vacation_system}</p>
                        </div>
                    )}

                    {company.paid_holiday && (
                        <div>
                            <p className="text-sm text-gray-500 mb-1">有給休暇等</p>
                            <p className="text-sm text-gray-900">{company.paid_holiday}</p>
                        </div>
                    )}

                    {company.weekends_off && (
                        <div>
                            <p className="text-sm text-gray-500 mb-1">休暇の振替</p>
                            <p className="text-sm text-gray-700 text-xs mb-1">（指定休暇日数を下回る月があった場合の補填等）</p>
                            <p className="text-sm text-gray-900 whitespace-pre-line">{company.weekends_off}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}