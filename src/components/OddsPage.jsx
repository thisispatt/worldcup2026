import { useMemo, useState } from "react";
import { getFlag } from "../flag";
import { matchOdds, stageOdds } from "../peoplesChampion";

const pairKey = (a, b) => [a, b].sort().join("|");
const pct = p => (p == null ? "—" : `${(p * 100).toFixed(1)}%`);

export default function OddsPage({ groups, fixtures, onBack }) {
  const [view, setView] = useState("stage"); // "stage" | "match"

  const flagOf = useMemo(() => {
    const m = {};
    Object.values(groups).forEach(g => g.teams.forEach(t => { m[t.name] = t.flag; }));
    return m;
  }, [groups]);

  // Stage rows, sorted by win probability (favourites first)
  const stageRows = useMemo(
    () => Object.entries(stageOdds)
      .map(([name, d]) => ({ name, flag: flagOf[name], ...d }))
      .sort((a, b) => b.p.win - a.p.win),
    [flagOf]
  );

  // Group matches with their margin-stripped probabilities
  const matchRows = useMemo(
    () => fixtures
      .filter(f => f.group)
      .map(f => {
        const o = matchOdds[pairKey(f.home, f.away)] || {};
        return {
          group: f.group, home: f.home, away: f.away,
          homeFlag: flagOf[f.home], awayFlag: flagOf[f.away],
          pHome: o[f.home], pDraw: o.draw, pAway: o[f.away],
        };
      }),
    [fixtures, flagOf]
  );

  return (
    <div className="section">
      <div className="section-header">
        <button className="odds-back" onClick={onBack}>
          <i className="ti ti-arrow-left" /> Back to People&apos;s Champion
        </button>
        <h1 className="section-title">Probabilities</h1>
        <p className="section-sub">
          The pre-tournament odds behind every rating, converted to probabilities.
          Group matches drive the group-stage scores; the stage odds drive the
          anchored knockout scores. Match odds are margin-stripped per game; stage
          odds are shown as implied from the listed price.
        </p>
      </div>

      <div className="odds-toggle">
        <button className={view === "stage" ? "on" : ""} onClick={() => setView("stage")}>Stage odds (knockout)</button>
        <button className={view === "match" ? "on" : ""} onClick={() => setView("match")}>Match odds (group)</button>
      </div>

      {view === "stage" && (
        <div className="group-card">
          <div className="odds-card">
            <table className="group-table odds-table">
              <thead>
                <tr>
                  <th className="th-team">Team</th>
                  <th>Qualify</th><th>R16</th><th>QF</th><th>SF</th><th>Final</th><th>Win</th>
                </tr>
              </thead>
              <tbody>
                {stageRows.map(r => (
                  <tr key={r.name}>
                    <td className="td-team">
                      <div className="td-team-inner">
                        <span className="team-flag team-flag-circle"><img src={getFlag(r.flag)} alt={r.name} /></span>
                        <span className="team-name-sm">{r.name}</span>
                      </div>
                    </td>
                    <td>{pct(r.p.qualify)}</td>
                    <td>{pct(r.p.r16)}</td>
                    <td>{pct(r.p.qf)}</td>
                    <td>{pct(r.p.sf)}</td>
                    <td>{pct(r.p.final)}</td>
                    <td className="pts">{pct(r.p.win)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === "match" && (
        <div className="group-card">
          <div className="odds-card">
            <table className="group-table odds-table">
              <thead>
                <tr>
                  <th>Group</th>
                  <th className="th-team">Match</th>
                  <th>Home</th><th>Draw</th><th>Away</th>
                </tr>
              </thead>
              <tbody>
                {matchRows.map((m, i) => (
                  <tr key={i}>
                    <td className="odds-grp">{m.group}</td>
                    <td className="td-team odds-match">
                      <span className="team-flag team-flag-circle odds-flag-sm"><img src={getFlag(m.homeFlag)} alt={m.home} /></span>
                      <span className="odds-team">{m.home}</span>
                      <span className="odds-v">v</span>
                      <span className="odds-team">{m.away}</span>
                      <span className="team-flag team-flag-circle odds-flag-sm"><img src={getFlag(m.awayFlag)} alt={m.away} /></span>
                    </td>
                    <td>{pct(m.pHome)}</td>
                    <td>{pct(m.pDraw)}</td>
                    <td>{pct(m.pAway)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="pc-foot">
        Group-match probabilities are margin-stripped (the three outcomes sum to 100%).
        Stage probabilities are implied directly from each listed price, so across a whole
        market they sum to more than 100% — that bookmaker margin cancels out in the
        anchored ratio (reach-this-stage ÷ reach-previous-stage) used for scoring.
      </p>
    </div>
  );
}
