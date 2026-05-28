import { useState, useEffect } from "react";

var SCARECROW = {
  name: "Scarecrow", par: 71,
  tees: [
    { label:"Medal",        color:"#1a1a1a", total:6921, f:[395,198,547,220,311,581,422,467,169], b:[478,158,489,430,500,575,205,408,368] },
    { label:"Back",         color:"#4a90d9", total:6501, f:[367,179,534,201,300,566,385,434,160], b:[446,142,461,415,484,538,182,382,325] },
    { label:"Sands",        color:"#c8a000", total:6261, f:[367,153,506,184,283,566,385,434,148], b:[434,126,461,415,463,502,156,382,296] },
    { label:"Regular",      color:"#cccccc", total:6061, f:[338,153,506,184,283,541,351,404,148], b:[434,126,438,400,463,502,156,338,296] },
    { label:"Intermediate", color:"#28a028", total:5204, f:[318,130,462,133,217,510,319,368,134], b:[381,110,383,330,375,459,128,214,233] },
    { label:"Forward",      color:"#e04040", total:4656, f:[293,120,379,117,183,469,304,314,104], b:[362,94,340,277,351,449,105,187,208] }
  ],
  fp:[4,3,5,3,4,5,4,4,3], bp:[4,3,5,4,4,5,3,4,4]
};
var SANDS = {
  name: "Sands", par: 72,
  tees: [
    { label:"Medal",        color:"#1a1a1a", total:7151, f:[430,340,632,165,501,264,493,310,421], b:[147,426,327,562,445,470,220,420,578] },
    { label:"Back",         color:"#4a90d9", total:6664, f:[397,297,623,161,483,230,456,305,380], b:[132,402,296,538,393,453,193,411,514] },
    { label:"Sands",        color:"#c8a000", total:6389, f:[397,297,519,161,483,216,456,305,354], b:[132,372,306,538,385,368,193,393,514] },
    { label:"Regular",      color:"#cccccc", total:6113, f:[364,258,519,142,456,216,439,280,354], b:[119,372,306,507,385,368,166,393,469] },
    { label:"Intermediate", color:"#28a028", total:5623, f:[315,232,499,131,428,190,411,241,341], b:[94,351,291,471,330,315,169,372,442] },
    { label:"Forward",      color:"#e04040", total:4804, f:[296,187,464,116,387,103,329,213,293], b:[81,317,194,411,254,285,138,339,397] }
  ],
  fp:[4,4,5,3,4,3,5,4,4], bp:[3,4,4,5,4,4,3,4,5]
};
var COURSES = { scarecrow: SCARECROW, sands: SANDS };
var BUZZ_PLAYERS = ["Brady","Bryce","Kevin","Kirby","Scott","Travis"];
var OWLS_PLAYERS = ["Nick","Corey","Ryan","Neil","Mike","Tom"];
var ROUNDS = [
  { id:"r1", label:"Round 1", date:"Fri Jun 12", fmt:"HI/LO",    course:"scarecrow", pps:2, type:"hilo"    },
  { id:"r2", label:"Round 2", date:"Sat Jun 13", fmt:"SCRAMBLE", course:"sands",     pps:2, type:"scramble"},
  { id:"r3", label:"Round 3", date:"Sun Jun 14", fmt:"SINGLES",  course:"scarecrow", pps:1, type:"singles" }
];
var CBUZZ = "#b83050";
var COWLS = "#9b7010";
var BG    = "#f5f0eb";
var CB    = "#ffffff";
var WDOT  = "#22c55e";
var FONTS = "@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700&display=swap');*{box-sizing:border-box;-webkit-text-size-adjust:100%}html,body{width:100%;overflow:hidden}body{font-size:13px;overflow-y:auto;overflow-x:hidden}";

var DEMO_MATCHES = {
  r1:[
    {id:"r1m1",label:"Match 1",home:["Brady","Kevin"],  away:["Nick","Corey"]},
    {id:"r1m2",label:"Match 2",home:["Bryce","Scott"],  away:["Ryan","Neil"]},
    {id:"r1m3",label:"Match 3",home:["Kirby","Travis"], away:["Mike","Tom"]}
  ],
  r2:[
    {id:"r2m1",label:"Match 1",home:["Brady","Kevin"],  away:["Nick","Corey"]},
    {id:"r2m2",label:"Match 2",home:["Bryce","Scott"],  away:["Ryan","Neil"]},
    {id:"r2m3",label:"Match 3",home:["Kirby","Travis"], away:["Mike","Tom"]}
  ],
  r3:[
    {id:"r3m1",label:"Match 1",home:["Brady"],  away:["Nick"]},
    {id:"r3m2",label:"Match 2",home:["Bryce"],  away:["Corey"]},
    {id:"r3m3",label:"Match 3",home:["Kevin"],  away:["Ryan"]},
    {id:"r3m4",label:"Match 4",home:["Kirby"],  away:["Neil"]},
    {id:"r3m5",label:"Match 5",home:["Scott"],  away:["Mike"]},
    {id:"r3m6",label:"Match 6",home:["Travis"], away:["Tom"]}
  ]
};

function makeDemoScores() {
  var s = {};
  var h1s = [4,3,5,3,4,5,4,4,3,4,3,5,4,4,5,3,4,4];
  var h2s = [5,4,6,4,5,6,5,5,4,5,4,6,5,5,6,4,5,5];
  var a1s = [5,4,6,4,5,6,5,5,4,5,4,6,5,5,6,4,5,5];
  var a2s = [6,5,7,5,6,7,6,6,5,6,5,7,6,6,7,5,6,6];
  var r1m1 = {};
  for (var i = 0; i < 18; i++) { r1m1[i+1] = {h1:h1s[i],h2:h2s[i],a1:a1s[i],a2:a2s[i]}; }
  s["r1m1"] = r1m1;
  var r1m2 = {};
  for (var i = 0; i < 18; i++) { r1m2[i+1] = {h1:h2s[i],h2:a2s[i],a1:h1s[i],a2:h2s[i]}; }
  s["r1m2"] = r1m2;
  var r3m1 = {};
  var bsc = [3,4,5,3,4,5,4,4,3,4,3,5];
  var nsc = [4,4,6,4,5,5,5,5,4,5,4,6];
  for (var i = 0; i < 12; i++) { r3m1[i+1] = {home:bsc[i],away:nsc[i]}; }
  s["r3m1"] = r3m1;
  var r3m2 = {};
  var tied = [4,3,5,3,4,5,4,4,3];
  for (var i = 0; i < 9; i++) { r3m2[i+1] = {home:tied[i],away:tied[i]}; }
  s["r3m2"] = r3m2;
  var r2m1 = {};
  var bscr = [3,3,4,3,4,4,4,4,3];
  var oscr = [4,3,5,3,4,5,4,5,3];
  for (var i = 0; i < 9; i++) { r2m1[i+1] = {home:bscr[i],away:oscr[i]}; }
  s["r2m1"] = r2m1;
  return s;
}

function getNames(arr) {
  return (arr || []).filter(Boolean).join(" / ") || "TBD";
}

function fmtPts(p) {
  return p % 1 === 0 ? String(p) : p.toFixed(1);
}

function mpStatus(scores, mid) {
  var ms = scores[mid] || {};
  var hw = 0, aw = 0, played = 0;
  for (var h = 1; h <= 18; h++) {
    var s = ms[h];
    if (!s || s.home == null || s.away == null) { break; }
    played++;
    if (s.home < s.away) { hw++; }
    else if (s.away < s.home) { aw++; }
  }
  var lead = hw - aw;
  var left = 18 - played;
  var leader = lead > 0 ? "home" : lead < 0 ? "away" : "as";
  var up = Math.abs(lead);
  if (played === 0) { return {leader:"as",up:0,status:"not_started",winner:null,result:""}; }
  if (played === 18) {
    if (lead === 0) { return {leader:"as",up:0,status:"complete",winner:"halved",result:"Halved"}; }
    return {leader:leader,up:up,status:"complete",winner:leader,result:up+" UP"};
  }
  if (up > left) { return {leader:leader,up:up,status:"complete",winner:leader,result:up+"&"+left}; }
  if (lead === 0) { return {leader:"as",up:0,status:"live",winner:null,result:"AS"}; }
  return {leader:leader,up:up,status:"live",winner:null,result:up+" UP"};
}

function hiloHole(s) {
  if (!s) { return null; }
  var h1 = s.h1, h2 = s.h2, a1 = s.a1, a2 = s.a2;
  if (h1 == null || h2 == null || a1 == null || a2 == null) { return null; }
  var bL = Math.min(h1,h2), oL = Math.min(a1,a2);
  var bH = Math.max(h1,h2), oH = Math.max(a1,a2);
  return {
    lowPt: bL < oL ? "buzz" : bL > oL ? "owls" : "push",
    hiPt:  bH < oH ? "buzz" : bH > oH ? "owls" : "push"
  };
}

function hiloResult(scores, mid) {
  var ms = scores[mid] || {};
  var bPts = 0, oPts = 0, played = 0;
  for (var h = 1; h <= 18; h++) {
    var r = hiloHole(ms[h]);
    if (!r) { break; }
    played++;
    if (r.lowPt === "buzz") { bPts++; } else if (r.lowPt === "owls") { oPts++; }
    if (r.hiPt === "buzz")  { bPts++; } else if (r.hiPt === "owls")  { oPts++; }
  }
  var complete = played === 18;
  var winner = null;
  if (complete) { winner = bPts > oPts ? "buzz" : oPts > bPts ? "owls" : "halved"; }
  return {bPts:bPts, oPts:oPts, played:played, complete:complete, winner:winner};
}

function isDone(round, m, scores) {
  if (round.type === "hilo") { return hiloResult(scores, m.id).complete; }
  return mpStatus(scores, m.id).status === "complete";
}

function hasScores(round, m, scores) {
  if (round.type === "hilo") { return hiloResult(scores, m.id).played > 0; }
  return mpStatus(scores, m.id).status !== "not_started";
}

function rdPts(round, matches, scores) {
  var b = 0, o = 0;
  (matches || []).forEach(function(m) {
    if (round.type === "hilo") {
      var r = hiloResult(scores, m.id);
      if (r.winner === "buzz") { b += 1; }
      else if (r.winner === "owls") { o += 1; }
      else if (r.winner === "halved") { b += 0.5; o += 0.5; }
    } else {
      var st = mpStatus(scores, m.id);
      if (st.winner === "home") { b += 1; }
      else if (st.winner === "away") { o += 1; }
      else if (st.winner === "halved") { b += 0.5; o += 0.5; }
    }
  });
  return {b:b, o:o};
}

function calcCollapsed(matchesByRound, scores) {
  var nc = {r1:true, r2:true, r3:true};
  var opened = false;
  var allRoundsDone = ROUNDS.every(function(r) {
    var ms = matchesByRound[r.id] || [];
    return ms.length > 0 && ms.every(function(m) { return isDone(r, m, scores); });
  });
  if (allRoundsDone) { return nc; }
  ROUNDS.forEach(function(r) {
    var ms = matchesByRound[r.id] || [];
    var allDone = ms.length > 0 && ms.every(function(m) { return isDone(r, m, scores); });
    var anyScores = ms.some(function(m) { return hasScores(r, m, scores); });
    var anyLineups = ms.some(function(m) { return m.home.some(Boolean); });
    if (allDone) {
      nc[r.id] = true;
    } else if ((anyScores || anyLineups) && !opened) {
      nc[r.id] = false;
      opened = true;
    }
  });
  if (!opened) { nc["r1"] = false; }
  return nc;
}

function shouldDot(key, sc, sv) {
  var hr = hiloHole(sv);
  if (!hr || sc == null) { return false; }
  var bz = [sv.h1, sv.h2].filter(function(v) { return v != null; });
  var ow = [sv.a1, sv.a2].filter(function(v) { return v != null; });
  if (!bz.length || !ow.length) { return false; }
  var bL = Math.min.apply(null, bz), oL = Math.min.apply(null, ow);
  var bH = Math.max.apply(null, bz), oH = Math.max.apply(null, ow);
  var isBuzz = key === "h1" || key === "h2";
  var won = false;
  if (isBuzz && hr.lowPt === "buzz") {
    if (sc === bL && (key === "h1" ? sv.h1 <= sv.h2 : sv.h2 < sv.h1)) { won = true; }
  }
  if (!isBuzz && hr.lowPt === "owls") {
    if (sc === oL && (key === "a1" ? sv.a1 <= sv.a2 : sv.a2 < sv.a1)) { won = true; }
  }
  if (isBuzz && hr.hiPt === "buzz") {
    if (sc === bH && (key === "h1" ? sv.h1 >= sv.h2 : sv.h2 > sv.h1)) { won = true; }
  }
  if (!isBuzz && hr.hiPt === "owls") {
    if (sc === oH && (key === "a1" ? sv.a1 >= sv.a2 : sv.a2 > sv.a1)) { won = true; }
  }
  return won;
}

function BuzzLogo(props) {
  var size = props.size || 44;
  return (
    <div style={{width:size,height:size,borderRadius:Math.round(size*0.22),background:CBUZZ,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:Math.round(size*0.38),color:"#fff",letterSpacing:1}}>BGC</span>
    </div>
  );
}

function OwlsLogo(props) {
  var size = props.size || 44;
  return (
    <div style={{width:size,height:size,borderRadius:Math.round(size*0.22),background:COWLS,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:Math.round(size*0.38),color:"#fff",letterSpacing:1}}>OWL</span>
    </div>
  );
}

function Pill(props) {
  return (
    <span style={{display:"inline-block",padding:"3px 8px",borderRadius:6,background:props.color+"22",border:"1px solid "+props.color+"55",fontSize:10,fontWeight:700,color:props.color,letterSpacing:0.5,fontFamily:"'DM Sans',sans-serif"}}>
      {props.label}
    </span>
  );
}

function ScoreSymbol(props) {
  var score = props.score;
  var par = props.par;
  if (score == null || par == null) {
    return <span style={{fontSize:12,color:"#bbb"}}>-</span>;
  }
  var diff = score - par;
  var wrapStyle = {width:20,height:20,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative"};
  var innerBase = {fontSize:12,fontWeight:600,color:"#222",display:"inline-flex",alignItems:"center",justifyContent:"center",width:20,height:20,position:"relative",zIndex:1};
  if (diff <= -2) {
    return (
      <span style={wrapStyle}>
        <span style={{fontSize:12,fontWeight:600,color:"#222",display:"inline-flex",alignItems:"center",justifyContent:"center",width:20,height:20,position:"relative",zIndex:1,borderRadius:"50%",border:"1px solid #555"}}>{score}</span>
        <span style={{position:"absolute",inset:0,border:"1px solid #555",pointerEvents:"none",borderRadius:"50%"}} />
      </span>
    );
  }
  if (diff === -1) {
    return (
      <span style={wrapStyle}>
        <span style={{fontSize:12,fontWeight:600,color:"#222",display:"inline-flex",alignItems:"center",justifyContent:"center",width:20,height:20,position:"relative",zIndex:1,borderRadius:"50%",border:"1px solid #555"}}>{score}</span>
      </span>
    );
  }
  if (diff === 0) {
    return (
      <span style={wrapStyle}>
        <span style={{fontSize:12,fontWeight:600,color:"#222",display:"inline-flex",alignItems:"center",justifyContent:"center",width:20,height:20,position:"relative",zIndex:1}}>{score}</span>
      </span>
    );
  }
  if (diff === 1) {
    return (
      <span style={wrapStyle}>
        <span style={{fontSize:12,fontWeight:600,color:"#222",display:"inline-flex",alignItems:"center",justifyContent:"center",width:20,height:20,position:"relative",zIndex:1,border:"1px solid #555"}}>{score}</span>
      </span>
    );
  }
  return (
    <span style={wrapStyle}>
      <span style={{fontSize:12,fontWeight:600,color:"#222",display:"inline-flex",alignItems:"center",justifyContent:"center",width:20,height:20,position:"relative",zIndex:1,border:"1px solid #555"}}>{score}</span>
      <span style={{position:"absolute",inset:0,border:"1px solid #555",pointerEvents:"none",borderRadius:0}} />
    </span>
  );
}

function PasswordScreen(props) {
  var onAuth = props.onAuth;
  var pinState = useState("");
  var pin = pinState[0];
  var setPin = pinState[1];
  var shakeState = useState(false);
  var shake = shakeState[0];
  var setShake = shakeState[1];

  function tryPin(p) {
    if (p.toUpperCase() === "BENDERS") {
      onAuth();
    } else {
      setShake(true);
      setTimeout(function() { setShake(false); setPin(""); }, 600);
    }
  }

  return (
    <div style={{minHeight:"100vh",background:"#1a1a1a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'DM Sans',sans-serif"}}>
      <style>{FONTS}</style>
      <div style={{width:"100%",maxWidth:300,display:"flex",flexDirection:"column",alignItems:"center",gap:24}}>
        <div style={{width:90,height:90,borderRadius:18,background:"#2a2a2a",border:"1px solid #333",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,color:"#666",letterSpacing:2,textAlign:"center",lineHeight:1.6}}>BENDERS GOLF</span>
        </div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,letterSpacing:4,color:"#fff"}}>BENDERS 2026</div>
        <div style={{width:"100%",display:"flex",flexDirection:"column",gap:8}}>
          <input
            type="password"
            placeholder="Password"
            value={pin}
            onChange={function(e) { setPin(e.target.value); }}
            onKeyDown={function(e) { if (e.key === "Enter") { tryPin(pin); } }}
            autoComplete="off"
            style={{width:"100%",padding:"10px 14px",fontSize:14,border:shake?"2px solid #b83050":"2px solid #333",borderRadius:10,background:"#2a2a2a",color:"#fff",outline:"none",textAlign:"center",boxSizing:"border-box",fontFamily:"'DM Sans',sans-serif"}}
          />
          <button
            onClick={function() { tryPin(pin); }}
            style={{width:"100%",padding:"10px",background:"#fff",color:"#1a1a1a",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:1,fontFamily:"'DM Sans',sans-serif"}}
          >
            ENTER
          </button>
        </div>
        <div style={{display:"flex",gap:16}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:CBUZZ,opacity:0.7}} />
          <div style={{width:40,height:40,borderRadius:"50%",background:COWLS,opacity:0.7}} />
        </div>
      </div>
    </div>
  );
}

function LineupView(props) {
  var round = props.round;
  var match = props.match;
  var setMatchesByRound = props.setMatchesByRound;
  var setView = props.setView;
  var homeState = useState(match ? match.home.slice() : []);
  var home = homeState[0];
  var setHome = homeState[1];
  var awayState = useState(match ? match.away.slice() : []);
  var away = awayState[0];
  var setAway = awayState[1];

  function save() {
    setMatchesByRound(function(prev) {
      var updated = (prev[round.id] || []).map(function(m) {
        return m.id === match.id ? Object.assign({}, m, {home:home, away:away}) : m;
      });
      var next = Object.assign({}, prev);
      next[round.id] = updated;
      return next;
    });
    setView("matches");
  }

  function makeSelector(team, arr, setArr) {
    var pool = team === "home" ? BUZZ_PLAYERS : OWLS_PLAYERS;
    var rows = [];
    for (var i = 0; i < round.pps; i++) {
      (function(idx) {
        var others = arr.filter(function(_, j) { return j !== idx; });
        var btns = pool.map(function(p) {
          var disabled = others.indexOf(p) >= 0;
          var selected = arr[idx] === p;
          return (
            <button
              key={p}
              disabled={disabled}
              onClick={function() {
                var n = arr.slice();
                n[idx] = selected ? "" : p;
                setArr(n);
              }}
              style={{padding:"8px 14px",borderRadius:10,border:selected?"2px solid #1a1a1a":"1.5px solid #ddd",background:selected?"#1a1a1a":disabled?"#f8f8f8":"#fff",color:selected?"#fff":disabled?"#ccc":"#333",fontSize:13,fontWeight:600,cursor:disabled?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",opacity:disabled?0.5:1}}
            >
              {p}
            </button>
          );
        });
        rows.push(
          <div key={idx} style={{marginBottom:12}}>
            <div style={{fontSize:10,color:"#999",letterSpacing:1,marginBottom:6}}>PLAYER {idx+1}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{btns}</div>
          </div>
        );
      })(i);
    }
    return rows;
  }

  return (
    <div style={{padding:"20px 16px",minHeight:"100vh",background:BG,fontFamily:"'DM Sans',sans-serif"}}>
      <style>{FONTS}</style>
      <button onClick={function() { setView("matches"); }} style={{background:"none",border:"none",fontSize:13,color:"#888",cursor:"pointer",padding:0,marginBottom:16,fontFamily:"'DM Sans',sans-serif"}}>Back</button>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:3,color:"#1a1a1a",marginBottom:2}}>{round.label} - {match.label}</div>
      <div style={{fontSize:11,color:"#888",letterSpacing:1,marginBottom:20}}>{round.fmt}</div>
      <div style={{background:CB,borderRadius:16,padding:18,marginBottom:12,boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}}>
        <div style={{fontSize:11,fontWeight:700,color:CBUZZ,letterSpacing:2,marginBottom:12}}>BUZZARDS</div>
        {makeSelector("home", home, setHome)}
      </div>
      <div style={{background:CB,borderRadius:16,padding:18,marginBottom:20,boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}}>
        <div style={{fontSize:11,fontWeight:700,color:COWLS,letterSpacing:2,marginBottom:12}}>OWLS</div>
        {makeSelector("away", away, setAway)}
      </div>
      <button onClick={save} style={{width:"100%",padding:16,background:"#1a1a1a",color:"#fff",border:"none",borderRadius:14,fontSize:15,fontWeight:700,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",letterSpacing:1}}>SAVE LINEUP</button>
    </div>
  );
}

function ScorecardView(props) {
  var viewKey = props.viewKey;
  var matchesByRound = props.matchesByRound;
  var scores = props.scores;
  var setScores = props.setScores;
  var tees = props.tees;
  var setView = props.setView;

  var parts = viewKey.split(":");
  var rid = parts[1];
  var mid = parts[2];
  var round = ROUNDS.filter(function(r) { return r.id === rid; })[0];
  var match = (matchesByRound[rid] || []).filter(function(m) { return m.id === mid; })[0];
  var course = COURSES[round ? round.course : "scarecrow"];
  var teeIdx = tees[rid] || 2;
  var tee = course ? course.tees[teeIdx] : null;

  var editHoleState = useState(null);
  var editHole = editHoleState[0];
  var setEditHole = editHoleState[1];
  var draftState = useState({});
  var draft = draftState[0];
  var setDraft = draftState[1];
  var flashState = useState(null);
  var flash = flashState[0];
  var setFlash = flashState[1];
  var editModeState = useState(false);
  var editMode = editModeState[0];
  var setEditMode = editModeState[1];
  var showResetState = useState(false);
  var showReset = showResetState[0];
  var setShowReset = showResetState[1];

  if (!round || !match || !course || !tee) { return null; }

  var hs = scores[mid] || {};
  var allPar = course.fp.concat(course.bp);

  var holesEntered = Object.keys(hs).filter(function(h) {
    var sv = hs[h];
    if (round.type === "hilo") { return sv && sv.h1 != null && sv.h2 != null && sv.a1 != null && sv.a2 != null; }
    return sv && sv.home != null && sv.away != null;
  }).length;
  var isComplete = holesEntered === 18;
  var matchClinched = round.type === "hilo" ? hiloResult(scores, mid).complete : mpStatus(scores, mid).status === "complete";
  var locked = isComplete && !editMode;

  function openEdit(h) {
    if (locked) { return; }
    var ex = hs[h] || {};
    if (round.type === "hilo") {
      setDraft({h1:ex.h1 != null ? ex.h1 : null, h2:ex.h2 != null ? ex.h2 : null, a1:ex.a1 != null ? ex.a1 : null, a2:ex.a2 != null ? ex.a2 : null});
    } else {
      setDraft({home:ex.home != null ? ex.home : null, away:ex.away != null ? ex.away : null});
    }
    setEditHole(h);
  }

  function commit() {
    setScores(function(p) {
      var updated = Object.assign({}, p);
      var matchScores = Object.assign({}, p[mid] || {});
      matchScores[editHole] = draft;
      updated[mid] = matchScores;
      return updated;
    });
    setFlash(editHole);
    setTimeout(function() { setFlash(null); }, 800);
    setEditHole(null);
  }

  function resetScores() {
    setScores(function(p) {
      var updated = Object.assign({}, p);
      updated[mid] = {};
      return updated;
    });
    setEditMode(false);
    setShowReset(false);
  }

  var statusText = "NOT STARTED";
  var statusColor = "#888";
  if (round.type === "hilo") {
    var res = hiloResult(scores, mid);
    if (res.complete) {
      statusText  = res.winner === "buzz" ? "BUZZARDS WIN" : res.winner === "owls" ? "OWLS WIN" : "MATCH HALVED";
      statusColor = res.winner === "buzz" ? CBUZZ : res.winner === "owls" ? COWLS : "#666";
    } else if (res.played > 0) {
      var d = res.bPts - res.oPts;
      statusText  = d === 0 ? "TIED" : d > 0 ? "BUZZARDS +" + d : "OWLS +" + Math.abs(d);
      statusColor = d > 0 ? CBUZZ : d < 0 ? COWLS : "#666";
    }
  } else {
    var st = mpStatus(scores, mid);
    var hName = round.pps > 1 ? "BUZZARDS" : getNames(match.home).toUpperCase();
    var aName = round.pps > 1 ? "OWLS" : getNames(match.away).toUpperCase();
    if (st.status === "complete") {
      if (st.winner === "home") { statusText = hName + " WINS " + st.result; statusColor = CBUZZ; }
      else if (st.winner === "away") { statusText = aName + " WINS " + st.result; statusColor = COWLS; }
      else { statusText = "MATCH HALVED"; statusColor = "#666"; }
    } else if (st.status === "live") {
      if (st.leader === "home") { statusText = hName + " LEADS " + st.result; statusColor = CBUZZ; }
      else if (st.leader === "away") { statusText = aName + " LEADS " + st.result; statusColor = COWLS; }
      else { statusText = "ALL SQUARE"; statusColor = "#666"; }
    }
  }

  var HC = {padding:"3px 1px",textAlign:"center",fontSize:8,fontWeight:700,color:"#555",letterSpacing:0,borderRight:"1px solid #ddd",borderBottom:"1px solid #ddd"};
  var NC = {padding:"4px 2px",fontSize:8,fontWeight:700,whiteSpace:"nowrap",textAlign:"left",borderRight:"2px solid #bbb",borderBottom:"1px solid #ddd"};
  var DC = {padding:"3px 1px",textAlign:"center",borderRight:"1px solid #ddd",borderBottom:"1px solid #ddd",position:"relative",background:CB,cursor:"pointer"};
  var TC = {padding:"3px 2px",textAlign:"center",fontWeight:700,fontSize:10,borderLeft:"2px solid #bbb",borderBottom:"1px solid #ddd",color:"#333",background:CB};

  function renderNine(start, end, label) {
    var holes = [];
    for (var ii = start + 1; ii <= end; ii++) { holes.push(ii); }
    var parArr  = label === "FRONT" ? course.fp : course.bp;
    var yardArr = label === "FRONT" ? tee.f : tee.b;
    var parTot  = parArr.reduce(function(a, b) { return a + b; }, 0);
    var yTot    = yardArr.reduce(function(a, b) { return a + b; }, 0);

    var runStatus = "";
    if (round.type === "hilo") {
      var rb = 0, ro = 0;
      for (var h = 1; h <= end; h++) {
        var rv = hiloHole(hs[h]);
        if (!rv) { break; }
        if (rv.lowPt === "buzz") { rb++; } else if (rv.lowPt === "owls") { ro++; }
        if (rv.hiPt === "buzz")  { rb++; } else if (rv.hiPt === "owls")  { ro++; }
      }
      runStatus = "BUZZARDS " + rb + " - OWLS " + ro;
    } else {
      var rhw = 0, raw = 0;
      for (var h = 1; h <= end; h++) {
        var sv2 = hs[h];
        if (!sv2 || sv2.home == null || sv2.away == null) { break; }
        if (sv2.home < sv2.away) { rhw++; } else if (sv2.away < sv2.home) { raw++; }
      }
      var rd = rhw - raw;
      runStatus = rd === 0 ? "AS" : (rd > 0 ? "BUZZARDS " : "OWLS ") + Math.abs(rd) + " UP";
    }

    var h1T = null, h2T = null, a1T = null, a2T = null, hT = null, aT = null;
    holes.forEach(function(h) {
      var sv = hs[h];
      if (!sv) { return; }
      if (round.type === "hilo") {
        if (sv.h1 != null) { h1T = (h1T || 0) + sv.h1; }
        if (sv.h2 != null) { h2T = (h2T || 0) + sv.h2; }
        if (sv.a1 != null) { a1T = (a1T || 0) + sv.a1; }
        if (sv.a2 != null) { a2T = (a2T || 0) + sv.a2; }
      } else {
        if (sv.home != null) { hT = (hT || 0) + sv.home; }
        if (sv.away != null) { aT = (aT || 0) + sv.away; }
      }
    });

    function makeDataCell(h, parIdx, key, color, isAway) {
      var sv = hs[h];
      var sc = sv ? (sv[key] != null ? sv[key] : null) : null;
      var par = parArr[parIdx];
      var won = false;
      if (round.type === "hilo") {
        won = shouldDot(key, sc, sv);
      } else {
        var other = sv ? (isAway ? sv.home : sv.away) : null;
        won = sc != null && other != null && sc < other;
      }
      return (
        <td key={h} onClick={function() { openEdit(h); }} style={{padding:"6px 2px",textAlign:"center",borderRight:"1px solid #ddd",borderBottom:"1px solid #ddd",position:"relative",background:CB,cursor:locked?"default":"pointer"}}>
          {won && <span style={{position:"absolute",top:2,right:2,width:5,height:5,borderRadius:"50%",background:WDOT}} />}
          {flash === h
            ? <span style={{color:"#22c55e",fontWeight:700,fontSize:12}}>v</span>
            : <ScoreSymbol score={sc} par={par} />
          }
        </td>
      );
    }

    var headRow = holes.map(function(h) {
      return <td key={h} style={{padding:"5px 2px",textAlign:"center",fontSize:9,fontWeight:700,color:"#555",letterSpacing:1,borderRight:"1px solid #ddd",borderBottom:"1px solid #ddd"}}>{h}</td>;
    });
    var parRow = parArr.map(function(p, i) {
      return <td key={i} style={{padding:"3px 1px",textAlign:"center",fontSize:8,fontWeight:700,color:"#444",letterSpacing:0,borderRight:"1px solid #ddd",borderBottom:"1px solid #ddd"}}>{p}</td>;
    });
    var ydsRow = yardArr.map(function(y, i) {
      return <td key={i} style={{padding:"3px 1px",textAlign:"center",fontSize:7,fontWeight:700,color:"#666",letterSpacing:0,borderRight:"1px solid #ddd",borderBottom:"1px solid #ddd"}}>{y}</td>;
    });

    var bodyRows;
    if (round.type === "hilo") {
      var h1Cells = holes.map(function(h, i) { return makeDataCell(h, i, "h1", CBUZZ, false); });
      var h2Cells = holes.map(function(h, i) { return makeDataCell(h, i, "h2", CBUZZ, false); });
      var a1Cells = holes.map(function(h, i) { return makeDataCell(h, i, "a1", COWLS, true); });
      var a2Cells = holes.map(function(h, i) { return makeDataCell(h, i, "a2", COWLS, true); });
      bodyRows = (
        <tbody>
          <tr>
            <td style={{padding:"4px 2px",fontSize:8,fontWeight:700,whiteSpace:"nowrap",textAlign:"left",borderRight:"2px solid #bbb",borderBottom:"1px solid #ddd",color:CBUZZ}}>{match.home[0]||"H1"}</td>
            {h1Cells}
            <td style={{padding:"6px 3px",textAlign:"center",fontWeight:700,fontSize:12,borderLeft:"2px solid #bbb",borderBottom:"1px solid #ddd",color:"#333",background:CB}}>{h1T != null ? h1T : "-"}</td>
          </tr>
          <tr>
            <td style={{padding:"4px 2px",fontSize:8,fontWeight:700,whiteSpace:"nowrap",textAlign:"left",borderRight:"2px solid #bbb",borderBottom:"1px solid #ddd",color:CBUZZ}}>{match.home[1]||"H2"}</td>
            {h2Cells}
            <td style={{padding:"6px 3px",textAlign:"center",fontWeight:700,fontSize:12,borderLeft:"2px solid #bbb",borderBottom:"1px solid #ddd",color:"#333",background:CB}}>{h2T != null ? h2T : "-"}</td>
          </tr>
          <tr><td colSpan={holes.length+2} style={{height:4,background:"#f0ebe4",borderBottom:"1px solid #ddd"}} /></tr>
          <tr>
            <td style={{padding:"4px 2px",fontSize:8,fontWeight:700,whiteSpace:"nowrap",textAlign:"left",borderRight:"2px solid #bbb",borderBottom:"1px solid #ddd",color:COWLS}}>{match.away[0]||"A1"}</td>
            {a1Cells}
            <td style={{padding:"6px 3px",textAlign:"center",fontWeight:700,fontSize:12,borderLeft:"2px solid #bbb",borderBottom:"1px solid #ddd",color:"#333",background:CB}}>{a1T != null ? a1T : "-"}</td>
          </tr>
          <tr>
            <td style={{padding:"4px 2px",fontSize:8,fontWeight:700,whiteSpace:"nowrap",textAlign:"left",borderRight:"2px solid #bbb",borderBottom:"1px solid #ddd",color:COWLS}}>{match.away[1]||"A2"}</td>
            {a2Cells}
            <td style={{padding:"6px 3px",textAlign:"center",fontWeight:700,fontSize:12,borderLeft:"2px solid #bbb",borderBottom:"1px solid #ddd",color:"#333",background:CB}}>{a2T != null ? a2T : "-"}</td>
          </tr>
        </tbody>
      );
    } else {
      var homeCells = holes.map(function(h, i) { return makeDataCell(h, i, "home", CBUZZ, false); });
      var awayCells = holes.map(function(h, i) { return makeDataCell(h, i, "away", COWLS, true); });
      bodyRows = (
        <tbody>
          <tr>
            <td style={{padding:"4px 2px",fontSize:8,fontWeight:700,whiteSpace:"nowrap",textAlign:"left",borderRight:"2px solid #bbb",borderBottom:"1px solid #ddd",color:CBUZZ}}>{getNames(match.home)}</td>
            {homeCells}
            <td style={{padding:"6px 3px",textAlign:"center",fontWeight:700,fontSize:12,borderLeft:"2px solid #bbb",borderBottom:"1px solid #ddd",color:"#333",background:CB}}>{hT != null ? hT : "-"}</td>
          </tr>
          <tr><td colSpan={holes.length+2} style={{height:4,background:"#f0ebe4",borderBottom:"1px solid #ddd"}} /></tr>
          <tr>
            <td style={{padding:"4px 2px",fontSize:8,fontWeight:700,whiteSpace:"nowrap",textAlign:"left",borderRight:"2px solid #bbb",borderBottom:"1px solid #ddd",color:COWLS}}>{getNames(match.away)}</td>
            {awayCells}
            <td style={{padding:"6px 3px",textAlign:"center",fontWeight:700,fontSize:12,borderLeft:"2px solid #bbb",borderBottom:"1px solid #ddd",color:"#333",background:CB}}>{aT != null ? aT : "-"}</td>
          </tr>
        </tbody>
      );
    }

    return (
      <div key={label} style={{marginBottom:12}}>
        <div style={{background:"#2a2a2a",padding:"7px 10px",borderRadius:"9px 9px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,color:"#fff",letterSpacing:2}}>{label} 9</span>
          <span style={{fontSize:11,color:"#fff",fontWeight:600}}>{yTot.toLocaleString()} yds - Par {parTot}</span>
        </div>
        <div style={{overflow:"hidden",border:"1px solid #ddd",borderTop:"none",background:CB}}>
          <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed"}}>
            <thead>
              <tr style={{background:"#f0ebe4"}}>
                <td style={{padding:"3px 1px",textAlign:"left",paddingLeft:3,fontSize:8,fontWeight:700,color:"#555",letterSpacing:0,borderRight:"2px solid #bbb",borderBottom:"1px solid #ddd"}}>HOLE</td>
                {headRow}
                <td style={{padding:"3px 1px",textAlign:"center",fontSize:8,fontWeight:700,color:"#555",letterSpacing:0,borderLeft:"2px solid #bbb",borderRight:"none",borderBottom:"1px solid #ddd"}}>TOT</td>
              </tr>
              <tr style={{background:"#f0ebe4"}}>
                <td style={{padding:"3px 1px",textAlign:"left",paddingLeft:3,fontSize:8,fontWeight:700,color:"#444",letterSpacing:0,borderRight:"2px solid #bbb",borderBottom:"1px solid #ddd"}}>PAR</td>
                {parRow}
                <td style={{padding:"3px 1px",textAlign:"center",fontSize:8,fontWeight:700,color:"#444",letterSpacing:0,borderLeft:"2px solid #bbb",borderRight:"none",borderBottom:"1px solid #ddd"}}>{parTot}</td>
              </tr>
              <tr style={{background:"#f0ebe4"}}>
                <td style={{padding:"3px 1px",textAlign:"left",paddingLeft:3,fontSize:7,fontWeight:700,color:"#666",letterSpacing:0,borderRight:"2px solid #bbb",borderBottom:"1px solid #ddd"}}>YDS</td>
                {ydsRow}
                <td style={{padding:"3px 1px",textAlign:"center",fontSize:7,fontWeight:700,color:"#666",letterSpacing:0,borderLeft:"2px solid #bbb",borderRight:"none",borderBottom:"1px solid #ddd"}}>{yTot}</td>
              </tr>
            </thead>
            {bodyRows}
          </table>
        </div>
        <div style={{background:"#2a2a2a",padding:"6px 10px",borderRadius:"0 0 9px 9px",display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:10,color:"#aaa",letterSpacing:1}}>THRU {end}</span>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,color:"#fff",letterSpacing:1}}>{runStatus}</span>
        </div>
      </div>
    );
  }

  function renderTotals() {
    var h1T=0,h2T=0,a1T=0,a2T=0,hT=0,aT=0;
    var h1n=0,h2n=0,a1n=0,a2n=0,hn=0,an=0;
    for (var h = 1; h <= 18; h++) {
      var sv = hs[h];
      if (!sv) { continue; }
      if (round.type === "hilo") {
        if (sv.h1 != null) { h1T += sv.h1; h1n++; }
        if (sv.h2 != null) { h2T += sv.h2; h2n++; }
        if (sv.a1 != null) { a1T += sv.a1; a1n++; }
        if (sv.a2 != null) { a2T += sv.a2; a2n++; }
      } else {
        if (sv.home != null) { hT += sv.home; hn++; }
        if (sv.away != null) { aT += sv.away; an++; }
      }
    }
    var noData = round.type === "hilo" ? h1n === 0 : hn === 0;
    if (noData) { return null; }

    function TotalEntry(ep) {
      return (
        <div style={{display:"flex",alignItems:"baseline",gap:8}}>
          <span style={{fontSize:11,fontWeight:700,color:ep.color,width:60,flexShrink:0}}>{ep.name}</span>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,color:ep.color,lineHeight:1}}>{ep.total}</span>
        </div>
      );
    }

    if (round.type === "hilo") {
      return (
        <div style={{background:"#fafaf8",borderRadius:"0 0 9px 9px",borderTop:"2px solid #2a2a2a",padding:"10px 14px 14px"}}>
          <div style={{fontSize:9,fontWeight:700,color:"#999",letterSpacing:2,marginBottom:10}}>18-HOLE TOTALS</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1px 1fr",gap:0}}>
            <div style={{display:"flex",flexDirection:"column",gap:4,paddingRight:16}}>
              <TotalEntry name={match.home[0]||"H1"} total={h1T} color={CBUZZ} />
              <TotalEntry name={match.home[1]||"H2"} total={h2T} color={CBUZZ} />
            </div>
            <div style={{background:"#e0d8d0"}} />
            <div style={{display:"flex",flexDirection:"column",gap:4,paddingLeft:16}}>
              <TotalEntry name={match.away[0]||"A1"} total={a1T} color={COWLS} />
              <TotalEntry name={match.away[1]||"A2"} total={a2T} color={COWLS} />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div style={{background:"#fafaf8",borderRadius:"0 0 9px 9px",borderTop:"2px solid #2a2a2a",padding:"10px 14px 14px"}}>
        <div style={{fontSize:9,fontWeight:700,color:"#999",letterSpacing:2,marginBottom:10}}>18-HOLE TOTALS</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1px 1fr",gap:0}}>
          <div style={{paddingRight:16}}><TotalEntry name={getNames(match.home)} total={hT} color={CBUZZ} /></div>
          <div style={{background:"#e0d8d0"}} />
          <div style={{paddingLeft:16}}><TotalEntry name={getNames(match.away)} total={aT} color={COWLS} /></div>
        </div>
      </div>
    );
  }

  var inputFields;
  if (editHole) {
    var fieldDefs = round.type === "hilo"
      ? [{key:"h1",label:match.home[0]||"H1",color:CBUZZ},{key:"h2",label:match.home[1]||"H2",color:CBUZZ},{key:"a1",label:match.away[0]||"A1",color:COWLS},{key:"a2",label:match.away[1]||"A2",color:COWLS}]
      : [{key:"home",label:getNames(match.home),color:CBUZZ},{key:"away",label:getNames(match.away),color:COWLS}];
    inputFields = fieldDefs.map(function(fd) {
      var btns = [1,2,3,4,5,6,7,8,9,10].map(function(n) {
        return (
          <button
            key={n}
            onClick={function() {
              var nd = Object.assign({}, draft);
              nd[fd.key] = n;
              setDraft(nd);
            }}
            style={{width:38,height:38,borderRadius:9,border:draft[fd.key]===n?"2.5px solid #1a1a1a":"1.5px solid #ddd",background:draft[fd.key]===n?"#1a1a1a":"#fff",color:draft[fd.key]===n?"#fff":"#333",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}
          >
            {n}
          </button>
        );
      });
      return (
        <div key={fd.key} style={{marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:fd.color,marginBottom:5,letterSpacing:1}}>{fd.label}</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{btns}</div>
        </div>
      );
    });
  }

  return (
    <div style={{padding:"8px 4px",background:BG,minHeight:"100vh",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{FONTS}</style>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <button onClick={function() { setView("matches"); }} style={{background:"none",border:"none",fontSize:13,color:"#888",cursor:"pointer",padding:0,fontFamily:"'DM Sans',sans-serif"}}>Back</button>
        <div style={{display:"flex",gap:8}}>
          {isComplete && (
            <button
              onClick={function() { setEditMode(function(e) { return !e; }); }}
              style={{padding:"6px 12px",background:editMode?"#1a1a1a":"#f0ebe4",color:editMode?"#fff":"#555",border:"none",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}
            >
              {editMode ? "LOCK" : "EDIT"}
            </button>
          )}
          <button
            onClick={function() { setShowReset(true); }}
            style={{padding:"6px 12px",background:"#fff0f0",color:"#cc3333",border:"1px solid #ffcccc",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}
          >
            RESET
          </button>
        </div>
      </div>
      <div style={{background:CB,borderRadius:14,padding:"13px 15px",marginBottom:10,boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:17,letterSpacing:2,color:"#1a1a1a"}}>{round.label} - {match.label}</div>
            <div style={{fontSize:10,color:"#777",letterSpacing:1,marginTop:2}}>{round.fmt} - {course.name.toUpperCase()} - {tee.label.toUpperCase()} TEES</div>
          </div>
          <div style={{display:"flex",gap:6}}>
            {matchClinched && !editMode && <Pill label="Final" color="#22c55e" />}
            {editMode && <Pill label="Editing" color="#f59e0b" />}
            {!matchClinched && (round.type === "hilo" ? hiloResult(scores,mid).played > 0 : mpStatus(scores,mid).status === "live") && <Pill label="Live" color="#22c55e" />}
          </div>
        </div>
        <div style={{marginTop:9,padding:"7px 11px",background:statusColor+"15",borderRadius:8,borderLeft:"3px solid "+statusColor}}>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,color:statusColor,letterSpacing:1.5}}>{statusText}</span>
        </div>
      </div>
      <div style={{background:CB,borderRadius:14,padding:"10px 6px",boxShadow:"0 2px 12px rgba(0,0,0,0.07)",marginBottom:10}}>
        {renderNine(0, 9, "FRONT")}
        {renderNine(9, 18, "BACK")}
        {renderTotals()}
      </div>
      {showReset && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:24}}>
          <div style={{background:CB,borderRadius:18,padding:24,width:"100%",maxWidth:320,textAlign:"center"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:2,marginBottom:8}}>RESET SCORES?</div>
            <div style={{fontSize:13,color:"#666",marginBottom:20,lineHeight:1.5}}>This will clear all scores for this match.</div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={function() { setShowReset(false); }} style={{flex:1,padding:13,background:"#f5f0eb",color:"#555",border:"none",borderRadius:11,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>CANCEL</button>
              <button onClick={resetScores} style={{flex:1,padding:13,background:"#cc3333",color:"#fff",border:"none",borderRadius:11,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>RESET</button>
            </div>
          </div>
        </div>
      )}
      {editHole && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}}>
          <div style={{background:CB,borderRadius:"20px 20px 0 0",padding:"22px 18px",width:"100%",maxWidth:480,fontFamily:"'DM Sans',sans-serif"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:19,letterSpacing:2,marginBottom:3}}>HOLE {editHole} - PAR {allPar[editHole-1]}</div>
            <div style={{fontSize:10,color:"#888",marginBottom:16}}>{round.fmt}</div>
            {inputFields}
            <div style={{display:"flex",gap:9,marginTop:8}}>
              <button onClick={function() { setEditHole(null); }} style={{flex:1,padding:13,background:"#f5f0eb",color:"#555",border:"none",borderRadius:11,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>CANCEL</button>
              <button onClick={commit} style={{flex:2,padding:13,background:"#1a1a1a",color:"#fff",border:"none",borderRadius:11,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>SAVE HOLE {editHole}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OverallTab(props) {
  var matchesByRound = props.matchesByRound;
  var scores = props.scores;
  var setView = props.setView;
  var collapsedState = useState(function() { return calcCollapsed(matchesByRound, scores); });
  var collapsed = collapsedState[0];
  var setCollapsed = collapsedState[1];

  useEffect(function() {
    setCollapsed(calcCollapsed(matchesByRound, scores));
  }, [scores, matchesByRound]);

  var gB = 0, gO = 0;
  ROUNDS.forEach(function(r) {
    var pts = rdPts(r, matchesByRound[r.id] || [], scores);
    gB += pts.b; gO += pts.o;
  });

  var roundCards = ROUNDS.map(function(r) {
    var ms = matchesByRound[r.id] || [];
    var pts = rdPts(r, ms, scores);
    var isColl = collapsed[r.id];
    var hasLive = ms.some(function(m) { return !isDone(r, m, scores) && hasScores(r, m, scores); });

    var matchRows = null;
    if (!isColl) {
      if (ms.length === 0) {
        matchRows = <div style={{padding:"18px 16px",color:"#aaa",fontSize:13,textAlign:"center"}}>Lineups not yet set</div>;
      } else {
        matchRows = ms.map(function(m, idx) {
          var lbl = "";
          var winner = null;
          var live = false;
          if (r.type === "hilo") {
            var res = hiloResult(scores, m.id);
            live = !res.complete && res.played > 0;
            winner = res.winner;
            if (res.complete) {
              lbl = res.winner === "buzz" ? "BUZZARDS WIN" : res.winner === "owls" ? "OWLS WIN" : "HALVED";
            } else if (live) {
              var d2 = res.bPts - res.oPts;
              lbl = d2 > 0 ? "BUZZARDS +" + d2 : d2 < 0 ? "OWLS +" + Math.abs(d2) : "TIED";
            }
          } else {
            var st2 = mpStatus(scores, m.id);
            live = st2.status === "live";
            winner = st2.winner;
            var hN = r.pps > 1 ? "BUZZARDS" : getNames(m.home).split(" / ")[0].toUpperCase();
            var aN = r.pps > 1 ? "OWLS" : getNames(m.away).split(" / ")[0].toUpperCase();
            if (st2.status === "complete") {
              if (st2.winner === "halved") { lbl = "HALVED"; }
              else if (st2.winner === "home") { lbl = hN + " WINS " + st2.result; }
              else { lbl = aN + " WINS " + st2.result; }
            } else if (live) {
              if (st2.leader === "home") { lbl = hN + " " + st2.result; }
              else if (st2.leader === "away") { lbl = aN + " " + st2.result; }
              else { lbl = "ALL SQUARE"; }
            }
          }
          var hW = (r.type !== "hilo" && winner === "home") || (r.type === "hilo" && winner === "buzz");
          var aW = (r.type !== "hilo" && winner === "away") || (r.type === "hilo" && winner === "owls");
          return (
            <div key={m.id} style={{borderTop: idx === 0 ? "1px solid #f0ebe4" : "none"}}>
              <div
                onClick={function() { setView("scorecard:" + r.id + ":" + m.id); }}
                style={{padding:"12px 16px",borderBottom: idx === ms.length-1 ? "none" : "1px solid #f0ebe4",cursor:"pointer"}}
              >
                <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",gap:4}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                    <div style={{fontSize:11,fontWeight:700,color:hW?CBUZZ:"#333",textAlign:"center"}}>{getNames(m.home)}</div>
                    <div style={{fontSize:9,color:CBUZZ,letterSpacing:1,marginTop:1}}>BUZZARDS</div>
                  </div>
                  <div style={{textAlign:"center",minWidth:80}}>
                    {live && <span style={{display:"block",width:6,height:6,borderRadius:"50%",background:"#22c55e",margin:"0 auto 3px"}} />}
                    {lbl ? <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:12,color:live?"#22c55e":winner?"#1a1a1a":"#bbb",letterSpacing:1}}>{lbl}</div> : null}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                    <div style={{fontSize:11,fontWeight:700,color:aW?COWLS:"#333",textAlign:"center"}}>{getNames(m.away)}</div>
                    <div style={{fontSize:9,color:COWLS,letterSpacing:1,marginTop:1}}>OWLS</div>
                  </div>
                </div>
              </div>
            </div>
          );
        });
      }
    }

    return (
      <div key={r.id} style={{marginBottom:12}}>
        <div
          onClick={function() { setCollapsed(function(p) { var n = Object.assign({}, p); n[r.id] = !p[r.id]; return n; }); }}
          style={{background:CB,borderRadius:isColl?"16px":"16px 16px 0 0",padding:"13px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}}
        >
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            {hasLive && <span style={{width:8,height:8,borderRadius:"50%",background:"#22c55e",flexShrink:0}} />}
            <div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,letterSpacing:2,color:"#1a1a1a"}}>{r.label} - {r.date}</div>
              <div style={{fontSize:10,color:"#888",letterSpacing:1}}>{r.fmt}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20}}>
              <span style={{color:CBUZZ}}>{fmtPts(pts.b)}</span>
              <span style={{color:"#ccc",margin:"0 3px"}}>-</span>
              <span style={{color:COWLS}}>{fmtPts(pts.o)}</span>
            </div>
            <span style={{fontSize:11,color:"#aaa",display:"inline-block"}}>{isColl ? ">" : "v"}</span>
          </div>
        </div>
        {!isColl && (
          <div style={{background:CB,borderRadius:"0 0 16px 16px",boxShadow:"0 2px 12px rgba(0,0,0,0.07)",overflow:"hidden"}}>
            {matchRows}
          </div>
        )}
      </div>
    );
  });

  return (
    <div style={{padding:"16px 16px 0",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{FONTS}</style>
      <div style={{textAlign:"center",paddingTop:14,paddingBottom:14}}>
        <div style={{width:80,height:80,borderRadius:16,background:"#222",border:"1px solid #333",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:10,color:"#666",letterSpacing:2,textAlign:"center",lineHeight:1.5}}>BENDERS GOLF</span>
        </div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:4,color:"#1a1a1a",lineHeight:1}}>BENDERS 2026</div>
        <div style={{fontSize:11,color:"#888",letterSpacing:2,marginTop:3}}>GAMBLE SANDS - JUNE 12-14</div>
        <div style={{marginTop:20,background:CB,borderRadius:16,padding:"14px 18px",boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",gap:8}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
              <BuzzLogo size={36} />
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:38,color:CBUZZ,lineHeight:1}}>{fmtPts(gB)}</div>
            </div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:"#ccc"}}>-</div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
              <OwlsLogo size={36} />
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:38,color:COWLS,lineHeight:1}}>{fmtPts(gO)}</div>
            </div>
          </div>
          <div style={{marginTop:6,fontSize:10,color:"#aaa",letterSpacing:1}}>12 POINTS TOTAL - FIRST TO 6.5 WINS</div>
        </div>
      </div>
      {roundCards}
      <div style={{height:8}} />
    </div>
  );
}

function MatchesTab(props) {
  var matchesByRound = props.matchesByRound;
  var setMatchesByRound = props.setMatchesByRound;
  var scores = props.scores;
  var tees = props.tees;
  var setTees = props.setTees;
  var setView = props.setView;
  var collapsedState = useState(function() { return calcCollapsed(matchesByRound, scores); });
  var collapsed = collapsedState[0];
  var setCollapsed = collapsedState[1];

  useEffect(function() {
    setCollapsed(calcCollapsed(matchesByRound, scores));
  }, [scores, matchesByRound]);

  var roundCards = ROUNDS.map(function(r) {
    var ms = matchesByRound[r.id] || [];
    var course = COURSES[r.course];
    var teeIdx = tees[r.id] || 2;
    var pts = rdPts(r, ms, scores);
    var isColl = collapsed[r.id];
    var anyScrs = ms.some(function(m) { return hasScores(r, m, scores); });
    var allDone = ms.length > 0 && ms.every(function(m) { return isDone(r, m, scores); });
    var allSet  = ms.every(function(m) { return m.home.every(Boolean) && m.away.every(Boolean); });

    var pill;
    if (allDone)       { pill = <Pill label="Final"       color="#22c55e" />; }
    else if (anyScrs)  { pill = <Pill label="Live"        color="#22c55e" />; }
    else if (allSet)   { pill = <Pill label="Lineups Set" color="#4a90d9" />; }
    else               { pill = <span style={{fontSize:10,color:"#bbb",letterSpacing:1}}>NOT SET</span>; }

    var teeSelector = null;
    if (!isColl) {
      var teeDot = course.tees[teeIdx];
      teeSelector = (
        <div style={{marginTop:10}} onClick={function(e) { e.stopPropagation(); }}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,border:"1.5px solid #e0d8d0",borderRadius:10,padding:"5px 10px 5px 8px",background:"#fff",position:"relative"}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:teeDot.color,flexShrink:0}} />
            <select
              value={teeIdx}
              onChange={function(e) {
                var val = parseInt(e.target.value);
                setTees(function(p) { var n = Object.assign({}, p); n[r.id] = val; return n; });
              }}
              style={{fontSize:12,fontFamily:"'DM Sans',sans-serif",fontWeight:600,color:"#333",background:"transparent",border:"none",outline:"none",cursor:"pointer",paddingRight:16}}
            >
              {course.tees.map(function(t, i) {
                return <option key={i} value={i}>{t.label} - {t.total.toLocaleString()} yds</option>;
              })}
            </select>
            <span style={{fontSize:9,color:"#999",pointerEvents:"none",position:"absolute",right:8,top:"50%",transform:"translateY(-50%)"}}>v</span>
          </div>
        </div>
      );
    }

    var matchRows = null;
    if (!isColl) {
      matchRows = ms.map(function(m, idx) {
        var lineupSet = m.home.every(Boolean) && m.away.every(Boolean);
        var thisHasScores = hasScores(r, m, scores);
        var hN = r.pps > 1 ? "BUZZARDS" : getNames(m.home).split(" / ")[0].toUpperCase();
        var aN = r.pps > 1 ? "OWLS" : getNames(m.away).split(" / ")[0].toUpperCase();
        var mStatus = "";
        var mColor = "#888";
        var mLive = false;

        if (r.type === "hilo") {
          var res = hiloResult(scores, m.id);
          if (res.complete) {
            mStatus = res.winner === "buzz" ? "BUZZARDS WIN" : res.winner === "owls" ? "OWLS WIN" : "HALVED";
            mColor  = res.winner === "buzz" ? CBUZZ : res.winner === "owls" ? COWLS : "#666";
          } else if (res.played > 0) {
            mStatus = res.bPts + " - " + res.oPts;
            mColor  = res.bPts > res.oPts ? CBUZZ : res.bPts < res.oPts ? COWLS : "#666";
            mLive = true;
          }
        } else {
          var st = mpStatus(scores, m.id);
          if (st.status === "complete") {
            if (st.winner === "halved") { mStatus = "HALVED"; mColor = "#666"; }
            else if (st.winner === "home") { mStatus = hN + " WINS " + st.result; mColor = CBUZZ; }
            else { mStatus = aN + " WINS " + st.result; mColor = COWLS; }
          } else if (st.status === "live") {
            if (st.leader === "home") { mStatus = hN + " " + st.result; mColor = CBUZZ; }
            else if (st.leader === "away") { mStatus = aN + " " + st.result; mColor = COWLS; }
            else { mStatus = "ALL SQUARE"; mColor = "#666"; }
            mLive = true;
          }
        }

        return (
          <div key={m.id} style={{borderBottom: idx===ms.length-1?"none":"1px solid #f0ebe4",padding:"8px 12px",display:"flex",alignItems:"center",gap:6}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",gap:4}}>
                <div>
                  <div style={{fontSize:9,color:CBUZZ,letterSpacing:1,fontWeight:600}}>BUZZARDS</div>
                  <div style={{fontSize:11,fontWeight:600,color:"#222",marginTop:1}}>{getNames(m.home)}</div>
                </div>
                <div style={{textAlign:"center",minWidth:72}}>
                  {mStatus ? (
                    <div style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 7px",borderRadius:6,background:mColor+"15",border:"1px solid "+mColor+"40"}}>
                      {mLive && <span style={{width:4,height:4,borderRadius:"50%",background:"#22c55e",flexShrink:0}} />}
                      <span style={{fontSize:9,fontWeight:700,color:mColor,fontFamily:"'DM Sans',sans-serif",letterSpacing:0.3}}>{mStatus}</span>
                    </div>
                  ) : null}
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:9,color:COWLS,letterSpacing:1,fontWeight:600}}>OWLS</div>
                  <div style={{fontSize:11,fontWeight:600,color:"#222",marginTop:1}}>{getNames(m.away)}</div>
                </div>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:4,flexShrink:0}}>
              <button
                onClick={function(e) { e.stopPropagation(); setView("lineup:" + r.id + ":" + m.id); }}
                style={{padding:"4px 9px",background:lineupSet?"#f5f0eb":"#1a1a1a",color:lineupSet?"#666":"#fff",border:lineupSet?"1px solid #e0d8d0":"none",borderRadius:7,fontSize:9,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap",letterSpacing:0.3}}
              >
                {lineupSet ? "EDIT LINEUP" : "SET LINEUP"}
              </button>
              {lineupSet && (
                <button
                  onClick={function(e) { e.stopPropagation(); setView("scorecard:" + r.id + ":" + m.id); }}
                  style={{padding:"4px 9px",background:thisHasScores?"#1a1a1a":"#f5f0eb",color:thisHasScores?"#fff":"#888",border:thisHasScores?"none":"1px solid #e0d8d0",borderRadius:7,fontSize:9,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap",letterSpacing:0.3}}
                >
                  {thisHasScores ? "SCORECARD" : "ENTER SCORES"}
                </button>
              )}
            </div>
          </div>
        );
      });
    }

    return (
      <div key={r.id} style={{background:CB,borderRadius:16,marginBottom:14,boxShadow:"0 2px 12px rgba(0,0,0,0.07)",overflow:"hidden"}}>
        <div
          onClick={function() { setCollapsed(function(p) { var n = Object.assign({}, p); n[r.id] = !p[r.id]; return n; }); }}
          style={{padding:"10px 13px",borderBottom:isColl?"none":"1px solid #f0ebe4",cursor:"pointer"}}
        >
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:2,color:"#1a1a1a"}}>{r.label} - {r.date}</div>
              <div style={{fontSize:10,color:"#666",letterSpacing:1,marginTop:1}}>{r.fmt}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{textAlign:"right"}}>
                {pill}
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:17,marginTop:4}}>
                  <span style={{color:CBUZZ}}>{fmtPts(pts.b)}</span>
                  <span style={{color:"#ccc",margin:"0 3px"}}>-</span>
                  <span style={{color:COWLS}}>{fmtPts(pts.o)}</span>
                </div>
              </div>
              <span style={{fontSize:11,color:"#aaa",display:"inline-block"}}>{isColl ? ">" : "v"}</span>
            </div>
          </div>
          {teeSelector}
        </div>
        {matchRows}
      </div>
    );
  });

  return (
    <div style={{padding:"22px 16px 0",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{FONTS}</style>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:3,color:"#1a1a1a",marginBottom:12}}>MATCHES</div>
      {roundCards}
    </div>
  );
}

export default function App() {
  var authedState = useState(false);
  var authed = authedState[0];
  var setAuthed = authedState[1];
  var viewState = useState("overall");
  var view = viewState[0];
  var setView = viewState[1];
  var scoresState = useState(makeDemoScores);
  var scores = scoresState[0];
  var setScores = scoresState[1];
  var teesState = useState({r1:2, r2:2, r3:2});
  var tees = teesState[0];
  var setTees = teesState[1];
  var mbrState = useState(DEMO_MATCHES);
  var matchesByRound = mbrState[0];
  var setMatchesByRound = mbrState[1];

  var isScorecard = view.indexOf("scorecard:") === 0;
  var isLineup    = view.indexOf("lineup:") === 0;
  var lineupParts = isLineup ? view.split(":") : [];
  var lineupRound = isLineup ? ROUNDS.filter(function(r) { return r.id === lineupParts[1]; })[0] : null;
  var lineupMatch = isLineup ? (matchesByRound[lineupParts[1]] || []).filter(function(m) { return m.id === lineupParts[2]; })[0] : null;

  if (!authed) {
    return <PasswordScreen onAuth={function() { setAuthed(true); }} />;
  }

  if (isLineup) {
    return (
      <div style={{minHeight:"100vh",background:BG,fontFamily:"'DM Sans',sans-serif",maxWidth:480,margin:"0 auto"}}>
        <LineupView round={lineupRound} match={lineupMatch} matchesByRound={matchesByRound} setMatchesByRound={setMatchesByRound} setView={setView} />
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:BG,display:"flex",flexDirection:"column",fontFamily:"'DM Sans',sans-serif",maxWidth:480,margin:"0 auto",position:"relative"}}>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <div style={{flex:1,overflowY:"auto",paddingBottom:isScorecard?16:72}}>
        {view === "overall"  && <OverallTab  matchesByRound={matchesByRound} scores={scores} setView={setView} />}
        {view === "matches"  && <MatchesTab  matchesByRound={matchesByRound} setMatchesByRound={setMatchesByRound} scores={scores} tees={tees} setTees={setTees} setView={setView} />}
        {isScorecard         && <ScorecardView viewKey={view} matchesByRound={matchesByRound} scores={scores} setScores={setScores} tees={tees} setView={setView} />}
      </div>
      {!isScorecard && (
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#1a1a1a",display:"flex",zIndex:50}}>
          {[{key:"overall",label:"OVERALL"},{key:"matches",label:"MATCHES"}].map(function(tab) {
            return (
              <button
                key={tab.key}
                onClick={function() { setView(tab.key); }}
                style={{flex:1,padding:"14px 8px",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center"}}
              >
                <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:2,color:view===tab.key?"#fff":"#555",borderBottom:view===tab.key?"2px solid #fff":"2px solid transparent",paddingBottom:2}}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
