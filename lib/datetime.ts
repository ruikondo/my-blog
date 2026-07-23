// 管理画面の日時入力(<input type="datetime-local">)を JST として扱うためのヘルパー。
// 本番サーバーの TZ は UTC のため、入力値をそのまま new Date() すると 9 時間ずれる。
// 日本向けのため、入力・表示ともに Asia/Tokyo で統一する。

const JST_OFFSET = "+09:00";

// Date -> "YYYY-MM-DDTHH:mm"(JST)。datetime-local の defaultValue 用。
export function toJstDateTimeLocal(date: Date): string {
  // sv-SE ロケールは "YYYY-MM-DD HH:mm" 形式で返る
  const s = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  return s.replace(" ", "T");
}

// "YYYY-MM-DDTHH:mm"(JST とみなす)-> Date。空文字は null。
export function parseJstDateTimeLocal(value: string): Date | null {
  const v = value.trim();
  if (!v) return null;
  const date = new Date(`${v}:00${JST_OFFSET}`);
  return isNaN(date.getTime()) ? null : date;
}
