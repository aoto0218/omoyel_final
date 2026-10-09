import { PreferenceChips } from "@/components/profile/PreferenceChips";
import {
    ageGroupOptions,
    atmosphereOptions,
    customerGenderOptions,
    internationalFrequencyOptions,
    salonLocationOptions,
} from "@/lib/matching_options";
import type { Profile } from "@/types/salon";

export type ListPreferenceField =
    | "desired_locations"
    | "preferred_atmospheres"
    | "preferred_customer_ages"
    | "preferred_staff_ages"
    | "preferred_international_frequencies";

type SalonPreferencesProps = {
    isEditing: boolean;
    profile: Profile;
    onGenderChange: (value: string | null) => void;
    onToggle: (field: ListPreferenceField, value: string) => void;
};

export function SalonPreferences({ isEditing, profile, onGenderChange, onToggle }: SalonPreferencesProps) {
    return (
        <div className="border-t border-gray-100 pt-8">
            <div className="mb-6">
                <p className="ml-1 block text-[12px] font-bold uppercase tracking-widest text-gray-400">サロンへの希望条件</p>
                <p className="ml-1 mt-2 text-xs text-gray-400">得意メニュー1件、または希望条件2項目以上を登録するとマッチ度を表示します。</p>
            </div>

            <div className="space-y-7">
                <PreferenceRow label="希望エリア">
                    <PreferenceChips
                        isEditing={isEditing}
                        options={salonLocationOptions}
                        selected={profile.desired_locations || []}
                        onToggle={value => onToggle("desired_locations", value)}
                    />
                </PreferenceRow>

                <PreferenceRow label="店舗の雰囲気">
                    <PreferenceChips
                        isEditing={isEditing}
                        options={atmosphereOptions}
                        selected={profile.preferred_atmospheres || []}
                        onToggle={value => onToggle("preferred_atmospheres", value)}
                    />
                </PreferenceRow>

                <PreferenceRow label="接客したい客層の年齢">
                    <PreferenceChips
                        isEditing={isEditing}
                        options={ageGroupOptions}
                        selected={profile.preferred_customer_ages || []}
                        onToggle={value => onToggle("preferred_customer_ages", value)}
                    />
                </PreferenceRow>

                <PreferenceRow label="一緒に働きたいスタッフ世代">
                    <PreferenceChips
                        isEditing={isEditing}
                        options={ageGroupOptions}
                        selected={profile.preferred_staff_ages || []}
                        onToggle={value => onToggle("preferred_staff_ages", value)}
                    />
                </PreferenceRow>

                <PreferenceRow label="接客したい客層の男女比">
                    {isEditing ? (
                        <div className="flex flex-wrap gap-2">
                            {customerGenderOptions.map(option => {
                                const isSelected = profile.preferred_customer_gender === option.value;
                                return (
                                    <button
                                        type="button"
                                        key={option.value}
                                        onClick={() => onGenderChange(isSelected ? null : option.value)}
                                        className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${isSelected
                                            ? "border-indigo-500 bg-indigo-500 text-white shadow-md shadow-indigo-100"
                                            : "border-gray-200 bg-white text-gray-400"
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="ml-1 text-sm text-gray-600">
                            {customerGenderOptions.find(option => option.value === profile.preferred_customer_gender)?.label || "未設定"}
                        </p>
                    )}
                </PreferenceRow>

                <PreferenceRow label="外国人客の頻度">
                    <PreferenceChips
                        isEditing={isEditing}
                        options={internationalFrequencyOptions}
                        selected={profile.preferred_international_frequencies || []}
                        onToggle={value => onToggle("preferred_international_frequencies", value)}
                    />
                </PreferenceRow>
            </div>
        </div>
    );
}

function PreferenceRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <p className="mb-3 ml-1 text-[11px] font-bold text-indigo-300">{label}</p>
            {children}
        </div>
    );
}

