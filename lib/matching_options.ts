export const specialtyGroups = [
    {
        category: "カラー",
        options: ["ワンカラー", "ダブルカラー", "ハイライト", "ローライト", "グラデーション", "インナーカラー", "寒色系", "暖色系"],
    },
    {
        category: "カット",
        options: ["ベリーショート", "ショート", "ボブ", "ミディアム", "ロング"],
    },
    {
        category: "髪質改善",
        options: ["縮毛矯正", "トリートメント"],
    },
    {
        category: "パーマ",
        options: ["ボディーパーマ", "ニュアンスパーマ", "スパイラルパーマ", "ツイストパーマ", "ツイストスパイラルパーマ", "波巻きパーマ"],
    },
    {
        category: "まつげ・ブロウ",
        options: ["まつげパーマ", "まつげエクステ", "アイブロウ"],
    },
    {
        category: "ネイル",
        options: ["ジェルネイル", "ネイルアート", "フットネイル"],
    },
    {
        category: "エステ",
        options: ["フェイシャル", "ボディ", "リラクゼーション", "脱毛"],
    },
    {
        category: "その他",
        options: ["ヘアメイク", "メンズ特化", "ナチュラル", "着付け", "なんでも"],
    },
] as const;

export const salonLocationOptions = [
    "北海道", "茨城県", "栃木県", "埼玉県", "千葉県", "東京都", "神奈川県", "岐阜県", "愛知県", "滋賀県",
    "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県", "岡山県", "広島県", "愛媛県", "高知県", "福岡県", "海外",
] as const;

export const atmosphereOptions = [
    { value: "trend", label: "トレンド・SNS重視", keywords: ["トレンド", "SNS", "最先端", "ファッショナブル"] },
    { value: "energetic", label: "明るく活気がある", keywords: ["明るく", "活気", "熱気", "エネルギッシュ", "パッション"] },
    { value: "calm", label: "落ち着いている", keywords: ["落ち着いた", "穏やか"] },
    { value: "homey", label: "アットホーム", keywords: ["アットホーム", "自然体"] },
    { value: "teamwork", label: "チームワーク重視", keywords: ["チームワーク"] },
    { value: "professional", label: "技術・プロ志向", keywords: ["技術", "プロフェッショナル"] },
] as const;

export const ageGroupOptions = ["10代", "20代", "30代", "40代"] as const;

export const customerGenderOptions = [
    { value: "male", label: "男性客中心" },
    { value: "balanced", label: "男女バランス型" },
    { value: "female", label: "女性客中心" },
] as const;

export const internationalFrequencyOptions = [
    { value: "よくある", label: "外国人客がよく来る" },
    { value: "ときどき", label: "外国人客がときどき来る" },
] as const;

