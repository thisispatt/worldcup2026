export function getFlag(code) {
  if (!code) return null;
  return `https://flagcdn.com/w80/${code}.png`;
}

// Team crest (badge) image. Pattern confirmed:
//   .../crests/{slug}_badge.png   e.g. mexico_badge.png, curacao_badge.png
// Default slug: lowercase, strip accents, non-alphanumerics -> underscore.
// Override here if the Guardian used a different slug for a given team.
const CREST_BASE =
  "https://interactive.guim.co.uk/atoms/2026/04/world-cup-player-guide-2026/assets/v/1780676707960/imgs/crests/";

const CREST_SLUG_OVERRIDES = {
  "Türkiye": "turkey",
  "United States": "usa",
  "Côte d'Ivoire": "cote-d-ivoire",
  "Bosnia-Herzegovina": "bosnia-and-herzegovina",
};

export function crestSlug(teamName) {
  if (CREST_SLUG_OVERRIDES[teamName]) return CREST_SLUG_OVERRIDES[teamName];
  return teamName
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Curaçao -> Curacao
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // spaces, hyphens, etc. -> single hyphen
    .replace(/^-+|-+$/g, "");
}

export function getCrest(teamName) {
  if (!teamName) return null;
  return `${CREST_BASE}${crestSlug(teamName)}_badge.png`;
}
