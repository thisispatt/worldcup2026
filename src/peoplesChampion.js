// ============================================================
//  PEOPLE'S CHAMPION — overperformance ("surprise") ratings
// ============================================================
//
//  WHAT THIS DOES
//  Every team is scored by how UNLIKELY their results were, not by
//  how far they got. Beating expectations pays; meeting them does not.
//  A team scores points for each match by the "surprise" of the result:
//
//      surprise = -ln( probability of doing AT LEAST this well )
//
//  - A win  -> -ln(pre-match win probability)
//  - A draw -> -ln(win prob + draw prob)        (i.e. "at least a draw")
//  - A loss -> 0                                 (no reward, no penalty)
//
//  A team's rating is the SUM of that surprise across every match they
//  play — group AND knockout. Because a favourite's wins were expected,
//  each is worth almost nothing (e.g. -ln(0.85) ≈ 0.16), so favourites
//  are capped low by design. An underdog's win is worth a lot
//  (e.g. -ln(0.05) ≈ 3.0). The same 4 points means very different
//  ratings for Curaçao vs Brazil — exactly as intended.
//
//  Knockout matches have no pre-stored odds (pairings form as teams
//  advance), so each knockout tie's win probability is derived on the
//  fly from the two teams' pre-tournament strength (see KO_SCALE).
//  The reward for advancing a round = -ln(probability of advancing).
//
//  YOU DON'T EDIT THIS FILE to update results — enter scores in data.js.
//  The probabilities below are pre-tournament Betfair odds, margin-
//  stripped so each match's three outcomes sum to 100%.
// ============================================================

export const matchOdds = {
  "Algeria|Argentina": {"Argentina": 0.6782, "Algeria": 0.1248, "draw": 0.197},
  "Algeria|Austria": {"Algeria": 0.2699, "Austria": 0.4394, "draw": 0.2907},
  "Algeria|Jordan": {"Jordan": 0.1486, "Algeria": 0.6192, "draw": 0.2322},
  "Argentina|Austria": {"Argentina": 0.5752, "Austria": 0.177, "draw": 0.2478},
  "Argentina|Jordan": {"Jordan": 0.0843, "Argentina": 0.773, "draw": 0.1427},
  "Australia|Paraguay": {"Paraguay": 0.434, "Australia": 0.2744, "draw": 0.2916},
  "Australia|T\u00fcrkiye": {"Australia": 0.1889, "T\u00fcrkiye": 0.5557, "draw": 0.2553},
  "Australia|United States": {"United States": 0.543, "Australia": 0.2165, "draw": 0.2405},
  "Austria|Jordan": {"Austria": 0.7198, "Jordan": 0.1101, "draw": 0.1701},
  "Belgium|Egypt": {"Belgium": 0.5668, "Egypt": 0.1871, "draw": 0.2461},
  "Belgium|Iran": {"Belgium": 0.665, "Iran": 0.1311, "draw": 0.2039},
  "Belgium|New Zealand": {"New Zealand": 0.1161, "Belgium": 0.7224, "draw": 0.1615},
  "Bosnia-Herzegovina|Canada": {"Canada": 0.5319, "Bosnia-Herzegovina": 0.2128, "draw": 0.2553},
  "Bosnia-Herzegovina|Qatar": {"Bosnia-Herzegovina": 0.5968, "Qatar": 0.1592, "draw": 0.244},
  "Bosnia-Herzegovina|Switzerland": {"Switzerland": 0.5831, "Bosnia-Herzegovina": 0.1777, "draw": 0.2392},
  "Brazil|Haiti": {"Brazil": 0.8758, "Haiti": 0.0452, "draw": 0.0791},
  "Brazil|Morocco": {"Brazil": 0.5747, "Morocco": 0.1724, "draw": 0.2529},
  "Brazil|Scotland": {"Scotland": 0.1432, "Brazil": 0.642, "draw": 0.2148},
  "Canada|Qatar": {"Canada": 0.7159, "Qatar": 0.098, "draw": 0.1861},
  "Canada|Switzerland": {"Switzerland": 0.4477, "Canada": 0.2699, "draw": 0.2824},
  "Cape Verde|Saudi Arabia": {"Cape Verde": 0.3797, "Saudi Arabia": 0.3544, "draw": 0.2658},
  "Cape Verde|Spain": {"Spain": 0.8604, "Cape Verde": 0.0408, "draw": 0.0988},
  "Cape Verde|Uruguay": {"Uruguay": 0.6586, "Cape Verde": 0.1336, "draw": 0.2078},
  "Colombia|DR Congo": {"Colombia": 0.638, "DR Congo": 0.1316, "draw": 0.2304},
  "Colombia|Portugal": {"Colombia": 0.2757, "Portugal": 0.4359, "draw": 0.2884},
  "Colombia|Uzbekistan": {"Uzbekistan": 0.1246, "Colombia": 0.6677, "draw": 0.2077},
  "Croatia|England": {"England": 0.5463, "Croatia": 0.1987, "draw": 0.255},
  "Croatia|Ghana": {"Croatia": 0.5631, "Ghana": 0.1858, "draw": 0.2511},
  "Croatia|Panama": {"Panama": 0.1607, "Croatia": 0.6025, "draw": 0.2369},
  "Cura\u00e7ao|Ecuador": {"Ecuador": 0.7938, "Cura\u00e7ao": 0.0722, "draw": 0.134},
  "Cura\u00e7ao|Germany": {"Germany": 0.9217, "Cura\u00e7ao": 0.0281, "draw": 0.0502},
  "Cura\u00e7ao|Côte d'Ivoire": {"Cura\u00e7ao": 0.0903, "Côte d'Ivoire": 0.7526, "draw": 0.1571},
  "Czechia|Mexico": {"Czechia": 0.2043, "Mexico": 0.5253, "draw": 0.2704},
  "Czechia|South Africa": {"Czechia": 0.4897, "South Africa": 0.2226, "draw": 0.2877},
  "Czechia|South Korea": {"South Korea": 0.3623, "Czechia": 0.3308, "draw": 0.3068},
  "DR Congo|Portugal": {"Portugal": 0.7383, "DR Congo": 0.0987, "draw": 0.1631},
  "DR Congo|Uzbekistan": {"DR Congo": 0.4146, "Uzbekistan": 0.311, "draw": 0.2744},
  "Ecuador|Germany": {"Ecuador": 0.1956, "Germany": 0.5464, "draw": 0.258},
  "Côte d'Ivoire|Ecuador": {"Côte d'Ivoire": 0.2682, "Ecuador": 0.4081, "draw": 0.3237},
  "Egypt|Iran": {"Egypt": 0.4165, "Iran": 0.2603, "draw": 0.3232},
  "Egypt|New Zealand": {"New Zealand": 0.1958, "Egypt": 0.5385, "draw": 0.2657},
  "England|Ghana": {"England": 0.712, "Ghana": 0.1028, "draw": 0.1851},
  "England|Panama": {"Panama": 0.11, "England": 0.7273, "draw": 0.1626},
  "France|Iraq": {"France": 0.8409, "Iraq": 0.0492, "draw": 0.1099},
  "France|Norway": {"Norway": 0.2206, "France": 0.5147, "draw": 0.2647},
  "France|Senegal": {"France": 0.6486, "Senegal": 0.1344, "draw": 0.217},
  "Côte d'Ivoire|Germany": {"Germany": 0.5943, "Côte d'Ivoire": 0.1755, "draw": 0.2303},
  "Ghana|Panama": {"Ghana": 0.4701, "Panama": 0.2612, "draw": 0.2687},
  "Haiti|Morocco": {"Morocco": 0.6923, "Haiti": 0.1231, "draw": 0.1846},
  "Haiti|Scotland": {"Haiti": 0.1801, "Scotland": 0.6099, "draw": 0.2101},
  "Iran|New Zealand": {"Iran": 0.5073, "New Zealand": 0.2166, "draw": 0.2761},
  "Iraq|Norway": {"Iraq": 0.0778, "Norway": 0.7784, "draw": 0.1437},
  "Iraq|Senegal": {"Senegal": 0.6429, "Iraq": 0.1429, "draw": 0.2143},
  "Japan|Netherlands": {"Netherlands": 0.4713, "Japan": 0.2773, "draw": 0.2514},
  "Japan|Sweden": {"Japan": 0.4569, "Sweden": 0.2676, "draw": 0.2755},
  "Japan|Tunisia": {"Tunisia": 0.177, "Japan": 0.5575, "draw": 0.2655},
  "Mexico|South Africa": {"Mexico": 0.6645, "South Africa": 0.1258, "draw": 0.2097},
  "Mexico|South Korea": {"Mexico": 0.5183, "South Korea": 0.2073, "draw": 0.2744},
  "Morocco|Scotland": {"Scotland": 0.237, "Morocco": 0.4741, "draw": 0.2889},
  "Netherlands|Sweden": {"Netherlands": 0.57, "Sweden": 0.1939, "draw": 0.2361},
  "Netherlands|Tunisia": {"Tunisia": 0.1543, "Netherlands": 0.6254, "draw": 0.2204},
  "Norway|Senegal": {"Norway": 0.4437, "Senegal": 0.274, "draw": 0.2823},
  "Paraguay|T\u00fcrkiye": {"T\u00fcrkiye": 0.4243, "Paraguay": 0.2746, "draw": 0.3011},
  "Paraguay|United States": {"United States": 0.4852, "Paraguay": 0.2365, "draw": 0.2783},
  "Portugal|Uzbekistan": {"Portugal": 0.7373, "Uzbekistan": 0.1024, "draw": 0.1603},
  "Qatar|Switzerland": {"Qatar": 0.0785, "Switzerland": 0.7708, "draw": 0.1507},
  "Saudi Arabia|Spain": {"Spain": 0.8501, "Saudi Arabia": 0.045, "draw": 0.1049},
  "Saudi Arabia|Uruguay": {"Saudi Arabia": 0.1336, "Uruguay": 0.6586, "draw": 0.2078},
  "South Africa|South Korea": {"South Africa": 0.2387, "South Korea": 0.4876, "draw": 0.2738},
  "Spain|Uruguay": {"Uruguay": 0.186, "Spain": 0.5756, "draw": 0.2384},
  "Sweden|Tunisia": {"Sweden": 0.5073, "Tunisia": 0.2166, "draw": 0.2761},
  "T\u00fcrkiye|United States": {"T\u00fcrkiye": 0.3593, "United States": 0.3737, "draw": 0.2669},
};

export const stageOdds = {
  "Algeria": { p: {"qualify": 0.7333, "r16": 0.2667, "qf": 0.1, "sf": 0.0345, "final": 0.0099, "win": 0.0025}, odds: {"qualify": "4/11", "r16": "11/4", "qf": "9/1", "sf": "28/1", "final": "100/1", "win": "400/1"} },
  "Argentina": { p: {"qualify": 0.9804, "r16": 0.6923, "qf": 0.5, "sf": 0.3077, "final": 0.1818, "win": 0.1}, odds: {"qualify": "1/50", "r16": "4/9", "qf": "1/1", "sf": "9/4", "final": "9/2", "win": "9/1"} },
  "Australia": { p: {"qualify": 0.5238, "r16": 0.2105, "qf": 0.0769, "sf": 0.0244, "final": 0.0066, "win": 0.002}, odds: {"qualify": "10/11", "r16": "15/4", "qf": "12/1", "sf": "40/1", "final": "150/1", "win": "500/1"} },
  "Austria": { p: {"qualify": 0.8571, "r16": 0.2857, "qf": 0.125, "sf": 0.0476, "final": 0.0196, "win": 0.0066}, odds: {"qualify": "1/6", "r16": "5/2", "qf": "7/1", "sf": "20/1", "final": "50/1", "win": "150/1"} },
  "Belgium": { p: {"qualify": 0.9706, "r16": 0.619, "qf": 0.3636, "sf": 0.1538, "final": 0.0667, "win": 0.0294}, odds: {"qualify": "1/33", "r16": "8/13", "qf": "7/4", "sf": "11/2", "final": "14/1", "win": "33/1"} },
  "Bosnia-Herzegovina": { p: {"qualify": 0.6923, "r16": 0.25, "qf": 0.0909, "sf": 0.0294, "final": 0.0099, "win": 0.0028}, odds: {"qualify": "4/9", "r16": "3/1", "qf": "10/1", "sf": "33/1", "final": "100/1", "win": "350/1"} },
  "Brazil": { p: {"qualify": 0.9901, "r16": 0.7143, "qf": 0.5, "sf": 0.3077, "final": 0.2, "win": 0.1111}, odds: {"qualify": "1/100", "r16": "2/5", "qf": "1/1", "sf": "9/4", "final": "4/1", "win": "8/1"} },
  "Canada": { p: {"qualify": 0.875, "r16": 0.4444, "qf": 0.1667, "sf": 0.0667, "final": 0.0196, "win": 0.0079}, odds: {"qualify": "1/7", "r16": "5/4", "qf": "5/1", "sf": "14/1", "final": "50/1", "win": "125/1"} },
  "Cape Verde": { p: {"qualify": 0.381, "r16": 0.0769, "qf": 0.0294, "sf": 0.0079, "final": 0.002, "win": 0.0005}, odds: {"qualify": "13/8", "r16": "12/1", "qf": "33/1", "sf": "125/1", "final": "500/1", "win": "2000/1"} },
  "Colombia": { p: {"qualify": 0.8889, "r16": 0.5238, "qf": 0.2857, "sf": 0.1429, "final": 0.0667, "win": 0.0294}, odds: {"qualify": "1/8", "r16": "10/11", "qf": "5/2", "sf": "6/1", "final": "14/1", "win": "33/1"} },
  "Croatia": { p: {"qualify": 0.8182, "r16": 0.4, "qf": 0.1818, "sf": 0.0833, "final": 0.0345, "win": 0.0123}, odds: {"qualify": "2/9", "r16": "6/4", "qf": "9/2", "sf": "11/1", "final": "28/1", "win": "80/1"} },
  "Cura\u00e7ao": { p: {"qualify": 0.1, "r16": 0.0196, "qf": 0.0099, "sf": 0.0033, "final": 0.001, "win": 0.0003}, odds: {"qualify": "9/1", "r16": "50/1", "qf": "100/1", "sf": "300/1", "final": "1000/1", "win": "3500/1"} },
  "Czechia": { p: {"qualify": 0.7333, "r16": 0.3077, "qf": 0.0909, "sf": 0.0345, "final": 0.0099, "win": 0.0033}, odds: {"qualify": "4/11", "r16": "9/4", "qf": "10/1", "sf": "28/1", "final": "100/1", "win": "300/1"} },
  "DR Congo": { p: {"qualify": 0.4762, "r16": 0.1818, "qf": 0.0769, "sf": 0.0196, "final": 0.005, "win": 0.0013}, odds: {"qualify": "11/10", "r16": "9/2", "qf": "12/1", "sf": "50/1", "final": "200/1", "win": "750/1"} },
  "Ecuador": { p: {"qualify": 0.9091, "r16": 0.3636, "qf": 0.1667, "sf": 0.0667, "final": 0.0294, "win": 0.0099}, odds: {"qualify": "1/10", "r16": "7/4", "qf": "5/1", "sf": "14/1", "final": "33/1", "win": "100/1"} },
  "Egypt": { p: {"qualify": 0.7333, "r16": 0.2857, "qf": 0.1, "sf": 0.0345, "final": 0.0099, "win": 0.0033}, odds: {"qualify": "4/11", "r16": "5/2", "qf": "9/1", "sf": "28/1", "final": "100/1", "win": "300/1"} },
  "England": { p: {"qualify": 0.9851, "r16": 0.7692, "qf": 0.5556, "sf": 0.3478, "final": 0.2308, "win": 0.1333}, odds: {"qualify": "1/66", "r16": "3/10", "qf": "4/5", "sf": "15/8", "final": "10/3", "win": "13/2"} },
  "France": { p: {"qualify": 0.9615, "r16": 0.8, "qf": 0.5714, "sf": 0.4211, "final": 0.2667, "win": 0.1667}, odds: {"qualify": "1/25", "r16": "1/4", "qf": "3/4", "sf": "11/8", "final": "11/4", "win": "5/1"} },
  "Germany": { p: {"qualify": 0.9851, "r16": 0.6923, "qf": 0.4211, "sf": 0.2667, "final": 0.1538, "win": 0.0667}, odds: {"qualify": "1/66", "r16": "4/9", "qf": "11/8", "sf": "11/4", "final": "11/2", "win": "14/1"} },
  "Ghana": { p: {"qualify": 0.5789, "r16": 0.2308, "qf": 0.1, "sf": 0.0345, "final": 0.0099, "win": 0.0025}, odds: {"qualify": "8/11", "r16": "10/3", "qf": "9/1", "sf": "28/1", "final": "100/1", "win": "400/1"} },
  "Haiti": { p: {"qualify": 0.1111, "r16": 0.0294, "qf": 0.0196, "sf": 0.0066, "final": 0.002, "win": 0.0004}, odds: {"qualify": "8/1", "r16": "33/1", "qf": "50/1", "sf": "150/1", "final": "500/1", "win": "2500/1"} },
  "Iran": { p: {"qualify": 0.6667, "r16": 0.2222, "qf": 0.0909, "sf": 0.0294, "final": 0.0079, "win": 0.002}, odds: {"qualify": "1/2", "r16": "7/2", "qf": "10/1", "sf": "33/1", "final": "125/1", "win": "500/1"} },
  "Iraq": { p: {"qualify": 0.25, "r16": 0.1111, "qf": 0.0476, "sf": 0.0149, "final": 0.0033, "win": 0.0007}, odds: {"qualify": "3/1", "r16": "8/1", "qf": "20/1", "sf": "66/1", "final": "300/1", "win": "1500/1"} },
  "Côte d'Ivoire": { p: {"qualify": 0.8182, "r16": 0.3077, "qf": 0.1, "sf": 0.0345, "final": 0.0099, "win": 0.0033}, odds: {"qualify": "2/9", "r16": "9/4", "qf": "9/1", "sf": "28/1", "final": "100/1", "win": "300/1"} },
  "Japan": { p: {"qualify": 0.8, "r16": 0.4211, "qf": 0.2222, "sf": 0.1, "final": 0.0385, "win": 0.0196}, odds: {"qualify": "1/4", "r16": "11/8", "qf": "7/2", "sf": "9/1", "final": "25/1", "win": "50/1"} },
  "Jordan": { p: {"qualify": 0.2941, "r16": 0.0588, "qf": 0.0196, "sf": 0.0066, "final": 0.002, "win": 0.0004}, odds: {"qualify": "12/5", "r16": "16/1", "qf": "50/1", "sf": "150/1", "final": "500/1", "win": "2500/1"} },
  "Mexico": { p: {"qualify": 0.9091, "r16": 0.5455, "qf": 0.2222, "sf": 0.1, "final": 0.0385, "win": 0.0149}, odds: {"qualify": "1/10", "r16": "5/6", "qf": "7/2", "sf": "9/1", "final": "25/1", "win": "66/1"} },
  "Morocco": { p: {"qualify": 0.8889, "r16": 0.4444, "qf": 0.2222, "sf": 0.1, "final": 0.0435, "win": 0.0196}, odds: {"qualify": "1/8", "r16": "5/4", "qf": "7/2", "sf": "9/1", "final": "22/1", "win": "50/1"} },
  "Netherlands": { p: {"qualify": 0.9333, "r16": 0.5789, "qf": 0.3846, "sf": 0.2105, "final": 0.1111, "win": 0.0476}, odds: {"qualify": "1/14", "r16": "8/11", "qf": "8/5", "sf": "15/4", "final": "8/1", "win": "20/1"} },
  "New Zealand": { p: {"qualify": 0.3636, "r16": 0.1111, "qf": 0.0385, "sf": 0.0099, "final": 0.0025, "win": 0.0004}, odds: {"qualify": "7/4", "r16": "8/1", "qf": "25/1", "sf": "100/1", "final": "400/1", "win": "2500/1"} },
  "Norway": { p: {"qualify": 0.8333, "r16": 0.5455, "qf": 0.3478, "sf": 0.2, "final": 0.0769, "win": 0.0385}, odds: {"qualify": "1/5", "r16": "5/6", "qf": "15/8", "sf": "4/1", "final": "12/1", "win": "25/1"} },
  "Panama": { p: {"qualify": 0.3636, "r16": 0.125, "qf": 0.0476, "sf": 0.0149, "final": 0.0033, "win": 0.0007}, odds: {"qualify": "7/4", "r16": "7/1", "qf": "20/1", "sf": "66/1", "final": "300/1", "win": "1500/1"} },
  "Paraguay": { p: {"qualify": 0.6667, "r16": 0.2857, "qf": 0.125, "sf": 0.0476, "final": 0.0196, "win": 0.0066}, odds: {"qualify": "1/2", "r16": "5/2", "qf": "7/1", "sf": "20/1", "final": "50/1", "win": "150/1"} },
  "Portugal": { p: {"qualify": 0.9706, "r16": 0.7143, "qf": 0.5, "sf": 0.3077, "final": 0.2, "win": 0.1111}, odds: {"qualify": "1/33", "r16": "2/5", "qf": "1/1", "sf": "9/4", "final": "4/1", "win": "8/1"} },
  "Qatar": { p: {"qualify": 0.25, "r16": 0.0909, "qf": 0.0196, "sf": 0.005, "final": 0.0013, "win": 0.0005}, odds: {"qualify": "3/1", "r16": "10/1", "qf": "50/1", "sf": "200/1", "final": "750/1", "win": "2000/1"} },
  "Saudi Arabia": { p: {"qualify": 0.4762, "r16": 0.2, "qf": 0.0667, "sf": 0.0196, "final": 0.004, "win": 0.001}, odds: {"qualify": "11/10", "r16": "4/1", "qf": "14/1", "sf": "50/1", "final": "250/1", "win": "1000/1"} },
  "Scotland": { p: {"qualify": 0.7333, "r16": 0.2857, "qf": 0.1, "sf": 0.0345, "final": 0.0099, "win": 0.004}, odds: {"qualify": "4/11", "r16": "5/2", "qf": "9/1", "sf": "28/1", "final": "100/1", "win": "250/1"} },
  "Senegal": { p: {"qualify": 0.7143, "r16": 0.2857, "qf": 0.125, "sf": 0.0476, "final": 0.0196, "win": 0.0079}, odds: {"qualify": "2/5", "r16": "5/2", "qf": "7/1", "sf": "20/1", "final": "50/1", "win": "125/1"} },
  "South Africa": { p: {"qualify": 0.4444, "r16": 0.2, "qf": 0.0667, "sf": 0.0196, "final": 0.004, "win": 0.001}, odds: {"qualify": "5/4", "r16": "4/1", "qf": "14/1", "sf": "50/1", "final": "250/1", "win": "1000/1"} },
  "South Korea": { p: {"qualify": 0.7333, "r16": 0.25, "qf": 0.0909, "sf": 0.0294, "final": 0.0066, "win": 0.0025}, odds: {"qualify": "4/11", "r16": "3/1", "qf": "10/1", "sf": "33/1", "final": "150/1", "win": "400/1"} },
  "Spain": { p: {"qualify": 0.9901, "r16": 0.8, "qf": 0.6, "sf": 0.4444, "final": 0.3077, "win": 0.1818}, odds: {"qualify": "1/100", "r16": "1/4", "qf": "4/6", "sf": "5/4", "final": "9/4", "win": "9/2"} },
  "Sweden": { p: {"qualify": 0.6923, "r16": 0.2857, "qf": 0.125, "sf": 0.0476, "final": 0.0196, "win": 0.0079}, odds: {"qualify": "4/9", "r16": "5/2", "qf": "7/1", "sf": "20/1", "final": "50/1", "win": "125/1"} },
  "Switzerland": { p: {"qualify": 0.9231, "r16": 0.5789, "qf": 0.25, "sf": 0.1, "final": 0.0476, "win": 0.0123}, odds: {"qualify": "1/12", "r16": "8/11", "qf": "3/1", "sf": "9/1", "final": "20/1", "win": "80/1"} },
  "Tunisia": { p: {"qualify": 0.381, "r16": 0.1818, "qf": 0.0769, "sf": 0.0244, "final": 0.0066, "win": 0.002}, odds: {"qualify": "13/8", "r16": "9/2", "qf": "12/1", "sf": "40/1", "final": "150/1", "win": "500/1"} },
  "T\u00fcrkiye": { p: {"qualify": 0.8, "r16": 0.4444, "qf": 0.2, "sf": 0.0909, "final": 0.0385, "win": 0.0123}, odds: {"qualify": "1/4", "r16": "5/4", "qf": "4/1", "sf": "10/1", "final": "25/1", "win": "80/1"} },
  "United States": { p: {"qualify": 0.875, "r16": 0.4762, "qf": 0.2308, "sf": 0.1, "final": 0.0435, "win": 0.0149}, odds: {"qualify": "1/7", "r16": "11/10", "qf": "10/3", "sf": "9/1", "final": "22/1", "win": "66/1"} },
  "Uruguay": { p: {"qualify": 0.8889, "r16": 0.4211, "qf": 0.2222, "sf": 0.1, "final": 0.0435, "win": 0.0149}, odds: {"qualify": "1/8", "r16": "11/8", "qf": "7/2", "sf": "9/1", "final": "22/1", "win": "66/1"} },
  "Uzbekistan": { p: {"qualify": 0.381, "r16": 0.0769, "qf": 0.0244, "sf": 0.0099, "final": 0.0025, "win": 0.0007}, odds: {"qualify": "13/8", "r16": "12/1", "qf": "40/1", "sf": "100/1", "final": "400/1", "win": "1500/1"} },
};

const pairKey = (a, b) => [a, b].sort().join("|");

// Surprise earned by `team` in a single GROUP match. Loss => 0.
function groupSurprise(team, opp, teamGoals, oppGoals) {
  const o = matchOdds[pairKey(team, opp)];
  if (!o || o[team] == null) return 0;
  let p;
  if (teamGoals > oppGoals)      p = o[team];            // win
  else if (teamGoals === oppGoals) p = o[team] + o.draw; // at least a draw
  else return 0;                                          // loss
  return p > 0 ? -Math.log(p) : 0;
}

// Anchored knockout step: reward for reaching a stage given you were at the previous one.
//   step = -ln( P(reach this stage) / P(reach previous stage) )      [real bet365 odds]
// The group is scored separately per match, so the first step (reaching R16) is anchored
// on the qualify probability and never re-credits the group escape.
const KO_STEP = {
  R32:   { reached: "r16",   prev: "qualify", label: "reached R16" },
  R16:   { reached: "qf",    prev: "r16",     label: "reached QF" },
  QF:    { reached: "sf",    prev: "qf",      label: "reached SF" },
  SF:    { reached: "final", prev: "sf",      label: "reached Final" },
  Final: { reached: "win",   prev: "final",   label: "champion" },
  // Third-place play-off does not advance the ladder, so it is not scored.
};

function knockoutStep(team, round) {
  const cfg = KO_STEP[round];
  const s = stageOdds[team];
  if (!cfg || !s) return 0;
  const pReached = s.p[cfg.reached], pPrev = s.p[cfg.prev];
  if (!pReached || !pPrev || pReached >= pPrev) return 0;
  return -Math.log(pReached / pPrev);
}

const ROUND_LABEL = { R32: "R32", R16: "R16", QF: "QF", SF: "SF", Third: "3rd place", Final: "Final" };

// Build the full People's Champion table.
//   groups   : { A: { teams:[{name,flag,...}] }, ... }
//   fixtures : group fixtures with score1/score2/played
//   knockout : { R32:[...], R16:[...], ... } ties with home/away/score/played
//   entries  : [{ name, team }]
export function computeChampionTable(groups, fixtures, knockout, entries) {
  const entryMap = {};
  entries.forEach(e => { entryMap[e.team] = e.name; });

  // name -> flag lookup (for opponents shown in the per-game breakdown)
  const flagOf = {};
  Object.values(groups).forEach(g => g.teams.forEach(t => { flagOf[t.name] = t.flag; }));

  // seed every team
  const T = {};
  Object.values(groups).forEach(g => g.teams.forEach(t => {
    T[t.name] = {
      name: t.name, flag: t.flag, shortName: t.shortName,
      colleague: entryMap[t.name],
      played: 0, won: 0, drawn: 0, lost: 0, groupPts: 0,
      rating: 0, stage: "Group", koWins: 0,
      games: [], // per-game breakdown: { round, opp, oppFlag, ha, score, res, r }
    };
  }));

  // record one game for a team (from that team's perspective)
  const addGame = (team, round, opp, ha, teamGoals, oppGoals, r) => {
    const res = teamGoals > oppGoals ? "W" : teamGoals === oppGoals ? "D" : "L";
    team.games.push({
      round, opp, oppFlag: flagOf[opp], ha,
      score: `${teamGoals}\u2013${oppGoals}`, res, r,
    });
  };

  // GROUP matches
  fixtures
    .filter(f => f.played && f.score1 != null && f.score2 != null)
    .forEach(f => {
      const h = T[f.home], a = T[f.away];
      if (!h || !a) return;
      h.played++; a.played++;
      const rH = groupSurprise(f.home, f.away, f.score1, f.score2);
      const rA = groupSurprise(f.away, f.home, f.score2, f.score1);
      if (f.score1 > f.score2)      { h.won++; a.lost++; h.groupPts += 3; }
      else if (f.score1 < f.score2) { a.won++; h.lost++; a.groupPts += 3; }
      else                          { h.drawn++; a.drawn++; h.groupPts += 1; a.groupPts += 1; }
      h.rating += rH; a.rating += rA;
      addGame(h, "Group", f.away, "H", f.score1, f.score2, rH);
      addGame(a, "Group", f.home, "A", f.score2, f.score1, rA);
    });

  // KNOCKOUT matches — reward the team that advances by -ln(P(advance)).
  const rounds = ["R32", "R16", "QF", "SF", "Third", "Final"];
  rounds.forEach(r => {
    (knockout[r] || []).forEach(m => {
      if (!m.played || m.score1 == null || m.score2 == null) return;
      if (!m.home || !m.away) return;
      if (m.score1 === m.score2) return; // tie with no decided winner entered
      const h = T[m.home], a = T[m.away];
      if (!h || !a) return;
      let winner, loser, wTeam, lTeam, wGoals, lGoals;
      if (m.score1 > m.score2) { winner = h; wTeam = m.home; loser = a; lTeam = m.away; wGoals = m.score1; lGoals = m.score2; }
      else                     { winner = a; wTeam = m.away; loser = h; lTeam = m.home; wGoals = m.score2; lGoals = m.score1; }
      winner.played++; loser.played++; winner.koWins++;
      const gain = knockoutStep(wTeam, r);
      winner.rating += gain;
      const tag = (KO_STEP[r] && KO_STEP[r].label) || ROUND_LABEL[r];
      addGame(winner, tag, lTeam, "", wGoals, lGoals, gain);
      addGame(loser,  ROUND_LABEL[r], wTeam, "", lGoals, wGoals, 0);
      // furthest stage reached label
      winner.stage = ROUND_LABEL[r] === "Final" ? "Champion" : `Won ${ROUND_LABEL[r]}`;
      if (loser.stage === "Group" || loser.stage.startsWith("Won") || loser.stage === "Champion") {
        loser.stage = `Out · ${ROUND_LABEL[r]}`;
      }
    });
  });

  // Tournament podium (1st/2nd/3rd). A team that wins a top-3 prize is NOT
  // eligible for the People's Champion, to avoid double-dipping.
  const podiumPlace = {};
  const decided = m => m && m.played && m.home && m.away && m.score1 != null && m.score2 != null && m.score1 !== m.score2;
  const winnerLoser = m => (m.score1 > m.score2 ? [m.home, m.away] : [m.away, m.home]);
  const finalM = (knockout.Final || []).find(decided) || (decided(knockout.final) ? knockout.final : null);
  if (finalM) { const [w, l] = winnerLoser(finalM); podiumPlace[w] = "1st"; podiumPlace[l] = "2nd"; }
  const thirdArr = knockout.Third || (knockout["3rd"] ? [knockout["3rd"]] : []);
  const thirdM = (Array.isArray(thirdArr) ? thirdArr : [thirdArr]).find(decided);
  if (thirdM) { const [w] = winnerLoser(thirdM); podiumPlace[w] = "3rd"; }
  Object.values(T).forEach(t => {
    t.podiumPlace = podiumPlace[t.name] || null;
    t.eligible = !t.podiumPlace;
  });

  return Object.values(T).sort((x, y) =>
    y.rating - x.rating || y.groupPts - x.groupPts || x.name.localeCompare(y.name)
  );
}

// ── Elimination status ───────────────────────────────────────
// Derives each team's live status ("active" | "eliminated") purely from
// results, so the Sweepstakes cards update automatically as scores are entered.
//   • A team that loses a played knockout tie is eliminated.
//   • Once the group stage is complete, any team that didn't qualify is eliminated.
//     "Qualified" = appears in the knockout bracket if it's been filled; otherwise
//     computed from the standings (top 2 per group + 8 best third-placed teams).
//   • The team that wins the final stays active (champion).
function groupStandings(groups, groupFx) {
  const T = {};
  Object.entries(groups).forEach(([g, o]) =>
    o.teams.forEach(t => { T[t.name] = { name: t.name, group: g, pts: 0, gf: 0, ga: 0 }; }));
  groupFx.forEach(f => {
    if (!f.played) return;
    const h = T[f.home], a = T[f.away]; if (!h || !a) return;
    h.gf += f.score1; h.ga += f.score2; a.gf += f.score2; a.ga += f.score1;
    if (f.score1 > f.score2) h.pts += 3;
    else if (f.score1 < f.score2) a.pts += 3;
    else { h.pts++; a.pts++; }
  });
  return T;
}
const cmp = (a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf || a.name.localeCompare(b.name);

function computeQualifiers(groups, groupFx) {
  const T = groupStandings(groups, groupFx);
  const byGroup = {};
  Object.values(T).forEach(t => (byGroup[t.group] ||= []).push(t));
  const qualified = new Set(); const thirds = [];
  Object.values(byGroup).forEach(arr => {
    arr.sort(cmp); qualified.add(arr[0].name); qualified.add(arr[1].name);
    if (arr[2]) thirds.push(arr[2]);
  });
  thirds.sort(cmp).slice(0, 8).forEach(t => qualified.add(t.name));
  return qualified;
}

export function computeTeamStatus(groups, fixtures, knockout) {
  const status = {};
  Object.values(groups).forEach(g => g.teams.forEach(t => { status[t.name] = "active"; }));
  const groupFx = fixtures.filter(f => f.group);
  const groupComplete = groupFx.length > 0 && groupFx.every(f => f.played);

  const rounds = ["R32", "R16", "QF", "SF", "Third", "Final"];
  const koParticipants = new Set();
  let champion = null;
  rounds.forEach(r => (knockout[r] || []).forEach(tie => {
    if (tie.home) koParticipants.add(tie.home);
    if (tie.away) koParticipants.add(tie.away);
    if (tie.played && tie.home && tie.away && tie.score1 !== tie.score2) {
      const homeWin = tie.score1 > tie.score2;
      const loser = homeWin ? tie.away : tie.home;
      if (status[loser] !== undefined) status[loser] = "eliminated";
      if (r === "Final") champion = homeWin ? tie.home : tie.away;
    }
  }));

  if (groupComplete) {
    const qualified = koParticipants.size > 0 ? koParticipants : computeQualifiers(groups, groupFx);
    Object.keys(status).forEach(t => { if (!qualified.has(t)) status[t] = "eliminated"; });
  }
  if (champion) status[champion] = "active";
  return status;
}
