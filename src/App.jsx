import { useState, useEffect } from "react";

import { BUZZ_IMG, OWLS_IMG } from "./images.js";

const SCARECROW = {
  name: "Scarecrow", fullName: "Gamble Sands – Scarecrow Course", par: 71,
  tees: [
    { label:"Medal",        color:"#1a1a1a", total:6921, f:[395,198,547,220,311,581,422,467,169], b:[478,158,489,430,500,575,205,408,368] },
    { label:"Back",         color:"#4a90d9", total:6501, f:[367,179,534,201,300,566,385,434,160], b:[446,142,461,415,484,538,182,382,325] },
    { label:"Sands",        color:"#c8a000", total:6261, f:[367,153,506,184,283,566,385,434,148], b:[434,126,461,415,463,502,156,382,296] },
    { label:"Regular",      color:"#cccccc", total:6061, f:[338,153,506,184,283,541,351,404,148], b:[434,126,438,400,463,502,156,338,296] },
    { label:"Intermediate", color:"#28a028", total:5204, f:[318,130,462,133,217,510,319,368,134], b:[381,110,383,330,375,459,128,214,233] },
    { label:"Forward",      color:"#e04040", total:4656, f:[293,120,379,117,183,469,304,314,104], b:[362,94,340,277,351,449,105,187,208] },
  ],
  fp:[4,3,5,3,4,5,4,4,3], bp:[4,3,5,4,4,5,3,4,4],
};

const SANDS = {
  name: "Sands", fullName: "Gamble Sands – Sands Course", par: 72,
  tees: [
    { label:"Medal",        color:"#1a1a1a", total:7151, f:[430,340,632,165,501,264,493,310,421], b:[147,426,327,562,445,470,220,420,578] },
    { label:"Back",         color:"#4a90d9", total:6664, f:[397,297,623,161,483,230,456,305,380], b:[132,402,296,538,393,453,193,411,514] },
    { label:"Sands",        color:"#c8a000", total:6389, f:[397,297,519,161,483,216,456,305,354], b:[132,372,306,538,385,368,193,393,514] },
    { label:"Regular",      color:"#cccccc", total:6113, f:[364,258,519,142,456,216,439,280,354], b:[119,372,306,507,385,368,166,393,469] },
    { label:"Intermediate", color:"#28a028", total:5623, f:[315,232,499,131,428,190,411,241,341], b:[94,351,291,471,330,315,169,372,442] },
    { label:"Forward",      color:"#e04040", total:4804, f:[296,187,464,116,387,103,329,213,293], b:[81,317,194,411,254,285,138,339,397] },
  ],
  fp:[4,4,5,3,4,3,5,4,4], bp:[3,4,4,5,4,4,3,4,5],
};

const COURSES = { scarecrow: SCARECROW, sands: SANDS };
const BGC = ["Brady","Bryce","Kevin","Kirby","Scott","Travis"];
const OWL = ["Nick","Corey","Ryan","Neil","Michael","Tom"];
const ROUNDS = [
  { id:"r1", label:"Round 1", date:"Jun 12", fmt:"Hi/Lo Foursomes",    course:"scarecrow", slots:3, pps:2 },
  { id:"r2", label:"Round 2", date:"Jun 13", fmt:"Best Ball (4-ball)", course:"sands",     slots:3, pps:2 },
  { id:"r3", label:"Round 3", date:"Jun 14", fmt:"Singles Match Play", course:"scarecrow", slots:6, pps:1 },
];

function emptySlots(r) {
  return Array.from({length:r.slots}, (_,i) => ({
    id: r.id+"m"+(i+1), label:"Match "+(i+1),
    home: Array(r.pps).fill(""), away: Array(r.pps).fill(""),
  }));
}

function initByRound() {
  const m = {};
  ROUNDS.forEach(r => { m[r.id] = emptySlots(r); });
  return m;
}

function loadState() {
  try {
    const saved = localStorage.getItem("benders2026");
    if (saved) return JSON.parse(saved);
  } catch(e) {}
  return null;
}

function matchStatus(scores, mid) {
  const ms = scores[mid] || {};
  let hw=0, aw=0, played=0;
  for (let h=1; h<=18; h++) {
    const s = ms[h];
    if (!s || s.home==null || s.away==null) break;
    played++;
    if (s.home < s.away) hw++;
    else if (s.away < s.home) aw++;
  }
  const lead=hw-aw, left=18-played, leader=lead>0?"home":lead<0?"away":null;
  if (played===0) return {st:"ns", played, lead, leader};
  if (Math.abs(lead)>left || played===18) return {st:"done", played, lead, leader};
  return {st:"live", played, lead, leader};
}

function stLabel(ms, hN, aN) {
  if (ms.st==="ns") return "Not Started";
  const nm = ms.leader==="home"?hN:ms.leader==="away"?aN:null;
  const lead=Math.abs(ms.lead), left=18-ms.played;
  if (ms.st==="done") return nm ? nm+" wins "+lead+"&"+left : "Halved";
  return nm ? nm+" "+lead+"UP (thru "+ms.played+")" : "All Square (thru "+ms.played+")";
}

function mResult(ms) {
  if (ms.st!=="done") return null;
  if (!ms.leader) return {h:0.5, a:0.5};
  return {h: ms.leader==="home"?1:0, a: ms.leader==="away"?1:0};
}

function totals(scores, byRound) {
  let b=0, o=0;
  for (const rm of Object.values(byRound)) {
    for (const m of rm) {
      const r = mResult(matchStatus(scores, m.id));
      if (r) { b+=r.h; o+=r.a; }
    }
  }
  return {b, o};
}

function nl(arr) { return arr.filter(Boolean).join(" / ") || "—"; }
function ready(m) { return m.home.every(Boolean) && m.away.every(Boolean); }

function holeMP(upTo, ms) {
  let hw=0, aw=0;
  for (let h=1; h<=upTo; h++) {
    const s=ms[h];
    if (!s||s.home==null||s.away==null) continue;
    if (s.home<s.away) hw++; else if (s.away<s.home) aw++;
  }
  const d=hw-aw;
  if (d===0) return "AS";
  return (d>0?"BGC":"OWL")+" "+Math.abs(d)+"up";
}

function sumS(team, holes, ms) {
  return holes.reduce((s,h) => s+(ms[h.hole]?.[team]||0), 0);
}

const S = {
  app:{fontFamily:"'DM Sans',sans-serif",background:"#f5f0eb",color:"#1a1a1a",minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:84},
  hero:{background:"linear-gradient(160deg,#fff8f2,#f5f0eb)",padding:"22px 18px 18px",borderBottom:"1.5px solid #e0d8d0"},
  heroTop:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8},
  heroCenter:{textAlign:"center",flex:1,padding:"0 4px"},
  heroTitle:{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,letterSpacing:5,color:"#1a1a1a",lineHeight:1},
  heroYear:{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,letterSpacing:5,color:"#9b7010",lineHeight:1,marginTop:-4},
  heroLoc:{fontSize:10,color:"#5a7a5a",textTransform:"uppercase",letterSpacing:2,marginTop:5},
  heroDates:{fontSize:10,color:"#aaa",marginTop:2},
  sb:{display:"flex",alignItems:"center",justifyContent:"center",marginTop:16},
  sbSide:{flex:1,textAlign:"center"},
  sbLbl:{fontSize:10,textTransform:"uppercase",letterSpacing:1,marginBottom:2,fontWeight:700},
  sbPts:{fontFamily:"'Bebas Neue',sans-serif",fontSize:68,lineHeight:1},
  sbMid:{textAlign:"center",padding:"0 10px"},
  sbDash:{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:"#ccc"},
  sbGoal:{fontSize:9,color:"#aaa",textTransform:"uppercase",letterSpacing:0.5,marginTop:2,whiteSpace:"nowrap"},
  barWrap:{marginTop:12},
  bar:{height:5,background:"#e0d8d0",borderRadius:3,display:"flex",overflow:"hidden"},
  barRow:{display:"flex",justifyContent:"space-between",fontSize:10,marginTop:4,fontWeight:600},
  sect:{fontSize:9,textTransform:"uppercase",letterSpacing:2.5,color:"#bbb",padding:"14px 18px 6px",fontWeight:600},
  rlist:{padding:"0 14px",display:"flex",flexDirection:"column",gap:10},
  rcard:{background:"#fff",border:"1.5px solid #e8e0d8",borderRadius:14,padding:"14px 16px",display:"flex",alignItems:"center",cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"},
  rcardL:{flex:1},
  rcardDate:{fontSize:9,color:"#5a7a5a",textTransform:"uppercase",letterSpacing:1.5,fontWeight:700},
  rcardName:{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:1,lineHeight:1.1,marginTop:1},
  rcardFmt:{fontSize:12,color:"#666",marginTop:1},
  rcardCourse:{fontSize:10,color:"#888",marginTop:3,display:"flex",alignItems:"center",gap:5},
  rcardR:{textAlign:"right"},
  rcardScore:{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:2,marginBottom:4},
  nav:{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:"1.5px solid #e8e0d8",display:"flex",padding:"8px 0 18px",zIndex:50,boxShadow:"0 -2px 12px rgba(0,0,0,0.06)"},
  nbtn:{flex:1,background:"none",border:"none",cursor:"pointer",padding:"4px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:2},
  phdr:{display:"flex",alignItems:"center",padding:"14px 16px",borderBottom:"1.5px solid #e8e0d8",gap:10,background:"#fff"},
  pbk:{background:"none",border:"none",color:"#5a7a5a",fontSize:14,cursor:"pointer",whiteSpace:"nowrap",fontWeight:600,fontFamily:"'DM Sans',sans-serif"},
  ptitle:{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:1.5},
  teebar:{background:"#fff",borderBottom:"1.5px solid #e8e0d8",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12},
  teebarL:{flex:1},
  teebarC:{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:1,color:"#5a7a5a"},
  teebarF:{fontSize:11,color:"#aaa",marginTop:1},
  teeSW:{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4},
  teeDR:{display:"flex",alignItems:"center",gap:5},
  teeDot:{width:12,height:12,borderRadius:"50%",flexShrink:0},
  teeYds:{fontSize:11,fontWeight:700},
  teeSel:{background:"#f5f0eb",border:"1.5px solid #e0d8d0",borderRadius:8,color:"#1a1a1a",fontSize:12,fontWeight:600,padding:"7px 12px",fontFamily:"'DM Sans',sans-serif"},
  mcard:{background:"#fff",border:"1.5px solid #e8e0d8",borderRadius:14,padding:14,margin:"10px 14px 0",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"},
  mcardTop:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10},
  mcardLbl:{fontSize:9,color:"#5a7a5a",textTransform:"uppercase",letterSpacing:1.5,fontWeight:700},
  mcardDiv:{height:1,background:"#f0ece6",margin:"10px 0"},
  mcardMu:{display:"flex",alignItems:"center",gap:8},
  mcardTeam:{display:"flex",alignItems:"center",gap:6,flex:1},
  mcardTeamR:{display:"flex",alignItems:"center",gap:6,flex:1,justifyContent:"flex-end",flexDirection:"row-reverse"},
  mcardDot:{width:8,height:8,borderRadius:"50%",flexShrink:0},
  mcardNames:{fontSize:13,fontWeight:700},
  mcardVs:{fontSize:9,color:"#ccc",fontWeight:900},
  mcardSt:{fontSize:11,marginTop:7},
  mcardTap:{fontSize:10,color:"#bbb",marginTop:6,textAlign:"right"},
  picker:{marginTop:2},
  pickerCols:{display:"flex",alignItems:"flex-start",gap:10},
  pickerCol:{flex:1,display:"flex",flexDirection:"column",gap:8},
  pickerHdr:{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:2},
  pickerDiv:{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,color:"#ccc",paddingTop:26,flexShrink:0},
  pickerSel:{width:"100%",background:"#f8f4f0",border:"1.5px solid #e0d8d0",borderRadius:8,color:"#1a1a1a",fontSize:13,fontWeight:600,padding:"9px 10px",fontFamily:"'DM Sans',sans-serif"},
  scHdr:{padding:"12px 16px",borderBottom:"1.5px solid #e8e0d8",textAlign:"center",background:"#fff"},
  scCn:{fontSize:10,color:"#5a7a5a",textTransform:"uppercase",letterSpacing:1.5,fontWeight:700},
  scTeeRow:{display:"flex",alignItems:"center",justifyContent:"center",gap:5,marginTop:4},
  scTeeDot:{width:10,height:10,borderRadius:"50%",flexShrink:0},
  scTeeLbl:{fontSize:11,color:"#666",fontWeight:600},
  scTeams:{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:6},
  scTn:{fontSize:14,fontWeight:700},
  scStatus:{fontSize:12,fontWeight:700,marginTop:4},
  barWrap2:{background:"#fff",borderBottom:"1.5px solid #e8e0d8",padding:"12px 16px"},
  barLabels:{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,fontWeight:700,marginBottom:6},
  barScore:{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:1},
  mbar:{height:8,background:"#f0ece6",borderRadius:4,display:"flex",overflow:"hidden"},
  barStatus:{fontSize:10,color:"#888",textAlign:"center",marginTop:5,fontWeight:600},
  scWrap:{overflowX:"auto",padding:"10px 6px"},
  scTbl:{display:"flex",gap:1,background:"#e0d8d0",borderRadius:10,overflow:"hidden",minWidth:"max-content"},
  scc:{display:"flex",flexDirection:"column"},
  scHint:{textAlign:"center",fontSize:10,color:"#ccc",padding:"6px 0 14px"},
  modalBg:{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"flex-end",zIndex:200},
  modalSheet:{background:"#fff",borderTop:"2px solid #e8e0d8",borderRadius:"20px 20px 0 0",padding:"16px 18px 32px",width:"100%",maxWidth:480,margin:"0 auto"},
  modalHandle:{width:36,height:4,background:"#e0d8d0",borderRadius:2,margin:"0 auto 14px"},
  modalTitle:{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:2,textAlign:"center",color:"#1a1a1a",marginBottom:14},
  modalBody:{display:"flex",gap:12},
  modalCol:{flex:1},
  modalLbl:{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,textAlign:"center",marginBottom:8},
  sgrid:{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5},
  sbtn:{height:46,background:"#f5f0eb",border:"1.5px solid #e0d8d0",borderRadius:8,color:"#1a1a1a",fontSize:17,fontWeight:700,cursor:"pointer",width:"100%"},
  sbtnBuzz:{height:46,background:"#b83050",border:"1.5px solid #b83050",borderRadius:8,color:"#fff",fontSize:17,fontWeight:700,cursor:"pointer",width:"100%"},
  sbtnOwls:{height:46,background:"#9b7010",border:"1.5px solid #9b7010",borderRadius:8,color:"#fff",fontSize:17,fontWeight:700,cursor:"pointer",width:"100%"},
  modalSave:{width:"100%",marginTop:14,padding:15,background:"#b83050",border:"none",borderRadius:12,color:"#fff",fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:2,cursor:"pointer"},
  modalCancel:{width:"100%",marginTop:8,padding:11,background:"none",border:"1.5px solid #e0d8d0",borderRadius:12,color:"#aaa",fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"},
  stdHero:{display:"flex",alignItems:"center",justifyContent:"center",padding:"20px 14px",borderBottom:"1.5px solid #e8e0d8",gap:10,background:"#fff"},
  stdSide:{textAlign:"center",flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5},
  stdPts:{fontFamily:"'Bebas Neue',sans-serif",fontSize:50,lineHeight:1},
  stdName:{fontSize:10,textTransform:"uppercase",letterSpacing:1,fontWeight:700},
  stdMid:{textAlign:"center"},
  stdVs:{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,color:"#ccc"},
  stdGoal:{fontSize:8,color:"#bbb",marginTop:2,textTransform:"uppercase",letterSpacing:0.5},
  stdBlock:{margin:"16px 14px 0"},
  stdRhead:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1.5px solid #e8e0d8",marginBottom:4},
  stdRl:{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:0.5},
  stdRf:{fontSize:10,color:"#aaa"},
  stdRpts:{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:1},
  stdMrow:{padding:"10px 0",borderBottom:"1px solid #f0ece6",cursor:"pointer"},
  stdMp:{display:"flex",alignItems:"center",gap:6,fontSize:12,fontWeight:700,flexWrap:"wrap"},
};

const cell = (bg, h, w, extra={}) => ({height:h,width:w,background:bg,display:"flex",alignItems:"center",justifyContent:"center",...extra});
const pillStyle = (type) => {
  const base = {display:"inline-block",fontSize:9,padding:"3px 9px",borderRadius:20,fontWeight:700,letterSpacing:0.5};
  if (type==="live")    return {...base,background:"#fce8ec",color:"#b83050",border:"1px solid #f0b8c4"};
  if (type==="done")    return {...base,background:"#e8f5e8",color:"#3a7a3a",border:"1px solid #b8d8b8"};
  if (type==="set")     return {...base,background:"#e8f0fc",color:"#3060b8",border:"1px solid #b8ccf0"};
  if (type==="partial") return {...base,background:"#fdf4e0",color:"#9b7010",border:"1px solid #e8d090"};
  return {...base,background:"#f0ece6",color:"#aaa",border:"1px solid #ddd"};
};

function Logo({src, size=64}) {
  return <img src={src} width={size} height={size} style={{borderRadius:"50%",objectFit:"cover",display:"block",flexShrink:0}} alt="" />;
}

function NavBar({view, setView}) {
  return (
    <div style={S.nav}>
      <button style={{...S.nbtn,color:view==="home"?"#5a7a5a":"#bbb"}} onClick={()=>setView("home")}>
        <span style={{fontSize:20}}>🏠</span><span style={{fontSize:10,fontWeight:600}}>Home</span>
      </button>
      <button style={{...S.nbtn,color:view==="standings"?"#5a7a5a":"#bbb"}} onClick={()=>setView("standings")}>
        <span style={{fontSize:20}}>🏆</span><span style={{fontSize:10,fontWeight:600}}>Scores</span>
      </button>
    </div>
  );
}

function PHdr({title, onBack}) {
  return (
    <div style={S.phdr}>
      <button style={S.pbk} onClick={onBack}>← Back</button>
      <div style={S.ptitle}>{title}</div>
    </div>
  );
}

function MatchupPicker({match, matchIdx, roundId, pps, updateMatchup, allMatches}) {
  const others = allMatches.filter((_,i)=>i!==matchIdx);
  const usedB = others.flatMap(m=>m.home).filter(Boolean);
  const usedO = others.flatMap(m=>m.away).filter(Boolean);
  return (
    <div style={S.picker}>
      <div style={S.pickerCols}>
        <div style={S.pickerCol}>
          <div style={{...S.pickerHdr,color:"#b83050"}}>Buzzards GC</div>
          {Array.from({length:pps}).map((_,pi)=>(
            <select key={pi} style={S.pickerSel} value={match.home[pi]||""} onChange={e=>updateMatchup(roundId,matchIdx,"home",pi,e.target.value)}>
              <option value="">— select —</option>
              {BGC.map(n=><option key={n} value={n} disabled={usedB.includes(n)&&match.home[pi]!==n}>{n}{usedB.includes(n)&&match.home[pi]!==n?" ✓":""}</option>)}
            </select>
          ))}
        </div>
        <div style={S.pickerDiv}>VS</div>
        <div style={S.pickerCol}>
          <div style={{...S.pickerHdr,color:"#9b7010"}}>Owls GC</div>
          {Array.from({length:pps}).map((_,pi)=>(
            <select key={pi} style={S.pickerSel} value={match.away[pi]||""} onChange={e=>updateMatchup(roundId,matchIdx,"away",pi,e.target.value)}>
              <option value="">— select —</option>
              {OWL.map(n=><option key={n} value={n} disabled={usedO.includes(n)&&match.away[pi]!==n}>{n}{usedO.includes(n)&&match.away[pi]!==n?" ✓":""}</option>)}
            </select>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScoreCard({activeRound, match, teeIdx, scores, saveScore, onBack, setView}) {
  const [editHole, setEditHole] = useState(null);
  const [eHome, setEHome] = useState("");
  const [eAway, setEAway] = useState("");
  const rDef = ROUNDS.find(r=>r.id===activeRound);
  const course = COURSES[rDef.course];
  const tee = course.tees[teeIdx];
  const ms = scores[match.id] || {};
  const mst = matchStatus(scores, match.id);
  const hN = nl(match.home), aN = nl(match.away);
  const f9 = course.fp.map((par,i)=>({hole:i+1,par,yds:tee.f[i]}));
  const b9 = course.bp.map((par,i)=>({hole:i+10,par,yds:tee.b[i]}));
  const all = [...f9,...b9];
  const bar = (() => {
    let hw=0,aw=0;
    for(let h=1;h<=18;h++){const s=ms[h];if(!s||s.home==null||s.away==null)continue;if(s.home<s.away)hw++;else if(s.away<s.home)aw++;}
    return {hw,aw,diff:hw-aw};
  })();
  function openHole(h){const s=ms[h]||{};setEHome(s.home!=null?s.home:"");setEAway(s.away!=null?s.away:"");setEditHole(h);}
  function commit(){saveScore(match.id,editHole,eHome,eAway);setEditHole(null);}
  const hdrBg="#f0ece6",subBg="#e8e2da",totBg="#ddd6cc",cellBg="#fff";
  const f9out=sumS("home",f9,ms)||"—",f9outA=sumS("away",f9,ms)||"—";
  const b9in=sumS("home",b9,ms)||"—",b9inA=sumS("away",b9,ms)||"—";
  const tot=sumS("home",all,ms)||"—",totA=sumS("away",all,ms)||"—";
  return (
    <div style={S.app}>
      <PHdr title="Scorecard" onBack={onBack}/>
      <div style={S.scHdr}>
        <div style={S.scCn}>{course.fullName}</div>
        <div style={S.scTeeRow}>
          <div style={{...S.scTeeDot,background:tee.color,border:"1.5px solid #888"}}/>
          <span style={S.scTeeLbl}>{tee.label} tees · {tee.total.toLocaleString()} yds · Par {course.par}</span>
        </div>
        <div style={S.scTeams}>
          <span style={{...S.scTn,color:"#b83050"}}>{hN}</span>
          <span style={{fontSize:10,color:"#aaa"}}>vs</span>
          <span style={{...S.scTn,color:"#9b7010"}}>{aN}</span>
        </div>
        <div style={{...S.scStatus,color:mst.st==="live"?"#b83050":"#aaa"}}>{stLabel(mst,hN,aN)}</div>
      </div>
      <div style={S.barWrap2}>
        <div style={S.barLabels}>
          <span style={{color:"#b83050",fontSize:11}}>{hN}</span>
          <span style={S.barScore}><span style={{color:"#b83050"}}>{bar.hw}</span><span style={{color:"#aaa"}}> – </span><span style={{color:"#9b7010"}}>{bar.aw}</span></span>
          <span style={{color:"#9b7010",fontSize:11}}>{aN}</span>
        </div>
        <div style={S.mbar}>
          {bar.hw+bar.aw>0
            ? <><div style={{height:"100%",background:"#b83050",width:((bar.hw/(bar.hw+bar.aw))*100)+"%"}}/><div style={{height:"100%",background:"#9b7010",width:((bar.aw/(bar.hw+bar.aw))*100)+"%"}}/></>
            : <div style={{width:"100%",height:"100%",background:"#f0ece6"}}/>}
        </div>
        <div style={S.barStatus}>{bar.diff===0?"All Square":((bar.diff>0?hN:aN)+" leads "+Math.abs(bar.diff)+" up")}</div>
      </div>
      <div style={S.scWrap}>
        <div style={S.scTbl}>
          <div style={S.scc}>
            {[["#",hdrBg,28],["Par",hdrBg,26],["Yds",hdrBg,22]].map(([t,bg,h])=><div key={t} style={cell(bg,h,36,{fontSize:9,fontWeight:800,color:"#888"})}>{t}</div>)}
            <div style={cell(hdrBg,28,36,{fontSize:9,fontWeight:800,color:"#b83050"})}>BGC</div>
            <div style={cell(hdrBg,28,36,{fontSize:9,fontWeight:800,color:"#9b7010"})}>OWL</div>
            <div style={cell(hdrBg,22,40,{fontSize:7,fontWeight:800,color:"#888"})}>MP</div>
          </div>
          {f9.map(h=>{
            const hs=ms[h.hole]||{};
            return (
              <div key={h.hole} style={S.scc} onClick={()=>openHole(h.hole)}>
                <div style={cell(cellBg,28,36,{fontSize:10,fontWeight:800,color:"#5a7a5a",cursor:"pointer"})}>{h.hole}</div>
                <div style={cell(cellBg,26,36,{fontSize:10,color:"#888"})}>{h.par}</div>
                <div style={cell(cellBg,22,36,{fontSize:9,color:"#bbb"})}>{h.yds}</div>
                <div style={cell(cellBg,36,36,{fontSize:14,fontWeight:700,cursor:"pointer"})}>{hs.home!=null?hs.home:<span style={{color:"#ddd"}}>—</span>}</div>
                <div style={cell(cellBg,36,36,{fontSize:14,fontWeight:700,cursor:"pointer"})}>{hs.away!=null?hs.away:<span style={{color:"#ddd"}}>—</span>}</div>
                <div style={cell(cellBg,22,40,{fontSize:8,color:"#888"})}>{holeMP(h.hole,ms)}</div>
              </div>
            );
          })}
          <div style={S.scc}>
            <div style={cell(subBg,28,36,{fontSize:10,fontWeight:800,color:"#5a7a5a"})}>OUT</div>
            <div style={cell(subBg,26,36,{fontSize:10,fontWeight:700,color:"#888"})}>{f9.reduce((s,h)=>s+h.par,0)}</div>
            <div style={cell(subBg,22,36,{fontSize:9,fontWeight:700,color:"#bbb"})}>{f9.reduce((s,h)=>s+h.yds,0)}</div>
            <div style={cell(subBg,36,36,{fontSize:14,fontWeight:800})}>{f9out}</div>
            <div style={cell(subBg,36,36,{fontSize:14,fontWeight:800})}>{f9outA}</div>
            <div style={cell(subBg,22,40,{})}/>
          </div>
          {b9.map(h=>{
            const hs=ms[h.hole]||{};
            return (
              <div key={h.hole} style={S.scc} onClick={()=>openHole(h.hole)}>
                <div style={cell(cellBg,28,36,{fontSize:10,fontWeight:800,color:"#5a7a5a",cursor:"pointer"})}>{h.hole}</div>
                <div style={cell(cellBg,26,36,{fontSize:10,color:"#888"})}>{h.par}</div>
                <div style={cell(cellBg,22,36,{fontSize:9,color:"#bbb"})}>{h.yds}</div>
                <div style={cell(cellBg,36,36,{fontSize:14,fontWeight:700,cursor:"pointer"})}>{hs.home!=null?hs.home:<span style={{color:"#ddd"}}>—</span>}</div>
                <div style={cell(cellBg,36,36,{fontSize:14,fontWeight:700,cursor:"pointer"})}>{hs.away!=null?hs.away:<span style={{color:"#ddd"}}>—</span>}</div>
                <div style={cell(cellBg,22,40,{fontSize:8,color:"#888"})}>{holeMP(h.hole,ms)}</div>
              </div>
            );
          })}
          <div style={S.scc}>
            <div style={cell(subBg,28,36,{fontSize:10,fontWeight:800,color:"#5a7a5a"})}>IN</div>
            <div style={cell(subBg,26,36,{fontSize:10,fontWeight:700,color:"#888"})}>{b9.reduce((s,h)=>s+h.par,0)}</div>
            <div style={cell(subBg,22,36,{fontSize:9,fontWeight:700,color:"#bbb"})}>{b9.reduce((s,h)=>s+h.yds,0)}</div>
            <div style={cell(subBg,36,36,{fontSize:14,fontWeight:800})}>{b9in}</div>
            <div style={cell(subBg,36,36,{fontSize:14,fontWeight:800})}>{b9inA}</div>
            <div style={cell(subBg,22,40,{})}/>
          </div>
          <div style={S.scc}>
            <div style={cell(totBg,28,36,{fontSize:10,fontWeight:800,color:"#5a7a5a"})}>TOT</div>
            <div style={cell(totBg,26,36,{fontSize:10,fontWeight:800,color:"#888"})}>{course.par}</div>
            <div style={cell(totBg,22,36,{fontSize:9,fontWeight:800,color:"#bbb"})}>{tee.total.toLocaleString()}</div>
            <div style={cell(totBg,36,36,{fontSize:14,fontWeight:800})}>{tot}</div>
            <div style={cell(totBg,36,36,{fontSize:14,fontWeight:800})}>{totA}</div>
            <div style={cell(totBg,22,40,{})}/>
          </div>
        </div>
      </div>
      <div style={S.scHint}>Tap any hole to enter scores</div>
      {editHole && (
        <div style={S.modalBg} onClick={()=>setEditHole(null)}>
          <div style={S.modalSheet} onClick={e=>e.stopPropagation()}>
            <div style={S.modalHandle}/>
            <div style={S.modalTitle}>{"Hole "+editHole+" · Par "+all.find(h=>h.hole===editHole).par+" · "+all.find(h=>h.hole===editHole).yds+" yds"}</div>
            <div style={S.modalBody}>
              {[{lbl:hN,val:eHome,set:setEHome,buzz:true},{lbl:aN,val:eAway,set:setEAway,buzz:false}].map(({lbl,val,set,buzz})=>(
                <div key={lbl} style={S.modalCol}>
                  <div style={{...S.modalLbl,color:buzz?"#b83050":"#9b7010"}}>{lbl}</div>
                  <div style={S.sgrid}>
                    {[1,2,3,4,5,6,7,8,9,10].map(n=>{
                      const active=val==n;
                      const st=active?(buzz?S.sbtnBuzz:S.sbtnOwls):S.sbtn;
                      return <button key={n} style={st} onClick={()=>set(n)}>{n}</button>;
                    })}
                  </div>
                </div>
              ))}
            </div>
            <button style={S.modalSave} onClick={commit}>{"Save Hole "+editHole}</button>
            <button style={S.modalCancel} onClick={()=>setEditHole(null)}>Cancel</button>
          </div>
        </div>
      )}
      <NavBar view="round" setView={setView}/>
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(() => {
    try { return localStorage.getItem("benders_auth") === "yes"; } catch(e) { return false; }
  });
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);

  if (!authed) {
    function tryPin(p) {
      if (p.toUpperCase() === "BENDERS") {
        try { localStorage.setItem("benders_auth","yes"); } catch(e) {}
        setAuthed(true);
      } else {
        setShake(true);
        setTimeout(() => { setShake(false); setPin(""); }, 600);
      }
    }
    return (
      <div style={{fontFamily:"'DM Sans',sans-serif",background:"#f5f0eb",minHeight:"100vh",maxWidth:480,margin:"0 auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24,padding:32}}>
        <img src={BUZZ_IMG} width={80} height={80} style={{borderRadius:"50%",objectFit:"cover"}} alt=""/>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:38,letterSpacing:6,color:"#1a1a1a"}}>BENDERS 2026</div>
        <div style={{fontSize:13,color:"#aaa",marginTop:-16}}>Gamble Sands · June 12–14</div>
        <div style={{width:"100%",maxWidth:280,display:"flex",flexDirection:"column",gap:10}}>
          <input
            type="text"
            placeholder="Enter password"
            value={pin}
            onChange={e=>setPin(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&tryPin(pin)}
            style={{
              width:"100%",padding:"14px 16px",fontSize:16,fontFamily:"'DM Sans',sans-serif",
              border:shake?"2px solid #b83050":"2px solid #e0d8d0",borderRadius:12,
              background:"#fff",color:"#1a1a1a",outline:"none",textAlign:"center",
              transition:"border-color 0.2s",
              transform:shake?"translateX(6px)":"none",
            }}
            autoCapitalize="none"
          />
          <button
            onClick={()=>tryPin(pin)}
            style={{width:"100%",padding:14,background:"#b83050",border:"none",borderRadius:12,color:"#fff",fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:3,cursor:"pointer"}}>
            ENTER
          </button>
        </div>
      </div>
    );
  }

  const saved = loadState();
  const [byRound, setByRound] = useState(saved?.byRound || initByRound());
  const [teeByRound, setTeeByRound] = useState(saved?.teeByRound || {r1:2,r2:2,r3:2});
  const [scores, setScores] = useState(saved?.scores || {});
  const [view, setView] = useState("home");
  const [activeRound, setActiveRound] = useState(null);
  const [activeMatch, setActiveMatch] = useState(null);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem("benders2026", JSON.stringify({byRound, teeByRound, scores}));
    } catch(e) {}
  }, [byRound, teeByRound, scores]);

  const pts = totals(scores, byRound);
  const bPct = Math.min(100,(pts.b/12)*100);
  const oPct = Math.min(100,(pts.o/12)*100);

  function saveScore(mid, hole, home, away) {
    setScores(prev=>({...prev,[mid]:{...(prev[mid]||{}),[hole]:{
      home:home===""||home==null?null:parseInt(home),
      away:away===""||away==null?null:parseInt(away),
    }}}));
  }

  function updateMatchup(roundId, matchIdx, side, playerIdx, name) {
    setByRound(prev=>{
      const rm=prev[roundId].map((m,i)=>{
        if(i!==matchIdx) return m;
        const u=[...m[side]]; u[playerIdx]=name;
        return {...m,[side]:u};
      });
      return {...prev,[roundId]:rm};
    });
  }

  function resetAll() {
    if (!window.confirm("Reset all scores and lineups?")) return;
    const fresh = initByRound();
    setByRound(fresh);
    setScores({});
    setTeeByRound({r1:2,r2:2,r3:2});
    setView("home");
  }

  if (view==="scorecard" && activeRound && activeMatch) {
    const match = byRound[activeRound].find(m=>m.id===activeMatch);
    return <ScoreCard activeRound={activeRound} match={match} teeIdx={teeByRound[activeRound]}
      scores={scores} saveScore={saveScore} onBack={()=>setView("round")} setView={setView}/>;
  }

  if (view==="round" && activeRound) {
    const rDef=ROUNDS.find(r=>r.id===activeRound), course=COURSES[rDef.course];
    const teeIdx=teeByRound[activeRound], tee=course.tees[teeIdx], rm=byRound[activeRound];
    return (
      <div style={S.app}>
        <PHdr title={rDef.label} onBack={()=>setView("home")}/>
        <div style={S.teebar}>
          <div style={S.teebarL}>
            <div style={S.teebarC}>{course.name} · {rDef.date}</div>
            <div style={S.teebarF}>{rDef.fmt}</div>
          </div>
          <div style={S.teeSW}>
            <div style={S.teeDR}>
              <div style={{...S.teeDot,background:tee.color,border:"1.5px solid #999"}}/>
              <div style={S.teeYds}>{tee.total.toLocaleString()} yds</div>
            </div>
            <select style={S.teeSel} value={teeIdx} onChange={e=>setTeeByRound(prev=>({...prev,[activeRound]:parseInt(e.target.value)}))}>
              {course.tees.map((t,i)=><option key={i} value={i}>{t.label} — {t.total.toLocaleString()} yds</option>)}
            </select>
          </div>
        </div>
        {rm.map((m,idx)=>{
          const mst=matchStatus(scores,m.id),res=mResult(mst),rdy=ready(m),hN=nl(m.home),aN=nl(m.away);
          return (
            <div key={m.id} style={S.mcard}>
              <div style={S.mcardTop}>
                <span style={S.mcardLbl}>{m.label}</span>
                {rdy
                  ? <span style={pillStyle(mst.st==="live"?"live":mst.st==="done"?"done":"set")}>{mst.st==="live"?"● Live":mst.st==="done"?"Final":"Ready"}</span>
                  : <span style={pillStyle("pre")}>Not Set</span>}
              </div>
              <MatchupPicker match={m} matchIdx={idx} roundId={activeRound} pps={rDef.pps} updateMatchup={updateMatchup} allMatches={rm}/>
              {rdy && (
                <div onClick={()=>{setActiveMatch(m.id);setView("scorecard");}}>
                  <div style={S.mcardDiv}/>
                  <div style={S.mcardMu}>
                    <div style={S.mcardTeam}><div style={{...S.mcardDot,background:"#b83050"}}/><span style={{...S.mcardNames,color:"#b83050"}}>{hN}</span></div>
                    <div style={S.mcardVs}>VS</div>
                    <div style={S.mcardTeamR}><span style={{...S.mcardNames,color:"#9b7010"}}>{aN}</span><div style={{...S.mcardDot,background:"#9b7010"}}/></div>
                  </div>
                  <div style={{...S.mcardSt,color:mst.st==="live"?"#b83050":"#aaa",fontWeight:mst.st==="live"?700:400}}>{stLabel(mst,hN,aN)}</div>
                  {res && <div style={{fontSize:11,marginTop:3}}>
                    <span style={{color:res.h>0?"#3a7a3a":"#ccc",fontWeight:700}}>{res.h} pt</span>
                    <span style={{color:"#aaa"}}> – </span>
                    <span style={{color:res.a>0?"#3a7a3a":"#ccc",fontWeight:700}}>{res.a} pt</span>
                  </div>}
                  <div style={S.mcardTap}>Tap to open scorecard ›</div>
                </div>
              )}
            </div>
          );
        })}
        <NavBar view={view} setView={setView}/>
      </div>
    );
  }

  if (view==="standings") return (
    <div style={S.app}>
      <PHdr title="Standings" onBack={()=>setView("home")}/>
      <div style={S.stdHero}>
        <div style={S.stdSide}><Logo src={BUZZ_IMG} size={52}/><div style={{...S.stdPts,color:"#b83050"}}>{pts.b}</div><div style={{...S.stdName,color:"#b83050"}}>Buzzards GC</div></div>
        <div style={S.stdMid}><div style={S.stdVs}>VS</div><div style={S.stdGoal}>First to 6.5</div></div>
        <div style={S.stdSide}><Logo src={OWLS_IMG} size={52}/><div style={{...S.stdPts,color:"#9b7010"}}>{pts.o}</div><div style={{...S.stdName,color:"#9b7010"}}>Owls GC</div></div>
      </div>
      {ROUNDS.map(r=>{
        const rm=byRound[r.id]; let rb=0,ro=0;
        rm.forEach(m=>{const res=mResult(matchStatus(scores,m.id));if(res){rb+=res.h;ro+=res.a;}});
        return (
          <div key={r.id} style={S.stdBlock}>
            <div style={S.stdRhead}>
              <div><span style={S.stdRl}>{r.label}</span><span style={S.stdRf}> · {r.fmt}</span></div>
              <div style={S.stdRpts}><span style={{color:"#b83050"}}>{rb}</span><span style={{color:"#aaa"}}> – </span><span style={{color:"#9b7010"}}>{ro}</span></div>
            </div>
            {rm.map(m=>{
              const mst=matchStatus(scores,m.id),res=mResult(mst),hN=nl(m.home),aN=nl(m.away),rdy=ready(m);
              return (
                <div key={m.id} style={S.stdMrow} onClick={()=>{setActiveRound(r.id);setActiveMatch(m.id);setView("scorecard");}}>
                  <div style={S.stdMp}><span style={{color:rdy?"#b83050":"#aaa"}}>{hN}</span><span style={{fontSize:9,color:"#aaa",flexShrink:0}}>vs</span><span style={{color:rdy?"#9b7010":"#aaa"}}>{aN}</span></div>
                  <div style={{fontSize:10,color:mst.st==="live"?"#b83050":"#aaa",marginTop:2,fontWeight:mst.st==="live"?700:400}}>{rdy?stLabel(mst,hN,aN):"Lineup not set"}</div>
                  {res && <div style={{fontSize:11,marginTop:2}}>
                    <span style={{color:res.h>0?"#3a7a3a":"#ccc",fontWeight:700}}>{res.h}pt</span>
                    <span style={{color:"#aaa"}}> – </span>
                    <span style={{color:res.a>0?"#3a7a3a":"#ccc",fontWeight:700}}>{res.a}pt</span>
                  </div>}
                </div>
              );
            })}
          </div>
        );
      })}
      <NavBar view={view} setView={setView}/>
    </div>
  );

  return (
    <div style={S.app}>
      <div style={S.hero}>
        <div style={S.heroTop}>
          <Logo src={BUZZ_IMG} size={72}/>
          <div style={S.heroCenter}>
            <div style={S.heroTitle}>BENDERS</div>
            <div style={S.heroYear}>2026</div>
            <div style={S.heroLoc}>Gamble Sands · Brewster, WA</div>
            <div style={S.heroDates}>June 12 – 14</div>
          </div>
          <Logo src={OWLS_IMG} size={72}/>
        </div>
        <div style={S.sb}>
          <div style={S.sbSide}><div style={{...S.sbLbl,color:"#b83050"}}>Buzzards GC</div><div style={{...S.sbPts,color:"#b83050"}}>{pts.b}</div></div>
          <div style={S.sbMid}><div style={S.sbDash}>–</div><div style={S.sbGoal}>First to 6.5 wins</div></div>
          <div style={S.sbSide}><div style={{...S.sbLbl,color:"#9b7010"}}>Owls GC</div><div style={{...S.sbPts,color:"#9b7010"}}>{pts.o}</div></div>
        </div>
        <div style={S.barWrap}>
          <div style={S.bar}>
            <div style={{height:"100%",background:"#b83050",width:bPct+"%",transition:"width 0.5s"}}/>
            <div style={{height:"100%",background:"#9b7010",width:oPct+"%",transition:"width 0.5s"}}/>
          </div>
          <div style={S.barRow}>
            <span style={{color:"#b83050"}}>{pts.b} pts</span>
            <span style={{color:"#bbb",fontSize:9}}>12 total pts</span>
            <span style={{color:"#9b7010"}}>{pts.o} pts</span>
          </div>
        </div>
      </div>
      <div style={S.sect}>ROUNDS</div>
      <div style={S.rlist}>
        {ROUNDS.map(r=>{
          const rm=byRound[r.id],course=COURSES[r.course],tee=course.tees[teeByRound[r.id]];
          const done=rm.filter(m=>matchStatus(scores,m.id).st==="done").length;
          const live=rm.filter(m=>matchStatus(scores,m.id).st==="live").length;
          const set=rm.filter(m=>ready(m)).length;
          let rb=0,ro=0;
          rm.forEach(m=>{const res=mResult(matchStatus(scores,m.id));if(res){rb+=res.h;ro+=res.a;}});
          return (
            <div key={r.id} style={S.rcard} onClick={()=>{setActiveRound(r.id);setView("round");}}>
              <div style={S.rcardL}>
                <div style={S.rcardDate}>{r.date}</div>
                <div style={S.rcardName}>{r.label}</div>
                <div style={S.rcardFmt}>{r.fmt}</div>
                <div style={S.rcardCourse}>
                  <span style={{display:"inline-block",width:9,height:9,borderRadius:"50%",background:tee.color,border:"1px solid #aaa",flexShrink:0}}/>
                  {course.name} · {tee.label} · {tee.total.toLocaleString()} yds
                </div>
              </div>
              <div style={S.rcardR}>
                <div style={S.rcardScore}><span style={{color:"#b83050"}}>{rb}</span><span style={{color:"#ccc",margin:"0 2px"}}>–</span><span style={{color:"#9b7010"}}>{ro}</span></div>
                {done===rm.length&&set===rm.length&&rm.length>0?<span style={pillStyle("done")}>Final</span>
                  :live>0?<span style={pillStyle("live")}>● Live</span>
                  :set===0?<span style={pillStyle("pre")}>Not Set</span>
                  :set<rm.length?<span style={pillStyle("partial")}>Partial</span>
                  :<span style={pillStyle("set")}>Lineups Set</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{textAlign:"center",padding:"20px 0 8px"}}>
        <button onClick={resetAll} style={{background:"none",border:"1px solid #ddd",borderRadius:8,color:"#bbb",fontSize:11,padding:"6px 16px",cursor:"pointer"}}>Reset All</button>
      </div>
      <NavBar view={view} setView={setView}/>
    </div>
  );
}
