/**
 * Project cover assets under public/assets/projects/<id>.jpg
 * Bump COVER_V when replacing images (cache bust).
 */
export const COVER_V = "20260726e";

const KNOWN_COVER_IDS = new Set([
  "cangjie-ict",
  "ai-output-formatter",
  "offer-pilot",
  "harmony-ticket-agent",
  "zhonghe",
  "personal-ai-workbench",
  "workbench",
  "aether",
  "sticker-forge",
  "todos-clone",
  "zhishen-dun",
  "zhidun",
  "smart-silver",
  "digital-bomb",
  "harmonyos-dev",
  "new-energy-inspection",
]);

export function hasProjectCover(id: string): boolean {
  return KNOWN_COVER_IDS.has(id);
}

/** Absolute site path with cache bust */
export function projectCoverUrl(id: string): string | undefined {
  if (!hasProjectCover(id)) return undefined;
  return `/assets/projects/${id}.jpg?v=${COVER_V}`;
}

export function projectCoverAlt(title: string): string {
  return `${title} 项目封面`;
}
