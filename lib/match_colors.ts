export const MATCH_COLORS = {
    favorite: "#FACC15",
    default: "#EA4335",
} as const;

export const MATCH_GRADIENT_STOPS = [
    { score: 0, color: "#38BDF8" },
    { score: 25, color: "#22D3EE" },
    { score: 50, color: "#22C55E" },
    { score: 75, color: "#F97316" },
    { score: 100, color: "#C026D3" },
] as const;

function hexToRgb(color: string) {
    return {
        red: Number.parseInt(color.slice(1, 3), 16),
        green: Number.parseInt(color.slice(3, 5), 16),
        blue: Number.parseInt(color.slice(5, 7), 16),
    };
}

function toHex(value: number) {
    return Math.round(value).toString(16).padStart(2, "0").toUpperCase();
}

export function getMatchColor(score: number): string {
    if (!Number.isFinite(score) || score <= 0) return MATCH_COLORS.default;

    const normalizedScore = Math.min(100, score);
    const upperIndex = MATCH_GRADIENT_STOPS.findIndex(stop => normalizedScore <= stop.score);
    const safeUpperIndex = upperIndex === -1 ? MATCH_GRADIENT_STOPS.length - 1 : upperIndex;
    const upper = MATCH_GRADIENT_STOPS[safeUpperIndex];
    const lower = MATCH_GRADIENT_STOPS[Math.max(0, safeUpperIndex - 1)];
    if (upper.score === lower.score) return upper.color;

    const ratio = (normalizedScore - lower.score) / (upper.score - lower.score);
    const from = hexToRgb(lower.color);
    const to = hexToRgb(upper.color);
    return `#${toHex(from.red + (to.red - from.red) * ratio)}${toHex(from.green + (to.green - from.green) * ratio)}${toHex(from.blue + (to.blue - from.blue) * ratio)}`;
}

export function getMarkerIcon(color: string): google.maps.Symbol {
    return {
        path: "M 0 0 C -3 -5 -10 -12 -10 -19 A 10 10 0 1 1 10 -19 C 10 -12 3 -5 0 0 Z",
        fillColor: color,
        fillOpacity: 1,
        strokeColor: "#FFFFFF",
        strokeWeight: 1.5,
        scale: 1,
    };
}

