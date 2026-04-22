export const DASHBOARD = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KPS Kimlik Doğrulama</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root {
  --red:#e63329; --cream:#f5f0e8; --ink:#1a1a1a; --mid:#555; --light:#999;
  --border:#d0c8b8; --success:#1a7a3a; --sbg:#e8f5ec; --ebg:#fdf0ef;
  --wbg:#fffbea; --warn:#b07d00; --grid:#e8e2d8;
}
*{box-sizing:border-box;margin:0;padding:0}
body{
  background:var(--cream);font-family:'IBM Plex Sans',sans-serif;
  min-height:100vh;display:flex;flex-direction:column;
  align-items:center;padding:24px;position:relative;
}
body::before{
  content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:linear-gradient(var(--grid) 1px,transparent 1px),
    linear-gradient(90deg,var(--grid) 1px,transparent 1px);
  background-size:40px 40px;
}
.wrap{position:relative;z-index:1;width:100%;max-width:620px;display:flex;flex-direction:column;gap:16px;padding-top:8px}

/* Card */
.card{background:white;border:2px solid var(--ink);box-shadow:5px 5px 0 var(--ink);overflow:hidden}
.card-header{
  background:var(--red);padding:18px 24px;
  display:flex;align-items:center;gap:14px;border-bottom:2px solid var(--ink);
}
.hdr-icon{width:40px;height:40px;background:white;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.hdr-icon svg{width:20px;height:20px}
.hdr-text h1{font-family:'Bebas Neue',sans-serif;font-size:20px;color:white;letter-spacing:1.5px;line-height:1}
.hdr-text p{font-size:10px;color:rgba(255,255,255,.7);margin-top:3px}
.hdr-flag{margin-left:auto;font-size:26px}

/* Tabs */
.tabs{display:flex;border-bottom:2px solid var(--ink);background:var(--cream)}
.tab{
  flex:1;padding:10px 0;
  font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:1.5px;
  color:var(--light);background:none;border:none;border-right:1.5px solid var(--border);
  cursor:pointer;transition:all .15s;
}
.tab:last-child{border-right:none}
.tab.active{background:white;color:var(--red);border-bottom:2px solid white;margin-bottom:-2px}
.tab:hover:not(.active){color:var(--ink);background:rgba(255,255,255,.5)}

/* Panel */
.panel{display:none;padding:22px 24px}
.panel.active{display:block}

/* Labels & inputs */
.lbl{font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;color:var(--mid);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:7px;display:block}
.row{display:flex;gap:0;margin-bottom:5px}
input[type=text],input[type=password],input[type=number]{
  flex:1;font-family:'IBM Plex Mono',monospace;
  border:2px solid var(--ink);border-right:none;
  padding:11px 13px;outline:none;background:var(--cream);color:var(--ink);
  transition:background .15s;font-size:13px;
}
input[type=text]:focus,input[type=password]:focus,input[type=number]:focus{background:white}
input::placeholder{color:var(--border)}
input.full{border-right:2px solid var(--ink);width:100%}
#tc1,#tc2{font-size:19px;font-weight:500;letter-spacing:3px}

.btn{
  font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:1.5px;
  background:var(--ink);color:white;border:2px solid var(--ink);
  padding:0 18px;cursor:pointer;transition:background .15s;white-space:nowrap;
}
.btn:hover{background:var(--red);border-color:var(--red)}
.btn:active{transform:translate(2px,2px)}
.btn.block{width:100%;padding:12px;margin-top:6px;border-right:2px solid var(--ink)}

.cc{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--light);text-align:right;margin-bottom:12px}
.cc span{color:var(--ink);font-weight:600}
.sec{font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--light);margin-bottom:9px}

/* Digit cells */
.digits{display:flex;gap:3px;margin-bottom:16px}
.dc{
  flex:1;aspect-ratio:.75;border:1.5px solid var(--border);
  display:flex;align-items:center;justify-content:center;
  font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:600;
  background:var(--cream);transition:all .2s;position:relative;
}
.dc.filled{background:white;border-color:var(--ink)}
.dc.odd{background:#e8f0fd;border-color:#3366cc;color:#3366cc}
.dc.even{background:#fdeaea;border-color:#cc3333;color:#cc3333}
.dc.chk{background:#fff8e0;border-color:#c8a000;color:#c8a000}
.dc-lbl{position:absolute;top:2px;right:3px;font-size:6px;color:var(--light);font-family:'IBM Plex Mono',monospace}

/* Result */
.result{border:2px solid var(--border);padding:13px;display:none}
.result.show{display:block}
.result.ok{border-color:var(--success);background:var(--sbg)}
.result.fail{border-color:var(--red);background:var(--ebg)}
.result.warn{border-color:var(--warn);background:var(--wbg)}
.r-icon{font-size:22px;display:block;margin-bottom:5px}
.r-title{font-family:'Bebas Neue',sans-serif;font-size:17px;letter-spacing:1px;margin-bottom:4px}
.result.ok   .r-title{color:var(--success)}
.result.fail .r-title{color:var(--red)}
.result.warn .r-title{color:var(--warn)}
.r-detail{font-size:11px;color:var(--mid);line-height:1.65;font-family:'IBM Plex Mono',monospace}

/* Algo */
.algo{display:none;margin-top:14px;border:1.5px solid var(--border);background:var(--cream)}
.algo.show{display:block}
.algo-hdr{font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--mid);padding:7px 11px;border-bottom:1.5px solid var(--border);background:white}
.algo-steps{padding:10px 11px;display:flex;flex-direction:column;gap:7px}
.step{display:flex;align-items:flex-start;gap:8px;font-family:'IBM Plex Mono',monospace;font-size:11px}
.snum{width:17px;height:17px;background:var(--ink);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;flex-shrink:0;margin-top:1px}
.sok{color:var(--success)}.sfail{color:var(--red)}

/* Name-ID panel */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.two-col input{border-right:2px solid var(--ink)}
.meta-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}

/* KPS result card */
.kps-card{border:2px solid var(--border);display:none;margin-top:14px;overflow:hidden}
.kps-card.show{display:block}
.kps-head{padding:13px;display:flex;align-items:flex-start;gap:12px;border-bottom:1.5px solid var(--border)}
.kps-icon{font-size:28px;line-height:1;margin-top:2px}
.kps-info{flex:1}
.kps-title{font-family:'Bebas Neue',sans-serif;font-size:19px;letter-spacing:1px}
.kps-sub{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--mid);margin-top:3px}
.kps-body{padding:13px;background:var(--cream)}
.grid4{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.stat{background:white;border:1.5px solid var(--border);padding:9px 11px}
.sk{font-family:'IBM Plex Mono',monospace;font-size:8px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--light);margin-bottom:4px}
.sv{font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:600;color:var(--ink)}

/* Spinner */
.spin{display:none;align-items:center;gap:9px;padding:12px 0;font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--mid)}
.spin.show{display:flex}
.dot{width:7px;height:7px;background:var(--ink);animation:pulse 1s infinite}
.dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
@keyframes pulse{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}

/* Batch */
.batch-area{font-family:'IBM Plex Mono',monospace;font-size:12px;border:2px solid var(--ink);padding:12px;background:var(--cream);outline:none;resize:vertical;width:100%;min-height:140px;color:var(--ink);margin-bottom:6px}
.batch-area:focus{background:white}
.batch-results{display:flex;flex-direction:column;gap:6px;margin-top:14px}
.br{display:flex;align-items:center;gap:10px;padding:9px 12px;border:1.5px solid var(--border);background:white;font-family:'IBM Plex Mono',monospace;font-size:11px}
.br.ok{border-color:var(--success);background:var(--sbg)}
.br.fail{border-color:var(--red);background:var(--ebg)}
.br .bi{font-size:16px;flex-shrink:0}
.br .bt{flex:1}
.br .bd{font-size:10px;color:var(--mid);margin-top:2px}
.br .bms{font-size:9px;color:var(--light);margin-left:auto}

/* API docs panel */
.api-block{background:var(--ink);color:#c8f0c8;font-family:'IBM Plex Mono',monospace;font-size:11px;padding:14px;line-height:1.7;overflow-x:auto;margin-bottom:14px;white-space:pre}
.api-section{margin-bottom:18px}
.api-section h3{font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:1px;color:var(--ink);margin-bottom:8px;border-bottom:1.5px solid var(--border);padding-bottom:5px}
.badge{display:inline-block;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;padding:2px 7px;border:1.5px solid;margin-right:6px}
.badge.post{color:#c8a000;border-color:#c8a000}.badge.get{color:var(--success);border-color:var(--success)}

/* Config card */
.cfg-row{display:flex;gap:10px;align-items:flex-end;margin-bottom:14px}
.cfg-row>div{flex:1}
.cfg-status{font-family:'IBM Plex Mono',monospace;font-size:10px;padding:6px 10px;border:1.5px solid var(--border);background:var(--cream);color:var(--mid)}
.cfg-status.ok{border-color:var(--success);color:var(--success);background:var(--sbg)}
.cfg-status.fail{border-color:var(--red);color:var(--red);background:var(--ebg)}

/* Log */
.log-area{font-family:'IBM Plex Mono',monospace;font-size:10px;background:var(--ink);color:#8fc;padding:12px;max-height:260px;overflow-y:auto;line-height:1.6}
.log-line{border-bottom:1px solid rgba(255,255,255,.05);padding:3px 0}
.log-line.v{color:#6f6}.log-line.f{color:#f88}.log-line.w{color:#fa0}.log-line.i{color:#8cf}

/* Animations */
@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
.shake{animation:shake .35s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
.fi{animation:fadeIn .25s ease forwards}

/* Footer */
.footer{background:var(--ink);padding:10px 24px;display:flex;align-items:center;justify-content:space-between}
.fn{font-family:'IBM Plex Mono',monospace;font-size:9px;color:rgba(255,255,255,.35)}

/* Divider */
hr.div{border:none;border-top:1.5px solid var(--border);margin:16px 0}
</style>
</head>
<body>
<div class="wrap">

  <div class="card">
    <div class="card-header">
      <div class="hdr-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="#e63329" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2"/>
          <circle cx="8" cy="12" r="2.5"/>
          <line x1="13" y1="10" x2="20" y2="10"/>
          <line x1="13" y1="14" x2="18" y2="14"/>
        </svg>
      </div>
      <div class="hdr-text">
        <h1>KPS KİMLİK DOĞRULAMA</h1>
        <p>NVI · TC KİMLİK PAYLAŞIM SİSTEMİ · REST API + DASHBOARD</p>
      </div>
      <div class="hdr-flag">🇹🇷</div>
    </div>

    <div class="tabs">
      <button class="tab active" onclick="tab('tc')">TC NUMARA</button>
      <button class="tab" onclick="tab('nameid')">AD + TC</button>
      <button class="tab" onclick="tab('batch')">TOPLU</button>
      <button class="tab" onclick="tab('api')">API DOCS</button>
    </div>

    <!-- ── TAB 1: TC only ── -->
    <div class="panel active" id="p-tc">
      <label class="lbl" for="tc1">TC Kimlik Numarası</label>
      <div class="row">
        <input id="tc1" type="text" inputmode="numeric" maxlength="11" placeholder="_ _ _ _ _ _ _ _ _ _ _" autocomplete="off"/>
        <button class="btn" onclick="verifyTc()">DOĞRULA</button>
      </div>
      <div class="cc"><span id="cc1">0</span> / 11 hane</div>
      <div class="sec">Hane Analizi</div>
      <div class="digits" id="dg1"></div>
      <div class="result" id="r1"><span class="r-icon" id="ri1"></span><div class="r-title" id="rt1"></div><div class="r-detail" id="rd1"></div></div>
      <div class="algo" id="al1"><div class="algo-hdr">Algoritma Adımları</div><div class="algo-steps" id="as1"></div></div>
    </div>

    <!-- ── TAB 2: Name + TC ── -->
    <div class="panel" id="p-nameid">
      <div class="two-col">
        <div><label class="lbl" for="nad">Ad</label><input id="nad" type="text" class="full" placeholder="AHMET"/></div>
        <div><label class="lbl" for="nsoyad">Soyad</label><input id="nsoyad" type="text" class="full" placeholder="YILMAZ"/></div>
      </div>
      <div class="meta-row">
        <div><label class="lbl" for="nyr">Doğum Yılı</label><input id="nyr" type="number" class="full" placeholder="1985" min="1900" max="2099"/></div>
        <div><label class="lbl" for="tc2">TC Kimlik No</label><input id="tc2" type="text" inputmode="numeric" maxlength="11" class="full" placeholder="_ _ _ _ _ _ _ _ _ _ _"/></div>
      </div>
      <button class="btn block" onclick="verifyNameId()">KPS'E DOĞRULA</button>

      <div class="spin" id="sp2"><div class="dot"></div><div class="dot"></div><div class="dot"></div><span>NVI KPS sorgulanıyor...</span></div>

      <div class="kps-card" id="kc2">
        <div class="kps-head" id="kh2">
          <span class="kps-icon" id="ki2"></span>
          <div class="kps-info">
            <div class="kps-title" id="kt2"></div>
            <div class="kps-sub"  id="ks2"></div>
          </div>
        </div>
        <div class="kps-body">
          <div class="grid4" id="kg2"></div>
        </div>
      </div>
    </div>

    <!-- ── TAB 3: Batch ── -->
    <div class="panel" id="p-batch">
      <div class="sec">JSON Formatı · Maks 20 Kayıt</div>
      <textarea class="batch-area" id="batchInput" spellcheck="false">[
  {"tc":"10000000146","ad":"AHMET","soyad":"YILMAZ","dogumYili":1985},
  {"tc":"12345678901","ad":"FATMA","soyad":"KAYA","dogumYili":1990}
]</textarea>
      <button class="btn block" onclick="runBatch()">TOPLU DOĞRULA</button>
      <div class="spin" id="spB"><div class="dot"></div><div class="dot"></div><div class="dot"></div><span>Sorgulanıyor...</span></div>
      <div class="batch-results" id="batchResults"></div>
    </div>

    <!-- ── TAB 4: API Docs ── -->
    <div class="panel" id="p-api">
      <div class="api-section">
        <h3>Bağlantı Ayarları</h3>
        <div class="cfg-row">
          <div>
            <label class="lbl" for="cfgUrl">API Base URL</label>
            <input id="cfgUrl" type="text" class="full" placeholder="http://localhost:3000"/>
          </div>
          <div>
            <label class="lbl" for="cfgKey">API Key</label>
            <input id="cfgKey" type="password" class="full" placeholder="x-api-key değeri"/>
          </div>
          <button class="btn" style="height:45px;margin-top:auto;border-right:2px solid var(--ink)" onclick="testConn()">TEST</button>
        </div>
        <div class="cfg-status" id="connStatus">Henüz test edilmedi</div>
      </div>

      <hr class="div">

      <div class="api-section">
        <h3><span class="badge post">POST</span>/api/verify</h3>
        <div class="api-block">curl -X POST {BASE_URL}/api/verify \\
  -H "x-api-key: {API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "tc":        "12345678901",
    "ad":        "AHMET",
    "soyad":     "YILMAZ",
    "dogumYili": 1985
  }'</div>
        <div class="api-block">{
  "success":       true,
  "verified":      true,
  "checksumValid": true,
  "durationMs":    312,
  "requestId":     "550e8400-e29b-41d4-a716-446655440000"
}</div>
      </div>

      <div class="api-section">
        <h3><span class="badge post">POST</span>/api/verify/batch</h3>
        <div class="api-block">curl -X POST {BASE_URL}/api/verify/batch \\
  -H "x-api-key: {API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "records": [
      {"tc":"12345678901","ad":"AHMET","soyad":"YILMAZ","dogumYili":1985},
      {"tc":"98765432100","ad":"FATMA","soyad":"KAYA","dogumYili":1990}
    ]
  }'</div>
      </div>

      <div class="api-section">
        <h3><span class="badge get">GET</span>/health</h3>
        <div class="api-block">curl {BASE_URL}/health

# Response:
{"status":"ok","ts":"2026-04-22T10:00:00.000Z"}</div>
      </div>

      <hr class="div">
      <div class="sec">İstek Günlüğü</div>
      <div class="log-area" id="logArea"><div style="color:#555">Henüz istek yok...</div></div>
    </div>

    <div class="footer">
      <span class="fn">⚠️ NVI KPS — kurumsal IP whitelist + sözleşme gereklidir. Checksum lokal, KPS sorgusu NVI sunucusuna gider.</span>
      <span class="fn">v1.0</span>
    </div>
  </div>
</div>

<script>
// ── State ─────────────────────────────────────────────────────────────────────
let CFG = {
  url: localStorage.getItem('kps_url') || '',
  key: localStorage.getItem('kps_key') || ''
};

// Populate config inputs on API tab
document.getElementById('cfgUrl').value = CFG.url;
document.getElementById('cfgKey').value = CFG.key;
['cfgUrl','cfgKey'].forEach(id => {
  document.getElementById(id).addEventListener('change', () => {
    CFG.url = document.getElementById('cfgUrl').value.trim().replace(/\\/$/,'');
    CFG.key = document.getElementById('cfgKey').value.trim();
    localStorage.setItem('kps_url', CFG.url);
    localStorage.setItem('kps_key', CFG.key);
  });
});

// ── Tab ───────────────────────────────────────────────────────────────────────
function tab(id) {
  document.querySelectorAll('.tab').forEach((t,i) =>
    t.classList.toggle('active', ['tc','nameid','batch','api'][i] === id));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('p-'+id).classList.add('active');
}

// ── Digit cells (Tab 1) ───────────────────────────────────────────────────────
const dg1 = document.getElementById('dg1');
for(let i=0;i<11;i++){
  const c=document.createElement('div'); c.className='dc'; c.id='dc'+i;
  const l=document.createElement('span'); l.className='dc-lbl'; l.textContent=i+1;
  const v=document.createElement('span'); v.id='dv'+i;
  c.append(l,v); dg1.appendChild(c);
}

const tc1 = document.getElementById('tc1');
tc1.addEventListener('input', () => {
  const raw = tc1.value.replace(/\\D/g,'').slice(0,11);
  tc1.value = raw;
  document.getElementById('cc1').textContent = raw.length;
  paintDigits(raw, false);
  if(raw.length < 11){ hide('r1'); hide('al1'); }
});
tc1.addEventListener('keydown', e => { if(e.key==='Enter') verifyTc(); });
document.getElementById('tc2').addEventListener('input', e => {
  e.target.value = e.target.value.replace(/\\D/g,'').slice(0,11);
});

function paintDigits(tc, validated) {
  for(let i=0;i<11;i++){
    const c=document.getElementById('dc'+i), v=document.getElementById('dv'+i);
    if(i<tc.length){
      v.textContent=tc[i];
      c.className = 'dc ' + (!validated ? 'filled' : i<9 ? (i%2===0?'odd':'even') : 'chk');
    } else { v.textContent=''; c.className='dc'; }
  }
}

// ── TCKN local math ───────────────────────────────────────────────────────────
function checkTCKN(tc) {
  if(!/^\\d{11}$/.test(tc)) return {ok:false,steps:[]};
  const d = tc.split('').map(Number);
  const steps = [];
  let ok = true;

  const r1 = d[0]!==0;
  steps.push({label:'İlk hane sıfır olamaz', calc:\`d₁=\${d[0]}\`, pass:r1,
    note:r1?'✓ Geçerli':'✗ İlk hane 0 olamaz'});
  if(!r1) ok=false;

  const os=d[0]+d[2]+d[4]+d[6]+d[8], es=d[1]+d[3]+d[5]+d[7];
  const d10e=((os*7)-es)%10, r2=d10e===d[9];
  steps.push({label:'10. hane',calc:\`(\${os}×7−\${es}) mod10 = \${d10e}\`,pass:r2,
    note:r2?\`✓ Beklenen:\${d10e}\`:\`✗ Beklenen:\${d10e}, Bulunan:\${d[9]}\`});
  if(!r2) ok=false;

  const s10=d.slice(0,10).reduce((a,b)=>a+b,0), d11e=s10%10, r3=d11e===d[10];
  steps.push({label:'11. hane',calc:\`(d₁+…+d₁₀) mod10 = \${s10} mod10 = \${d11e}\`,pass:r3,
    note:r3?\`✓ Beklenen:\${d11e}\`:\`✗ Beklenen:\${d11e}, Bulunan:\${d[10]}\`});
  if(!r3) ok=false;

  return {ok, steps, digits:d, os, es, s10};
}

// ── Tab 1: TC only ────────────────────────────────────────────────────────────
function verifyTc() {
  const tc = tc1.value.trim();
  if(tc.length!==11){
    shake(tc1);
    showResult('r1','fail','⚠️','EKSİK GİRİŞ',\`\${tc.length} hane girildi, 11 hane gerekli.\`);
    hide('al1'); return;
  }
  const res = checkTCKN(tc);
  paintDigits(tc, true);
  showResult('r1', res.ok?'ok':'fail', res.ok?'✅':'❌',
    res.ok ? 'GEÇERLİ TC KİMLİK NUMARASI' : 'GEÇERSİZ TC KİMLİK NUMARASI',
    res.ok ? \`Numara: <strong>\${tc}</strong><br>Checksum algoritması başarılı.\`
           : res.steps.filter(s=>!s.pass).map(s=>\`• \${s.note.replace('✗ ','')}\`).join('<br>')
  );
  renderAlgo('al1','as1',res.steps);
}

// ── Tab 2: Name + TC — KPS call ───────────────────────────────────────────────
async function verifyNameId() {
  const ad=document.getElementById('nad').value.trim();
  const soyad=document.getElementById('nsoyad').value.trim();
  const yr=document.getElementById('nyr').value.trim();
  const tc=document.getElementById('tc2').value.trim();

  if(!ad||!soyad){ shake(document.getElementById('nad')); return; }
  if(!yr)         { shake(document.getElementById('nyr'));  return; }
  if(tc.length!==11){ shake(document.getElementById('tc2')); return; }

  hide('kc2');
  document.getElementById('sp2').className='spin show';

  try {
    const res = await apiCall('/api/verify', { tc, ad, soyad, dogumYili:parseInt(yr) });
    document.getElementById('sp2').className='spin';

    if(!res.success){ showKpsError('kc2','kh2','ki2','kt2','ks2','kg2', res.message || res.error); return; }

    const v = res.verified;
    const cs = res.checksumValid;
    showKpsResult('kc2','kh2','ki2','kt2','ks2','kg2', {
      icon:   v ? '✅' : cs ? '❌' : '⚠️',
      cls:    v ? 'ok' : 'fail',
      title:  v ? 'KİMLİK DOĞRULANDI' : cs ? 'KİMLİK DOĞRULANAMADI' : 'CHECKSUM HATASI',
      sub:    \`TC: \${tc.slice(0,3)}·····\${tc.slice(-2)} · \${ad.toUpperCase()} \${soyad.toUpperCase()} · \${yr}\`,
      stats:  [
        {k:'NVI Sonucu',   v: v ? '✓ DOĞRULANDI' : '✗ EŞLEŞMEDİ'},
        {k:'Checksum',     v: cs ? '✓ Geçerli'   : '✗ Hatalı'},
        {k:'Süre',         v: res.durationMs ? res.durationMs+'ms' : '—'},
        {k:'Request ID',   v: (res.requestId||'').slice(0,8)+'…'},
      ]
    });
    addLog(v?'v':'f', \`[VERIFY] \${tc.slice(0,3)}****\${tc.slice(-2)} → \${v?'DOĞRULANDI':'DOĞRULANAMADI'}\${res.durationMs?' ('+res.durationMs+'ms)':''}\`);
  } catch(err) {
    document.getElementById('sp2').className='spin';
    showKpsError('kc2','kh2','ki2','kt2','ks2','kg2', err.message);
    addLog('f','[VERIFY] HATA: '+err.message);
  }
}

// ── Tab 3: Batch ──────────────────────────────────────────────────────────────
async function runBatch() {
  let records;
  try { records = JSON.parse(document.getElementById('batchInput').value); }
  catch(e){ shake(document.getElementById('batchInput')); alert('Geçersiz JSON: '+e.message); return; }

  if(!Array.isArray(records)||records.length===0||records.length>20){
    alert('1-20 arası kayıt giriniz.'); return;
  }

  document.getElementById('spB').className='spin show';
  document.getElementById('batchResults').innerHTML='';

  try {
    const res = await apiCall('/api/verify/batch', { records });
    document.getElementById('spB').className='spin';

    if(!res.success){ addLog('f','[BATCH] HATA: '+(res.message||res.error)); return; }

    const container = document.getElementById('batchResults');
    res.results.forEach((r,i) => {
      const orig = records[i];
      const ok   = r.verified;
      const div  = document.createElement('div');
      div.className = 'br '+(ok?'ok':'fail');
      div.innerHTML = \`
        <span class="bi">\${r.error?'⚠️':ok?'✅':'❌'}</span>
        <div class="bt">
          <div>\${r.error?'HATA':ok?'DOĞRULANDI':'DOĞRULANAMADI'} — \${(orig.ad||'')} \${(orig.soyad||'')}</div>
          <div class="bd">TC: \${r.tc} · \${orig.dogumYili} · Checksum: \${r.checksumValid?'✓':'✗'}\${r.error?' · '+r.error:''}</div>
        </div>
        \${r.durationMs?\`<span class="bms">\${r.durationMs}ms</span>\`:''}
      \`;
      container.appendChild(div);
    });
    const vCount = res.results.filter(r=>r.verified).length;
    addLog('i', \`[BATCH] \${records.length} kayıt → \${vCount} doğrulama başarılı\`);
  } catch(err) {
    document.getElementById('spB').className='spin';
    addLog('f','[BATCH] HATA: '+err.message);
  }
}

// ── Health test ───────────────────────────────────────────────────────────────
async function testConn() {
  CFG.url = document.getElementById('cfgUrl').value.trim().replace(/\\/$/,'');
  CFG.key = document.getElementById('cfgKey').value.trim();
  localStorage.setItem('kps_url', CFG.url);
  localStorage.setItem('kps_key', CFG.key);

  const el = document.getElementById('connStatus');
  el.className='cfg-status'; el.textContent='Test ediliyor...';
  try {
    const res = await fetch(CFG.url+'/health');
    const data = await res.json();
    el.className='cfg-status ok'; el.textContent=\`✓ Bağlantı başarılı · \${data.ts}\`;
    addLog('v','[HEALTH] '+CFG.url+' → OK');
  } catch(err) {
    el.className='cfg-status fail'; el.textContent='✗ Bağlantı başarısız: '+err.message;
    addLog('f','[HEALTH] HATA: '+err.message);
  }
}

// ── API call helper ───────────────────────────────────────────────────────────
async function apiCall(path, body) {
  const url = (CFG.url || '') + path;
  const key = CFG.key;
  if(!key) throw new Error('API key girilmedi. "API DOCS" sekmesinden ayarlayın.');
  const res = await fetch(url, {
    method:'POST',
    headers:{'Content-Type':'application/json','x-api-key':key},
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if(!res.ok && !data.success) throw new Error(data.message || \`HTTP \${res.status}\`);
  return data;
}

// ── KPS result renderers ──────────────────────────────────────────────────────
function showKpsResult(cardId,headId,iconId,titleId,subId,gridId, {icon,cls,title,sub,stats}) {
  const card=document.getElementById(cardId);
  const head=document.getElementById(headId);
  card.className='kps-card show fi';
  const bgMap={ok:'var(--sbg)',fail:'var(--ebg)',warn:'var(--wbg)'};
  const brMap={ok:'var(--success)',fail:'var(--red)',warn:'var(--warn)'};
  const tcMap={ok:'var(--success)',fail:'var(--red)',warn:'var(--warn)'};
  head.style.background=bgMap[cls]||'white';
  head.style.borderColor=brMap[cls]||'var(--border)';
  document.getElementById(iconId).textContent=icon;
  document.getElementById(titleId).textContent=title;
  document.getElementById(titleId).style.color=tcMap[cls]||'var(--ink)';
  document.getElementById(subId).textContent=sub;
  document.getElementById(gridId).innerHTML=
    stats.map(s=>\`<div class="stat"><div class="sk">\${s.k}</div><div class="sv">\${s.v}</div></div>\`).join('');
}

function showKpsError(cardId,headId,iconId,titleId,subId,gridId, msg) {
  showKpsResult(cardId,headId,iconId,titleId,subId,gridId, {
    icon:'⚠️', cls:'warn', title:'SERVİS HATASI',
    sub: msg, stats:[{k:'Durum',v:'NVI erişilemiyor'},{k:'Öneri',v:'IP whitelist?'}]
  });
}

// ── Algo renderer ─────────────────────────────────────────────────────────────
function renderAlgo(algoId, stepsId, steps) {
  const el=document.getElementById(stepsId); el.innerHTML='';
  steps.forEach((s,i)=>{
    const d=document.createElement('div'); d.className='step';
    d.innerHTML=\`<div class="snum">\${i+1}</div><div>
      <div style="color:#1a1a1a;font-weight:500;font-size:11px;margin-bottom:2px">\${s.label}</div>
      <div style="color:#888;font-size:10px">\${s.calc}</div>
      <div class="\${s.pass?'sok':'sfail'}" style="font-size:10px;margin-top:1px">\${s.note}</div>
    </div>\`;
    el.appendChild(d);
  });
  document.getElementById(algoId).className='algo show fi';
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function showResult(id, cls, icon, title, detail) {
  const el=document.getElementById(id);
  el.className=\`result \${cls} show fi\`;
  document.getElementById(id.replace('r','ri')).textContent=icon;
  document.getElementById(id.replace('r','rt')).textContent=title;
  document.getElementById(id.replace('r','rd')).innerHTML=detail;
}
function hide(id){ document.getElementById(id).className=document.getElementById(id).className.replace(/ show.*/,''); }
function shake(el){ el.classList.add('shake'); setTimeout(()=>el.classList.remove('shake'),400); }

function addLog(type, msg) {
  const la=document.getElementById('logArea');
  const first=la.querySelector('[style]'); if(first) first.remove();
  const d=document.createElement('div'); d.className=\`log-line \${type}\`;
  d.textContent=\`[\${new Date().toLocaleTimeString('tr-TR')}] \${msg}\`;
  la.insertBefore(d, la.firstChild);
}
</script>
</body>
</html>
`;
