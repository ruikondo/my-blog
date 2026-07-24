// サイトの絶対 URL(sitemap / robots で使用)。
// 優先: 明示設定の NEXT_PUBLIC_SITE_URL(独自ドメイン等)
//   → Vercel の本番ドメイン(VERCEL_PROJECT_PRODUCTION_URL)
//   → ローカル
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}
