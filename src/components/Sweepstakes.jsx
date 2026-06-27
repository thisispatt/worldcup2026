import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { getFlag, getCrest } from "../flag";
import { teamInfo } from "../teamInfo";
import { computeChampionTable } from "../peoplesChampion";
import { knockoutWinner } from "../data";
import { Trophy } from "./icons";

const STATUS_CONFIG = {
  active:      { bg: null },
  eliminated:  { bg: null },
  champion:    { bg: "#fffbeb" },
  "runner-up": { bg: "#f1f5f9" },
  third:       { bg: "#fff7ed" },
};

const STAGE_LABEL = {
  "Champion":      "Champion",
  "Won R32":       "Through to the round of 16",
  "Won R16":       "Through to the quarter-finals",
  "Won QF":        "Through to the semi-finals",
  "Won SF":        "Through to the final",
  "Won 3rd place": "Finished third",
  "Out · R32":     "Out — round of 32",
  "Out · R16":     "Out — round of 16",
  "Out · QF":      "Out — quarter-finals",
  "Out · SF":      "Out — semi-finals",
  "Out · Final":   "Runners-up",
};
function stageLabel(stage, status) {
  if (STAGE_LABEL[stage]) return STAGE_LABEL[stage];
  if (stage === "Group") return status === "eliminated" ? "Out — group stage" : "Group stage";
  return stage || "Group stage";
}

function getTeamData(teamName, groups) {
  for (const [key, g] of Object.entries(groups)) {
    const t = g.teams.find(t => t.name === teamName);
    if (t) return { status: t.status, flag: t.flag, group: key };
  }
  return { status: "active", flag: null, group: "" };
}

// Group form: the team's three group results, W/D/L (or null if not yet played).
function groupForm(team, fixtures) {
  return (fixtures || [])
    .filter(f => f.group && (f.home === team || f.away === team))
    .map(f => {
      if (f.score1 == null || f.score2 == null) return null;
      const home = f.home === team;
      const gf = home ? f.score1 : f.score2;
      const ga = home ? f.score2 : f.score1;
      return gf > ga ? "W" : gf < ga ? "L" : "D";
    });
}

// Knockout form: result in each stage R32→Final (W advanced, L out, null not reached).
const KO_ROUNDS = [["R32", "32"], ["R16", "16"], ["QF", "QF"], ["SF", "SF"], ["Final", "F"]];
function knockoutForm(team, knockout) {
  return KO_ROUNDS.map(([key, label]) => {
    const arr = knockout && knockout[key];
    const tie = Array.isArray(arr) ? arr.find(m => m.home === team || m.away === team) : null;
    const winner = tie ? knockoutWinner(tie) : null;
    if (!winner) return { label, res: null };
    return { label, res: winner === team ? "W" : "L" };
  });
}

function Chip({ res }) {
  if (!res) return <span className="form-chip form-chip-empty" />;
  return <span className={`form-chip form-chip-${res}`}>{res}</span>;
}

// The body of the expanded card — used both inline (mobile) and in the side panel (desktop).
function DetailBody({ e, info, stage, isChamp, gForm, kForm }) {
  return (
    <>
      <div className="sweep-modal-meta">
        <span>Group {e.group}</span>
        {info.fifaRank && <span>FIFA Rank {info.fifaRank}</span>}
        <span>{isChamp ? <span className="meta-champ"><Trophy className="meta-trophy" /> Champion</span> : stage}</span>
      </div>

      <div className="form-row">
        <div className="form-block">
          <span className="form-label">Group</span>
          <div className="form-chips">{gForm.map((r, idx) => <Chip key={idx} res={r} />)}</div>
        </div>
        <div className="form-block">
          <div className="form-stages">
            {kForm.map((s, idx) => (
              <div key={idx} className="form-stage">
                <span className="form-stage-label">{s.label}</span>
                <Chip res={s.res} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {info.summary && <p className="sweep-modal-summary">{info.summary}</p>}
      {info.strengths && (
        <div className="sweep-modal-sw">
          <h4>Strengths</h4>
          <p>{info.strengths}</p>
        </div>
      )}
      {info.weaknesses && (
        <div className="sweep-modal-sw">
          <h4>Weaknesses</h4>
          <p>{info.weaknesses}</p>
        </div>
      )}
    </>
  );
}

export default function Sweepstakes({ entries, teamStatus, groups, fixtures, knockout, entryFee = 5 }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(null);   // team name of the expanded card
  // Hover devices expand on hover; touch devices toggle on tap.
  const [canHover] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? !window.matchMedia("(hover: none), (pointer: coarse)").matches
      : true);
  // Wide enough for the 4-column grid + side detail panel.
  const [wide, setWide] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(min-width: 980px)").matches
      : true);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(min-width: 980px)");
    const on = () => setWide(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on); };
  }, []);

  // Desktop split layout: 4 columns on the left, detail panel on the right.
  const useSplit = canHover && wide;

  const stageByTeam = useMemo(() => {
    if (!fixtures || !knockout) return {};
    const map = {};
    computeChampionTable(groups, fixtures, knockout, entries).forEach(t => { map[t.name] = t.stage; });
    return map;
  }, [groups, fixtures, knockout, entries]);

  const enriched = useMemo(() =>
    entries.map(e => {
      const data = getTeamData(e.team, groups);
      return { ...e, flagCode: data.flag, group: data.group, status: teamStatus[e.team] || data.status };
    }), [entries, groups, teamStatus]);

  const filtered = enriched.filter(e =>
    search === "" ||
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.team.toLowerCase().includes(search.toLowerCase())
  );

  const playerCount = useMemo(() => entries.filter(e => e.name !== "TBD").length, [entries]);

  // Independent masonry columns: expanding a card only pushes cards in its own column.
  const gridRef = useRef(null);
  const [numCols, setNumCols] = useState(1);
  useLayoutEffect(() => {
    const el = gridRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const COL_MIN = 260, GAP = 11;
    const update = () => {
      const w = el.clientWidth;
      setNumCols(Math.max(1, Math.floor((w + GAP) / (COL_MIN + GAP))));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [useSplit]);

  // Split layout is a fixed 4 columns; otherwise adapt to width.
  const colCount = useSplit ? 4 : numCols;
  const columns = Array.from({ length: colCount }, () => []);
  filtered.forEach((e, i) => columns[i % colCount].push(e));

  const openEntry = open ? filtered.find(e => e.team === open) || null : null;

  const detailProps = (e) => ({
    e,
    info: teamInfo[e.team] || {},
    stage: stageLabel(stageByTeam[e.team], e.status),
    isChamp: stageByTeam[e.team] === "Champion",
    gForm: groupForm(e.team, fixtures),
    kForm: knockoutForm(e.team, knockout),
  });

  const renderCard = (e) => {
    const sc = STATUS_CONFIG[e.status] || STATUS_CONFIG.active;
    const isOut = e.status === "eliminated";
    const isOpen = open === e.team;
    return (
      <div
        key={e.team}
        className={`entry-card entry-clickable${isOut ? " entry-out" : ""}${isOpen ? " entry-open" : ""}`}
        style={sc.bg ? { background: sc.bg } : {}}
        onMouseEnter={() => { if (canHover) setOpen(e.team); }}
        onMouseLeave={() => { if (canHover && !useSplit) setOpen(null); }}
        onClick={() => { if (!canHover) setOpen(isOpen ? null : e.team); }}
      >
        <div className="entry-row">
          <div className="entry-flag">
            <img src={getFlag(e.flagCode)} alt={e.team} />
          </div>
          <div className="entry-info">
            <div className="entry-team">{e.team}</div>
            <div className="entry-name">{e.name === "TBD" ? <em className="tbd">— not assigned —</em> : e.name}</div>
          </div>
          {e.flagCode && (
            <img
              className="entry-crest"
              src={getCrest(e.team)}
              alt=""
              aria-hidden="true"
              onError={ev => { ev.currentTarget.style.display = "none"; }}
            />
          )}
          {e.status === "active" && <span className="status-pulse" />}
        </div>

        {!useSplit && isOpen && (
          <div className="entry-detail"><DetailBody {...detailProps(e)} /></div>
        )}
      </div>
    );
  };

  return (
    <div className="section">
      <div className="section-header">
        <h1 className="section-title">Entrants {playerCount}</h1>
      </div>
      <div className="sweep-controls">
        <div className="sweep-search-wrap">
          <i className="ti ti-search sweep-search-icon" />
          <input
            className="search-input"
            type="search"
            placeholder="Search by team or player"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {useSplit ? (
        <div className="sweep-layout">
          {filtered.length === 0
            ? <div className="empty sweep-empty-span">No entries match your search.</div>
            : columns.map((col, ci) => (
                <div className="entry-col" key={ci}>
                  {col.map(e => renderCard(e))}
                </div>
              ))
          }
          <aside className="sweep-side">
            {openEntry ? (
              <div className="sweep-side-detail">
                <div className="sweep-side-head">
                  <div className="entry-flag">
                    <img src={getFlag(openEntry.flagCode)} alt={openEntry.team} />
                  </div>
                  <div className="entry-info">
                    <div className="entry-team">{openEntry.team}</div>
                    <div className="entry-name">{openEntry.name === "TBD" ? <em className="tbd">— not assigned —</em> : openEntry.name}</div>
                  </div>
                </div>
                <DetailBody {...detailProps(openEntry)} />
              </div>
            ) : (
              <div className="sweep-side-empty">Hover a team to see their group, knockout run and profile.</div>
            )}
          </aside>
        </div>
      ) : (
        <div className={`entry-grid${numCols === 1 ? " sweep-onecol" : ""}`} ref={gridRef}>
          {filtered.length === 0
            ? <div className="empty">No entries match your search.</div>
            : columns.map((col, ci) => (
                <div className="entry-col" key={ci}>
                  {col.map(e => renderCard(e))}
                </div>
              ))
          }
        </div>
      )}
    </div>
  );
}
