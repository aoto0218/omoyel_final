import assert from "node:assert/strict";
import test from "node:test";
import { getMatchColor, MATCH_COLORS } from "./match_colors.ts";
import { getSalonMatch, isMatchProfileReady } from "./salon_match.ts";

test("プロフィール未登録時は通常の赤で評価項目を持たない", () => {
    const match = getSalonMatch({}, { tags: ["ボブ"], location: "東京都" });
    assert.equal(match.score, 0);
    assert.equal(match.color, MATCH_COLORS.default);
    assert.equal(match.criteriaCount, 0);
    assert.equal(match.isEligible, false);
    assert.equal(match.description, "");
});

test("得意メニューなしで希望条件が1項目だけならマッチ度を表示しない", () => {
    const profile = { specialty: [], desired_locations: ["東京都"] };
    const match = getSalonMatch(profile, { tags: ["ボブ"], location: "東京都" });

    assert.equal(isMatchProfileReady(profile), false);
    assert.equal(match.score, 0);
    assert.equal(match.color, MATCH_COLORS.default);
    assert.equal(match.description, "");
});

test("得意メニューまたは希望条件2項目でマッチ度を有効にする", () => {
    assert.equal(isMatchProfileReady({ specialty: ["ボブ"] }), true);
    assert.equal(isMatchProfileReady({
        specialty: [],
        desired_locations: ["東京都"],
        preferred_customer_ages: ["20代"],
    }), true);
});

test("得意メニューは完全一致数と同カテゴリ一致から評価する", () => {
    const one = getSalonMatch(
        { specialty: ["ダブルカラー", "ボブ"] },
        { tags: ["ダブルカラー"] },
    );
    const two = getSalonMatch(
        { specialty: ["ダブルカラー", "ボブ"] },
        { tags: ["ダブルカラー", "ボブ"] },
    );
    const related = getSalonMatch(
        { specialty: ["ハイライト"] },
        { tags: ["ダブルカラー"] },
    );

    assert.equal(one.score, 60);
    assert.equal(one.color, getMatchColor(60));
    assert.equal(two.score, 100);
    assert.equal(two.color, getMatchColor(100));
    assert.equal(related.score, 25);
    assert.equal(related.color, getMatchColor(25));
});

test("既存の店舗項目を7軸に分解して総合評価する", () => {
    const match = getSalonMatch(
        {
            specialty: ["ボブ"],
            desired_locations: ["東京都"],
            preferred_atmospheres: ["trend"],
            preferred_customer_ages: ["20代"],
            preferred_staff_ages: ["20代"],
            preferred_customer_gender: "female",
            preferred_international_frequencies: ["よくある"],
        },
        {
            tags: ["ボブ"],
            location: "東京都",
            atmosphere: "SNSやトレンドに敏感な最先端の職場",
            customer_age_group: "10代後半〜20代後半",
            staff_age_group: "20代中心",
            customer_gender_ratio: "20:80",
            international_customer_frequency: "よくある",
        },
    );

    assert.equal(match.criteriaCount, 7);
    assert.equal(match.score, 88);
    assert.equal(match.color, getMatchColor(88));
    assert.equal(match.description, "マッチ度 88%");
});

test("未入力項目と店舗側にデータがない項目は計算から外す", () => {
    const match = getSalonMatch(
        { desired_locations: ["東京都"], preferred_customer_ages: ["20代"] },
        { location: "東京都" },
    );
    assert.equal(match.criteriaCount, 1);
    assert.equal(match.score, 100);
});

test("お気に入りは総合スコアに関係なく黄色を優先する", () => {
    const match = getSalonMatch(
        { desired_locations: ["大阪府"] },
        { location: "東京都" },
        true,
    );
    assert.equal(match.score, 0);
    assert.equal(match.color, MATCH_COLORS.favorite);
    assert.equal(match.description, "");
});

test("マッチ度の各スコアから連続したグラデーション色を計算する", () => {
    assert.equal(getMatchColor(0), MATCH_COLORS.default);
    assert.equal(getMatchColor(25), "#22D3EE");
    assert.equal(getMatchColor(50), "#22C55E");
    assert.equal(getMatchColor(75), "#F97316");
    assert.equal(getMatchColor(100), "#C026D3");
    assert.notEqual(getMatchColor(61), getMatchColor(62));
    assert.notEqual(getMatchColor(79), getMatchColor(80));
});
