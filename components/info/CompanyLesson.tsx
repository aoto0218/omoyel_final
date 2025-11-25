import { Company } from '@/types/salon';

interface CompanyTrainingProps {
    company: Company;
}

export default function CompanyTraining({ company }: CompanyTrainingProps) {
    return (
        <div className="space-y-4">
            {company.shift && (
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">シフト</h4>
                    <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{company.shift}</p>
                </div>
            )}

            {company.lesson && (
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">レッスン等研修時間</h4>
                    <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{company.lesson}</p>
                </div>
            )}

            {company.item && company.item.length > 0 && (
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">必要アイテム（支給の有無・負担の必要）</h4>
                    <div className="flex gap-2 flex-wrap">
                        {company.item.map((item, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-gray-100 text-gray-800 text-sm rounded-md border border-gray-200"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {company.debut && (
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">スタイリストデビューのためのテスト・カリキュラム等</h4>
                    <p className="text-gray-700 text-sm">{company.debut}</p>
                </div>
            )}

            {company.process && (
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">選考方法</h4>
                    <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{company.process}</p>
                </div>
            )}
        </div>
    );
}