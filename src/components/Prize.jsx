import { getFlag } from "../flag";
import { computeChampionTable } from "../peoplesChampion";

function getTeamFlag(teamName, groups) {
  for (const g of Object.values(groups)) {
    const t = g.teams.find(t => t.name === teamName);
    if (t) return t.flag;
  }
  return null;
}

export default function Prize({ entries, entryFee, prizes, teamStatus, groups, fixtures = [], knockout = {} }) {
  const paidCount = entries.filter(e => e.name !== "TBD").length;
  const total   = paidCount * entryFee;
  const first   = Math.round(total * prizes.first);
  const second  = Math.round(total * prizes.second);
  const third   = Math.round(total * prizes.third);
  const peoples = Math.round(total * (prizes.peoplesChampion || 0));

  const champion    = entries.find(e => (teamStatus[e.team] || "active") === "champion");
  const runnerUp    = entries.find(e => (teamStatus[e.team] || "active") === "runner-up");
  const thirdPl     = entries.find(e => (teamStatus[e.team] || "active") === "third");

  const pcTable     = computeChampionTable(groups, fixtures, knockout, entries);
  const pcLeader    = pcTable.find(t => t.eligible && t.played > 0);
  const peoplesWinner = pcLeader ? entries.find(e => e.team === pcLeader.name) : null;

  const splits = [
    { place: "1st Place",         pct: "60%",  amount: first,   winner: champion },
    { place: "2nd Place",         pct: "25%",  amount: second,  winner: runnerUp },
    { place: "3rd Place",         pct: "7.5%", amount: third,   winner: thirdPl },
    { place: "People's Champion", pct: "7.5%", amount: peoples, winner: peoplesWinner, note: "Best overperformer" },
  ];

  return (
    <div className="section">
      <div className="section-header">
        <h1 className="section-title">What you're playing for.</h1>
        <p className="section-sub">
          Everyone put in €{entryFee}. Winner takes the lion's share — the rest plays out through the knockouts, with a People&apos;s Champion crowned along the way.
        </p>
      </div>

      <div className="prize-layout">
        {/* Ink hero card */}
        <div className="prize-hero">
          <div className="prize-hero-ghost">€</div>
          <div className="prize-hero-eyebrow">
            <span className="prize-eyebrow-dot" />
            Total pot
          </div>
          <div>
            <div className="prize-hero-total">€{total}</div>
            <div className="prize-hero-kv">
              <div>
                <div className="prize-kv-label">Players</div>
                <div className="prize-kv-value">{paidCount}</div>
              </div>
              <div>
                <div className="prize-kv-label">Entry fee</div>
                <div className="prize-kv-value">€{entryFee}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Split cards */}
        <div className="prize-splits">
          {splits.map(({ place, pct, amount, winner, note }) => (
            <div key={place} className="prize-split-card">
              <div className="prize-split-place">{place}</div>
              <div className="prize-split-amount">€{amount}</div>
              <div className="prize-split-pct">{pct} of pot{note ? ` · ${note}` : ""}</div>
              {winner && (
                <div className="prize-winner">
                  <span className="winner-flag">
                    <img src={getFlag(getTeamFlag(winner.team, groups))} alt={winner.team} />
                  </span>
                  <div>
                    <div className="winner-name">{winner.name}</div>
                    <div className="winner-team">{winner.team}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="prize-info-box" style={{ marginTop: "1.5rem" }}>
        <h3 className="info-box-title">How the draw works</h3>
        <ul className="info-list">
          <li>Each of the 48 teams is randomly assigned to one participant</li>
          <li>The participant whose team wins the World Cup takes home <strong>60%</strong> (€{first})</li>
          <li>The participant whose team finishes as runner-up takes <strong>25%</strong> (€{second})</li>
          <li>The participant whose team wins 3rd place takes <strong>7.5%</strong> (€{third})</li>
          <li>The <strong>People&apos;s Champion</strong> — the team that most overperformed its odds — takes <strong>7.5%</strong> (€{peoples})</li>
        </ul>
      </div>
    </div>
  );
}
