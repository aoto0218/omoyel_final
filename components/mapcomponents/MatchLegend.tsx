import { MATCH_COLORS, MATCH_GRADIENT_STOPS } from "@/lib/match_colors";

export function MatchLegend() {
    const gradient = MATCH_GRADIENT_STOPS
        .map(stop => `${stop.color} ${stop.score}%`)
        .join(", ");

    return (
        <div className="absolute left-3 top-40 z-20 rounded-2xl bg-white/95 px-3 py-3 text-xs text-gray-900 shadow-md" aria-label="ピンの色の説明">
            <div className="flex items-end gap-3">
                <span className="h-32 w-3.5 shrink-0 rounded-full" style={{ background: `linear-gradient(to bottom, ${gradient})` }} />
                <div className="flex h-32 w-32 flex-col justify-between py-0.5 text-[11px] font-bold leading-none">
                    <span>低い <span className="font-normal text-gray-500">1</span></span>
                    <span>中間 <span className="font-normal text-gray-500">50</span></span>
                    <span>高い <span className="font-normal text-gray-500">100</span></span>
                </div>
            </div>
            <div className="mt-2 flex items-center gap-2 border-t border-gray-200 pt-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: MATCH_COLORS.favorite }} />
                <span className="font-medium">お気に入り</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: MATCH_COLORS.default }} />
                <span className="font-medium">通常表示</span>
            </div>
        </div>
    );
}

