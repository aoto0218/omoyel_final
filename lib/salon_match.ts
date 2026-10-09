import { getMatchColor, MATCH_COLORS } from "./match_colors";
import { atmosphereOptions, specialtyGroups } from "./matching_options";

export type MatchProfile = {
    specialty?: string[] | null;
    desired_locations?: string[] | null;
    preferred_atmospheres?: string[] | null;
    preferred_customer_ages?: string[] | null;
    preferred_staff_ages?: string[] | null;
    preferred_customer_gender?: string | null;
    preferred_international_frequencies?: string[] | null;
};

type MatchSalon = {
    tags?: string[] | null;
    location?: string | null;
    atmosphere?: string | null;
    customer_age_group?: string | null;
    staff_age_group?: string | null;
    customer_gender_ratio?: string | null;
    international_customer_frequency?: string | null;
};

type WeightedScore = {
    score: number;
    weight: number;
};

const preferenceFields = [
    "desired_locations",
    "preferred_atmospheres",
    "preferred_customer_ages",
    "preferred_staff_ages",
    "preferred_customer_gender",
    "preferred_international_frequencies",
] as const satisfies readonly (keyof MatchProfile)[];

function normalizeList(values: string[] | null | undefined): string[] {
    return [...new Set((Array.isArray(values) ? values : [])
        .filter((value): value is string => typeof value === "string")
        .map(value => value.normalize("NFKC").trim())
        .filter(Boolean))];
}

function hasValue(value: MatchProfile[keyof MatchProfile]): boolean {
    return Array.isArray(value)
        ? normalizeList(value).length > 0
        : typeof value === "string" && value.trim().length > 0;
}

export function getCompletedPreferenceCount(profile: MatchProfile | null | undefined): number {
    if (!profile) return 0;
    return preferenceFields.filter(field => hasValue(profile[field])).length;
}

export function isMatchProfileReady(profile: MatchProfile | null | undefined): boolean {
    return normalizeList(profile?.specialty).length > 0 || getCompletedPreferenceCount(profile) >= 2;
}

function getMenuScore(specialty: string[], tags: string[]): WeightedScore | null {
    if (specialty.length === 0 || tags.length === 0) return null;

    const exactMenus = specialty.filter(menu => tags.includes(menu));
    const relatedMenus = specialty.filter(menu => !exactMenus.includes(menu) &&
        specialtyGroups.some(group => group.category !== "その他" &&
            (group.options as readonly string[]).includes(menu) &&
            tags.some(tag => (group.options as readonly string[]).includes(tag))));

    return {
        score: Math.min(100, exactMenus.length * 60 + relatedMenus.length * 25),
        weight: 30,
    };
}

function getListScore(selected: string[], source: string | null | undefined, weight: number): WeightedScore | null {
    if (selected.length === 0 || !source) return null;
    const matches = selected.filter(value => source.includes(value));
    return {
        score: Math.round((matches.length / selected.length) * 100),
        weight,
    };
}

function getAtmosphereScore(selected: string[], atmosphere: string | null | undefined): WeightedScore | null {
    if (selected.length === 0 || !atmosphere) return null;
    const matchCount = selected.filter(value => {
        const option = atmosphereOptions.find(item => item.value === value);
        return option?.keywords.some(keyword => atmosphere.includes(keyword));
    }).length;

    return {
        score: Math.round((matchCount / selected.length) * 100),
        weight: 20,
    };
}

function getCustomerGender(ratio: string | null | undefined): string | null {
    if (!ratio) return null;
    const [male, female] = ratio.split(":").map(Number);
    if (!Number.isFinite(male) || !Number.isFinite(female)) return null;
    if (male >= 60) return "male";
    if (female >= 60) return "female";
    return "balanced";
}

export function getSalonMatch(profile: MatchProfile | null | undefined, salon: MatchSalon, isFavorite = false) {
    const isEligible = isMatchProfileReady(profile);
    if (!isEligible) {
        return {
            score: 0,
            color: isFavorite ? MATCH_COLORS.favorite : MATCH_COLORS.default,
            description: "",
            criteriaCount: 0,
            isEligible,
        };
    }

    const criteria: WeightedScore[] = [];
    const menuScore = getMenuScore(normalizeList(profile?.specialty), normalizeList(salon.tags));
    if (menuScore) criteria.push(menuScore);

    const desiredLocations = normalizeList(profile?.desired_locations);
    if (desiredLocations.length > 0 && salon.location) {
        criteria.push({
            score: desiredLocations.includes(salon.location) ? 100 : 0,
            weight: 20,
        });
    }

    const atmosphereScore = getAtmosphereScore(normalizeList(profile?.preferred_atmospheres), salon.atmosphere);
    if (atmosphereScore) criteria.push(atmosphereScore);

    const customerAgeScore = getListScore(normalizeList(profile?.preferred_customer_ages), salon.customer_age_group, 10);
    if (customerAgeScore) criteria.push(customerAgeScore);

    const staffAgeScore = getListScore(normalizeList(profile?.preferred_staff_ages), salon.staff_age_group, 10);
    if (staffAgeScore) criteria.push(staffAgeScore);

    const customerGender = getCustomerGender(salon.customer_gender_ratio);
    if (profile?.preferred_customer_gender && customerGender) {
        criteria.push({
            score: profile.preferred_customer_gender === customerGender ? 100 : 0,
            weight: 5,
        });
    }

    const internationalScore = getListScore(
        normalizeList(profile?.preferred_international_frequencies),
        salon.international_customer_frequency,
        5,
    );
    if (internationalScore) criteria.push(internationalScore);

    const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
    const score = totalWeight > 0
        ? Math.round(criteria.reduce((sum, criterion) => sum + criterion.score * criterion.weight, 0) / totalWeight)
        : 0;

    return {
        score,
        color: isFavorite ? MATCH_COLORS.favorite : getMatchColor(score),
        description: score > 0 ? `マッチ度 ${score}%` : "",
        criteriaCount: criteria.length,
        isEligible,
    };
}
