// <usagii-demo></usagii-demo>
// ブラウザ内だけで動く usagii の体験デモ。現行ページのロジックを忠実に移植。
// shadow DOM で隔離。保存・送信は一切なし。
(() => {
  if (customElements.get('usagii-demo')) return;

  const CSS = `
  :host{display:block}
  .dm{
    --lbg:#f1efec;--cbg:#fff;--bg2:#e9e7e3;--tx:#1d1c1a;--tx2:#6c6a66;--tx3:#9d9b96;--bd:rgba(0,0,0,.18);
    --ibg:#E6F1FB;--itx:#185FA5;--sun:#A32D2D;--sat:#185FA5;--sh:0 1px 3px rgba(0,0,0,.08);
    --bw-bg:#B5D4F4;--bw-fg:#0C447C;--bp-bg:#9FE1CB;--bp-fg:#085041;
    --bi-bg:#F7C1C1;--bi-fg:#791F1F;--bh-bg:#FAC775;--bh-fg:#633806;
    width:min(348px,100%);margin:0 auto;background:var(--lbg);color:var(--tx);
    font-family:var(--body,'Hiragino Sans','Yu Gothic UI','Segoe UI',sans-serif);
    border:1px solid var(--bd);border-radius:14px;overflow:hidden;position:relative;
    font-size:13px;text-align:left;box-shadow:0 24px 60px rgba(33,29,26,.18);
  }
  .dm.dark{--lbg:#1d1c1a;--cbg:#2c2b29;--bg2:#3a3937;--tx:#e9e7e3;--tx2:#a9a7a2;--tx3:#7b7975;--bd:rgba(255,255,255,.2);
    --ibg:#0C447C;--itx:#B5D4F4;--sun:#F09595;--sat:#85B7EB;--sh:0 1px 3px rgba(0,0,0,.35);
    --bw-bg:#0C447C;--bw-fg:#B5D4F4;--bp-bg:#085041;--bp-fg:#9FE1CB;
    --bi-bg:#791F1F;--bi-fg:#F7C1C1;--bh-bg:#633806;--bh-fg:#FAC775}
  @media (prefers-color-scheme:dark){
    .dm.auto{--lbg:#1d1c1a;--cbg:#2c2b29;--bg2:#3a3937;--tx:#e9e7e3;--tx2:#a9a7a2;--tx3:#7b7975;--bd:rgba(255,255,255,.2);
      --ibg:#0C447C;--itx:#B5D4F4;--sun:#F09595;--sat:#85B7EB;--sh:0 1px 3px rgba(0,0,0,.35);
      --bw-bg:#0C447C;--bw-fg:#B5D4F4;--bp-bg:#085041;--bp-fg:#9FE1CB;
      --bi-bg:#791F1F;--bi-fg:#F7C1C1;--bh-bg:#633806;--bh-fg:#FAC775}
  }
  .dm button{font-family:inherit}
  .dm .bar2{display:flex;align-items:center;gap:6px;height:36px;padding:0 12px;border-bottom:1px solid var(--bd)}
  .dm .bar2 b{font-family:var(--disp,'Zen Maru Gothic',sans-serif);font-weight:700;font-size:12.5px;flex:1}
  .dm .dot{width:9px;height:9px;border-radius:50%;background:var(--tx3);opacity:.5}
  .dm-quick{display:flex;flex-direction:column;gap:5px;margin:8px 10px 4px;padding:7px 9px;background:var(--cbg);border-radius:10px;box-shadow:var(--sh)}
  .dm-qrow{display:flex;gap:6px;align-items:center}
  .dm-quick input[type="text"]{flex:1;min-width:0;border:1px solid var(--bd);border-radius:8px;height:28px;padding:0 10px;font-size:12px;background:var(--cbg);color:var(--tx);font-family:inherit}
  .dm-quick input[type="text"]::placeholder{color:var(--tx3)}
  .dm-more{display:none}
  .dm-quick.open .dm-more{display:flex;gap:6px;align-items:center;flex-wrap:wrap;animation:dm-in .18s ease}
  .dm-quick input[type="date"]{border:1px solid var(--bd);border-radius:8px;height:26px;padding:0 8px;font-size:11.5px;background:var(--cbg);color:var(--tx);font-family:inherit;color-scheme:light}
  .dm.dark .dm-quick input[type="date"]{color-scheme:dark}
  @media (prefers-color-scheme:dark){.dm.auto .dm-quick input[type="date"]{color-scheme:dark}}
  .dm-add{border:1px solid var(--itx);background:var(--ibg);color:var(--itx);border-radius:8px;padding:4px 11px;font-size:11.5px;cursor:pointer;white-space:nowrap}
  .dm-add:disabled{opacity:.45;cursor:default}
  .dm-qtoday{border:1px solid var(--bd);background:transparent;color:var(--tx2);border-radius:8px;padding:4px 10px;font-size:11.5px;cursor:pointer;white-space:nowrap}
  .dm-ph{display:flex;align-items:center;gap:5px;padding:3px 10px 1px;font-size:10.5px;color:var(--tx3)}
  .dm-ph .tgl{border:none;background:none;color:var(--tx3);cursor:pointer;font-size:10px;padding:1px 4px}
  .dm-ph .nav{margin-left:auto;display:flex;gap:4px;align-items:center}
  .dm-nbtn{border:1px solid var(--bd);background:transparent;color:var(--tx2);border-radius:7px;padding:1px 9px;font-size:10.5px;cursor:pointer}
  .dm-pins{padding-top:2px}
  .dm-pinrow{display:flex;align-items:center;gap:7px;margin:2px 10px 5px;padding:4px 5px 4px 10px;background:var(--cbg);border-radius:9px;box-shadow:var(--sh);cursor:pointer}
  .dm-pic{color:#BA7517;display:flex;align-items:center}
  .dm-pd{color:var(--tx2);font-size:11px;white-space:nowrap;font-variant-numeric:tabular-nums}
  .dm-pt{flex:1;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .dm-cnt{font-size:10px;padding:1px 8px;border-radius:999px;background:var(--lbg);color:var(--tx2);white-space:nowrap}
  .dm-cnt.tdy{background:var(--ibg);color:var(--itx)}
  .dm-cnt.over{background:#FCEBEB;color:#A32D2D}
  .dm.dark .dm-cnt.over{background:#501313;color:#F09595}
  @media (prefers-color-scheme:dark){.dm.auto .dm-cnt.over{background:#501313;color:#F09595}}
  .dm-unpin{border:none;background:none;color:var(--tx3);font-size:11px;cursor:pointer;padding:2px 5px}
  .dm-sect{border-bottom:1px solid var(--bd);box-shadow:0 2px 6px rgba(0,0,0,.05);padding-bottom:7px;position:relative;z-index:4;background:var(--lbg)}
  .dm-srch{padding:2px 10px 6px}
  .dm-srch input{width:100%;border:1px solid var(--bd);border-radius:8px;height:26px;padding:0 10px;font-size:11.5px;background:var(--cbg);color:var(--tx);font-family:inherit}
  .dm-srch input::placeholder{color:var(--tx3)}
  .dm-chips{display:flex;gap:5px;padding:0 10px;flex-wrap:wrap}
  .dm-chip{font-size:10.5px;padding:2px 9px;border-radius:999px;border:1px solid var(--bd);background:transparent;color:var(--tx2);cursor:pointer}
  .dm-chip.on{background:var(--bg2);color:var(--tx)}
  .dm-chip.c-w.col{background:var(--bw-bg);color:var(--bw-fg);border-color:var(--bw-fg)}
  .dm-chip.c-p.col{background:var(--bp-bg);color:var(--bp-fg);border-color:var(--bp-fg)}
  .dm-chip.c-i.col{background:var(--bi-bg);color:var(--bi-fg);border-color:var(--bi-fg)}
  .dm-chip.c-h.col{background:var(--bh-bg);color:var(--bh-fg);border-color:var(--bh-fg)}
  .dm-listwrap{position:relative}
  .dm-seg{position:absolute;top:6px;right:10px;z-index:3;display:flex;gap:2px;background:var(--bg2);border-radius:8px;padding:2px}
  .dm-seg button{border:none;background:transparent;font-size:10.5px;padding:2px 9px;border-radius:6px;color:var(--tx2);cursor:pointer;font-weight:600}
  .dm-seg button.on{background:var(--cbg);color:var(--tx);box-shadow:var(--sh)}
  .dm-list{position:relative;height:430px;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--bd) transparent}
  .dm-list::-webkit-scrollbar{width:7px}
  .dm-list::-webkit-scrollbar-thumb{background:var(--bd);border-radius:4px}
  .dm-list::-webkit-scrollbar-track{background:transparent}
  .dm-dh{position:sticky;top:0;z-index:2;background:var(--lbg);padding:9px 100px 5px 12px;font-size:11.5px;font-weight:600;display:flex;gap:8px;align-items:center}
  .dm-dh.sun{color:var(--sun)}
  .dm-dh.sat{color:var(--sat)}
  .dm-today{font-size:10px;background:var(--ibg);color:var(--itx);padding:1px 8px;border-radius:999px}
  .dm-row{display:flex;gap:8px;margin:0 10px 7px;padding:8px 5px 8px 11px;background:var(--cbg);border-radius:10px;box-shadow:var(--sh);align-items:center;scroll-margin-top:34px}
  .dm-row.ck{opacity:.55}
  .dm-row.ck .dm-tt{text-decoration:line-through}
  .dm-row[draggable]{cursor:grab}
  .dm-row.dragging{opacity:.4;cursor:grabbing}
  .dm-day.drop-on{background:var(--ibg);border-radius:8px}
  .dm-main{flex:1;min-width:0}
  .dm-tm{color:var(--tx2);font-size:11px;white-space:nowrap;font-variant-numeric:tabular-nums;margin-right:6px}
  .dm-tt{font-size:13px}
  .dm-bdg{display:inline-block;font-size:10px;padding:1px 8px;border-radius:999px;margin-left:5px;vertical-align:1px;border:none;cursor:pointer}
  .dm-bdg.c-w{background:var(--bw-bg);color:var(--bw-fg)}
  .dm-bdg.c-p{background:var(--bp-bg);color:var(--bp-fg)}
  .dm-bdg.c-i{background:var(--bi-bg);color:var(--bi-fg)}
  .dm-bdg.c-h{background:var(--bh-bg);color:var(--bh-fg)}
  .dm-row input[type="checkbox"]{appearance:none;-webkit-appearance:none;width:15px;height:15px;margin:0;padding:0;flex:none;border:1.5px solid var(--tx3);border-radius:50%;background:transparent;cursor:pointer;position:relative;transition:background-color .15s,border-color .15s}
  .dm-row input[type="checkbox"]:hover{border-color:var(--itx)}
  .dm-row input[type="checkbox"]:checked{background:var(--itx);border-color:var(--itx)}
  .dm-row input[type="checkbox"]:checked::after{content:"";position:absolute;left:3.5px;top:1px;width:4px;height:8px;border:solid var(--cbg);border-width:0 2px 2px 0;transform:rotate(45deg)}
  .dm-pinb{border:none;background:none;color:var(--tx3);cursor:pointer;padding:2px 5px;display:flex;align-items:center}
  .dm-pinb.on{color:#BA7517}
  .dm-emp{margin:0 10px 7px;padding:9px 12px;font-size:11.5px;color:var(--tx3);border:1px dashed var(--bd);border-radius:10px}
  .dm-row.new{animation:dm-in .3s cubic-bezier(.2,1,.35,1),dm-glow 1.2s ease-out}
  .dm-row.flash{animation:dm-glow 1.2s ease-out}
  @keyframes dm-in{from{opacity:0;transform:translateY(8px)}}
  @keyframes dm-glow{0%,25%{background-color:var(--ibg)}100%{background-color:var(--cbg)}}
  .dm-toast{position:absolute;bottom:10px;left:50%;transform:translate(-50%,6px);background:var(--tx);color:var(--lbg);font-size:11.5px;padding:5px 14px;border-radius:999px;opacity:0;pointer-events:none;transition:opacity .25s,transform .25s;white-space:nowrap;z-index:5}
  .dm-toast.show{opacity:1;transform:translate(-50%,0)}
  .dm-vseg{display:flex;gap:2px;background:var(--bg2);border-radius:7px;padding:2px;margin-right:2px}
  .dm-vseg button{border:none;background:transparent;font-size:10px;padding:1px 7px;border-radius:5px;color:var(--tx2);cursor:pointer;font-weight:600}
  .dm-vseg button.on{background:var(--cbg);color:var(--tx);box-shadow:var(--sh)}
  .dm-dh.now{background:var(--ibg)}
  .dm-dh.now>span:first-child{color:var(--itx)}
  .dm-dh.now .dm-today{background:var(--itx);color:var(--ibg)}
  .dm-dh.jflash{animation:dm-hglow 1.2s ease-out}
  @keyframes dm-hglow{0%,25%{background-color:var(--ibg)}100%{background-color:var(--lbg)}}
  .dm-dh+.dm-row,.dm-dh+.dm-emp{margin-top:5px}
  .dm-row.outr{animation:dm-out-r .26s ease forwards;pointer-events:none}
  .dm-row.outl{animation:dm-out-l .26s ease forwards;pointer-events:none}
  @keyframes dm-out-r{to{opacity:0;transform:translateX(48px)}}
  @keyframes dm-out-l{to{opacity:0;transform:translateX(-48px)}}
  .dm-vhead{padding:9px 100px 5px 12px;font-size:11.5px;font-weight:600;white-space:nowrap}
  .dm-wkg{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;padding:0 8px 8px}
  .dm-wkc{display:flex;flex-direction:column;gap:3px;min-width:0}
  .dm-wkh{border:none;background:var(--cbg);box-shadow:var(--sh);border-radius:7px;padding:3px 0 2px;display:flex;flex-direction:column;align-items:center;cursor:pointer;font-family:inherit;color:var(--tx)}
  .dm-wkh .d{font-size:11.5px;font-weight:600;line-height:1.1}
  .dm-wkh .w{font-size:8.5px;color:var(--tx3)}
  .dm-wkh.sun .d,.dm-wkh.sun .w{color:var(--sun)}
  .dm-wkh.sat .d,.dm-wkh.sat .w{color:var(--sat)}
  .dm-wkh.now{background:var(--ibg)}
  .dm-wkh.now .d,.dm-wkh.now .w{color:var(--itx)}
  .dm-wkchip{border:none;border-radius:5px;background:var(--cbg);box-shadow:var(--sh);color:var(--tx);font-size:8.5px;line-height:1.35;padding:2px 3px;text-align:left;cursor:pointer;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-family:inherit;min-width:0}
  .dm-wkchip.ck{opacity:.55;text-decoration:line-through}
  .dm-mowd{display:grid;grid-template-columns:repeat(7,1fr);padding:0 8px 2px;font-size:9px;color:var(--tx3);text-align:center}
  .dm-mowd .sun{color:var(--sun)}
  .dm-mowd .sat{color:var(--sat)}
  .dm-mog{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;padding:0 8px 8px}
  .dm-moc{border:none;background:var(--cbg);box-shadow:var(--sh);border-radius:7px;padding:2px;display:flex;flex-direction:column;gap:1px;cursor:pointer;font-family:inherit;color:var(--tx);min-width:0;min-height:46px;overflow:hidden;text-align:left}
  .dm-moc.out{opacity:.4}
  .dm-moc.today{background:var(--ibg)}
  .dm-mon{font-size:9px;font-weight:600;text-align:center;line-height:1.2}
  .dm-mon.sun{color:var(--sun)}
  .dm-mon.sat{color:var(--sat)}
  .dm-mon.now{color:var(--itx)}
  .dm-mochip{font-size:7.5px;line-height:1.3;border-radius:3px;padding:0 2px;background:var(--lbg);color:var(--tx2);overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
  .dm-mochip.ck,.dm-moc .ck{opacity:.55;text-decoration:line-through}
  .dm-momore{font-size:7.5px;color:var(--tx3);text-align:center}
  .dm-wkchip.c-w,.dm-mochip.c-w{background:var(--bw-bg);color:var(--bw-fg)}
  .dm-wkchip.c-p,.dm-mochip.c-p{background:var(--bp-bg);color:var(--bp-fg)}
  .dm-wkchip.c-i,.dm-mochip.c-i{background:var(--bi-bg);color:var(--bi-fg)}
  .dm-wkchip.c-h,.dm-mochip.c-h{background:var(--bh-bg);color:var(--bh-fg)}
  @media (hover:none) and (pointer:coarse){
    .dm-quick input[type="text"],.dm-quick input[type="date"],.dm-srch input{font-size:16px}
  }
  @media (prefers-reduced-motion: reduce){ .dm *{animation:none!important} }
  `;

  const HTML = `
  <div class="dm">
    <div class="bar2"><b>usagii</b><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
    <div class="dm-quick" id="dmQuick">
      <div class="dm-qrow">
        <input type="text" id="dmTitle" placeholder="クイック登録(タイトルを入力)" aria-label="タイトル">
        <button class="dm-add" id="dmAdd" disabled>登録</button>
      </div>
      <div class="dm-more">
        <input type="date" id="dmDate" aria-label="日付">
        <button class="dm-qtoday" id="dmQToday" type="button" style="display:none">今日</button>
        <span class="dm-chips" id="dmQCats" style="padding:0"></span>
      </div>
    </div>
    <div class="dm-pins" id="dmPins"></div>
    <div class="dm-sect">
      <div class="dm-ph">
        <button class="tgl" id="dmSectTgl" aria-label="検索表示の折りたたみ">∧</button><span id="dmSectLbl">検索</span>
        <span class="nav">
          <span class="dm-vseg" role="group" aria-label="表示の切替">
            <button data-vw="day" class="on" aria-pressed="true">日</button>
            <button data-vw="week" aria-pressed="false">週</button>
            <button data-vw="month" aria-pressed="false">月</button>
          </span>
          <button class="dm-nbtn" id="dmPrev" aria-label="前へ">‹</button>
          <button class="dm-nbtn" id="dmToday">今日</button>
          <button class="dm-nbtn" id="dmNext" aria-label="次へ">›</button>
        </span>
      </div>
      <div id="dmSectBody">
        <div class="dm-srch"><input type="text" id="dmQuery" placeholder="タイトルで検索" aria-label="タイトルで検索"></div>
        <div class="dm-chips" id="dmChips"></div>
      </div>
    </div>
    <div class="dm-listwrap">
      <div class="dm-seg" role="group" aria-label="予定の表示切替">
        <button class="on" data-tab="active" aria-pressed="true">予定</button>
        <button data-tab="done" aria-pressed="false">完了</button>
      </div>
      <div class="dm-list" id="dmList"></div>
    </div>
    <div class="dm-toast" id="dmToast" role="status"></div>
  </div>`;

  class UsagiiDemo extends HTMLElement {
    connectedCallback(){
      if (this._mounted) return;
      this._mounted = true;
      const root = this.attachShadow({mode:'open'});
      const style = document.createElement('style'); style.textContent = CSS;
      const wrap = document.createElement('div'); wrap.innerHTML = HTML;
      root.appendChild(style); root.appendChild(wrap.firstElementChild);
      this._init(root);
      this._applyTheme();
    }
    static get observedAttributes(){ return ['theme']; }
    attributeChangedCallback(){ this._applyTheme(); }
    _applyTheme(){ const dm=this._dmEl; if(!dm) return; const t=this.getAttribute('theme')||'auto'; dm.classList.toggle('dark', t==='dark'); dm.classList.toggle('auto', t!=='dark' && t!=='light'); }

    _init(root){
      const dm = root.querySelector('.dm');
      this._dmEl = dm;
      const $ = id => root.getElementById(id);
      const WD=['日','月','火','水','木','金','土'];
      const CATS={w:'仕事',p:'私用',i:'重要',h:'家'};
      const t0=new Date(2026,5,10);
      const pad=n=>String(n).padStart(2,'0');
      const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
      const off=n=>{const d=new Date(t0);d.setDate(d.getDate()+n);return d;};
      const parse=k=>{const[a,b,c]=k.split('-').map(Number);return new Date(a,b-1,c);};
      const fmt=d=>(d.getMonth()+1)+'/'+d.getDate()+' ('+WD[d.getDay()]+')';
      const PIN='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4v6l-2 4v2h10v-2l-2-4V4"/><line x1="12" y1="16" x2="12" y2="21"/><line x1="8" y1="4" x2="16" y2="4"/></svg>';
      let seq=0;
      const mk=(title,o,time,cats,pinned)=>({id:++seq,title:title,date:iso(off(o)),time:time,cats:cats||[],pinned:!!pinned,done:false});
      const items=[
        mk('粗大ゴミ申込',0,null,['h']),
        mk('チーム定例',0,'13:00-14:00',['w']),
        mk('設計レビュー',1,'10:00-12:00',['w','i']),
        mk('TNKN MTG',1,'15:00-16:00',['i'],true),
        mk('夜間メンテ立会い',2,'23:00-01:00',['w','i']),
        mk('父の日の買い物',4,null,['p']),
        mk('車検',13,null,[],true),
        mk('Aプロジェクト納品',65,null,['w'],true),
      ];
      let tab='active',newId=0,sel=new Set(),qcats=new Set(),pinsCol=false,sectCol=false;
      let vw='day',va=new Date(t0);
      let dragItem=null;
      const list=$('dmList'),pinsEl=$('dmPins'),toastEl=$('dmToast'),quick=$('dmQuick'),
            ti=$('dmTitle'),di=$('dmDate'),addBtn=$('dmAdd'),qi=$('dmQuery');
      di.value=iso(t0);
      const qToday=$('dmQToday');
      const syncQToday=()=>{qToday.style.display=di.value!==iso(t0)?'':'none';};
      di.addEventListener('change',syncQToday);
      qToday.addEventListener('click',()=>{di.value=iso(t0);syncQToday();});
      let toastT;
      const toast=m=>{toastEl.textContent=m;toastEl.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>toastEl.classList.remove('show'),1600);};
      const daysTo=k=>Math.round((parse(k)-t0)/864e5);
      const flash=el=>{el.classList.add('flash');setTimeout(()=>el.classList.remove('flash'),1300);};
      const filtering=()=>qi.value.trim()!==''||sel.size>0;
      const scrollListTo=el=>{ if(el) list.scrollTo({top:Math.max(0,el.offsetTop-6),behavior:'smooth'}); };

      function syncTabs(){
        dm.querySelectorAll('.dm-seg button').forEach(b=>{
          const on=b.dataset.tab===tab;
          b.classList.toggle('on',on);
          b.setAttribute('aria-pressed',on?'true':'false');
        });
      }
      function applySect(){
        $('dmSectBody').style.display=sectCol?'none':'';
        $('dmSectTgl').textContent=sectCol?'∨':'∧';
        $('dmSectTgl').setAttribute('aria-expanded',sectCol?'false':'true');
        const f=sectCol&&filtering();
        $('dmSectLbl').textContent=f?'検索(絞り込み中)':'検索';
        $('dmSectLbl').style.color=f?'var(--itx)':'';
      }
      function renderChips(){
        const box=$('dmChips');
        box.innerHTML='';
        const all=document.createElement('button');
        all.className='dm-chip'+(sel.size===0?' on':'');
        all.textContent='すべて';
        all.setAttribute('aria-pressed',sel.size===0?'true':'false');
        all.addEventListener('click',()=>{sel.clear();renderAll();});
        box.appendChild(all);
        for(const k of Object.keys(CATS)){
          const b=document.createElement('button');
          b.className='dm-chip c-'+k+((sel.size===0||sel.has(k))?' col':'');
          b.textContent=CATS[k];
          b.setAttribute('aria-pressed',sel.has(k)?'true':'false');
          b.addEventListener('click',()=>{if(sel.has(k)){sel.delete(k);}else{sel.add(k);}renderAll();});
          box.appendChild(b);
        }
      }
      function renderQCats(){
        const box=$('dmQCats');
        box.innerHTML='';
        for(const k of Object.keys(CATS)){
          const b=document.createElement('button');
          b.className='dm-chip c-'+k+(qcats.has(k)?' col':'');
          b.textContent=CATS[k];
          b.setAttribute('aria-pressed',qcats.has(k)?'true':'false');
          b.addEventListener('click',()=>{if(qcats.has(k)){qcats.delete(k);}else{qcats.add(k);}renderQCats();});
          box.appendChild(b);
        }
      }
      function render(){
        const pn=items.filter(i=>i.pinned&&!i.done).sort((a,b)=>a.date<b.date?-1:1);
        pinsEl.innerHTML='';
        if(pn.length){
          const h=document.createElement('div');h.className='dm-ph';
          const tg=document.createElement('button');tg.className='tgl';
          tg.textContent=pinsCol?'∨':'∧';
          tg.setAttribute('aria-label','ピン留め表示の折りたたみ');
          tg.setAttribute('aria-expanded',pinsCol?'false':'true');
          tg.addEventListener('click',()=>{pinsCol=!pinsCol;render();});
          h.appendChild(tg);
          h.appendChild(document.createTextNode(pinsCol?'ピン留め ('+pn.length+'件)':'ピン留め'));
          pinsEl.appendChild(h);
          if(!pinsCol)for(const i of pn){
            const n=daysTo(i.date);
            const r=document.createElement('div');r.className='dm-pinrow';
            r.setAttribute('role','button');
            r.tabIndex=0;
            r.setAttribute('aria-label',i.title+'('+fmt(parse(i.date))+')へ移動');
            r.innerHTML='<span class="dm-pic">'+PIN+'</span><span class="dm-pd"></span><span class="dm-pt"></span>'
              +'<span class="dm-cnt '+(n<0?'over':n===0?'tdy':'')+'">'+(n>0?'あと'+n+'日':n===0?'今日':(-n)+'日超過')+'</span>'
              +'<button class="dm-unpin" title="ピン解除" aria-label="ピン解除">✕</button>';
            r.querySelector('.dm-pd').textContent=fmt(parse(i.date));
            r.querySelector('.dm-pt').textContent=i.title;
            const jump=()=>{
              if(tab!=='active'){tab='active';syncTabs();render();}
              const el=list.querySelector('[data-id="'+i.id+'"]');
              if(el){scrollListTo(el);flash(el);}
              else{toast('検索・フィルタ中のため一覧に非表示です');}
            };
            r.addEventListener('click',jump);
            r.addEventListener('keydown',e=>{
              if(e.key==='Enter'||e.key===' '){e.preventDefault();jump();}
            });
            r.querySelector('.dm-unpin').addEventListener('click',e=>{
              e.stopPropagation();i.pinned=false;toast('ピン留めを外しました');render();
            });
            pinsEl.appendChild(r);
          }
        }
        if(vw==='day'){renderDay();}
        else if(vw==='week'){renderWeek();}
        else{renderMonth();}
      }
      function visibleItems(){
        const q=qi.value.trim();
        return items.filter(i=>(tab==='done'?i.done:!i.done)
          &&(q===''||i.title.includes(q))
          &&(sel.size===0||i.cats.some(c=>sel.has(c))));
      }
      const byTime=(a,b)=>{
        if((a.time===null)!==(b.time===null))return a.time===null?-1:1;
        if(a.time!==b.time)return a.time<b.time?-1:1;
        return a.id-b.id;
      };
      function renderDay(){
        const vis=visibleItems();
        const map=new Map();
        for(const i of vis){if(!map.has(i.date))map.set(i.date,[]);map.get(i.date).push(i);}
        const tk=iso(t0);
        if(!map.has(tk))map.set(tk,[]);
        list.innerHTML='';
        for(const k of [...map.keys()].sort()){
          const d=parse(k);
          const day=document.createElement('div');
          day.className='dm-day';
          day.dataset.k=k;
          day.addEventListener('dragover',e=>{
            if(dragItem&&dragItem.date!==k){e.preventDefault();day.classList.add('drop-on');}
          });
          day.addEventListener('dragleave',()=>day.classList.remove('drop-on'));
          day.addEventListener('drop',e=>{
            e.preventDefault();day.classList.remove('drop-on');
            if(dragItem&&dragItem.date!==k){
              const m=dragItem;m.date=k;dragItem=null;newId=m.id;render();
              toast(fmt(parse(k))+' に移動しました');
            }
          });
          const dh=document.createElement('div');
          dh.className='dm-dh'+(k===tk?' now':d.getDay()===0?' sun':d.getDay()===6?' sat':'');
          const sp=document.createElement('span');sp.textContent=fmt(d);dh.appendChild(sp);
          if(k===tk){const b=document.createElement('span');b.className='dm-today';b.textContent='今日';dh.appendChild(b);}
          day.appendChild(dh);
          const arr=map.get(k).sort(byTime);
          if(!arr.length){
            const e=document.createElement('div');e.className='dm-emp';
            e.textContent=tab==='done'?'完了した予定はありません':'予定はありません';
            day.appendChild(e);
          }
          for(const i of arr){
            const r=document.createElement('div');
            r.className='dm-row'+(i.done?' ck':'')+(i.id===newId?' new':'');
            r.dataset.id=i.id;
            r.draggable=true;
            r.addEventListener('dragstart',e=>{
              dragItem=i;r.classList.add('dragging');e.dataTransfer.effectAllowed='move';
            });
            r.addEventListener('dragend',()=>{
              dragItem=null;r.classList.remove('dragging');
              list.querySelectorAll('.dm-day.drop-on').forEach(d=>d.classList.remove('drop-on'));
            });
            const cb=document.createElement('input');
            cb.type='checkbox';cb.checked=i.done;
            cb.setAttribute('aria-label',i.title+' を完了にする');
            const main=document.createElement('div');main.className='dm-main';
            const tm=document.createElement('span');tm.className='dm-tm';tm.textContent=i.time||'終日';
            const tt=document.createElement('span');tt.className='dm-tt';tt.textContent=i.title;
            main.appendChild(tm);main.appendChild(tt);
            for(const c of i.cats){
              const bg=document.createElement('button');
              bg.className='dm-bdg c-'+c;bg.textContent=CATS[c];
              bg.addEventListener('click',()=>{sel=new Set([c]);renderAll();});
              main.appendChild(bg);
            }
            const pb=document.createElement('button');
            pb.className='dm-pinb'+(i.pinned?' on':'');
            pb.title='ピン留め';
            pb.setAttribute('aria-label',i.title+' をピン留め');
            pb.setAttribute('aria-pressed',i.pinned?'true':'false');
            pb.innerHTML=PIN;
            cb.addEventListener('change',()=>{
              i.done=cb.checked;
              r.classList.add('ck',i.done?'outr':'outl');
              if(i.done){const up=i.pinned;i.pinned=false;toast(up?'完了へ移動し、ピン留めを外しました':'完了へ移動しました');}
              else{toast('予定へ戻しました');}
              setTimeout(render,260);
            });
            pb.addEventListener('click',()=>{
              i.pinned=!i.pinned;toast(i.pinned?'ピン留めしました':'ピン留めを外しました');render();
            });
            r.appendChild(cb);r.appendChild(main);
            if(!i.done)r.appendChild(pb);
            day.appendChild(r);
          }
          list.appendChild(day);
        }
        newId=0;
      }
      function renderWeek(){
        const vis=visibleItems();
        const start=new Date(va);start.setDate(start.getDate()-start.getDay());
        const endD=new Date(start);endD.setDate(endD.getDate()+6);
        list.innerHTML='';
        const vh=document.createElement('div');vh.className='dm-vhead';
        vh.textContent=fmt(start)+' 〜 '+fmt(endD);
        list.appendChild(vh);
        const g=document.createElement('div');g.className='dm-wkg';
        for(let n=0;n<7;n++){
          const d=new Date(start);d.setDate(d.getDate()+n);
          const k=iso(d);
          const col=document.createElement('div');col.className='dm-wkc';
          const h=document.createElement('button');
          h.className='dm-wkh'+(k===iso(t0)?' now':d.getDay()===0?' sun':d.getDay()===6?' sat':'');
          h.title='この日の日表示へ';
          const dn=document.createElement('span');dn.className='d';dn.textContent=d.getDate();
          const wn=document.createElement('span');wn.className='w';wn.textContent=WD[d.getDay()];
          h.appendChild(dn);h.appendChild(wn);
          h.addEventListener('click',()=>gotoDay(k));
          col.appendChild(h);
          vis.filter(x=>x.date===k).sort(byTime).forEach(x=>{
            const c=document.createElement('button');
            c.className='dm-wkchip'+(x.cats[0]?' c-'+x.cats[0]:'')+(x.done?' ck':'');
            c.textContent=x.title;c.title=x.title;
            c.addEventListener('click',()=>gotoDay(k));
            col.appendChild(c);
          });
          g.appendChild(col);
        }
        list.appendChild(g);
      }
      function renderMonth(){
        const vis=visibleItems();
        const first=new Date(va.getFullYear(),va.getMonth(),1);
        const start=new Date(first);start.setDate(start.getDate()-start.getDay());
        list.innerHTML='';
        const vh=document.createElement('div');vh.className='dm-vhead';
        vh.textContent=va.getFullYear()+'年'+(va.getMonth()+1)+'月';
        list.appendChild(vh);
        const wd=document.createElement('div');wd.className='dm-mowd';
        WD.forEach((w,n)=>{
          const s=document.createElement('span');s.textContent=w;
          if(n===0)s.className='sun';if(n===6)s.className='sat';
          wd.appendChild(s);
        });
        list.appendChild(wd);
        const g=document.createElement('div');g.className='dm-mog';
        for(let n=0;n<42;n++){
          const d=new Date(start);d.setDate(d.getDate()+n);
          const k=iso(d);
          const cell=document.createElement('button');
          cell.className='dm-moc'+(d.getMonth()!==va.getMonth()?' out':'')+(k===iso(t0)?' today':'');
          cell.title='この日の日表示へ';
          const num=document.createElement('span');
          num.className='dm-mon'+(k===iso(t0)?' now':d.getDay()===0?' sun':d.getDay()===6?' sat':'');
          num.textContent=d.getDate();
          cell.appendChild(num);
          const evs=vis.filter(x=>x.date===k).sort(byTime);
          evs.slice(0,2).forEach(x=>{
            const c=document.createElement('span');
            c.className='dm-mochip'+(x.cats[0]?' c-'+x.cats[0]:'')+(x.done?' ck':'');
            c.textContent=x.title;
            cell.appendChild(c);
          });
          if(evs.length>2){
            const m=document.createElement('span');m.className='dm-momore';
            m.textContent='+'+(evs.length-2);
            cell.appendChild(m);
          }
          cell.addEventListener('click',()=>gotoDay(k));
          g.appendChild(cell);
        }
        list.appendChild(g);
      }
      function syncVw(){
        dm.querySelectorAll('.dm-vseg button').forEach(b=>{
          const on=b.dataset.vw===vw;
          b.classList.toggle('on',on);
          b.setAttribute('aria-pressed',on?'true':'false');
        });
      }
      function gotoDay(k){
        vw='day';syncVw();render();
        const el=list.querySelector('[data-k="'+k+'"]');
        if(el){
          list.scrollTo({top:el.offsetTop,behavior:'smooth'});
          const dh=el.querySelector('.dm-dh');
          if(dh&&!dh.classList.contains('now')){
            dh.classList.add('jflash');
            setTimeout(()=>dh.classList.remove('jflash'),1300);
          }
        }
      }
      function renderAll(){renderChips();applySect();render();}

      dm.querySelectorAll('.dm-seg button').forEach(b=>b.addEventListener('click',()=>{tab=b.dataset.tab;syncTabs();render();}));
      $('dmSectTgl').addEventListener('click',()=>{sectCol=!sectCol;applySect();});
      qi.addEventListener('input',()=>render());
      dm.querySelectorAll('.dm-vseg button').forEach(b=>b.addEventListener('click',()=>{
        vw=b.dataset.vw;
        if(vw!=='day')va=new Date(t0);
        syncVw();render();
      }));
      $('dmToday').addEventListener('click',()=>{
        if(vw==='day'){
          const el=list.querySelector('[data-k="'+iso(t0)+'"]');
          if(el)list.scrollTo({top:el.offsetTop,behavior:'smooth'});
        }else{
          va=new Date(t0);render();
        }
      });
      const stepFn=dir=>{
        if(vw==='week'){va.setDate(va.getDate()+dir*7);render();return;}
        if(vw==='month'){va=new Date(va.getFullYear(),va.getMonth()+dir,1);render();return;}
        const hs=[...list.querySelectorAll('[data-k]')];
        let cur=-1;
        for(let i=0;i<hs.length;i++){if(hs[i].offsetTop<=list.scrollTop+1){cur=i;}else{break;}}
        const nx=cur+dir;
        if(nx<0||nx>=hs.length){toast(dir>0?'これより後に予定のある日はありません':'これより前に予定のある日はありません');return;}
        list.scrollTo({top:hs[nx].offsetTop,behavior:'smooth'});
      };
      $('dmPrev').addEventListener('click',()=>stepFn(-1));
      $('dmNext').addEventListener('click',()=>stepFn(1));
      quick.addEventListener('focusin',()=>quick.classList.add('open'));
      quick.addEventListener('focusout',()=>{
        setTimeout(()=>{
          if(!quick.contains(root.activeElement)&&ti.value.trim()===''&&qcats.size===0){
            quick.classList.remove('open');
          }
        },0);
      });
      $('dmQCats').addEventListener('mousedown',e=>e.preventDefault());
      ti.addEventListener('input',()=>{addBtn.disabled=ti.value.trim()==='';});
      const add=()=>{
        const t=ti.value.trim();
        if(!t)return;
        const i={id:++seq,title:t,date:di.value||iso(t0),time:null,cats:[...qcats],pinned:false,done:false};
        items.push(i);
        ti.value='';addBtn.disabled=true;qcats.clear();renderQCats();
        if(tab!=='active'){tab='active';syncTabs();}
        if(vw!=='day'){vw='day';syncVw();}
        newId=i.id;
        render();
        const el=list.querySelector('[data-id="'+i.id+'"]');
        if(el){ scrollListTo(el); toast('保存しました'); }
        else{ toast('保存しました(絞り込み中のため一覧には非表示)'); }
      };
      addBtn.addEventListener('click',add);
      ti.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing&&e.keyCode!==229)add();});
      renderQCats();
      renderAll();
    }
  }
  customElements.define('usagii-demo', UsagiiDemo);
})();
