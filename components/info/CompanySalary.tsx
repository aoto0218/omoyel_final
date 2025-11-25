import { Company } from '@/types/salon';

interface CompanySalaryProps {
    company: Company;
}

export default function CompanySalary({ company }: CompanySalaryProps) {
    return (
        <div className="space-y-4">
            {company.start_salary && (
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">初任給</h4>
                    <p className="text-gray-700 text-sm">{company.start_salary}</p>
                </div>
            )}

            {company.assist_salary && (
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">アシスタント給与</h4>
                    <p className="text-gray-700 text-sm">{company.assist_salary}</p>
                </div>
            )}

            {company.stylist_salary && (
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">スタイリスト給与</h4>
                    <p className="text-gray-700 text-sm">{company.stylist_salary}</p>
                </div>
            )}

            {company.manager_salary && (
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">店長給与</h4>
                    <p className="text-gray-700 text-sm">{company.manager_salary}</p>
                </div>
            )}

            {company.area_salary && (
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">エリアマネージャー給与</h4>
                    <p className="text-gray-700 text-sm">{company.area_salary}</p>
                </div>
            )}

            {company.ten_million !== null && company.ten_million !== undefined && (
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">年収1000万円以上のスタッフが在籍している</h4>
                    <p className="text-gray-700 text-sm">{company.ten_million ? 'はい' : 'いいえ'}</p>
                </div>
            )}

            {company.bonus && (
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">賞与・ボーナス</h4>
                    <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{company.bonus}</p>
                </div>
            )}
        </div>
    );
}