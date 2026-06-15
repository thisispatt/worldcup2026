import { useState, useRef, useEffect, useCallback } from "react";
import { entries, groups, fixtures, knockout, ENTRY_FEE, PRIZES } from "./data";
import Sweepstakes from "./components/Sweepstakes";
import Groups from "./components/Groups";
import Fixtures from "./components/Fixtures";
import Bracket from "./components/Bracket";
import Prize from "./components/Prize";
import PeoplesChampion from "./components/PeoplesChampion";
import { computeTeamStatus } from "./peoplesChampion";
import OddsPage from "./components/OddsPage";
import emblem from "./assets/wc2026-emblem.svg";

const NAV = [
  { id: "sweep",    label: "Entrants", icon: "ti-trophy" },
  { id: "groups",   label: "Groups",      icon: "ti-table" },
  { id: "fixtures", label: "Fixtures",    icon: "ti-calendar-event" },
  { id: "bracket",  label: "Bracket",     icon: "ti-tournament" },
  { id: "champion", label: "People's Champion", icon: "ti-crown" },
  { id: "prize",    label: "Prize Pot",   icon: "ti-coin-euro" },
];

export default function App() {
  const [showOdds, setShowOdds] = useState(false);
  const [active, setActive] = useState("sweep");
  const headerRef = useRef(null);
  const teamStatus = computeTeamStatus(groups, fixtures, knockout);

  // Smooth-scroll to a section, accounting for the sticky header height.
  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const headerH = headerRef.current?.offsetHeight ?? 80;
    const y = el.getBoundingClientRect().top + window.scrollY - headerH - 12;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  // Scroll-spy: highlight the nav item for the section currently in view.
  useEffect(() => {
    if (showOdds) return;
    const headerH = headerRef.current?.offsetHeight ?? 80;
    const els = NAV
      .map((n) => document.getElementById(n.id))
      .filter(Boolean);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: `-${headerH + 8}px 0px -45% 0px`, threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [showOdds]);

  const openOdds = () => setShowOdds(true);
  const closeOdds = () => {
    setShowOdds(false);
    // return the reader to where they drilled in from
    requestAnimationFrame(() => scrollToSection("champion"));
  };

  return (
    <div className="app">
      <div className="nav-wrapper" ref={headerRef}>
        <nav className="nav-pill">
          <div className="logo">
            <div className="logo-badge">
              <img src={emblem} alt="WC 2026" className="logo-emblem" />
            </div>
            <div className="logo-text">
              <div className="logo-title">A Better World™ Cup 2026</div>
              <div className="logo-sub">Sweepstakes</div>
            </div>
          </div>
          <div className="nav-tabs">
            {NAV.map((n) => (
              <button
                key={n.id}
                className={`nav-tab${active === n.id && !showOdds ? " active" : ""}`}
                onClick={() => {
                  if (showOdds) setShowOdds(false);
                  requestAnimationFrame(() => scrollToSection(n.id));
                }}
              >
                <i className={`ti ${n.icon} nav-icon`} />
                <span className="nav-label">{n.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      <main className="main">
        {showOdds ? (
          <OddsPage groups={groups} fixtures={fixtures} onBack={closeOdds} />
        ) : (
          <>
            <section id="sweep" className="scroll-section">
              <Sweepstakes entries={entries} teamStatus={teamStatus} groups={groups} fixtures={fixtures} knockout={knockout} entryFee={ENTRY_FEE} />
            </section>
            <section id="groups" className="scroll-section">
              <Groups groups={groups} fixtures={fixtures} entries={entries} teamStatus={teamStatus} />
            </section>
            <section id="fixtures" className="scroll-section">
              <Fixtures fixtures={fixtures} groups={groups} entries={entries} knockout={knockout} />
            </section>
            <section id="bracket" className="scroll-section">
              <Bracket knockout={knockout} groups={groups} entries={entries} entryFee={ENTRY_FEE} prizes={PRIZES} teamStatus={teamStatus} />
            </section>
            <section id="champion" className="scroll-section">
              <PeoplesChampion groups={groups} fixtures={fixtures} knockout={knockout} entries={entries} onShowOdds={openOdds} />
            </section>
            <section id="prize" className="scroll-section">
              <Prize entries={entries} entryFee={ENTRY_FEE} prizes={PRIZES} teamStatus={teamStatus} groups={groups} fixtures={fixtures} knockout={knockout} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
