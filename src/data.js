// ============================================================
//  SWEEPSTAKES DATA — edit this file to update the app
// ============================================================
//
//  HOW TO UPDATE AFTER A MATCH:
//  1. Find the fixture below (search by team names or id)
//  2. Change score1 and score2 from null to the goals scored
//  3. Change played: false  to  played: true
//  That's it — standings calculate automatically!
//
//  EXAMPLE:
//  Before: { id: 49, home: "France", away: "Senegal", score1: null, score2: null, played: false },
//  After:  { id: 49, home: "France", away: "Senegal", score1: 2,    score2: 0,    played: true  },
//
//  All times are Irish local time (IST)
// ============================================================

export const ENTRY_FEE = 5;
export const PRIZES = { first: 0.60, second: 0.25, third: 0.075, peoplesChampion: 0.075 };

// ----------------------------------------------------------------
// PARTICIPANTS — replace "TBD" with colleague names as they enter
// ----------------------------------------------------------------
export const entries = [
  { name: "Vitor E", team: "Algeria" },
  { name: "Sean C", team: "Argentina" },
  { name: "Jennifer C", team: "Australia" },
  { name: "Hugh O", team: "Austria" },
  { name: "Orla K", team: "Belgium" },
  { name: "Claire C", team: "Bosnia-Herzegovina" },
  { name: "Sarah H", team: "Brazil" },
  { name: "Joseph H", team: "Canada" },
  { name: "Aine D", team: "Cape Verde" },
  { name: "James Mc", team: "Colombia" },
  { name: "David O", team: "Croatia" },
  { name: "Jayne L", team: "Curaçao" },
  { name: "Eric C", team: "Czechia" },
  { name: "Roisin C", team: "DR Congo" },
  { name: "Sophia K", team: "Ecuador" },
  { name: "Vicky D", team: "Egypt" },
  { name: "Rachel M", team: "England" },
  { name: "Paul T", team: "France" },
  { name: "Alexandre C", team: "Germany" },
  { name: "Nicola B", team: "Ghana" },
  { name: "Gareth C", team: "Haiti" },
  { name: "Fiona Mc", team: "Iran" },
  { name: "James M", team: "Iraq" },
  { name: "Matthew C", team: "Côte d'Ivoire" },
  { name: "Niamh F", team: "Japan" },
  { name: "Brian T. O", team: "Jordan" },
  { name: "Chloe G", team: "Mexico" },
  { name: "Alana FP", team: "Morocco" },
  { name: "Kate C", team: "Netherlands" },
  { name: "Breandan O", team: "New Zealand" },
  { name: "Michael G", team: "Norway" },
  { name: "Jolene Q", team: "Panama" },
  { name: "Paul D", team: "Paraguay" },
  { name: "Robert S", team: "Portugal" },
  { name: "Karen W", team: "Qatar" },
  { name: "Siobhan R", team: "Saudi Arabia" },
  { name: "Katrina D", team: "Scotland" },
  { name: "Mark F", team: "Senegal" },
  { name: "Colm B", team: "South Africa" },
  { name: "Morgane C", team: "South Korea" },
  { name: "Patrick G", team: "Spain" },
  { name: "George S", team: "Sweden" },
  { name: "Frank Mc", team: "Switzerland" },
  { name: "Martin F", team: "Tunisia" },
  { name: "Karina Mc", team: "Türkiye" },
  { name: "Tara K", team: "United States" },
  { name: "Chris P", team: "Uruguay" },
  { name: "Oonagh W", team: "Uzbekistan" },
];

// ----------------------------------------------------------------
// GROUPS — team names, flags and status only.
// W / D / L / GF / GA are calculated automatically from fixtures.
// ----------------------------------------------------------------
export const groups = {
  A: { teams: [
    { name: "Mexico",       flag: "mx", status: "active" },
    { name: "South Africa", flag: "za", status: "active" },
    { name: "South Korea",  flag: "kr", status: "active" },
    { name: "Czechia",      flag: "cz", status: "active" },
  ]},
  B: { teams: [
    { name: "Canada",               flag: "ca", status: "active" },
    { name: "Bosnia-Herzegovina", flag: "ba", shortName: "Bosnia-Herz", status: "active" },
    { name: "Qatar",                flag: "qa", status: "active" },
    { name: "Switzerland",          flag: "ch", status: "active" },
  ]},
  C: { teams: [
    { name: "Brazil",   flag: "br", status: "active" },
    { name: "Morocco",  flag: "ma", status: "active" },
    { name: "Haiti",    flag: "ht", status: "active" },
    { name: "Scotland", flag: "gb-sct", status: "active" },
  ]},
  D: { teams: [
    { name: "United States", flag: "us", status: "active" },
    { name: "Paraguay",      flag: "py", status: "active" },
    { name: "Australia",     flag: "au", status: "active" },
    { name: "Türkiye",       flag: "tr", status: "active" },
  ]},
  E: { teams: [
    { name: "Germany",     flag: "de", status: "active" },
    { name: "Curaçao",     flag: "cw", status: "active" },
    { name: "Côte d'Ivoire", flag: "ci", status: "active" },
    { name: "Ecuador",     flag: "ec", status: "active" },
  ]},
  F: { teams: [
    { name: "Netherlands", flag: "nl", status: "active" },
    { name: "Japan",       flag: "jp", status: "active" },
    { name: "Sweden",      flag: "se", status: "active" },
    { name: "Tunisia",     flag: "tn", status: "active" },
  ]},
  G: { teams: [
    { name: "Belgium",     flag: "be", status: "active" },
    { name: "Egypt",       flag: "eg", status: "active" },
    { name: "Iran",        flag: "ir", status: "active" },
    { name: "New Zealand", flag: "nz", status: "active" },
  ]},
  H: { teams: [
    { name: "Spain",        flag: "es", status: "active" },
    { name: "Cape Verde",   flag: "cv", status: "active" },
    { name: "Saudi Arabia", flag: "sa", status: "active" },
    { name: "Uruguay",      flag: "uy", status: "active" },
  ]},
  I: { teams: [
    { name: "France",  flag: "fr", status: "active" },
    { name: "Senegal", flag: "sn", status: "active" },
    { name: "Iraq",    flag: "iq", status: "active" },
    { name: "Norway",  flag: "no", status: "active" },
  ]},
  J: { teams: [
    { name: "Argentina", flag: "ar", status: "active" },
    { name: "Algeria",   flag: "dz", status: "active" },
    { name: "Austria",   flag: "at", status: "active" },
    { name: "Jordan",    flag: "jo", status: "active" },
  ]},
  K: { teams: [
    { name: "Portugal",   flag: "pt", status: "active" },
    { name: "DR Congo",   flag: "cd", status: "active" },
    { name: "Uzbekistan", flag: "uz", status: "active" },
    { name: "Colombia",   flag: "co", status: "active" },
  ]},
  L: { teams: [
    { name: "England", flag: "gb-eng", status: "active" },
    { name: "Croatia", flag: "hr",     status: "active" },
    { name: "Ghana",   flag: "gh",     status: "active" },
    { name: "Panama",  flag: "pa",     status: "active" },
  ]},
};

// ----------------------------------------------------------------
// FIXTURES — official FIFA schedule, Irish local time (IST)
// Change score1, score2, and played when a match is finished.
// ----------------------------------------------------------------
export const fixtures = [
  // ── GROUP A ──────────────────────────────────────────────
  { id: 1,  group: "A", date: "11 Jun", time: "20:00", home: "Mexico",       away: "South Africa",        score1: 2, score2: 0, played: true },
  { id: 2,  group: "A", date: "12 Jun", time: "03:00", home: "South Korea",  away: "Czechia",             score1: 2, score2: 1, played: true },
  { id: 3,  group: "A", date: "18 Jun", time: "17:00", home: "Czechia",      away: "South Africa",        score1: null, score2: null, played: false },
  { id: 4,  group: "A", date: "19 Jun", time: "02:00", home: "Mexico",       away: "South Korea",         score1: null, score2: null, played: false },
  { id: 5,  group: "A", date: "25 Jun", time: "02:00", home: "Czechia",      away: "Mexico",              score1: null, score2: null, played: false },
  { id: 6,  group: "A", date: "25 Jun", time: "02:00", home: "South Africa", away: "South Korea",         score1: null, score2: null, played: false },

  // ── GROUP B ──────────────────────────────────────────────
  { id: 7,  group: "B", date: "12 Jun", time: "20:00", home: "Canada",               away: "Bosnia-Herzegovina", score1: 1, score2: 1, played: true },
  { id: 8,  group: "B", date: "13 Jun", time: "20:00", home: "Qatar",                away: "Switzerland",          score1: 1, score2: 1, played: true },
  { id: 9,  group: "B", date: "18 Jun", time: "20:00", home: "Switzerland",          away: "Bosnia-Herzegovina", score1: null, score2: null, played: false },
  { id: 10, group: "B", date: "18 Jun", time: "23:00", home: "Canada",               away: "Qatar",                score1: null, score2: null, played: false },
  { id: 11, group: "B", date: "24 Jun", time: "20:00", home: "Switzerland",          away: "Canada",               score1: null, score2: null, played: false },
  { id: 12, group: "B", date: "24 Jun", time: "20:00", home: "Bosnia-Herzegovina", away: "Qatar",                score1: null, score2: null, played: false },

  // ── GROUP C ──────────────────────────────────────────────
  { id: 13, group: "C", date: "13 Jun", time: "23:00", home: "Brazil",   away: "Morocco",  score1: 1, score2: 1, played: true },
  { id: 14, group: "C", date: "14 Jun", time: "02:00", home: "Haiti",    away: "Scotland", score1: 0, score2: 1, played: true },
  { id: 15, group: "C", date: "19 Jun", time: "23:00", home: "Scotland", away: "Morocco",  score1: null, score2: null, played: false },
  { id: 16, group: "C", date: "20 Jun", time: "01:30", home: "Brazil",   away: "Haiti",    score1: null, score2: null, played: false },
  { id: 17, group: "C", date: "24 Jun", time: "23:00", home: "Scotland", away: "Brazil",   score1: null, score2: null, played: false },
  { id: 18, group: "C", date: "24 Jun", time: "23:00", home: "Morocco",  away: "Haiti",    score1: null, score2: null, played: false },

  // ── GROUP D ──────────────────────────────────────────────
  { id: 19, group: "D", date: "13 Jun", time: "02:00", home: "United States", away: "Paraguay",  score1: 4, score2: 1, played: true },
  { id: 20, group: "D", date: "14 Jun", time: "05:00", home: "Australia",     away: "Türkiye",   score1: 2, score2: 0, played: true },
  { id: 21, group: "D", date: "19 Jun", time: "20:00", home: "United States", away: "Australia", score1: null, score2: null, played: false },
  { id: 22, group: "D", date: "20 Jun", time: "04:00", home: "Türkiye",       away: "Paraguay",  score1: null, score2: null, played: false },
  { id: 23, group: "D", date: "26 Jun", time: "03:00", home: "Türkiye",       away: "United States", score1: null, score2: null, played: false },
  { id: 24, group: "D", date: "26 Jun", time: "03:00", home: "Paraguay",      away: "Australia", score1: null, score2: null, played: false },

  // ── GROUP E ──────────────────────────────────────────────
  { id: 25, group: "E", date: "14 Jun", time: "18:00", home: "Germany",     away: "Curaçao",     score1: 7, score2: 1, played: true },
  { id: 26, group: "E", date: "15 Jun", time: "00:00", home: "Côte d'Ivoire", away: "Ecuador",     score1: 1, score2: 0, played: true },
  { id: 27, group: "E", date: "20 Jun", time: "21:00", home: "Germany",     away: "Côte d'Ivoire", score1: null, score2: null, played: false },
  { id: 28, group: "E", date: "21 Jun", time: "01:00", home: "Ecuador",     away: "Curaçao",     score1: null, score2: null, played: false },
  { id: 29, group: "E", date: "25 Jun", time: "21:00", home: "Curaçao",     away: "Côte d'Ivoire", score1: null, score2: null, played: false },
  { id: 30, group: "E", date: "25 Jun", time: "21:00", home: "Ecuador",     away: "Germany",     score1: null, score2: null, played: false },

  // ── GROUP F ──────────────────────────────────────────────
  { id: 31, group: "F", date: "14 Jun", time: "21:00", home: "Netherlands", away: "Japan",       score1: 2, score2: 2, played: true },
  { id: 32, group: "F", date: "15 Jun", time: "03:00", home: "Sweden",      away: "Tunisia",     score1: 5, score2: 1, played: true },
  { id: 33, group: "F", date: "20 Jun", time: "18:00", home: "Netherlands", away: "Sweden",      score1: null, score2: null, played: false },
  { id: 34, group: "F", date: "21 Jun", time: "05:00", home: "Tunisia",     away: "Japan",       score1: null, score2: null, played: false },
  { id: 35, group: "F", date: "26 Jun", time: "00:00", home: "Japan",       away: "Sweden",      score1: null, score2: null, played: false },
  { id: 36, group: "F", date: "26 Jun", time: "00:00", home: "Tunisia",     away: "Netherlands", score1: null, score2: null, played: false },

  // ── GROUP G ──────────────────────────────────────────────
  { id: 37, group: "G", date: "15 Jun", time: "20:00", home: "Belgium",     away: "Egypt",       score1: 1, score2: 1, played: true },
  { id: 38, group: "G", date: "16 Jun", time: "02:00", home: "Iran",        away: "New Zealand", score1: 2, score2: 2, played: true },
  { id: 39, group: "G", date: "21 Jun", time: "20:00", home: "Belgium",     away: "Iran",        score1: null, score2: null, played: false },
  { id: 40, group: "G", date: "22 Jun", time: "02:00", home: "New Zealand", away: "Egypt",       score1: null, score2: null, played: false },
  { id: 41, group: "G", date: "27 Jun", time: "04:00", home: "Egypt",       away: "Iran",        score1: null, score2: null, played: false },
  { id: 42, group: "G", date: "27 Jun", time: "04:00", home: "New Zealand", away: "Belgium",     score1: null, score2: null, played: false },

  // ── GROUP H ──────────────────────────────────────────────
  { id: 43, group: "H", date: "15 Jun", time: "17:00", home: "Spain",        away: "Cape Verde",   score1: 0, score2: 0, played: true },
  { id: 44, group: "H", date: "15 Jun", time: "23:00", home: "Saudi Arabia", away: "Uruguay",      score1: 1, score2: 1, played: true },
  { id: 45, group: "H", date: "21 Jun", time: "17:00", home: "Spain",        away: "Saudi Arabia", score1: null, score2: null, played: false },
  { id: 46, group: "H", date: "21 Jun", time: "23:00", home: "Uruguay",      away: "Cape Verde",   score1: null, score2: null, played: false },
  { id: 47, group: "H", date: "27 Jun", time: "01:00", home: "Cape Verde",   away: "Saudi Arabia", score1: null, score2: null, played: false },
  { id: 48, group: "H", date: "27 Jun", time: "01:00", home: "Uruguay",      away: "Spain",        score1: null, score2: null, played: false },

  // ── GROUP I ──────────────────────────────────────────────
  { id: 49, group: "I", date: "16 Jun", time: "20:00", home: "France",  away: "Senegal", score1: 3, score2: 1, played: true },
  { id: 50, group: "I", date: "16 Jun", time: "23:00", home: "Iraq",    away: "Norway",  score1: 1, score2: 4, played: true },
  { id: 51, group: "I", date: "22 Jun", time: "22:00", home: "France",  away: "Iraq",    score1: null, score2: null, played: false },
  { id: 52, group: "I", date: "23 Jun", time: "01:00", home: "Norway",  away: "Senegal", score1: null, score2: null, played: false },
  { id: 53, group: "I", date: "26 Jun", time: "20:00", home: "Norway",  away: "France",  score1: null, score2: null, played: false },
  { id: 54, group: "I", date: "26 Jun", time: "20:00", home: "Senegal", away: "Iraq",    score1: null, score2: null, played: false },

  // ── GROUP J ──────────────────────────────────────────────
  { id: 55, group: "J", date: "17 Jun", time: "02:00", home: "Argentina", away: "Algeria",  score1: 3, score2: 0, played: true },
  { id: 56, group: "J", date: "17 Jun", time: "05:00", home: "Austria",   away: "Jordan",   score1: 3, score2: 1, played: true },
  { id: 57, group: "J", date: "22 Jun", time: "18:00", home: "Argentina", away: "Austria",  score1: null, score2: null, played: false },
  { id: 58, group: "J", date: "23 Jun", time: "04:00", home: "Jordan",    away: "Algeria",  score1: null, score2: null, played: false },
  { id: 59, group: "J", date: "28 Jun", time: "03:00", home: "Algeria",   away: "Austria",  score1: null, score2: null, played: false },
  { id: 60, group: "J", date: "28 Jun", time: "03:00", home: "Jordan",    away: "Argentina",score1: null, score2: null, played: false },

  // ── GROUP K ──────────────────────────────────────────────
  { id: 61, group: "K", date: "17 Jun", time: "18:00", home: "Portugal",   away: "DR Congo",   score1: null, score2: null, played: false },
  { id: 62, group: "K", date: "18 Jun", time: "03:00", home: "Uzbekistan", away: "Colombia",   score1: null, score2: null, played: false },
  { id: 63, group: "K", date: "23 Jun", time: "18:00", home: "Portugal",   away: "Uzbekistan", score1: null, score2: null, played: false },
  { id: 64, group: "K", date: "24 Jun", time: "03:00", home: "Colombia",   away: "DR Congo",   score1: null, score2: null, played: false },
  { id: 65, group: "K", date: "28 Jun", time: "00:30", home: "Colombia",   away: "Portugal",   score1: null, score2: null, played: false },
  { id: 66, group: "K", date: "28 Jun", time: "00:30", home: "DR Congo",   away: "Uzbekistan", score1: null, score2: null, played: false },

  // ── GROUP L ──────────────────────────────────────────────
  { id: 67, group: "L", date: "17 Jun", time: "21:00", home: "England",  away: "Croatia", score1: null, score2: null, played: false },
  { id: 68, group: "L", date: "18 Jun", time: "00:00", home: "Ghana",    away: "Panama",  score1: null, score2: null, played: false },
  { id: 69, group: "L", date: "23 Jun", time: "21:00", home: "England",  away: "Ghana",   score1: null, score2: null, played: false },
  { id: 70, group: "L", date: "24 Jun", time: "00:00", home: "Panama",   away: "Croatia", score1: null, score2: null, played: false },
  { id: 71, group: "L", date: "27 Jun", time: "22:00", home: "Panama",   away: "England", score1: null, score2: null, played: false },
  { id: 72, group: "L", date: "27 Jun", time: "22:00", home: "Croatia",  away: "Ghana",   score1: null, score2: null, played: false },
];

// ----------------------------------------------------------------
// KNOCKOUT BRACKET — fill in as teams advance
// ----------------------------------------------------------------
export const knockout = {
  R32: [
    { id: "r32-1",  home: null, away: null, score1: null, score2: null, played: false, date: "28 Jun", time: "20:00" },
    { id: "r32-2",  home: null, away: null, score1: null, score2: null, played: false, date: "29 Jun", time: "18:00" },
    { id: "r32-3",  home: null, away: null, score1: null, score2: null, played: false, date: "29 Jun", time: "21:30" },
    { id: "r32-4",  home: null, away: null, score1: null, score2: null, played: false, date: "30 Jun", time: "02:00" },
    { id: "r32-5",  home: null, away: null, score1: null, score2: null, played: false, date: "30 Jun", time: "18:00" },
    { id: "r32-6",  home: null, away: null, score1: null, score2: null, played: false, date: "30 Jun", time: "22:00" },
    { id: "r32-7",  home: null, away: null, score1: null, score2: null, played: false, date: "1 Jul",  time: "02:00" },
    { id: "r32-8",  home: null, away: null, score1: null, score2: null, played: false, date: "1 Jul",  time: "17:00" },
    { id: "r32-9",  home: null, away: null, score1: null, score2: null, played: false, date: "1 Jul",  time: "21:00" },
    { id: "r32-10", home: null, away: null, score1: null, score2: null, played: false, date: "2 Jul",  time: "01:00" },
    { id: "r32-11", home: null, away: null, score1: null, score2: null, played: false, date: "2 Jul",  time: "20:00" },
    { id: "r32-12", home: null, away: null, score1: null, score2: null, played: false, date: "3 Jul",  time: "00:00" },
    { id: "r32-13", home: null, away: null, score1: null, score2: null, played: false, date: "3 Jul",  time: "04:00" },
    { id: "r32-14", home: null, away: null, score1: null, score2: null, played: false, date: "3 Jul",  time: "19:00" },
    { id: "r32-15", home: null, away: null, score1: null, score2: null, played: false, date: "3 Jul",  time: "23:00" },
    { id: "r32-16", home: null, away: null, score1: null, score2: null, played: false, date: "4 Jul",  time: "02:30" },
  ],
  R16: [
    { id: "r16-1", home: null, away: null, score1: null, score2: null, played: false, date: "4 Jul",  time: "18:00" },
    { id: "r16-2", home: null, away: null, score1: null, score2: null, played: false, date: "4 Jul",  time: "22:00" },
    { id: "r16-3", home: null, away: null, score1: null, score2: null, played: false, date: "5 Jul",  time: "21:00" },
    { id: "r16-4", home: null, away: null, score1: null, score2: null, played: false, date: "6 Jul",  time: "01:00" },
    { id: "r16-5", home: null, away: null, score1: null, score2: null, played: false, date: "6 Jul",  time: "20:00" },
    { id: "r16-6", home: null, away: null, score1: null, score2: null, played: false, date: "7 Jul",  time: "01:00" },
    { id: "r16-7", home: null, away: null, score1: null, score2: null, played: false, date: "7 Jul",  time: "17:00" },
    { id: "r16-8", home: null, away: null, score1: null, score2: null, played: false, date: "7 Jul",  time: "21:00" },
  ],
  QF: [
    { id: "qf-1", home: null, away: null, score1: null, score2: null, played: false, date: "9 Jul",  time: "21:00" },
    { id: "qf-2", home: null, away: null, score1: null, score2: null, played: false, date: "10 Jul", time: "20:00" },
    { id: "qf-3", home: null, away: null, score1: null, score2: null, played: false, date: "11 Jul", time: "22:00" },
    { id: "qf-4", home: null, away: null, score1: null, score2: null, played: false, date: "12 Jul", time: "02:00" },
  ],
  SF: [
    { id: "sf-1", home: null, away: null, score1: null, score2: null, played: false, date: "14 Jul", time: "20:00" },
    { id: "sf-2", home: null, away: null, score1: null, score2: null, played: false, date: "15 Jul", time: "20:00" },
  ],
  Third: [
    { id: "3rd", home: null, away: null, score1: null, score2: null, played: false, date: "18 Jul", time: "22:00" },
  ],
  Final: [
    { id: "final", home: null, away: null, score1: null, score2: null, played: false, date: "19 Jul", time: "20:00" },
  ],
};
