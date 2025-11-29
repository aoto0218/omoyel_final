import { Company } from '@/types/salon';

interface CompanyBasicInfoProps {
    company: Company;
}

export default function CompanyBasicInfo({ company }: CompanyBasicInfoProps) {
    return (
        <div className="space-y-4">
            {company.name && (
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">企業名</h3>
                    <p className="text-gray-700 text-sm">{company.name}</p>
                </div>
            )}

            {company.hr && company.hr.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-2">募集区分</h3>
                    <div className="flex gap-2 flex-wrap">
                        {company.hr.map((hr, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-gray-100 text-gray-800 text-sm rounded-md border border-gray-200"
                            >
                                {hr}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {company.recruit && (
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">採用情報</h3>
                    <a
                    href={company.recruit.startsWith('http') ? company.recruit : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 transition text-sm break-all underline"
                    >
                    {company.recruit}
                </a>
                </div>
    )
}

{
    company.experience && company.experience.length > 0 && (
        <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">体験可能</h3>
            <div className="flex gap-2 flex-wrap">
                {company.experience.map((exp, index) => (
                    <span
                        key={index}
                        className="px-4 py-2 bg-gray-100 text-gray-800 text-sm rounded-md border border-gray-200"
                    >
                        {exp}
                    </span>
                ))}
            </div>
        </div>
    )
}

{
    company.provided && (
        <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">体験向け交通費支給</h3>
            <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{company.provided}</p>
        </div>
    )
}

{
    company.salons && (
        <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">店舗一覧</h3>
            <a
            href={company.salons.startsWith('http') ? company.salons : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700 transition text-sm break-all underline"
                    >
            {company.salons}
        </a>
                </div >
            )
}

{
    company.event && company.event.length > 0 && (
        <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">開催・参加イベント等</h3>
            <div className="flex gap-2 flex-wrap">
                {company.event.map((event, index) => (
                    <span
                        key={index}
                        className="px-4 py-2 bg-gray-100 text-gray-800 text-sm rounded-md border border-gray-200"
                    >
                        {event}
                    </span>
                ))}
            </div>
        </div>
    )
}

{
    company.expansion && (
        <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">店舗展開の仕方</h3>
            <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{company.expansion}</p>
        </div>
    )
}

{
    company.appeal && (
        <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">企業のアピールポイント</h3>
            <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{company.appeal}</p>
        </div>
    )
}

{
    company.point && (
        <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">企業の推しポイント</h3>
            <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{company.point}</p>
        </div>
    )
}

{
    company.customer && (
        <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">お客様への向き合い方</h3>
            <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{company.customer}</p>
        </div>
    )
}

{
    company.staff && (
        <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">スタッフの雰囲気</h3>
            <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{company.staff}</p>
        </div>
    )
}
        </div >
    );
}