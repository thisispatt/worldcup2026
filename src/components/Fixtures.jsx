import { useState, useMemo } from "react";
import { getFlag } from "../flag";

const STAGE_FILTERS = [
  { key: "Group", label: "Group" },
  { key: "R32",   label: "R32" },
  { key: "R16",   label: "R16" },
  { key: "QF",    label: "Quarter-finals" },
  { key: "SF",    label: "Semi-finals" },
  { key: "Finals",label: "Finals" },
];
const GROUP_LETTERS = ["A","B","C","D","E","F","G","H","I","J","K","L"];
const ROUND_LABEL = { R32: "Round of 32", R16: "Round of 16", QF: "Quarter-finals", SF: "Semi-finals" };
const MONTH = { Jan:1, Feb:2, Mar:3, Apr:4, May:5, Jun:6, Jul:7, Aug:8, Sep:9, Oct:10, Nov:11, Dec:12 };
const fixtureSort = (a, b) => {
  const d = f => { const [day, mon] = (f.date || "").split(" "); return (MONTH[mon] || 0) * 100 + (parseInt(day) || 0); };
  return d(a) - d(b) || (a.time || "").localeCompare(b.time || "");
};

function getTeamFlag(teamName, groups) {
  if (!teamName) return null;
  for (const g of Object.values(groups)) {
    const t = g.teams.find(t => t.name === teamName);
    if (t) return t.flag;
  }
  return null;
}

// A stage counts as "finished" once every match in it has a recorded score.
// An empty/not-yet-populated round (e.g. QF before teams are known) is never
// considered finished, so we don't skip past it.
const STAGE_ORDER = ["Group", "R32", "R16", "QF", "SF", "Finals"];
const isPlayed = m => m.score1 != null && m.score2 != null;

function isStageComplete(key, fixtures, knockout) {
  if (key === "Group") return fixtures.length > 0 && fixtures.every(isPlayed);
  if (key === "Finals") {
    const matches = [...(knockout.Final || []), ...(knockout.Third || [])];
    return matches.length > 0 && matches.every(isPlayed);
  }
  const matches = knockout[key] || [];
  return matches.length > 0 && matches.every(isPlayed);
}

// Default to the first stage that isn't fully finished yet — e.g. once every
// R32 game has a score, the view opens on R16 instead of a "finished" round.
function getDefaultStage(fixtures, knockout) {
  for (const key of STAGE_ORDER) {
    if (!isStageComplete(key, fixtures, knockout)) return key;
  }
  return STAGE_ORDER[STAGE_ORDER.length - 1];
}

export default function Fixtures({ fixtures, groups, entries, knockout = {} }) {
  const [stage, setStage] = useState(() => getDefaultStage(fixtures, knockout));
  const [activeGroup, setActiveGroup] = useState("all");
  const [search, setSearch] = useState("");

  const entryMap = useMemo(() => {
    const map = {};
    entries.forEach(e => { map[e.team] = e.name !== "TBD" ? e.name : null; });
    return map;
  }, [entries]);

  const displayList = useMemo(() => {
    let list;
    if (stage === "Group") {
      const grouped = activeGroup === "all"
        ? [...fixtures].sort(fixtureSort)
        : fixtures.filter(f => f.group === activeGroup);
      list = grouped.map(f => ({ ...f, roundLabel: `Group ${f.group}` }));
    } else if (stage === "Finals") {
      list = [
        ...(knockout.Final  || []).map(m => ({ ...m, roundLabel: "Final" })),
        ...(knockout.Third  || []).map(m => ({ ...m, roundLabel: "3rd Place Play-off" })),
      ].sort(fixtureSort);
    } else {
      // Underlying knockout[stage] arrays are ordered by bracket position (so
      // Bracket.jsx's connectors line up), not kickoff time — sort by date/time
      // here so the Fixtures list always reads chronologically.
      list = (knockout[stage] || []).map(m => ({ ...m, roundLabel: ROUND_LABEL[stage] })).sort(fixtureSort);
    }

    if (!search.trim()) return list;
    const q = search.trim().toLowerCase();
    return list.filter(f => {
      const home = (f.home || "").toLowerCase();
      const away = (f.away || "").toLowerCase();
      const homeName = (entryMap[f.home] || "").toLowerCase();
      const awayName = (entryMap[f.away] || "").toLowerCase();
      return home.includes(q) || away.includes(q) || homeName.includes(q) || awayName.includes(q);
    });
  }, [fixtures, knockout, stage, activeGroup, search, entryMap]);

  return (
    <div className="section">
      <div className="section-header">
        <h1 className="section-title">Fixtures</h1>
        <p className="section-sub">All matches from the group stage through to the final</p>
      </div>

      {/* Stage filter + search on same row */}
      <div className="fixture-filter-row">
        <div className="group-tabs" style={{ marginBottom: 0 }}>
          {STAGE_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              className={`group-tab${stage === key ? " group-tab-active" : ""}`}
              onClick={() => { setStage(key); setActiveGroup("all"); setSearch(""); }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="fixture-search-wrap" style={{ marginBottom: 0 }}>
          <i className="ti ti-search fixture-search-icon" />
          <input
            className="fixture-search"
            type="search"
            placeholder="Search by team or player"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="fixture-search-clear" onClick={() => setSearch("")} aria-label="Clear search">
              <i className="ti ti-x" />
            </button>
          )}
        </div>
      </div>

      {/* Group letter sub-filter */}
      {stage === "Group" && (
        <div className="group-tabs" style={{ marginTop: "0.5rem" }}>
          <button
            className={`group-tab${activeGroup === "all" ? " group-tab-active" : ""}`}
            onClick={() => setActiveGroup("all")}
          >
            All
          </button>
          {GROUP_LETTERS.map(g => (
            <button
              key={g}
              className={`group-tab${activeGroup === g ? " group-tab-active" : ""}`}
              onClick={() => setActiveGroup(g)}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      <div className="fixtures-list" style={{ marginTop: "1.25rem" }}>
        {displayList.length === 0 && (
          <div className="empty">
            {search.trim() ? `No fixtures match "${search.trim()}".` : "No fixtures yet for this stage."}
          </div>
        )}
        {displayList.map(f => {
          const homeFlag = getTeamFlag(f.home, groups);
          const awayFlag = getTeamFlag(f.away, groups);
          const homeName = entryMap[f.home];
          const awayName = entryMap[f.away];
          const homeWin = f.score1 != null && f.score1 > f.score2;
          const awayWin = f.score1 != null && f.score2 > f.score1;
          return (
            <div key={f.id} className={`fixture-row${f.score1 != null ? " fixture-played" : ""}`}>
              <div className="fixture-meta">
                <span className="fixture-group">{f.roundLabel}</span>
                <span className="fixture-date">{f.date}</span>
                <span className="fixture-time">{f.time}</span>
              </div>
              <div className="fixture-match">
                <div className="fixture-team fixture-home">
                  <div className="fixture-team-info fixture-team-info-home">
                    <span className={homeWin ? "winner" : f.score1 != null ? "fixture-loser" : ""}>{f.home || "TBD"}</span>
                    {homeName && <span className="fixture-colleague">{homeName}</span>}
                  </div>
                  {homeFlag
                    ? <img src={getFlag(homeFlag)} alt={f.home} className="fixture-flag fixture-flag-circle" />
                    : <span className="fixture-flag-tbd" />}
                </div>
                <div className="fixture-score">
                  {f.score1 != null
                    ? <span className="score-result">{f.score1} – {f.score2}</span>
                    : <span className="score-vs">{f.time}</span>
                  }
                </div>
                <div className="fixture-team fixture-away">
                  {awayFlag
                    ? <img src={getFlag(awayFlag)} alt={f.away} className="fixture-flag fixture-flag-circle" />
                    : <span className="fixture-flag-tbd" />}
                  <div className="fixture-team-info fixture-team-info-away">
                    <span className={awayWin ? "winner" : f.score1 != null ? "fixture-loser" : ""}>{f.away || "TBD"}</span>
                    {awayName && <span className="fixture-colleague">{awayName}</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
