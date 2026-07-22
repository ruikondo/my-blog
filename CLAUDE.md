# CLAUDE.md

## プロジェクト概要

ブログ型Webサービス。管理画面から記事を投稿でき、公開側でブログとして閲覧できる。

このプロジェクトは、WordPress製の観光メディア「タビイコ」(https://www.tabiico.com/) をNext.jsでリニューアルするための**予行演習**として作られた。今後、本番リニューアルに向けた機能拡張の実験台としても使う。

## 技術構成

- **フレームワーク**: Next.js 16 (App Router, Turbopack, TypeScript, Tailwind CSS)
  - **`src/` なし構成**。ページはプロジェクト直下の `app/` に置く(過去に `src/app` に誤って作成して404になった経緯あり。`src/` は作らないこと)
- **ORM**: Prisma 7
  - 接続設定は `prisma.config.ts` に書く(スキーマの datasource に `url` を書くのは v7 では不可)
  - `PrismaClient` は必ず `@prisma/adapter-pg` の `PrismaPg` アダプター経由で生成する(`lib/prisma.ts` の共有インスタンスを使うこと)
  - シードは `prisma/seed.ts`(tsx で実行、`prisma.config.ts` の `migrations.seed` に登録済み)
- **DB**: PostgreSQL
  - ローカル: Docker(`docker compose up -d`、接続先 `postgresql://bloguser:blogpass@localhost:5432/blogdb`)
  - 本番: Neon(シンガポール)。Vercel には pooled 接続文字列(ホスト名に `-pooler`)を設定
- **認証**: Auth.js v5 (next-auth@beta)
  - Credentials プロバイダ + bcryptjs、セッションは JWT 戦略
  - 設定本体はプロジェクト直下の `auth.ts`。API ルートは `app/api/auth/[...nextauth]/route.ts`
  - セッションの `user` に `role` を埋め込んでいる(auth.ts の callbacks 参照)
- **デプロイ**: Vercel(Function Region: Singapore sin1)。GitHub の main への push で自動デプロイ

## ディレクトリ構成(主要ファイル)

```
app/
  page.tsx                     # 公開側: 記事一覧(published のみ)
  posts/[id]/page.tsx          # 公開側: 記事詳細(未公開は404)
  login/page.tsx               # ログイン画面(Server Action で signIn)
  admin/
    layout.tsx                 # 管理画面共通レイアウト。未ログインは /login へ redirect
    page.tsx                   # ダッシュボード(ADMINのみユーザー管理リンク表示)
    posts/
      page.tsx                 # 記事一覧 + 公開/非公開切替
      new/page.tsx             # 新規作成
      [id]/page.tsx            # 編集・削除
      actions.ts               # 記事のServer Actions(EDITOR以上)
    users/
      page.tsx                 # ユーザー管理(ADMINのみ。非ADMINは notFound)
      actions.ts               # ユーザーのServer Actions(ADMINのみ)
  api/auth/[...nextauth]/route.ts
auth.ts                        # Auth.js 設定本体
lib/
  prisma.ts                    # PrismaClient 共有インスタンス(adapter-pg 経由)
  authz.ts                     # requireRole() 権限チェック
prisma/
  schema.prisma                # User / Post / Role(datasource に url は書かない)
  seed.ts                      # 初期 ADMIN ユーザー投入(upsert なので冪等)
docker-compose.yml             # ローカル PostgreSQL
prisma.config.ts               # Prisma 7 設定(dotenv/config の import 必須)
```

## 権限モデル(重要)

- ロールは `ADMIN` と `EDITOR` の2種類(Prisma enum `Role`)
- **ADMIN は EDITOR の全操作ができ、加えてユーザーの追加・削除ができる**
- 序列判定は `lib/authz.ts` の `requireRole()` で行う(EDITOR=1, ADMIN=2 のレベル比較)
- **ルール: すべての Server Action は冒頭で必ず `requireRole()` を呼ぶ**。UI で隠すだけの権限制御は禁止(サーバー側チェックが本体)
- ユーザー削除には安全弁あり: 自分自身は削除不可、最後の ADMIN は削除不可。この安全弁は維持すること
- 将来: タビイコ本番では「カテゴリ(担当地域)ごとの編集権限」を追加予定。UserCategory 的な中間テーブル + `requireCategoryAccess()` のような拡張を想定

## よく使うコマンド

```bash
docker compose up -d          # ローカルDB起動
npm run dev                   # 開発サーバー(http://localhost:3000)
npx prisma migrate dev        # スキーマ変更の反映(ローカル)
npx prisma generate           # クライアント再生成
npx prisma db seed            # シード投入
npx prisma studio             # DBのGUI確認
```

- ローカルの初期管理者: `admin@example.com`(パスワードは seed.ts 参照)

## 環境変数

- `.env`: `DATABASE_URL`(ローカルは Docker の接続文字列)
- `.env.local`: `AUTH_SECRET`
- 本番(Vercel): `DATABASE_URL`(Neon pooled)と `AUTH_SECRET`(ローカルとは別の値)

## やってはいけないこと

- **本番DB(Neon)に対する migrate / seed を自動実行しない**。本番反映は人間の指示があったときのみ、`.env` を一時的に direct 接続文字列に切り替えて `npx prisma migrate deploy` を手動実行する運用
- `.env` / `.env.local` の書き換え・削除は、事前に内容を提示して確認を取る
- 接続文字列・パスワード等の秘密情報をコードやコミットに含めない(`.gitignore` の `.env*` を外さない)
- `schema.prisma` の datasource に `url` を追加しない(Prisma 7 でエラーになる)
- `src/` ディレクトリを作らない
- ユーザー削除の安全弁(自分自身・最後のADMIN)を外さない

## コーディング方針

- UIテキストは日本語
- スタイリングは Tailwind CSS(既存画面のトーンに合わせる)
- データ更新は Server Actions を基本とする(フォーム + `"use server"`)
- 公開側ページは `published: true` のみ表示。下書きはURL直打ちでも見えないようにする(詳細ページで `!post.published` は notFound)

## Git / デプロイ運用

- main への直接 push はしない。ブランチを切って PR 経由でマージ
- PR / ブランチは Vercel の Preview Deployment で動作確認する
- コミットメッセージは日本語でよい
