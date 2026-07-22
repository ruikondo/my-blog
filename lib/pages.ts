// 固定ページの定義。ここに列挙した slug のみ編集・表示できる。
// 将来ページを増やすときはこの配列に追加する(+ seed でデフォルト内容を用意)。
export const FIXED_PAGES = [
  { slug: "home", label: "Home" },
  { slug: "service", label: "Service" },
  { slug: "about", label: "About" },
] as const;

export type FixedPageSlug = (typeof FIXED_PAGES)[number]["slug"];

export function isFixedPageSlug(slug: string): slug is FixedPageSlug {
  return FIXED_PAGES.some((p) => p.slug === slug);
}

export function fixedPageLabel(slug: string): string {
  return FIXED_PAGES.find((p) => p.slug === slug)?.label ?? slug;
}
