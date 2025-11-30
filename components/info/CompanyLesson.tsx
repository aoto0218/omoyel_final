import { Company } from '@/types/salon';

interface CompanyTrainingProps {
    company: Company;
}

export default function CompanyTraining({ company }: CompanyTrainingProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                勤務・研修制度
            </h3>
            <div className="space-y-4">
                {company.shift && (
                    <div>
                        <p className="text-sm text-gray-500 mb-1">シフト</p>
                        <p className="text-sm text-gray-900 whitespace-pre-line">{company.shift}</p>
                    </div>
                )}

                {company.lesson && (
                    <div>
                        <p className="text-sm text-gray-500 mb-1">レッスン等研修時間</p>
                        <p className="text-sm text-gray-900 whitespace-pre-line">{company.lesson}</p>
                    </div>
                )}

                {company.item && company.item.length > 0 && (
                    <div>
                        <p className="text-sm text-gray-500 mb-1">必要アイテム</p>
                        <p className="text-xs text-gray-600 mb-2">（支給の有無・負担の必要）</p>
                        <div className="flex gap-2 flex-wrap">
                            {company.item.map((item, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-md border border-gray-300"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {company.debut && (
                    <div>
                        <p className="text-sm text-gray-500 mb-1">スタイリストデビュー</p>
                        <p className="text-xs text-gray-600 mb-1">（テスト・カリキュラム等）</p>
                        <p className="text-sm text-gray-900">{company.debut}</p>
                    </div>
                )}

                {company.process && (
                    <div>
                        <p className="text-sm text-gray-500 mb-1">選考方法</p>
                        <p className="text-sm text-gray-900 whitespace-pre-line">{company.process}</p>
                    </div>
                )}
            </div>
        </div>
    );
}