// Cloudflare Turnstile(ロボット判定)の設定とサーバー側検証。
//
// 環境変数:
//   NEXT_PUBLIC_TURNSTILE_SITE_KEY  … ウィジェット表示用(公開してよい)
//   TURNSTILE_SECRET_KEY            … サーバー検証用(秘密)
//
// 開発環境で未設定の場合のみ、Cloudflare 公式のテスト用キー(常に成功)を使う。
// 本番ビルド(Vercel の Preview / Production を含む)で未設定の場合は
// 送信を受け付けない(検証をすり抜けないよう fail closed)。

const isDev = process.env.NODE_ENV !== "production";

// https://developers.cloudflare.com/turnstile/troubleshooting/testing/
const TEST_SITE_KEY = "1x00000000000000000000AA";
const TEST_SECRET_KEY = "1x0000000000000000000000000000000AA";

export const turnstileSiteKey =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || (isDev ? TEST_SITE_KEY : "");

export async function verifyTurnstile(
  token: string,
  remoteIp?: string | null,
): Promise<boolean> {
  const secret =
    process.env.TURNSTILE_SECRET_KEY || (isDev ? TEST_SECRET_KEY : "");
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY が設定されていません");
    return false;
  }
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body, cache: "no-store" },
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (e) {
    console.error("Turnstile の検証に失敗しました", e);
    return false;
  }
}
