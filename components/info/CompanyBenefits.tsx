import { Company } from '@/types/salon';

interface CompanyBenefitsProps {
    company: Company;
}

export default function CompanyBenefits({ company }: CompanyBenefitsProps) {
    return (
        <div className="space-y-4">
            {company.benefits && (
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">福利厚生</h4>
                    <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{company.benefits}</p>
                </div>
            )}

            {company.insurance && (
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">社会保険</h4>
                    <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{company.insurance}</p>
                </div>
            )}

            {company.vacation_system && (
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">休暇制度</h4>
                    <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{company.vacation_system}</p>
                </div>
            )}

            {company.paid_holiday && (
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">有給休暇等</h4>
                    <p className="text-gray-700 text-sm">{company.paid_holiday}</p>
                </div>
            )}

            {company.weekends_off && (
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">休暇の振替（指定休暇日数を下回る月があった場合の補填等）</h4>
                    <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{company.weekends_off}</p>
                </div>
            )}
        </div>
    );
}