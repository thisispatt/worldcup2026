import { useMemo, useState } from "react";
import { getFlag } from "../flag";

function calcStandings(teams, fixtures) {
  const stats = {};
  teams.forEach(t => {
    stats[t.name] = { ...t, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0 };
  });
  fixtures
    .filter(f => f.score1 !== null && f.score2 !== null)
    .forEach(f => {
      const h = stats[f.home];
      const a = stats[f.away];
      if (!h || !a) return;
      h.played++; a.played++;
      h.gf += f.score1; h.ga += f.score2;
      a.gf += f.score2; a.ga += f.score1;
      if (f.score1 > f.score2)      { h.won++;   a.lost++;  }
      else if (f.score1 < f.score2) { a.won++;   h.lost++;  }
      else                          { h.drawn++; a.drawn++; }
    });
  return Object.values(stats).sort((a, b) => {
    const pts = x => x.won * 3 + x.drawn;
    const gd  = x => x.gf - x.ga;
    return pts(b) - pts(a) || gd(b) - gd(a) || b.gf - a.gf || a.name.localeCompare(b.name);
  });
}

export default function Groups({ groups, fixtures, entries, teamStatus = {} }) {
  const [search, setSearch] = useState("");

  const entryMap = useMemo(() => {
    const map = {};
    entries.forEach(e => { map[e.team] = e.name; });
    return map;
  }, [entries]);

  const computed = useMemo(() =>
    Object.entries(groups).map(([letter, g]) => ({
      letter,
      standings: calcStandings(g.teams, fixtures.filter(f => f.group === letter)),
    })),
  [groups, fixtures]);

  const q = search.trim().toLowerCase();

  const matches = (team) => {
    if (!q) return false;
    const colleague = entryMap[team.name] || "";
    return team.name.toLowerCase().includes(q) ||
      (team.shortName || "").toLowerCase().includes(q) ||
      colleague.toLowerCase().includes(q);
  };

  return (
    <div className="section">
      <div className="section-header">
        <h1 className="section-title">Group stage</h1>
        <p className="section-sub">The top 2 from each group advance automatically. The 8 best third-place finishers across all 12 groups also go through — completing the Round of 32.</p>
      </div>

      <div className="fixture-search-wrap" style={{ marginBottom: "1.5rem" }}>
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

      <div className="groups-grid">
        {computed.map(({ letter, standings }) => {
          const anyMatch = q && standings.some(t => matches(t));
          return (
            <div key={letter} className={`group-card${anyMatch ? " group-card-active-search" : ""}`}>
              <div className="group-header">
                <span className="group-header-left">
                  <span className="group-letter-badge">{letter}</span>
                  <span className="group-letter">Group {letter}</span>
                </span>
                <span className="group-advance-note">Top 2 advance · best 3rds may also</span>
              </div>
              <table className="group-table">
                <thead>
                  <tr>
                    <th className="th-team">Team</th>
                    <th title="Played">P</th>
                    <th title="Won">W</th>
                    <th title="Drawn">D</th>
                    <th title="Lost">L</th>
                    <th title="Goal difference">GD</th>
                    <th title="Points">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team, idx) => {
                    const pts = team.won * 3 + team.drawn;
                    const gd  = team.gf - team.ga;
                    const through = idx < 2;
                    const eliminated = teamStatus[team.name] === "eliminated";
                    const colleague = entryMap[team.name];
                    const isMatch = matches(team);
                    const isDim   = q && !isMatch;
                    return (
                      <tr
                        key={team.name}
                        className={[
                          through    ? "row-qualify"   : "",
                          eliminated ? "row-out"       : "",
                          isMatch    ? "row-highlight" : "",
                          isDim      ? "row-dim-search": "",
                        ].filter(Boolean).join(" ")}
                      >
                        <td className="td-team">
                          <div className="td-team-inner">
                            {through && <span className="qualify-bar-left" />}
                            <span className="rank-num">{idx + 1}</span>
                            <span className="team-flag team-flag-circle">
                              <img src={getFlag(team.flag)} alt={team.name} />
                            </span>
                            <div>
                              <div className="team-name-sm">{team.shortName || team.name}</div>
                              {colleague && colleague !== "TBD" && (
                                <div className="team-colleague">{colleague}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>{team.played}</td>
                        <td>{team.won}</td>
                        <td>{team.drawn}</td>
                        <td>{team.lost}</td>
                        <td className={gd > 0 ? "pos" : gd < 0 ? "neg" : ""}>{gd > 0 ? "+" : ""}{gd}</td>
                        <td className="pts">{pts}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
