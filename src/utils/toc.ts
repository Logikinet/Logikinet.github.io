export interface TocHeading {
  depth: number;
  slug: string;
  text: string;
}

export function buildToc(headings: { depth: number; slug: string; text: string }[]): TocHeading[] {
  return headings
    .filter((h) => h.depth >= 2 && h.depth <= 3)
    .map((h) => ({ depth: h.depth, slug: h.slug, text: h.text }));
}
