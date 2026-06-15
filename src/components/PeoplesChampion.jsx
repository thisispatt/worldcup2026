import { useMemo, useState } from "react";
import { getFlag } from "../flag";
import { computeChampionTable } from "../peoplesChampion";

export default function PeoplesChampion({ groups, fixtures, knockout, entries, onShowOdds }) {
  const table = useMemo(
    () => computeChampionTable(groups, fixtures, knockout, entries),
    [groups, fixtures, knockout, entries]
  );
  const [open, setOpen] = useState({}); // team name -> expanded?

  const toggle = name => setOpen(o => ({ ...o, [name]: !o[name] }));

  const anyPlayed = table.some(t => t.played > 0);
  const leader = table.find(t => t.eligible && t.played > 0) || null;
  const maxRating = Math.max(0.0001, ...table.map(t => t.rating));

  return (
    <div className="section">
      <div className="section-header">
        <h1 className="section-title">People&apos;s Champion</h1>
        <p className="section-sub">
          Over-performance rating — teams score by how <em>unlikely</em> each result was,
          not how far they got. Tap a team to see how each game contributed.{" "}
          <button type="button" className="pc-link" onClick={onShowOdds}>
            See the probabilities behind every match and stage
          </button>.
        </p>
      </div>

      <div className="group-card pc-card">
        <div className="group-header">
          <span className="group-header-left">
            <span className="group-letter-badge" style={{ background: "var(--signal)" }}>
              <i className="ti ti-crown" style={{ fontSize: "0.8rem" }} />
            </span>
            <span className="group-letter">Over-performance ranking</span>
          </span>
          <span className="group-advance-note">Tap a team to see breakdown</span>
        </div>
        <table className="group-table">
          <thead>
            <tr>
              <th className="pc-rank-th"></th>
              <th className="th-team">Team</th>
              <th title="Matches played">Pld</th>
              <th title="Won">W</th>
              <th title="Drawn">D</th>
              <th title="Lost">L</th>
              <th title="Group points">Pts</th>
              <th title="Overperformance rating" className="pc-rating-th">Rating</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              let er = 0; // running rank among eligible teams
              return table.map((t, i) => {
                const pct = Math.round((t.rating / maxRating) * 100);
                if (t.eligible && t.played > 0) er++;
                const rankNum = t.eligible && t.played > 0 ? er : null;
                const medal = anyPlayed && t.eligible && t.played > 0 && er <= 3;
                const isOpen = !!open[t.name];
                const canOpen = t.games.length > 0;
                return (
                  <Row
                    key={t.name}
                    t={t} rankNum={rankNum} pct={pct} medal={medal}
                    isOpen={isOpen} canOpen={canOpen}
                    onToggle={() => canOpen && toggle(t.name)}
                  />
                );
              });
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ t, rankNum, pct, medal, isOpen, canOpen, onToggle }) {
  const faded = t.played === 0 || !t.eligible;
  const maxGameR = Math.max(0.001, ...t.games.map(g => g.r));
  return (
    <>
      <tr
        className={`pc-row${canOpen ? " pc-clickable" : ""}${isOpen ? " pc-open" : ""}${!t.eligible ? " pc-ineligible" : ""}`}
        style={faded ? { opacity: 0.45 } : {}}
        onClick={onToggle}
      >
        <td className="pc-rank">
          {medal
            ? <span className={`pc-medal pc-medal-${rankNum}`}>{rankNum}</span>
            : rankNum != null
              ? <span className="pc-rank-num">{rankNum}</span>
              : <span className="pc-rank-num pc-rank-dash">{t.podiumPlace ? "—" : ""}</span>}
        </td>
        <td className="td-team">
          <div className="td-team-inner">
            {canOpen
              ? <i className="ti ti-chevron-right pc-chev" />
              : <span className="pc-chev-spacer" />}
            <span className="team-flag team-flag-circle">
              <img src={getFlag(t.flag)} alt={t.name} />
            </span>
            <div>
              <div className="team-name-sm">{t.shortName || t.name}</div>
              {t.colleague && t.colleague !== "TBD" && (
                <div className="team-colleague">{t.colleague}</div>
              )}
            </div>
          </div>
        </td>
        <td>{t.played}</td>
        <td>{t.won}</td>
        <td>{t.drawn}</td>
        <td>{t.lost}</td>
        <td className="pts">{t.groupPts}</td>
        <td className="pc-rating-cell">
          <div className="pc-rating-wrap">
            <span className="pc-rating-val">{t.rating.toFixed(2)}</span>
          </div>
        </td>
      </tr>

      {isOpen && (
        <tr className="pc-detail-row">
          <td colSpan={8}>
            <div className="pc-detail">
              {(() => {
                const groupGames = t.games.filter(g => g.round === "Group");
                const koGames = t.games.filter(g => g.round !== "Group");
                const gameRow = (g, gi) => (
                  <div className="pc-game" key={gi}>
                    <span className={`pc-res pc-res-${g.res}`}>{g.res}</span>
                    <span className="pc-game-flag">
                      <img src={getFlag(g.oppFlag)} alt={g.opp} />
                    </span>
                    <span className="pc-game-opp">
                      {g.opp}
                      {g.round !== "Group" && (
                        <span className="pc-game-ha">{g.round}</span>
                      )}
                    </span>
                    <span className="pc-game-score">{g.score}</span>
                    <div className="pc-game-pts-wrap">
                      <span className={`pc-game-pts ${g.r > 0 ? "pos" : "zero"}`}>
                        +{g.r.toFixed(2)}
                      </span>
                      <div
                        className="pc-game-pts-bar"
                        style={{ width: `${Math.max(4, (g.r / maxGameR) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
                return (
                  <>
                    {groupGames.length > 0 && <div className="pc-phase">Group stage</div>}
                    {groupGames.map(gameRow)}
                    {koGames.length > 0 && <div className="pc-phase">Knockouts</div>}
                    {koGames.map((g, gi) => gameRow(g, `ko${gi}`))}
                  </>
                );
              })()}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
