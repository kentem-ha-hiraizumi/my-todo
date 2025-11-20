# my-todo プロジェクト - AI コーディングエージェント向けガイド

- 回答は日本語で行ってください。

## プロジェクト概要

React 19 + TypeScript + Vite で構築された ToDo アプリケーションです。状態管理には **Jotai**、スタイリングには **Tailwind CSS 4** を使用し、localStorage による永続化を備えた機能ベースのアーキテクチャを採用しています。

## アーキテクチャと状態管理

### Jotai パターン（重要）

- すべての状態は `atomWithStorage` を使用して localStorage に自動永続化される
- カスタムフック（`useTodoAtom`、`useFilterAtom`）が atom をラップしてビジネスロジックを提供
- **atom を直接インポートしてはいけない**—必ずカスタムフックを使用すること
- 例：`src/features/todo/todoAtom.ts` は生の atom ではなく `useTodoAtom()` を公開している

### 機能構造

```
src/features/
  [feature-name]/
    [featureName]Atom.ts    # 状態 + カスタムフック
    [Component].tsx         # UI コンポーネント
    subfolder/              # 関連するサブ機能
```

### データフロー

1. ユーザー操作 → コンポーネントのイベントハンドラ
2. コンポーネントがカスタムフックのメソッド（例：`addTodo()`）を呼び出す
3. フックが atom を更新 → localStorage に自動同期
4. React が影響を受けるコンポーネントを再レンダリング

## 主要な型定義

```typescript
// src/features/todo/todoAtom.ts
type Todo = {
  id: string; // crypto.randomUUID()
  title: string;
  completed: boolean;
  endAt?: number; // UNIX タイムスタンプ（ミリ秒）
  url?: string; // オプションのリンクフィールド
};

// src/features/todo/filter/filterAtom.ts
type FilterType = "all" | "active" | "completed";
type SortType = "none" | "date-asc" | "date-desc";
```

## 開発ワークフロー

### テスト（Vitest）

- **インソーステスト**：`if (import.meta.vitest) { ... }` を使ってソースファイル内にテストブロックを配置
- 参考パターン：`src/features/input/inputAtom.ts`
- コマンド：`npm run test`（1 回実行）、`npm run test:watch`（監視モード）
- ロジック関数をテストし、React コンポーネントはテストしない

### リントとフォーマット（Biome）

- **Biome**（ESLint/Prettier ではない）がすべてのコード品質を管理
- 自動修正：`npm run lint:fix`
- 設定：ダブルクォート、スペースインデント、インポート整理を強制
- 保存時に Biome がインポートを自動整理

### ビルドとデプロイ

- ビルドターゲット：GitHub Pages（ベースパス `/my-todo/`、`vite.config.ts` 参照）
- ビルドコマンド：`npm run build`（TypeScript 型チェック含む）
- プレビュー：`npm run preview` でプロダクションビルドをローカルテスト

## プロジェクト固有の規約

### コンポーネントパターン

1. **フォームアクション**：`onSubmit` ではなく React 19 の `action={async (formData) => ...}` パターンを使用
   - 参考：`src/features/todo/form/todoForm.tsx`
2. **条件付きレンダリング**：空の状態には早期リターンを使用
3. **スタイリング**：Tailwind ユーティリティクラスのみ使用—CSS モジュールや styled-components は不可

### 日付の扱い

- 日付は UNIX タイムスタンプ（`number`、ミリ秒単位）で保存
- 入力時の変換：`new Date(dateString).getTime()`
- 表示時の変換：`new Date(timestamp).toLocaleDateString()`
- ビジネスロジック：`todoList.tsx` 内の `isOverdue()`、`isDueToday()` ヘルパー

### 視覚的な状態

- **期限超過タスク**：赤背景 + ボーダー（`bg-red-50 border-red-300`）
- **本日期限タスク**：青背景 + ボーダー（`bg-blue-50 border-blue-300`）
- **完了タスク**：グレー + 打消し線（`line-through text-slate-400`）

### UI/UX パターン

- 未完了タスクの削除時のみ確認モーダルを表示（`todoList.tsx` 参照）
- 編集モード：ローカルの `editingId` 状態を使ってその場でフォームに切り替え
- フィルタ/ソート状態はセッション間で永続化（Jotai 経由の localStorage）

## よくあるタスク

### Todo に新しいフィールドを追加

1. `todoAtom.ts` の `Todo` 型を更新
2. `todoForm.tsx` と `todoEditForm.tsx` に入力欄を追加
3. カスタムフックの `addTodo()` と `updateTodo()` を更新
4. `TodoItem` 表示コンポーネントを更新

### フィルタ/ソートオプションを追加

1. `filterAtom.ts` の `FilterType` または `SortType` にオプションを追加
2. `useFilteredTodos.ts` のマップにフィルタ/ソート関数を追加
3. `todoFilter.tsx` の UI を更新

### 新機能を作成

1. `src/features/[name]/` ディレクトリを作成
2. `[name]Atom.ts` に atom + カスタムフックを定義
3. UI コンポーネントを作成
4. `src/pages/App.tsx` でインポートして使用

## 技術スタックの詳細

- **React 19**：フォームで `action` プロップを使用（実験的機能）
- **Tailwind CSS 4**：`@tailwindcss/vite` プラグインを使用（v4 アーキテクチャ）
- **TypeScript**：strict モード有効、`tsconfig.json` でプロジェクト参照
- **Vite 7**：React コンパイルに SWC を使用（`@vitejs/plugin-react-swc`）

## 言語とドキュメント

- すべての UI テキストとコメントは日本語
- ユーザー向け文字列は丁寧語（です/ます調）を使用
- 変数名・関数名は英語の camelCase
