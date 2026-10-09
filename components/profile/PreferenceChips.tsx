export type PreferenceOption = string | { value: string; label: string };

type PreferenceChipsProps = {
    isEditing: boolean;
    options: readonly PreferenceOption[];
    selected: string[];
    onToggle: (value: string) => void;
};

export function PreferenceChips({ isEditing, options, selected, onToggle }: PreferenceChipsProps) {
    const normalizedOptions = options.map(option => typeof option === "string"
        ? { value: option, label: option }
        : option);

    if (!isEditing && selected.length === 0) {
        return <p className="ml-1 text-sm text-gray-400">未設定</p>;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {normalizedOptions
                .filter(option => isEditing || selected.includes(option.value))
                .map(option => {
                    const isSelected = selected.includes(option.value);
                    return isEditing ? (
                        <button
                            type="button"
                            key={option.value}
                            onClick={() => onToggle(option.value)}
                            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${isSelected
                                ? "border-indigo-500 bg-indigo-500 text-white shadow-md shadow-indigo-100"
                                : "border-gray-200 bg-white text-gray-400"
                                }`}
                        >
                            {option.label}
                        </button>
                    ) : (
                        <span key={option.value} className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 shadow-sm">
                            {option.label}
                        </span>
                    );
                })}
        </div>
    );
}

