# 💇‍♀️ 美容師　就活マッチングサイト Mobile　WEBアプリ

[美容師就活マッチングサイトのホームページを開く(Mobile First)🌐](https://omoyel-final.vercel.app)

---
## ✨ 主な機能
### 📍 サロン検索 & マップ連携

- Google Maps APIを統合し、エリアや現在地から直感的にサロンを探索。

- 地図上での視覚的な配置確認と、詳細なサロン情報の絞り込み。

### 🔍 高度な多条件フィルタリング（詳細絞り込み）

- 「給与・休日」などの待遇面から、「教育体制」「店の雰囲気」「客層」といった美容師特有のこだわり条件まで、詳細なパラメータで検索可能。

- 大量のデータから、ユーザーの「譲れない条件」に合致するサロンを瞬時に抽出します。

### 💬 スムーズなコンタクト機能

- 気になったサロンへ直接アプローチが可能。

- 美容師とオーナーを繋ぐシンプルで無駄のないコミュニケーション。

### ⭐ リアルなレビューシステム

- 実際に働く環境や雰囲気を可視化。

- 信頼性の高い口コミに基づいたミスマッチのない就職活動をサポート。

### 🤖 AIチャット・サジェスト (Gemini API 活用)

- ユーザーの希望条件や価値観をAIが分析。

- 膨大なデータから「あなたに本当に合うサロン」をパーソナライズして提案。

---

## 技術スタック  
  
### Frontend

- React / Next.js (TypeScript) 🚀

- Tailwind CSS 🎨

### Backend & Database

- Supabase ⚡️ (Authentication, Database, Storage)


### AI & APIs

- Gemini API ♊️ (AI-chat)

- Google Maps API 📍 (Location services & Maps integration)

### Infrastructure & Tools

- Deployment: Vercel ▲
- 
- Package Manager: npm 📦

   
---
   

## セットアップ
開発環境の起動

```bash
# 依存関係のインストール
npm install

# ローカルサーバーの起動
npm run dev
```

---

## プロジェクト構造
```bash
omoyel/              
├── public/                 # ロゴ、アイコン、背景画像などの静的資産
├── src/
│   ├── app/                # 【Next.js App Router】ルーティングとページ
│   │   ├── (auth)/         # ログイン・新規登録（グループ化）
│   │   ├── (dashboard)/    # ユーザー用・美容室用管理画面
│   │   ├── salons/         # 美容室検索・一覧・詳細ページ
│   │   ├── api/            # API Route (Supabaseとの連携など)
│   │   ├── layout.tsx      # 全体共通のレイアウト
│   │   └── page.tsx        # トップページ
│   ├── components/         # 再利用可能なUIパーツ
│   │   ├── ui/             # shadcn/ui などの基本部品（Button, Input等）
│   │   ├── common/         # Header, Footer, Sidebar
│   │   ├── salon/          # 美容室カード、検索フォーム
│   │   └── auth/           # ログインフォーム、認証ガード
│   ├── hooks/              # カスタムフック（useAuth, useGoogleMaps等）
│   ├── lib/                # 外部ライブラリの設定（supabaseClient.ts, utils.ts）
│   ├── services/           # データ取得ロジック（API叩く処理をまとめる）
│   ├── types/              # TypeScriptの型定義ファイル
│   └── store/              # 状態管理（Zustand や Jotai を使う場合）              # MIT License
├── README.md               # プロジェクト説明書
└── package.json            # 依存関係管理
```
---
## ライセンス

© 2026 Omoyel Project. All rights reserved.


