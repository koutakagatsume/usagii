// <usagii-appmock scene="list|pin|cat|theme"></usagii-appmock>
// 現行アプリの忠実な静的レプリカ。scrollytelling 用に scene 属性で強調状態を切り替える。
// shadow DOM で隔離。ページの @font-face / CSS変数(--disp 等) は継承される。
(() => {
  if (customElements.get('usagii-appmock')) return;

  const CSS = `
  :host{display:block}
  .mock{ width:348px; max-width:100% }
  .app{
    --lbg:#f1efec;--cbg:#fff;--bg2:#e9e7e3;--tx:#1d1c1a;--tx2:#6c6a66;--tx3:#9d9b96;--bd:rgba(0,0,0,.12);
    --ibg:#E6F1FB;--itx:#185FA5;--sun:#A32D2D;--sh:0 1px 3px rgba(0,0,0,.08);
    --bw-bg:#B5D4F4;--bw-fg:#0C447C;--bp-bg:#9FE1CB;--bp-fg:#085041;
    --bi-bg:#F7C1C1;--bi-fg:#791F1F;--bh-bg:#FAC775;--bh-fg:#633806;
    width:348px;background:var(--lbg);color:var(--tx);border:1px solid var(--bd);border-radius:14px;
    overflow:hidden;font-size:13px;font-family:var(--body,'Hiragino Sans','Yu Gothic UI','Segoe UI',sans-serif);
    box-shadow:0 24px 60px rgba(33,29,26,.18); transition:background .6s ease,color .6s ease;
  }
  .mock[data-scene="theme"] .app{
    --lbg:#1d1c1a;--cbg:#2c2b29;--bg2:#3a3937;--tx:#e9e7e3;--tx2:#a9a7a2;--tx3:#7b7975;--bd:rgba(255,255,255,.16);
    --ibg:#0C447C;--itx:#B5D4F4;--sun:#F09595;--sh:0 1px 3px rgba(0,0,0,.35);
    --bw-bg:#0C447C;--bw-fg:#B5D4F4;--bp-bg:#085041;--bp-fg:#9FE1CB;
    --bi-bg:#791F1F;--bi-fg:#F7C1C1;--bh-bg:#633806;--bh-fg:#FAC775;
  }
  .app .bar{display:flex;align-items:center;gap:6px;height:36px;padding:0 12px;border-bottom:1px solid var(--bd)}
  .app .bar b{font-family:var(--disp,'Zen Maru Gothic',sans-serif);font-weight:700;font-size:12.5px;flex:1}
  .app .dot{width:9px;height:9px;border-radius:50%;background:var(--tx3);opacity:.5}
  .app .quick{display:flex;align-items:center;gap:6px;margin:8px 10px 4px;padding:7px 9px;background:var(--cbg);border-radius:10px;box-shadow:var(--sh);transition:background .6s ease}
  .app .qtitle{flex:1;border:1px solid var(--bd);border-radius:8px;padding:4px 10px;color:var(--tx3);font-size:11.5px;white-space:nowrap;overflow:hidden}
  .app .qbtn{border:1px solid var(--itx);background:var(--ibg);color:var(--itx);border-radius:8px;padding:3px 10px;font-size:11px;white-space:nowrap}
  .app .ph{display:flex;align-items:center;gap:5px;padding:3px 10px 1px;font-size:10.5px;color:var(--tx3)}
  .app .ph .nav{margin-left:auto;display:flex;gap:4px;align-items:center}
  .app .nbtn{border:1px solid var(--bd);border-radius:7px;padding:1px 8px;font-size:10.5px;color:var(--tx2)}
  .app .vseg{display:flex;gap:2px;background:var(--bg2);border-radius:7px;padding:2px;margin-right:2px}
  .app .vseg b{font-weight:600;font-size:10px;padding:1px 7px;border-radius:5px;color:var(--tx2)}
  .app .vseg b.on{background:var(--cbg);color:var(--tx);box-shadow:var(--sh)}
  .app .pins{padding:2px 0;transition:box-shadow .5s,transform .5s;border-radius:10px}
  .mock[data-scene="pin"] .pins{box-shadow:0 0 0 3px var(--coral,#D85A30) inset;transform:scale(1.02)}
  .app .pinrow{display:flex;align-items:center;gap:7px;margin:2px 10px 5px;padding:4px 8px 4px 10px;background:var(--cbg);border-radius:9px;box-shadow:var(--sh);transition:background .6s ease}
  .app .pinrow .pic{color:#BA7517;font-size:11px}
  .app .pinrow .d{color:var(--tx2);font-size:11px;font-variant-numeric:tabular-nums;white-space:nowrap}
  .app .pinrow .t{flex:1;font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .app .cnt{font-size:10px;padding:1px 8px;border-radius:999px;background:var(--lbg);color:var(--tx2);white-space:nowrap;transition:background .6s ease}
  .app .sect{border-bottom:1px solid var(--bd);box-shadow:0 2px 6px rgba(0,0,0,.05);padding-bottom:7px;position:relative}
  .app .srch{padding:2px 10px 6px}
  .app .search{display:block;border:1px solid var(--bd);border-radius:8px;padding:4px 10px;color:var(--tx3);font-size:11.5px}
  .app .chips{display:flex;gap:5px;padding:0 10px;flex-wrap:wrap}
  .app .chip{font-size:10.5px;padding:2px 9px;border-radius:999px;border:1px solid var(--bd);color:var(--tx2);transition:all .5s}
  .app .chip.on{background:var(--bg2);color:var(--tx);border-color:var(--bd)}
  .app .chip.c-w{background:var(--bw-bg);color:var(--bw-fg);border-color:var(--bw-fg)}
  .app .chip.c-p{background:var(--bp-bg);color:var(--bp-fg);border-color:var(--bp-fg)}
  .app .chip.c-i{background:var(--bi-bg);color:var(--bi-fg);border-color:var(--bi-fg)}
  .app .chip.c-h{background:var(--bh-bg);color:var(--bh-fg);border-color:var(--bh-fg)}
  .mock[data-scene="cat"] .app .chip.on,
  .mock[data-scene="cat"] .app .chip.c-w,.mock[data-scene="cat"] .app .chip.c-p,.mock[data-scene="cat"] .app .chip.c-h{background:transparent;color:var(--tx2);border-color:var(--bd)}
  .app .dh{position:relative;padding:8px 12px 4px;font-size:11.5px;font-weight:600;display:flex;gap:8px;align-items:center}
  .app .dh.sun{color:var(--sun)}
  .app .dh.now{background:var(--ibg);color:var(--itx)}
  .app .dh.now .today{background:var(--itx);color:var(--ibg)}
  .app .today{font-size:10px;background:var(--ibg);color:var(--itx);padding:1px 8px;border-radius:999px}
  .app .seg{margin-left:auto;display:flex;gap:2px;background:var(--bg2);border-radius:7px;padding:2px;transition:background .6s ease}
  .app .seg b{font-weight:600;font-size:10px;padding:1px 8px;border-radius:5px;color:var(--tx2)}
  .app .seg b.on{background:var(--cbg);color:var(--tx);box-shadow:var(--sh)}
  .app .row{display:flex;gap:8px;margin:0 10px 7px;padding:8px 10px 8px 11px;background:var(--cbg);border-radius:10px;box-shadow:var(--sh);align-items:center;transition:opacity .5s,background .6s ease}
  .app .cb{width:14px;height:14px;border:1.5px solid var(--tx3);border-radius:50%;flex:none}
  .app .tm{color:var(--tx2);font-size:11px;font-variant-numeric:tabular-nums;white-space:nowrap;margin-right:6px}
  .app .bdgs{display:inline;margin-left:6px}
  .app .bdg{display:inline-block;font-size:10px;padding:1px 8px;border-radius:999px;margin-right:3px;vertical-align:1px}
  .app .b-w{background:var(--bw-bg);color:var(--bw-fg)} .app .b-p{background:var(--bp-bg);color:var(--bp-fg)}
  .app .b-i{background:var(--bi-bg);color:var(--bi-fg)} .app .b-h{background:var(--bh-bg);color:var(--bh-fg)}
  .mock[data-scene="pin"] .app .list,.mock[data-scene="pin"] .app .sect,.mock[data-scene="pin"] .app .quick{opacity:.45}
  .mock[data-scene="cat"] .app .row:not(.has-imp){opacity:.18}
  .app .list,.app .sect,.app .quick{transition:opacity .5s,background .6s ease}
  @media (prefers-reduced-motion: reduce){ .app,.app *{transition:none!important} }
  `;

  const HTML = `
  <div class="mock" data-scene="list">
    <div class="app" aria-hidden="true">
      <div class="bar"><b>usagii</b><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
      <div class="quick"><span class="qtitle">クイック登録(タイトルを入力)</span><span class="qbtn">登録</span></div>
      <div class="pins">
        <div class="ph">∧ ピン留め</div>
        <div class="pinrow"><span class="pic">●</span><span class="d">6/23(火)</span><span class="t">車検</span><span class="cnt">あと13日</span></div>
        <div class="pinrow"><span class="pic">●</span><span class="d">8/14(金)</span><span class="t">Aプロジェクト納品</span><span class="cnt">あと65日</span></div>
      </div>
      <div class="sect">
        <div class="ph">∧ 検索<span class="nav"><span class="vseg"><b class="on">日</b><b>週</b><b>月</b></span><span class="nbtn">‹</span><span class="nbtn">今日</span><span class="nbtn">›</span></span></div>
        <div class="srch"><span class="search">タイトルで検索</span></div>
        <div class="chips">
          <span class="chip on">すべて</span><span class="chip c-w">仕事</span><span class="chip c-p">私用</span><span class="chip c-i imp">重要</span><span class="chip c-h">家</span>
        </div>
      </div>
      <div class="list">
        <div class="dh now">6/10 (水) <span class="today">今日</span><span class="seg"><b class="on">予定</b><b>完了</b></span></div>
        <div class="row"><span class="cb"></span><div><span class="tm">終日</span>粗大ゴミ申込<div class="bdgs"><span class="bdg b-h">家</span></div></div></div>
        <div class="row"><span class="cb"></span><div><span class="tm">13:00-14:00</span>チーム定例<div class="bdgs"><span class="bdg b-w">仕事</span></div></div></div>
        <div class="dh">6/11 (木)</div>
        <div class="row has-imp"><span class="cb"></span><div><span class="tm">10:00-12:00</span>設計レビュー<div class="bdgs"><span class="bdg b-w">仕事</span><span class="bdg b-i">重要</span></div></div></div>
        <div class="dh">6/12 (金)</div>
        <div class="row has-imp"><span class="cb"></span><div><span class="tm">6/12 23:00 → 6/13 01:00</span>夜間メンテ立会い<div class="bdgs"><span class="bdg b-w">仕事</span><span class="bdg b-i">重要</span></div></div></div>
        <div class="dh sun">6/14 (日)</div>
        <div class="row"><span class="cb"></span><div><span class="tm">終日</span>父の日の買い物<div class="bdgs"><span class="bdg b-p">私用</span></div></div></div>
      </div>
    </div>
  </div>`;

  class UsagiiAppMock extends HTMLElement {
    static get observedAttributes(){ return ['scene']; }
    connectedCallback(){
      if (this._mounted) return;
      this._mounted = true;
      const root = this.attachShadow({mode:'open'});
      const style = document.createElement('style'); style.textContent = CSS;
      const wrap = document.createElement('div'); wrap.innerHTML = HTML;
      root.appendChild(style); root.appendChild(wrap.firstElementChild);
      this._mock = root.querySelector('.mock');
      this._apply();
    }
    attributeChangedCallback(){ this._apply(); }
    _apply(){ if (this._mock) this._mock.dataset.scene = this.getAttribute('scene') || 'list'; }
  }
  customElements.define('usagii-appmock', UsagiiAppMock);
})();
