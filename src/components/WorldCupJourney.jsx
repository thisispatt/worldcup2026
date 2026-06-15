import { useState, useMemo, useRef, useEffect } from "react";

/* =====================================================================
   World Cup 2026 — Group-stage journey visualisations (MOCKUPS v3)
   ---------------------------------------------------------------------
   • Trail grid   — one lane per team. All start on the 0-axis, travel by
                    FIFA-tiebreaker distance in the group phase, then snap
                    into a knockout column the moment they're known to be in.
   • Journey lines— a normal multi-series line chart: every team starts
                    stacked at the origin (0,0) and fans out. x = stage,
                    y = performance. Flags are de-cluttered so none overlap;
                    comet trails dissipate toward the tail.
   • Stage boxes  — faint dotted boxes per stage; flags float into whichever
                    box matches where they are in the competition.
   • Survival funnel — bonus: 48 -> 1.

   Illustrative projection (real scores used where present, rest filled from
   FIFA rank). No play button — it flows once on load, then the scrubber replays.
   ===================================================================== */

/* ---------------------------- DATA ---------------------------------- */
const GROUPS = {
  A:[["Mexico","mx"],["South Africa","za"],["South Korea","kr"],["Czechia","cz"]],
  B:[["Canada","ca"],["Bosnia-Herzegovina","ba"],["Qatar","qa"],["Switzerland","ch"]],
  C:[["Brazil","br"],["Morocco","ma"],["Haiti","ht"],["Scotland","gb-sct"]],
  D:[["United States","us"],["Paraguay","py"],["Australia","au"],["Türkiye","tr"]],
  E:[["Germany","de"],["Curaçao","cw"],["Côte d'Ivoire","ci"],["Ecuador","ec"]],
  F:[["Netherlands","nl"],["Japan","jp"],["Sweden","se"],["Tunisia","tn"]],
  G:[["Belgium","be"],["Egypt","eg"],["Iran","ir"],["New Zealand","nz"]],
  H:[["Spain","es"],["Cape Verde","cv"],["Saudi Arabia","sa"],["Uruguay","uy"]],
  I:[["France","fr"],["Senegal","sn"],["Iraq","iq"],["Norway","no"]],
  J:[["Argentina","ar"],["Algeria","dz"],["Austria","at"],["Jordan","jo"]],
  K:[["Portugal","pt"],["DR Congo","cd"],["Uzbekistan","uz"],["Colombia","co"]],
  L:[["England","gb-eng"],["Croatia","hr"],["Ghana","gh"],["Panama","pa"]],
};
const RANK = {"Mexico":15,"South Africa":60,"South Korea":25,"Czechia":41,"Canada":30,"Bosnia-Herzegovina":64,"Qatar":55,"Switzerland":19,"Brazil":6,"Morocco":7,"Haiti":82,"Scotland":43,"United States":16,"Paraguay":40,"Australia":27,"Türkiye":22,"Germany":10,"Curaçao":83,"Côte d'Ivoire":34,"Ecuador":24,"Netherlands":8,"Japan":18,"Sweden":38,"Tunisia":46,"Belgium":9,"Egypt":29,"Iran":21,"New Zealand":85,"Spain":2,"Cape Verde":68,"Saudi Arabia":61,"Uruguay":17,"France":1,"Senegal":14,"Iraq":57,"Norway":31,"Argentina":3,"Algeria":28,"Austria":23,"Jordan":63,"Portugal":5,"DR Congo":45,"Uzbekistan":50,"Colombia":13,"England":4,"Croatia":11,"Ghana":73,"Panama":33};
const COLLEAGUE = {"Algeria":"Vitor E","Argentina":"Sean C","Australia":"Jennifer C","Austria":"Hugh O","Belgium":"Orla K","Bosnia-Herzegovina":"Claire C","Brazil":"Sarah H","Canada":"Joseph H","Cape Verde":"Aine D","Colombia":"James Mc","Croatia":"David O","Curaçao":"Jayne L","Czechia":"Eric C","DR Congo":"Roisin C","Ecuador":"Sophia K","Egypt":"Vicky D","England":"Rachel M","France":"Paul T","Germany":"Alexandre C","Ghana":"Nicola B","Haiti":"Gareth C","Iran":"Fiona Mc","Iraq":"James M","Côte d'Ivoire":"Matthew C","Japan":"Niamh F","Jordan":"Brian T. O","Mexico":"Chloe G","Morocco":"Alana FP","Netherlands":"Kate C","New Zealand":"Breandan O","Norway":"Michael G","Panama":"Jolene Q","Paraguay":"Paul D","Portugal":"Robert S","Qatar":"Karen W","Saudi Arabia":"Siobhan R","Scotland":"Katrina D","Senegal":"Mark F","South Africa":"Colm B","South Korea":"Morgane C","Spain":"Patrick G","Sweden":"George S","Switzerland":"Frank Mc","Tunisia":"Martin F","Türkiye":"Karina Mc","United States":"Tara K","Uruguay":"Chris P","Uzbekistan":"Oonagh W"};
const REAL = { "Mexico|South Africa":[2,0], "South Korea|Czechia":[2,1] };
const flagUrl = (c) => `https://flagcdn.com/w80/${c}.png`;

/* ------------------------- PROJECTION ------------------------------- */
const SCHED = [[[0,1],[2,3]],[[0,2],[3,1]],[[3,0],[1,2]]];
const PTS = (w,d)=>w*3+d;
const perfOf = (pts,gd,gf)=>pts+gd*0.03+gf*0.0018;
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return ((h>>>0)%100000)/100000;}
function projectScore(home,away){
  const k=`${home}|${away}`;
  if(REAL[k])return REAL[k];
  if(REAL[`${away}|${home}`]){const[a,b]=REAL[`${away}|${home}`];return[b,a];}
  const gap=(RANK[away]-RANK[home])/100, noise=(hash(k)-0.5)*1.1, edge=gap*2.4+noise;
  return [Math.min(5,Math.max(0,Math.round(1.3+edge))), Math.min(5,Math.max(0,Math.round(1.3-edge)))];
}
const STAGE_ORDER = ["Group","R32","R16","QF","SF","Final"];
const STAGE_IDX = { Group:0,R32:1,R16:2,QF:3,SF:4,Final:5 };
const STAGE_LABEL = { Group:"GROUP STAGE", R32:"ROUND OF 32", R16:"ROUND OF 16", QF:"QUARTER-FINALS", SF:"SEMI-FINALS", Final:"FINAL" };
const STEPS = [
  {short:"Kickoff", label:"Kick-off — no matches played yet"},
  {short:"MD1",     label:"Matchday 1"},
  {short:"MD2",     label:"Matchday 2"},
  {short:"MD3",     label:"Group stage complete"},
  {short:"R32",     label:"Round of 32 — teams drawn in"},
  {short:"R16",     label:"Round of 16"},
  {short:"QF",      label:"Quarter-finals"},
  {short:"SF",      label:"Semi-finals"},
  {short:"Final",   label:"Final & 3rd-place"},
];
const stageRevealed = (step)=> step<=3 ? 0 : Math.min(5, step-3);

function buildProjection(){
  const teams=[]; const tables={};
  Object.keys(GROUPS).forEach(L=>{
    const t=GROUPS[L].map(([name,flag])=>({name,flag,group:L,w:0,d:0,l:0,gf:0,ga:0,snap:[]}));
    SCHED.forEach(md=>{
      md.forEach(([hi,ai])=>{
        const h=t[hi],a=t[ai];const[hg,ag]=projectScore(h.name,a.name);
        h.gf+=hg;h.ga+=ag;a.gf+=ag;a.ga+=hg;
        if(hg>ag){h.w++;a.l++;}else if(ag>hg){a.w++;h.l++;}else{h.d++;a.d++;}
      });
      t.forEach(x=>x.snap.push(perfOf(PTS(x.w,x.d),x.gf-x.ga,x.gf)));
    });
    const s=[...t].sort((x,y)=>y.snap[2]-x.snap[2]||RANK[x.name]-RANK[y.name]);
    s.forEach((x,i)=>{x.pos=i+1;x.perf=x.snap[2];});
    tables[L]=s; teams.push(...s);
  });
  const q=[]; const thirds=[];
  Object.values(tables).forEach(s=>{q.push(s[0],s[1]);thirds.push(s[2]);});
  thirds.sort((a,b)=>b.perf-a.perf||RANK[a.name]-RANK[b.name]);
  q.push(...thirds.slice(0,8));
  const qSet=new Set(q.map(t=>t.name));
  teams.forEach(t=>{t.qualified=qSet.has(t.name);t.reached=t.qualified?1:0;t.result=null;t.outStage=t.qualified?null:"Group";});
  const seeded=[...q].sort((a,b)=>b.perf-a.perf||RANK[a.name]-RANK[b.name]);
  seeded.forEach((t,i)=>t.seed=i+1);
  const koTie=(a,b,st)=>{const fav=RANK[a.name]<RANK[b.name]?a:b,dog=fav===a?b:a;
    const adj=Math.min(0.35,(RANK[dog.name]-RANK[fav.name])/300);
    return hash(`${st}|${a.name}|${b.name}`)<(0.18-adj*0.3)?dog:fav;};
  let cur=[];for(let i=0;i<16;i++)cur.push([seeded[i],seeded[31-i]]);
  const rounds={};
  ["R32","R16","QF","SF"].forEach(st=>{
    const ties=[],win=[];
    cur.forEach(([a,b])=>{const w=koTie(a,b,st);win.push(w);ties.push([a,b,w]);
      const l=w===a?b:a;l.outStage=st;l.reached=STAGE_IDX[st];w.reached=STAGE_IDX[st];});
    rounds[st]=ties;cur=[];for(let i=0;i<win.length;i+=2)cur.push([win[i],win[i+1]]);
  });
  const sf=rounds.SF;const fin=sf.map(([a,b,w])=>w);const sfL=sf.map(([a,b,w])=>w===a?b:a);
  const champ=koTie(fin[0],fin[1],"Final");const runner=champ===fin[0]?fin[1]:fin[0];
  const third=koTie(sfL[0],sfL[1],"Third");const fourth=third===sfL[0]?sfL[1]:sfL[0];
  champ.result="champion";champ.reached=5;runner.result="runner-up";runner.reached=5;
  third.result="third";fourth.result="fourth";
  teams.forEach(t=>{
    t.colleague=COLLEAGUE[t.name];
    t.knownOut = (t.result==="champion"||t.result==="runner-up") ? 99 : t.reached+4;
    const c=[{step:0,y:0}];
    t.snap.forEach((v,i)=>c.push({step:i+1,y:v}));
    let base=t.snap[2];
    [[1,4],[2,4],[3,4],[4,4]].forEach(([si,g])=>{ if(t.reached>=si){ base+=g+hash(t.name+si)*0.5; c.push({step:si+3,y:base}); }});
    if(t.result==="champion")c.push({step:8,y:base+5});
    else if(t.result==="runner-up")c.push({step:8,y:base+3});
    else if(t.result==="third")c.push({step:8,y:base+2.4});
    else if(t.result==="fourth")c.push({step:8,y:base+1});
    t.cum=c;
    t.journey=t.reached*100+(t.result==="champion"?60:t.result==="runner-up"?40:t.result==="third"?20:t.result==="fourth"?10:0)+t.perf;
  });
  return {teams, champ, runner, third, fourth};
}
const memberOf=(t,si,step)=> step<t.knownOut ? true : t.reached>=si;

// vertical de-clutter: push pixel-y values apart by >=gap, keep within [lo,hi]
function declutter(items, gap, lo, hi){
  const a=items.map((it,i)=>({...it,i})).sort((p,q)=>p.y-q.y);
  let prev=-1e9;
  a.forEach(o=>{ if(o.y<prev+gap)o.y=prev+gap; prev=o.y; });
  const over=a.length? a[a.length-1].y-hi : 0;
  if(over>0)a.forEach(o=>o.y-=over);
  if(a.length && a[0].y<lo){const sh=lo-a[0].y;a.forEach(o=>o.y+=sh);}
  const out=new Array(items.length); a.forEach(o=>out[o.i]={...o}); return out;
}

/* ------------------------------ theme ------------------------------- */
const C = { red:"#EF8733", redDk:"#c2641f", ink:"#282C20", ink2:"#374151", ink3:"#6b7280", ink4:"#9ca3af",
  border:"#e5e7eb", border2:"#d1d5db", white:"#fff",
  trail:"#E3E3E1", lead:"#ededeb", zoneBorder:"#DDDDDA", zoneLabel:"#C7C7C2",
  gold:"#d9a441", silver:"#9aa3ad", bronze:"#b97a4a" };
const ringFor=t=> t.result==="champion"?C.gold:t.result==="runner-up"?C.silver:t.result==="third"?C.bronze:"#fff";

/* ===================================================================== */
export default function App(){
  const proj=useMemo(buildProjection,[]);
  const [tab,setTab]=useState("grid");
  const [step,setStep]=useState(0);
  const [sortMode,setSortMode]=useState("progress");
  const [hover,setHover]=useState(null);
  const touched=useRef(false);

  useEffect(()=>{
    if(touched.current)return;
    let s=0;
    const id=setInterval(()=>{ s++; if(touched.current||s>8){clearInterval(id);return;} setStep(s); },820);
    return ()=>clearInterval(id);
  },[]);
  const onScrub=(v)=>{ touched.current=true; setStep(v); };

  return (
    <div style={{fontFamily:"Inter, system-ui, sans-serif", color:C.ink, width:"100%",
      marginTop:"3.5rem", paddingTop:"3.5rem", borderTop:`1px solid ${C.border}`}}>
      <style>{`
        .wc-tab{font:600 13px Inter,sans-serif;padding:7px 14px;border-radius:8px;border:1px solid ${C.border};
          background:#fff;color:${C.ink2};cursor:pointer;transition:.15s}
        .wc-tab:hover{border-color:${C.border2}} .wc-tab.on{background:${C.red};border-color:${C.red};color:#fff}
        .wc-seg{font:600 12px Inter,sans-serif;padding:5px 11px;border:1px solid ${C.border2};background:#fff;color:${C.ink3};cursor:pointer}
        .wc-seg.on{background:${C.ink};border-color:${C.ink};color:#fff}
        .wc-rng{-webkit-appearance:none;appearance:none;height:4px;border-radius:4px;outline:none;cursor:pointer;width:100%;
          background:linear-gradient(90deg,${C.red} var(--p),${C.border} var(--p))}
        .wc-rng::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:50%;background:#fff;
          border:3px solid ${C.red};box-shadow:0 1px 4px rgba(0,0,0,.22);cursor:pointer}
        .wc-rng::-moz-range-thumb{width:15px;height:15px;border-radius:50%;background:#fff;border:3px solid ${C.red};cursor:pointer}
        .wc-z{transition:x .7s cubic-bezier(.45,0,.15,1),y .7s cubic-bezier(.45,0,.15,1),
          width .7s cubic-bezier(.45,0,.15,1),height .7s cubic-bezier(.45,0,.15,1),opacity .5s}
        .wc-mv{transition:transform .75s cubic-bezier(.45,0,.15,1),opacity .5s}
        .wc-tr{transition:opacity .5s}
        .wc-chip{transition:opacity .5s, transform .5s}
      `}</style>

      <div style={{display:"flex",alignItems:"baseline",gap:10,flexWrap:"wrap"}}>
        <h2 style={{font:"700 1.5rem Inter",letterSpacing:"-0.02em",margin:0}}>The journey to the final</h2>
        <span style={{fontSize:12,color:C.ink3}}>illustrative projection · scrub to replay</span>
      </div>

      <div style={{display:"flex",gap:6,margin:"12px 0 14px",flexWrap:"wrap"}}>
        {[["grid","Trail grid"],["lines","Journey lines"],["boxes","Stage boxes"],["funnel","Survival funnel"]].map(([k,l])=>(
          <button key={k} className={`wc-tab${tab===k?" on":""}`} onClick={()=>setTab(k)}>{l}</button>
        ))}
        {tab==="grid" && (
          <div style={{marginLeft:"auto",display:"flex",borderRadius:7,overflow:"hidden",border:`1px solid ${C.border2}`}}>
            <button className={`wc-seg${sortMode==="progress"?" on":""}`} onClick={()=>setSortMode("progress")}>By progress</button>
            <button className={`wc-seg${sortMode==="group"?" on":""}`} onClick={()=>setSortMode("group")}>By group</button>
          </div>
        )}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:4}}>
        <input className="wc-rng" type="range" min={0} max={8} step={1} value={step}
          style={{"--p":`${step/8*100}%`}} onChange={e=>onScrub(+e.target.value)}/>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          {STEPS.map((s,i)=>(
            <span key={i} onClick={()=>onScrub(i)} style={{fontSize:9.5,fontWeight:i===step?700:500,
              color:i===step?C.redDk:C.ink4,cursor:"pointer",flex:1,textAlign:i===0?"left":i===8?"right":"center"}}>{s.short}</span>
          ))}
        </div>
      </div>
      <div style={{fontSize:12.5,color:C.ink2,margin:"8px 2px 12px",fontWeight:600}}>{STEPS[step].label}</div>

      <div style={{position:"relative"}}>
        {tab==="grid"   && <TrailGrid    proj={proj} step={step} sortMode={sortMode} setHover={setHover}/>}
        {tab==="lines"  && <JourneyLines proj={proj} step={step} setHover={setHover}/>}
        {tab==="boxes"  && <StageBoxes   proj={proj} step={step} setHover={setHover}/>}
        {tab==="funnel" && <Funnel       proj={proj} step={step} setHover={setHover}/>}
        {hover && (
          <div style={{position:"fixed",left:hover.x+14,top:hover.y+10,zIndex:50,pointerEvents:"none",
            background:C.ink,color:"#fff",borderRadius:8,padding:"7px 10px",fontSize:11.5,boxShadow:"0 6px 20px rgba(0,0,0,.25)"}}>
            <div style={{fontWeight:700}}>{hover.t.name} <span style={{opacity:.6,fontWeight:500}}>· Grp {hover.t.group}</span></div>
            {hover.t.colleague && <div style={{opacity:.85}}>{hover.t.colleague}</div>}
            <div style={{opacity:.7,marginTop:2}}>FIFA #{RANK[hover.t.name]} · reached {STAGE_ORDER[hover.t.reached]}{hover.t.result?` (${hover.t.result})`:""}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== MOCKUP 1 — TRAIL GRID ========================= */
function TrailGrid({proj,step,sortMode,setHover}){
  const W=1440, PX0=16, PX1=1424, PY0=56, laneH=26, BOT=44, FW=22, FH=15;
  const teams=useMemo(()=>{
    const a=[...proj.teams];
    if(sortMode==="progress") a.sort((x,y)=>y.journey-x.journey);
    else a.sort((x,y)=> x.group<y.group?-1:x.group>y.group?1:x.pos-y.pos);
    return a;
  },[proj,sortMode]);
  const H=PY0+teams.length*laneH+BOT;
  const laneY=i=>PY0+i*laneH+laneH/2;
  const startX=PX0+16, groupEnd=PX0+0.42*(PX1-PX0), GP_MAX=9.7;
  const groupX=(perf)=> startX + Math.max(0,Math.min(1,perf/GP_MAX))*(groupEnd-startX-10);
  const koX0=groupEnd+34, koGap=(PX1-koX0)/5;
  const colX=(si)=> koX0 + (si-1)*koGap + koGap/2;
  const sr=stageRevealed(step);
  const colStage=t=>Math.min(t.reached,sr);
  const perfAtStep=t=> step<=0?0 : t.snap[Math.min(step,3)-1];
  const flagX=t=>{const cs=colStage(t);return cs===0?groupX(perfAtStep(t)):colX(cs);};

  const VPAD=3;
  const zones=[{st:"Group",x0:PX0+6,x1:groupEnd+6,lanes:teams.map((_,i)=>i)}];
  ["R32","R16","QF","SF","Final"].forEach(st=>{
    const si=STAGE_IDX[st];
    const lanes=teams.map((t,i)=>memberOf(t,si,step)?i:-1).filter(i=>i>=0);
    if(lanes.length){const cx=colX(si);zones.push({st,x0:cx-koGap*0.40,x1:cx+koGap*0.40,lanes});}
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:"block"}}>
      <defs>
        <linearGradient id="trailFade" gradientUnits="userSpaceOnUse" x1={startX} y1="0" x2={PX1} y2="0">
          <stop offset="0" stopColor={C.trail} stopOpacity="0"/>
          <stop offset="0.5" stopColor={C.trail} stopOpacity="0.55"/>
          <stop offset="1" stopColor={C.trail} stopOpacity="1"/>
        </linearGradient>
      </defs>

      {zones.map(z=>{
        const top=Math.min(...z.lanes),bot=Math.max(...z.lanes);
        const y=laneY(top)-laneH/2+VPAD, h=(bot-top)*laneH+laneH-VPAD*2;
        const isGroup=z.st==="Group";
        return (
          <g key={z.st}>
            <rect className="wc-z" x={z.x0} y={y} width={z.x1-z.x0} height={h} rx={10}
              fill="none" stroke={C.zoneBorder} strokeWidth={1} strokeDasharray="2 3"/>
            {isGroup
              ? <text x={(z.x0+z.x1)/2} y={(y+y+h)/2} textAnchor="middle" dominantBaseline="middle"
                  fontSize="30" fontWeight="700" letterSpacing="0.16em" fill={C.zoneLabel} opacity="0.45">GROUP STAGE</text>
              : <text className="wc-z" x={(z.x0+z.x1)/2} y={y+13} textAnchor="middle"
                  fontSize="12.5" fontWeight="700" letterSpacing="0.05em" fill={C.zoneLabel}>{z.st}</text>}
          </g>
        );
      })}

      {teams.map((t,i)=>{
        const y=laneY(i), fx=flagX(t);
        const out=step>=t.knownOut && t.result!=="champion";
        return (
          <g key={t.name}>
            {fx>startX+2 &&
              <line className="wc-tr" x1={startX} y1={y} x2={fx} y2={y} stroke="url(#trailFade)"
                strokeWidth={2.2} strokeLinecap="round" opacity={out?0.5:1}/>}
            <g className="wc-mv" style={{transform:`translate(${fx}px,${y}px)`,opacity:out?0.4:1}}
               onMouseMove={e=>setHover({x:e.clientX,y:e.clientY,t})} onMouseLeave={()=>setHover(null)}>
              <image href={flagUrl(t.flag)} x={-FW/2} y={-FH/2} width={FW} height={FH} preserveAspectRatio="xMidYMid slice"
                style={{filter:out?"grayscale(.65)":"none"}}/>
              <rect x={-FW/2} y={-FH/2} width={FW} height={FH} rx={2} fill="none" stroke={ringFor(t)} strokeWidth={t.result?1.5:0.6}/>
            </g>
          </g>
        );
      })}

      {[["MD1",0.18],["MD2",0.42],["MD3",0.66]].map(([l,f])=>(
        <text key={l} x={startX+f*(groupEnd-startX)} y={H-14} textAnchor="middle" fontSize="12" fill={C.ink4}>{l}</text>
      ))}
    </svg>
  );
}

/* ===================== MOCKUP 2 — JOURNEY LINES ====================== */
function JourneyLines({proj,step,setHover}){
  const W=1440, H=1100, PX0=16, PX1=1424, PY0=34, PY1=1040, FW=22, FH=15;
  const xOf=s=>PX0+s/8*(PX1-PX0);
  const teams=proj.teams;
  const visC=t=>t.cum.filter(p=>p.step<=step);

  // y-domain from TRUE performance (no epsilon) so all teams converge at the origin
  let lo=0,hi=0;
  teams.forEach(t=>visC(t).forEach(p=>{lo=Math.min(lo,p.y);hi=Math.max(hi,p.y);}));
  if(hi-lo<0.8)hi=lo+0.8; const pad=(hi-lo)*0.07; lo-=pad;hi+=pad;
  const yOf=v=>PY1-(v-lo)/(hi-lo)*(PY1-PY0);
  const endPt=t=>{const v=visC(t);return v.length?v[v.length-1]:{step:0,y:0};};

  // nets: stable, full-width, non-overlapping horizontal bands per stage cohort
  const sr=stageRevealed(step);
  const cohortOf=t=> (step>=t.knownOut && t.result!=="champion") ? t.reached : Math.min(t.reached,sr);
  const grp={}; teams.forEach(t=>{const c=cohortOf(t);(grp[c]=grp[c]||[]).push(t);});
  const nets=Object.entries(grp).map(([k,arr])=>{
    const ys=arr.map(t=>endPt(t).y);
    return {si:+k, top:Math.max(...ys), bot:Math.min(...ys), n:arr.length};
  }).sort((a,b)=>a.bot-b.bot);
  for(let i=1;i<nets.length;i++){ if(yOf(nets[i].bot)<yOf(nets[i-1].top)) nets[i].bot=nets[i-1].top; }

  // flag positions, de-cluttered per column (kept stacked at the kickoff origin)
  let flags=teams.map(t=>{const p=endPt(t);return {t,step:p.step,trueY:yOf(p.y),
    out:step>=t.knownOut&&t.result!=="champion"};});
  if(step>0){
    const buckets={}; flags.forEach(f=>{(buckets[f.step]=buckets[f.step]||[]).push(f);});
    let res=[];
    Object.values(buckets).forEach(b=>{
      const d=declutter(b.map(f=>({y:f.trueY,f})), FH+6, PY0+FH+8, PY1-FH-8);
      d.forEach(o=>res.push({...o.f, drawY:o.y}));
    });
    flags=res;
  } else flags=flags.map(f=>({...f, drawY:f.trueY}));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:"block"}}>
      {nets.map(z=>{
        if(z.si===0 && step<3) return null;
        const y=yOf(z.top)-9, h=(yOf(z.bot)-yOf(z.top))+18;
        return (
          <g key={z.si}>
            <rect className="wc-z" x={PX0} y={y} width={PX1-PX0} height={Math.max(h,16)} rx={11}
              fill="none" stroke={C.zoneBorder} strokeWidth={1} strokeDasharray="2 3"/>
            <text className="wc-z" x={PX0+12} y={y+16} fontWeight="700" opacity="0.55"
              letterSpacing="0.05em" fill={C.zoneLabel} fontSize="12.5">{STAGE_LABEL[STAGE_ORDER[z.si]]} · {z.n}</text>
          </g>
        );
      })}

      {STEPS.map((s,i)=>(
        <text key={i} x={xOf(i)} y={H-14} textAnchor={i===0?"start":i===8?"end":"middle"} fontSize="12"
          fontWeight={i===step?700:400} fill={i===step?C.redDk:C.ink4}>{s.short}</text>
      ))}
      <text x={PX0} y={PY0-14} fontSize="11.5" fill={C.ink4}>performance →</text>

      {/* comet trails: per-segment opacity fades toward the tail */}
      {teams.map(t=>{
        const v=visC(t); if(v.length<2)return null;
        const out=step>=t.knownOut && t.result!=="champion";
        const n=v.length-1;
        return v.slice(1).map((p,k)=>{
          const a=v[k];
          const op=(out?0.5:1)*(0.12+0.88*((k+1)/n));
          return <line key={t.name+k} x1={xOf(a.step)} y1={yOf(a.y)} x2={xOf(p.step)} y2={yOf(p.y)}
            stroke={C.trail} strokeWidth={2.1} strokeLinecap="round" opacity={op} className="wc-tr"/>;
        });
      })}

      {/* leader lines for any de-cluttered flags */}
      {flags.map(f=> Math.abs(f.drawY-f.trueY)>1.5 &&
        <line key={"l"+f.t.name} x1={xOf(f.step)} y1={f.trueY} x2={xOf(f.step)} y2={f.drawY}
          stroke={C.lead} strokeWidth={1}/>)}

      {flags.map(f=>(
        <g key={f.t.name} className="wc-mv" style={{transform:`translate(${xOf(f.step)}px,${f.drawY}px)`,opacity:f.out?0.42:1}}
           onMouseMove={e=>setHover({x:e.clientX,y:e.clientY,t:f.t})} onMouseLeave={()=>setHover(null)}>
          <image href={flagUrl(f.t.flag)} x={-FW/2} y={-FH/2} width={FW} height={FH} preserveAspectRatio="xMidYMid slice"
            style={{filter:f.out?"grayscale(.65)":"none"}}/>
          <rect x={-FW/2} y={-FH/2} width={FW} height={FH} rx={2} fill="none" stroke={ringFor(f.t)} strokeWidth={f.t.result?1.5:0.6}/>
        </g>
      ))}
    </svg>
  );
}

/* ===================== MOCKUP 3 — STAGE BOXES ======================= */
function StageBoxes({proj,step,setHover}){
  const sr=stageRevealed(step);
  const stageNow=t=> (step>=t.knownOut && t.result!=="champion") ? t.reached : Math.min(t.reached,sr);
  // top (Final) -> bottom (Group)
  const bands=[5,4,3,2,1,0].map(si=>({si, teams:proj.teams.filter(t=>stageNow(t)===si)
    .sort((a,b)=>b.journey-a.journey)}));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {bands.map(b=>(
        <div key={b.si} style={{border:`1px dashed ${C.zoneBorder}`,borderRadius:11,padding:"8px 12px 10px",
          minHeight:50, display:"flex", alignItems:"center", gap:14}}>
          <div style={{width:108, flexShrink:0}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.05em",color:C.zoneLabel}}>{STAGE_LABEL[STAGE_ORDER[b.si]]}</div>
            <div style={{fontSize:10,color:C.ink4,marginTop:1}}>{b.teams.length} team{b.teams.length===1?"":"s"}</div>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,flex:1}}>
            {b.teams.map(t=>{
              const ring=ringFor(t);
              return (
                <span key={t.name} className="wc-chip"
                  onMouseMove={e=>setHover({x:e.clientX,y:e.clientY,t})} onMouseLeave={()=>setHover(null)}
                  style={{width:23,height:15,borderRadius:3,overflow:"hidden",
                    boxShadow:`0 0 0 ${t.result?1.5:1}px ${ring}, 0 1px 2px rgba(0,0,0,.12)`,cursor:"default"}}>
                  <img src={flagUrl(t.flag)} alt={t.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                </span>
              );
            })}
            {b.teams.length===0 && <span style={{fontSize:11,color:C.ink4,fontStyle:"italic"}}>—</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===================== BONUS — SURVIVAL FUNNEL ======================= */
function Funnel({proj,step,setHover}){
  const cols=[{l:"48 in",s:0},{l:"R32",s:1},{l:"R16",s:2},{l:"QF",s:3},{l:"SF",s:4},{l:"Final",s:5},{l:"🏆",s:6}];
  const sr=stageRevealed(step);
  const reach=t=> Math.min(t.reached,sr) + (t.result==="champion"&&step>=8?1:0);
  const W=1440,H=1140,colW=W/7,top=52,rowH=22, FW=22, FH=15;
  const inCol=c=>proj.teams.filter(t=>reach(t)>=(c.s===6?6:c.s)).sort((a,b)=>b.journey-a.journey);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:"block"}}>
      {cols.map(c=>{
        const ts=inCol(c),cx=c.s*colW+colW/2,bh=Math.max(ts.length*rowH,rowH),y0=top+(H-top-30-bh)/2;
        return (
          <g key={c.s}>
            <text x={cx} y={32} textAnchor="middle" fontSize="13" fontWeight="700" fill={C.ink3}>{c.l}</text>
            <text x={cx} y={H-14} textAnchor="middle" fontSize="12" fill={C.ink4}>{ts.length}</text>
            <rect className="wc-z" x={cx-19} y={y0-7} width={38} height={bh+14} rx={10}
              fill="none" stroke={C.zoneBorder} strokeWidth={1} strokeDasharray="2 3"/>
            {ts.map((t,i)=>(
              <g key={t.name} className="wc-mv" style={{transform:`translate(${cx}px,${y0+i*rowH+rowH/2}px)`}}
                 onMouseMove={e=>setHover({x:e.clientX,y:e.clientY,t})} onMouseLeave={()=>setHover(null)}>
                <image href={flagUrl(t.flag)} x={-FW/2} y={-FH/2} width={FW} height={FH} preserveAspectRatio="xMidYMid slice"/>
                <rect x={-FW/2} y={-FH/2} width={FW} height={FH} rx={2} fill="none" stroke={t.result==="champion"?C.gold:"#fff"} strokeWidth={t.result==="champion"?1.6:0.5}/>
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
