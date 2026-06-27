import { useRef, useEffect, useState, useCallback } from "react";
import { getFlag } from "../flag";
import { knockoutWinner } from "../data";

function getTeamFlag(teamName, groups) {
  if (!teamName) return null;
  for (const g of Object.values(groups)) {
    const t = g.teams.find(t => t.name === teamName);
    if (t) return t.flag;
  }
  return null;
}

function MatchNode({ match, groups, entryMap, nodeRef }) {
  const w = knockoutWinner(match);
  const hasPens = match.pens1 != null && match.pens2 != null;

  const Side = ({ name, flag, colName, score, pen }) => {
    const tbd = !name;
    const isWin  = w != null && name === w;
    const isLoss = w != null && name !== w;
    return (
      <div className={`ko-side${isWin ? " ko-side-win" : isLoss ? " ko-side-loss" : ""}`}>
        <span className="ko-side-left">
          {tbd
            ? <span className="ko-crest-tbd" />
            : flag
              ? <img src={getFlag(flag)} alt={name} className={`ko-crest${isLoss ? " ko-crest-dim" : ""}`} />
              : <span className="ko-crest-tbd" />
          }
          <span className="ko-side-name">
            <span>{name || "To be decided"}</span>
            {colName && <span className="ko-colleague">{colName}</span>}
          </span>
        </span>
        {match.score1 != null && (
          <span className="ko-side-score">
            {score}{hasPens && <span className="ko-side-pens"> ({pen})</span>}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      ref={nodeRef}
      data-match={match.id}
      className={`ko-node${match.score1 != null ? " ko-node-played" : ""}${(!match.home && !match.away) ? " ko-node-empty" : ""}`}
    >
      <div className="ko-node-header">
        <span className="ko-node-date">{match.date || "TBD"}</span>
        {match.score1 == null && match.time && <span className="ko-node-time">{match.time}</span>}
      </div>
      <Side name={match.home} flag={getTeamFlag(match.home, groups)} colName={match.home ? entryMap[match.home] : null} score={match.score1} pen={match.pens1} />
      <div className="ko-node-divider" />
      <Side name={match.away} flag={getTeamFlag(match.away, groups)} colName={match.away ? entryMap[match.away] : null} score={match.score2} pen={match.pens2} />
    </div>
  );
}

function buildParentMap(knockout) {
  const map = {};
  const chain = [
    ["R32", "R16"],
    ["R16", "QF"],
    ["QF",  "SF"],
    ["SF",  "Final"],
  ];
  chain.forEach(([src, dst]) => {
    const srcMatches = knockout[src] || [];
    const dstMatches = knockout[dst] || [];
    srcMatches.forEach((m, i) => {
      const parent = dstMatches[Math.floor(i / 2)];
      if (parent) map[m.id] = parent.id;
    });
  });
  return map;
}

const ROUND_KEYS   = ["R32", "R16", "QF", "SF"];
const ROUND_LABELS = { R32: "Round of 32", R16: "Round of 16", QF: "Quarter-finals", SF: "Semi-finals" };

export default function Bracket({ knockout, groups, entries, entryFee, prizes, teamStatus = {} }) {
  const entryMap = {};
  entries.forEach(e => { entryMap[e.team] = e.name !== "TBD" ? e.name : null; });

  const finalMatch = knockout.Final?.[0];
  const thirdMatch = knockout.Third?.[0];

  const wrapRef  = useRef(null);
  const svgRef   = useRef(null);
  const nodeRefs = useRef({});
  const [paths, setPaths] = useState([]);

  const recalc = useCallback(() => {
    const wrap = wrapRef.current;
    const svg  = svgRef.current;
    if (!wrap || !svg) return;
    const wRect = wrap.getBoundingClientRect();
    const parentMap = buildParentMap(knockout);
    const newPaths = [];

    Object.entries(nodeRefs.current).forEach(([id, el]) => {
      if (!el) return;
      const parentId = parentMap[id];
      if (!parentId) return;
      const parentEl = nodeRefs.current[parentId];
      if (!parentEl) return;
      const s = el.getBoundingClientRect();
      const d = parentEl.getBoundingClientRect();
      const x1 = s.right  - wRect.left;
      const y1 = s.top    + s.height / 2 - wRect.top;
      const x2 = d.left   - wRect.left;
      const y2 = d.top    + d.height / 2 - wRect.top;
      const cx = (x1 + x2) / 2;
      newPaths.push(`M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`);
    });

    setPaths(newPaths);
  }, [knockout]);

  useEffect(() => {
    recalc();
    const ob = new ResizeObserver(recalc);
    if (wrapRef.current) ob.observe(wrapRef.current);
    return () => ob.disconnect();
  }, [recalc]);

  return (
    <div className="section">
      <div className="section-header">
        <h1 className="section-title">Knockout bracket</h1>
        <p className="section-sub">From the Round of 32 to the World Cup Final</p>
      </div>

      <div className="bracket-bleed">
      <div className="bracket-scroll">
        <div className="bracket" ref={wrapRef} style={{ position: "relative" }}>

          {/* SVG bezier connectors */}
          <svg
            ref={svgRef}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}
            aria-hidden="true"
          >
            {paths.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="var(--signal-lt)" strokeWidth="1.5" strokeLinecap="round" />
            ))}
          </svg>

          {/* R32 → SF rounds */}
          {ROUND_KEYS.map(key => (
            <div key={key} className="bracket-round">
              <h2 className="bracket-title">{ROUND_LABELS[key]}</h2>
              <div className="bracket-body">
                {(knockout[key] || []).map(m => (
                  <div key={m.id} className="bracket-cell">
                    <MatchNode
                      match={m}
                      groups={groups}
                      entryMap={entryMap}
                      nodeRef={el => { nodeRefs.current[m.id] = el; }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Finals column — Final centered, Third below */}
          <div className="bracket-round">
            <h2 className="bracket-title">Final</h2>
            <div className="bracket-body" style={{ position: "relative" }}>
              {finalMatch && (
                <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: 0, right: 0 }}>
                  <MatchNode
                    match={finalMatch}
                    groups={groups}
                    entryMap={entryMap}
                    nodeRef={el => { nodeRefs.current[finalMatch.id] = el; }}
                  />
                </div>
              )}
              {thirdMatch && (
                <div style={{ position: "absolute", top: "calc(50% + 108px)", left: 0, right: 0 }}>
                  <MatchNode
                    match={thirdMatch}
                    groups={groups}
                    entryMap={entryMap}
                    nodeRef={el => { nodeRefs.current[thirdMatch.id] = el; }}
                  />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      </div>
    </div>
  );
}
