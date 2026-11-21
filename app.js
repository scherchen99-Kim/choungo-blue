(function () {
  "use strict";
  var D = window.CHOUNGO_DATA;
  var view = document.getElementById("view");
  var header = document.getElementById("header");
  var catLabel = {};
  D.categories.forEach(function (c) { catLabel[c.id] = c.label; });
  var bySlug = {};
  D.projects.forEach(function (p) { bySlug[p.slug] = p; });

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  var SERVICES = [
    ["Graphic Design", "광고·홍보물, 브랜드 그래픽", "캠페인 키 비주얼부터 매장에 걸리는 홍보물까지, 브랜드의 메시지를 한눈에 읽히는 그래픽으로 만듭니다.", "Graphic & Print"],
    ["Editorial Design", "카탈로그, 브로슈어, 편집디자인", "정보가 많은 카탈로그도 읽기 쉬운 구조로 정리합니다. 인쇄 사양과 후가공까지 함께 설계합니다.", "Graphic & Print"],
    ["POP Design", "매장 내 판매촉진 광고물", "계산대, 매대, 진열장 앞에서 구매를 이끄는 POP를 기획하고 직접 제작합니다.", "POP & POSM"],
    ["POSM Design", "진열 및 판매촉진 제작물", "FSDU, 카운터 디스플레이, 쉘프 토퍼와 워블러까지 매장 운영 방식에 맞춰 설계합니다.", "POP & POSM"],
    ["VMD Design", "비주얼 머천다이징, 매장 연출", "윈도우와 매장 동선, 진열 높이까지 고려해 제품이 가장 잘 보이는 장면을 만듭니다.", "Display & VMD"],
    ["Promotion Design", "각종 프로모션 디자인", "시즌 캠페인과 행사, 팝업까지 짧은 기간에 많은 매장으로 퍼지는 프로모션을 준비합니다.", "POP & POSM"],
    ["Sign Design", "사인물, 옥내외 광고물", "채널 사인, 라이트박스, 안내 사인 체계까지 낮과 밤 모두에서 읽히는 사인을 만듭니다.", "Signage"],
    ["Display Design", "제품 디스플레이", "아크릴, 우드, 금속을 조합해 제품의 형태와 가격대에 맞는 진열 구조를 만듭니다.", "Display & VMD"],
    ["Interior Design", "상업공간 디자인 및 시공", "팝업 스토어와 쇼룸, 매장 인테리어를 설계부터 시공까지 한 팀이 책임집니다.", "Display & VMD"]
  ];
  var STEPS = [
    ["Planning", "브리프를 함께 정리하고 매장 환경, 일정, 예산, 수량을 확인합니다."],
    ["Design", "그래픽과 구조를 함께 설계합니다. 만들 수 있는 디자인인지 처음부터 검토합니다."],
    ["Prototyping", "자체 제작센터에서 실물 샘플을 만들어 크기, 색, 강도를 확인합니다."],
    ["Production", "인쇄, 가공, 조립을 한 공간에서 진행해 품질과 일정을 직접 관리합니다."],
    ["Installation & Delivery", "매장별 포장과 배송, 현장 설치까지 마무리합니다."]
  ];

  /* ---------------- Shared fragments ---------------- */
  var KB = window.CHOUNGO_KB || [];
  function tile(p, i) {
    var motion = p.category === "web" ? " pan" : (KB.indexOf(p.images[0]) >= 0 ? " kb" : "");
    return '<a class="tile in' + motion + '" href="#work-' + p.slug + '" data-cat="' + p.category + '" style="animation-delay:' + ((i % 8) * 40) + 'ms">' +
      '<img src="' + p.images[0] + '" alt="' + esc(p.title) + '">' +
      '<span class="ov"><span class="label">' + esc(catLabel[p.category]) + '</span><h3>' + esc(p.title) + '</h3></span></a>';
  }
  function slot(src, name, size, alt) {
    if (src) return '<img src="' + src + '" alt="' + esc(alt) + '">';
    return '<span class="slot"><b>이미지 자리</b><span>' + esc(name) + '</span><span>' + esc(size) + '</span></span>';
  }
  function shuffled(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  function footer() {
    var c = D.company;
    return '<section class="partners"><div class="inner"><span class="label">Main Partners</span><h2>Brands we work with</h2></div>' +
      '<div class="p-track"><img src="img/partners/samsung.png" alt="Samsung" style="height:31px"><img src="img/partners/sktelecom.png" alt="SK telecom" style="height:51px"><img src="img/partners/skmagic.png" alt="SK매직" style="height:54px"><img src="img/partners/lottehimart.png" alt="롯데하이마트" style="height:33px"><img src="img/partners/lottealuminium.png" alt="롯데알미늄" style="height:38px"><img src="img/partners/tsingtao.png" alt="Tsingtao" style="height:54px"><img src="img/partners/dimchae.png" alt="딤채" style="height:47px"><img src="img/partners/philips.png" alt="Philips" style="height:35px"><img src="img/partners/canon.png" alt="Canon" style="height:40px"><img src="img/partners/lguplus.png" alt="LG U+" style="height:43px"><img src="img/partners/hp.png" alt="HP" style="height:46px"><img src="img/partners/olympus.png" alt="Olympus" style="height:37px"><img src="img/partners/nespresso.png" alt="Nespresso" style="height:35px"><img src="img/partners/innisfree.png" alt="innisfree" style="height:60px"><img src="img/partners/thefaceshop.png" alt="The Face Shop" style="height:26px"><img src="img/partners/nonghyup.png" alt="농협" style="height:46px"><img src="img/partners/nhinvest.png" alt="NH투자증권" style="height:33px"><img src="img/partners/ibk.png" alt="IBK기업은행" style="height:47px"><img src="img/partners/hellomobile.png" alt="hello mobile" style="height:54px"><img src="img/partners/samsung.png" alt="Samsung" style="height:31px"><img src="img/partners/sktelecom.png" alt="SK telecom" style="height:51px"><img src="img/partners/skmagic.png" alt="SK매직" style="height:54px"><img src="img/partners/lottehimart.png" alt="롯데하이마트" style="height:33px"><img src="img/partners/lottealuminium.png" alt="롯데알미늄" style="height:38px"><img src="img/partners/tsingtao.png" alt="Tsingtao" style="height:54px"><img src="img/partners/dimchae.png" alt="딤채" style="height:47px"><img src="img/partners/philips.png" alt="Philips" style="height:35px"><img src="img/partners/canon.png" alt="Canon" style="height:40px"><img src="img/partners/lguplus.png" alt="LG U+" style="height:43px"><img src="img/partners/hp.png" alt="HP" style="height:46px"><img src="img/partners/olympus.png" alt="Olympus" style="height:37px"><img src="img/partners/nespresso.png" alt="Nespresso" style="height:35px"><img src="img/partners/innisfree.png" alt="innisfree" style="height:60px"><img src="img/partners/thefaceshop.png" alt="The Face Shop" style="height:26px"><img src="img/partners/nonghyup.png" alt="농협" style="height:46px"><img src="img/partners/nhinvest.png" alt="NH투자증권" style="height:33px"><img src="img/partners/ibk.png" alt="IBK기업은행" style="height:47px"><img src="img/partners/hellomobile.png" alt="hello mobile" style="height:54px"></div>' +
      '</section>' +
      '<div class="inner">' +
      '<div class="foot-contact">' +
        '<div><span class="label">Telephone</span><span class="v">' + esc(c.phone) + '</span></div>' +
        '<div><span class="label">Studio & Factory</span><span class="v">SEOUL — PAJU</span></div>' +
        '<div><span class="label">Email</span><span class="v">' + esc(c.email.toUpperCase()) + '</span></div>' +
      '</div>' +
      '<div class="foot-bottom"><span class="logo"><span class="logo-word" style="font-size:16px">CHOUNGO <b>BLUE</b></span></span>' +
        '<span>로고는 임시안입니다.</span>' +
        '<span>© 2026 CHOUNGO BLUE</span></div>' +
    '</div>';
  }

  /* ---------------- HOME ---------------- */
  var homeOrder = [], homeShown = 0;
  function home() {
    var webP = D.projects.filter(function (p) { return p.category === "web"; });
    homeOrder = shuffled(D.projects.filter(function (p) { return p.category !== "web"; }));
    webP.forEach(function (p, k) { homeOrder.splice(Math.min(homeOrder.length, k * 6), 0, p); });   // slots 0, 6, 12: never next to each other
    homeShown = Math.min(16, homeOrder.length);
    var spotPool = D.projects.filter(function (p) { return p.images.length >= 3; });
    var spot = spotPool[Math.floor(Math.random() * spotPool.length)] || D.projects[0];
    var steps = ["Planning", "Design", "Print & Production", "Finishing"].map(function (s, i) {
      return '<li><span class="no">' + pad(i + 1) + '</span><span class="nm">' + esc(s) + '</span><i></i></li>';
    }).join("");

    return '' +
    '<section class="hero hero-motion" id="hero">' +
      '<canvas id="heroCanvas" aria-hidden="true"></canvas>' +
      '<h1 class="sr-only">Designed here. Built here. 기획부터 디자인, 제작, 설치까지 한 곳에서.</h1>' +
      '<p class="label kicker hero-kicker inner" id="heroKicker">One-stop creative production<span class="cbar" aria-hidden="true"><i style="background:#00a6e2"></i><i style="background:#e4007f"></i><i style="background:#ffe100"></i><i style="background:#1a1a1a"></i></span></p>' +
      '<ol class="hero-steps inner" id="heroSteps">' + steps + '</ol>' +
    '</section>' +

    '<section class="section inner">' +
      '<div class="intro">' +
        '<h2 class="display">A creative studio with its own <em>production floor.</em></h2>' +
        '<div class="copy"><p>CHOUNGO BLUE는 광고디자인 스튜디오이자 자체 제작센터를 갖춘 크리에이티브 프로덕션입니다. 아이디어를 그리는 팀과 그것을 실제로 만드는 팀이 한 회사 안에서 일합니다.</p>' +
        '<p>그래픽과 편집디자인부터 POP, 디스플레이, 사인, 매장 연출까지. 기획에서 설치까지 하나의 흐름으로 이어지기 때문에 디자인 의도가 마지막 단계까지 그대로 남습니다.</p>' +
        '<p><a class="link-arrow" href="#about">About CHOUNGO BLUE</a></p></div>' +
      '</div>' +
    '</section>' +

    '<section>' +
      '<div class="inner sec-head"><div><span class="label">Selected Work</span><h2 class="display">Portfolio</h2></div><a class="link-arrow" href="#portfolio">View all projects</a></div>' +
      '<div class="work-grid" id="homeGrid">' + homeOrder.slice(0, homeShown).map(tile).join("") + '</div>' +
      '<div class="more-row inner"><button type="button" class="btn-line" id="moreWork">More work <span id="moreCount"></span></button></div>' +
    '</section>' +

    '<section class="section dark">' +
      '<div class="inner">' +
        '<div class="sec-head"><div><span class="label">What we do</span><h2 class="display">Services</h2></div><a class="link-arrow" href="#about">All services</a></div>' +
        '<div class="services">' + SERVICES.map(function (s) {
          return '<div class="svc"><span class="label">' + esc(s[3]) + '</span><h3>' + esc(s[0]) + '</h3><p>' + esc(s[1]) + '</p></div>';
        }).join("") + '</div>' +
      '</div>' +
    '</section>' +

    '<section class="section inner">' +
      '<span class="label" style="color:var(--grey);display:block;margin-bottom:20px">How we work</span>' +
      '<h2 class="display process-title">One-stop<span>creative production.</span></h2>' +
      '<ol class="steps">' + STEPS.map(function (s, i) {
        return '<li><span class="no">' + pad(i + 1) + '</span><h3>' + esc(s[0]) + '</h3><p>' + esc(s[1]) + '</p></li>';
      }).join("") + '</ol>' +
    '</section>' +

    '<section class="split dark">' +
      '<div class="media">' + slot("", "home-factory.jpg", "1600 × 1200", "제작센터") + '</div>' +
      '<div class="body inner">' +
        '<span class="label" style="color:var(--grey)">In-house production</span>' +
        '<h2 class="display">We build<br>what we design.</h2>' +
        '<p style="color:#a3a3a0;max-width:460px">샘플 하나부터 전국 매장 롤아웃까지. 자체 제작센터에서 출력, 가공, 조립을 직접 진행합니다.</p>' +
        '<ul class="eq-list">' + D.facilities.map(function (f) { return '<li><span>' + esc(f.name) + '</span><span>' + esc(f.nameKo) + '</span></li>'; }).join("") + '</ul>' +
        '<p><a class="link-arrow" href="#facilities">Facilities</a></p>' +
      '</div>' +
    '</section>' +

    '<section class="section spotlight inner">' +
      '<span class="label" style="color:var(--grey)">Featured project</span>' +
      '<h2 class="display" style="margin-top:18px">' + esc(spot.title) + '</h2>' +
      '<p class="label scope">' + spot.scope.map(esc).join(" &nbsp;|&nbsp; ") + '</p>' +
      '<p class="lede">' + esc(spot.description) + '</p>' +
      '<a class="frame" href="#work-' + spot.slug + '"><img src="' + spot.images[0] + '" alt="' + esc(spot.title) + '"></a>' +
    '</section>' +

    cta();
  }
  function bindHomeGrid() {
    var grid = document.getElementById("homeGrid"), btn = document.getElementById("moreWork");
    if (!grid || !btn) return;
    function upd() {
      var left = homeOrder.length - homeShown;
      document.getElementById("moreCount").textContent = left > 0 ? "+" + Math.min(8, left) : "";
      btn.parentNode.hidden = left <= 0;
    }
    btn.addEventListener("click", function () {
      var next = homeOrder.slice(homeShown, homeShown + 8);
      grid.insertAdjacentHTML("beforeend", next.map(tile).join(""));
      homeShown += next.length;
      upd();
    });
    upd();
  }

  function cta() {
    return '<section class="section dark cta inner">' +
      '<span class="label" style="color:var(--grey)">Start a project</span>' +
      '<h2 class="display" style="margin-top:20px">Let’s build your<br>next campaign.</h2>' +
      '<p>기획 단계의 아이디어도 좋습니다. 브리프를 보내주시면 디자인과 제작 방법을 함께 제안드립니다.</p>' +
      '<a class="btn-outline" href="#contact">Let’s talk →</a>' +
    '</section>';
  }

  /* ---------- Hero motion graphic: design → print → laser cut ---------- */
  var heroRAF = 0, heroCleanup = null;
  function stopHero() { cancelAnimationFrame(heroRAF); heroRAF = 0; if (heroCleanup) { heroCleanup(); heroCleanup = null; } }
  function startHero() {
    var cv = document.getElementById("heroCanvas");
    if (!cv) return;
    var ctx = cv.getContext("2d");
    var kicker = document.getElementById("heroKicker");
    var stepEls = document.querySelectorAll("#heroSteps li");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var W = 0, H = 0, dpr = 1, size = 100, pad = 24, groups = [], sparks = [];
    var LOOP = 7, cbT0 = performance.now(), cbMark = null, cbTxt = null, cbClicks = [], cbCh = 0, cbPrev = -1, cbG = [], cbK = 0;
    // timeline (seconds)
    var T = { grid: [0, .8], aS: [.5, 2.3], aP: [2.2, 3.6], bS: [3.3, 4.7], bL: [4.6, 6.6], fade: [8.8, 10.5] };
    var STEP_T = [0, .5, 2.2, 3.6, 6.6, 9.6];
    var CMYK = ["#00a6e2", "#e4007f", "#ffe100", "#ffffff"];
    var BLUE = "#000055";
    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function prog(t, r) { return clamp((t - r[0]) / (r[1] - r[0])); }
    function ease(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
    function setFont(px) {
      ctx.font = "850 " + px + "px Archivo, 'Helvetica Neue', Arial, sans-serif";
      if ("fontStretch" in ctx) ctx.fontStretch = "condensed";
      ctx.textBaseline = "alphabetic";
    }
    function layout() {
      var r = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      var nw = Math.round(W * dpr), nh = Math.round(H * dpr);
      if (cv.width !== nw) cv.width = nw; if (cv.height !== nh) cv.height = nh; // resetting the size clears the canvas, so only do it on a real change
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pad = Math.max(16, Math.min(56, W * 0.04));
      var narrow = W < 720;
      // headline chapters (one per cycle): [line A words, line B words]
      var CH = [[["CLEAR", "IDEAS"], ["PLANNED", "HERE."]], [["BOLD", "VISUALS"], ["DESIGNED", "HERE."]], [["TRUE", "COLORS"], ["PRINTED", "HERE."]], [["FINE", "DETAILS"], ["FINISHED", "HERE."]]];
      function ln(w) { return narrow ? w : [w.join(" ")]; }
      var A = ln(CH[cbCh][0]), B = ln(CH[cbCh][1]);
      setFont(100);
      var widest = 0;
      CH.forEach(function (c) { ln(c[0]).concat(ln(c[1])).forEach(function (l) { widest = Math.max(widest, ctx.measureText(l).width); }); });
      var stepsH = (document.getElementById("heroSteps") || { offsetHeight: 80 }).offsetHeight;
      var lines = A.length + B.length;
      var maxByH = (H - stepsH - 150) / (lines * 0.9);
      size = Math.min((W - pad * 2) / widest * 100, maxByH, 230);
      var lh = size * 0.9;
      var bottom = H - stepsH - Math.max(28, size * 0.3);
      var y = bottom - (lines - 1) * lh;
      var y0 = y;
      cbG = CH.map(function (c) {
        y = y0;
        return [ln(c[0]), ln(c[1])].map(function (g) {
          var ls = g.map(function (t) { var o = { text: t, y: y }; y += lh; return o; });
          setFont(size);
          var w = 0; ls.forEach(function (l) { w = Math.max(w, ctx.measureText(l.text).width); });
          return { lines: ls, top: ls[0].y - size * 0.78, bottom: ls[ls.length - 1].y + size * 0.06, width: w };
        });
      });
      groups = cbG[cbCh];
      if (kicker) kicker.style.top = Math.max(90, groups[0].top - 44) + "px";
    }
    function drawText(g, mode, color) {
      setFont(size);
      g.lines.forEach(function (l) {
        if (mode === "stroke") ctx.strokeText(l.text, pad, l.y); else { ctx.fillStyle = color; ctx.fillText(l.text, pad, l.y); }
      });
    }
    function frame(t) {
      ctx.clearRect(0, 0, W, H);
      // CHOUNGO BLUE background: a slow chain of ripple experiments; the ( O ) mark surfaces now and then and dissolves again
      var BG = "#007fff";
      // navy at the top (matches the header bar) flowing into the bright blue
      
      ctx.fillStyle = "#000055"; ctx.fillRect(0, 0, W, H);   // solid navy, same as the inner page headers (no gradient)
      var LOOPS = 64, now = (performance.now() - cbT0) / 1000, sec = now % LOOPS;
      var R = Math.max(46, Math.min(W, H) * .1), r = R * .643, th = R - r, d = R * .63;
      var cx = W / 2, cy = Math.min(H * .34, H / 2 - R * 1.4), cxL = cx - d, cxR = cx + d;
      var maxR = Math.hypot(W, H), V = R * .55, GAP = th * 2.1, BASE = .065;
      function band(x, y, ro, w, col) { if (ro - w / 2 <= 0) return; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(x, y, ro - w / 2, 0, Math.PI * 2); ctx.stroke(); }
      function e3(x) { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
      function env(t, a0, a1, fi, fo) { return e3((t - a0) / fi) * (1 - e3((t - (a1 - fo)) / fo)); }
      function rnd(n) { var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
      // emitter: rings leave a (possibly moving) source; a ring of radius rr was born at te = t - rr / v
      function emit(t, t0, dur, pos, amp, gap, v) {
        gap = gap || GAP; v = v || V; amp = amp || 1;
        var oldest = t - t0; if (oldest <= 0) return;
        var kMax = Math.floor(Math.min(oldest, dur + maxR / v) * v / gap);
        var phase = ((t - t0) * v) % gap;
        for (var k = 0; k <= kMax; k++) {
          var rr = phase + k * gap; if (rr < th * .6 || rr > maxR) continue;
          var te = t - rr / v; if (te < t0 || te > t0 + dur) continue;
          var w = env(te, t0, t0 + dur, Math.min(1.5, dur / 3), Math.min(2, dur / 3)) * (1 - rr / maxR);
          if (w <= .002) continue;
          var p = pos(te); band(p[0], p[1], rr, th, "rgba(195,227,251," + (.07 * w) + ")");
        }
      }
      function at(x, y) { return function () { return [x, y]; }; }
      // A) rain: scattered drops (0-16s, and again at the very end so the loop joins)
      for (var i = 0; i < 9; i++) { var t0 = i * 1.6, sx = W * (.1 + .8 * rnd(i + 1)), sy = H * (.1 + .8 * rnd(i + 21)); emit(sec, t0, 2.2, at(sx, sy), 1.1); }
      for (var j = 0; j < 3; j++) { var dp = at(W * (.15 + .7 * rnd(j + 50)), H * (.15 + .7 * rnd(j + 60))); emit(sec, 56 + j * 1.8, 2.2, dp, 1.1); emit(sec + LOOPS, 56 + j * 1.8, 2.2, dp, 1.1); }
      // B) interference: two sources drifting slowly, their rings cross into moire (12-30s)
      emit(sec, 12, 16, function (t) { return [W * (.28 + .06 * Math.sin(t * .25)), H * (.45 + .12 * Math.cos(t * .2))]; }, 1);
      emit(sec, 13, 16, function (t) { return [W * (.72 + .06 * Math.cos(t * .22)), H * (.5 + .12 * Math.sin(t * .27))]; }, 1);
      // C) travelling source: rings bunch up ahead and stretch behind (Doppler) (26-38s)
      emit(sec, 26, 11, function (t) { var p = e3((t - 26) / 11); return [W * (-.05 + 1.1 * p), H * (.62 - .2 * Math.sin(p * Math.PI))]; }, 1, GAP * .9, V * 1.4);
      // D) a second rain fills the middle of the loop (34-56s)
      for (var i2 = 0; i2 < 12; i2++) emit(sec, 34 + i2 * 1.8, 2.2, at(W * (.08 + .84 * rnd(i2 + 101)), H * (.1 + .8 * rnd(i2 + 131))), 1.1);
      // E) visitor clicks: concentric rings from the clicked point (real time, not looped)
      for (var ci = cbClicks.length - 1; ci >= 0; ci--) {
        var ck = cbClicks[ci]; if (now - ck.t > 40) { cbClicks.splice(ci, 1); continue; }
        var age = now - ck.t;                     // same band width and speed as the background ripples, starting right at the click
        for (var kk = 0; kk < 1; kk++) {      // a single ring per click
          var ag = age; if (ag <= 0) continue;
          var rr2 = th * .5 + ag * V; if (rr2 > maxR) continue;
          var fa = Math.min(1, ag / .25) * (1 - rr2 / maxR);
          band(ck.x, ck.y, rr2, th, "rgba(195,227,251," + (.07 * fa) + ")");   // #c3e3fb at 7%, same as the background ripples
        }
      }
      var fadeOut = 1 - prog(t, T.fade);
      ctx.globalAlpha = 1;
      // headline: four chapters, one tool each — no fades, the tool itself replaces the words
      //   0 planning: a typing caret deletes the old copy and types the new one
      //   1 design:   old copy is selected and deleted, the pen tool draws outlines with anchor points, then the fill pours in
      //   2 print:    a screen-print squeegee pulls the new ink across
      //   3 finish:   a laser head cuts the old letters away and leaves the new
      var cur = cbG[cbCh], prv = cbPrev >= 0 ? cbG[cbPrev] : null, WHITE = "#ffffff", CYAN = "#095fe0";   // point colour on the navy hero
      function linesOf(g) { return g ? g[0].lines.concat(g[1].lines) : []; }
      function clipX(g, x0, x1) { ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, x1 - x0, H); ctx.clip(); drawText(g, "fill", WHITE); ctx.restore(); }
      function both(fn) { fn(cur[0], 0); fn(cur[1], 1); }
      var INK = ["#ffe58a", "#ffb3cd", "#a9e7ff", "#ffcb9a", "#aef0c8", "#ffb4ab", "#e6f5a0", "#d6c8ff", "#ffd9a0", "#a8f2e6", "#f7c0f0", "#c4e3ff"];   // pastel ink, a different one for each letter
      function paint(g, gi, chap) {
        if (chap !== 2 || gi !== 0) { drawText(g, "fill", WHITE); return; }
        setFont(size); var n = 0;
        g.lines.forEach(function (l) {
          for (var c = 0; c < l.text.length; c++) {
            if (l.text[c] === " ") continue;
            var x0 = pad + ctx.measureText(l.text.slice(0, c)).width, x1 = pad + ctx.measureText(l.text.slice(0, c + 1)).width;
            ctx.save(); ctx.beginPath(); ctx.rect(x0 - .5, l.y - size, x1 - x0 + 1, size * 1.3); ctx.clip();
            ctx.fillStyle = INK[n++ % INK.length]; ctx.fillText(l.text, pad, l.y); ctx.restore();
          }
        });
      }
      function paintClip(g, gi, chap, x0, x1) { ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, x1 - x0, H); ctx.clip(); paint(g, gi, chap); ctx.restore(); }
      var kind = cbCh;
      if (kind === 0) {
        setFont(size); ctx.fillStyle = WHITE;
        var Ln = linesOf(cur), Lo = linesOf(prv), del = prog(t, [.2, .9]), typ = prog(t, [1.0, 3.0]);
        var caret = null;
        if (t < 1.0 && Lo.length) {           // backspace the old copy from the end
          var tot = 0; Lo.forEach(function (l) { tot += l.text.length; });
          var keep = Math.round(tot * (1 - del));
          Lo.forEach(function (l) { var n = Math.max(0, Math.min(l.text.length, keep)); keep -= l.text.length;
            var tx = l.text.slice(0, n); ctx.fillText(tx, pad, l.y); if (n > 0 || !caret) caret = { x: pad + ctx.measureText(tx).width, y: l.y }; });
          if (del >= 1) caret = { x: pad, y: Lo[0].y };
        } else {                               // type the new copy
          var totN = 0; Ln.forEach(function (l) { totN += l.text.length; });
          var shown = Math.floor(totN * typ);
          Ln.forEach(function (l) { var n = Math.max(0, Math.min(l.text.length, shown)); shown -= l.text.length;
            var tx = l.text.slice(0, n); ctx.fillText(tx, pad, l.y); if (n > 0 || !caret) caret = { x: pad + ctx.measureText(tx).width, y: l.y }; });
        }
        if (caret && (t < 3.0 || Math.sin(t * 6) > 0)) { ctx.fillStyle = CYAN; ctx.fillRect(caret.x + size * .04, caret.y - size * .78, Math.max(3, size * .05), size * .84); }
      } else if (kind === 1) {
        // design: one cursor. arrow selects the old copy and drags the corner to enlarge it,
        // then it turns into the pen tool, draws the new outlines with anchor points, the fill pours in and a colour sheen passes
        function arrow(x, y) { ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 22); ctx.lineTo(6, 16); ctx.lineTo(10, 25); ctx.lineTo(14, 23); ctx.lineTo(10, 15); ctx.lineTo(17, 15); ctx.closePath(); ctx.fillStyle = "#fff"; ctx.fill(); ctx.lineWidth = 1.4; ctx.strokeStyle = "#000055"; ctx.stroke(); ctx.restore(); }
        function penIcon(x, y) { ctx.save(); ctx.translate(x, y); ctx.rotate(-Math.PI / 4); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-7, 12); ctx.lineTo(-5, 22); ctx.lineTo(5, 22); ctx.lineTo(7, 12); ctx.closePath(); ctx.fillStyle = "#fff"; ctx.fill(); ctx.lineWidth = 1.4; ctx.strokeStyle = "#000055"; ctx.stroke(); ctx.beginPath(); ctx.arc(0, 11, 2, 0, Math.PI * 2); ctx.fillStyle = "#000055"; ctx.fill(); ctx.fillStyle = "#fff"; ctx.strokeStyle = "#000055"; ctx.fillRect(-6, 22, 12, 6); ctx.strokeRect(-6, 22, 12, 6); ctx.restore(); }
        function handles(x0, y0, x1, y1) {
          ctx.strokeStyle = CYAN; ctx.lineWidth = 1.5; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
          ctx.fillStyle = "#fff"; [[x0, y0], [x1, y0], [x0, y1], [x1, y1], [(x0 + x1) / 2, y0], [(x0 + x1) / 2, y1], [x0, (y0 + y1) / 2], [x1, (y0 + y1) / 2]].forEach(function (p) { ctx.fillRect(p[0] - 4, p[1] - 4, 8, 8); ctx.strokeRect(p[0] - 4, p[1] - 4, 8, 8); });
        }
        // one continuous edit: marquee-drag from the bottom corner selects the old copy -> it shows as editable outlines ->
        // the pen tool walks each line turning old outlines into new ones -> the fill pours in (outline stays, so weight doesn't jump)
        var T_IN = .3, T_DRAG = 1.2, T_SELD = 1.5, T_A = 2.6, T_B = 3.7, T_FILL = 4.6;
        var lw = Math.max(1.2, size / 90);
        function anchorsFor(g, x0, x1) {
          ctx.fillStyle = "#fff"; ctx.strokeStyle = CYAN; ctx.lineWidth = 1.5;
          var step = Math.max(40, size * .55);
          for (var ax = pad; ax <= pad + g.width; ax += step) { if (ax < x0 || ax > x1) continue; [g.top + size * .1, g.bottom - size * .02].forEach(function (ay) { ctx.fillRect(ax - 3.5, ay - 3.5, 7, 7); ctx.strokeRect(ax - 3.5, ay - 3.5, 7, 7); }); }
        }
        function outline(g, x0, x1) { ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, x1 - x0, H); ctx.clip(); ctx.lineWidth = lw; ctx.strokeStyle = WHITE; drawText(g, "stroke"); ctx.restore(); }
        var gx0 = pad, gy0 = cur[0].top, gx1 = pad + Math.max(cur[0].width, cur[1].width, prv ? prv[0].width : 0, prv ? prv[1].width : 0), gy1 = cur[1].bottom;
        var sx0 = gx1 + 30, sy0 = gy1 + 30;
        if (t < T_SELD) {
          if (prv) { drawText(prv[0], "fill", WHITE); drawText(prv[1], "fill", WHITE); }
          var dp = ease(prog(t, [T_IN, T_DRAG])), cxp = sx0 + (gx0 - 20 - sx0) * dp, cyp = sy0 + (gy0 - 20 - sy0) * dp;
          if (t > T_IN && t < T_DRAG) { ctx.fillStyle = "rgba(9,95,224,.22)"; ctx.fillRect(cxp, cyp, sx0 - cxp, sy0 - cyp); ctx.setLineDash([5, 4]); ctx.strokeStyle = CYAN; ctx.lineWidth = 1; ctx.strokeRect(cxp, cyp, sx0 - cxp, sy0 - cyp); ctx.setLineDash([]); }
          if (t >= T_DRAG) handles(gx0 - 8, gy0 - 8, gx1 + 8, gy1 + 8);
          var mv = ease(prog(t, [0, T_IN]));
          arrow(t < T_IN ? W * .7 + (sx0 - W * .7) * mv : cxp, t < T_IN ? H * .95 + (sy0 - H * .95) * mv : cyp);
        } else {
          var penX = null, penY = null, pf = ease(prog(t, [T_B + .1, T_FILL]));
          [[0, T_SELD, T_A], [1, T_A, T_B]].forEach(function (d) {
            var gi = d[0], gN = cur[gi], gO = prv ? prv[gi] : null, pp = ease(prog(t, [d[1], d[2]]));
            var end = pad + Math.max(gN.width, gO ? gO.width : 0) + 6, ox = pad - 6 + (end - pad + 6) * pp;
            var fx = pf > 0 ? pad + (gN.width + 6) * pf : 0;
            outline(gN, fx, ox);                        // behind the pen: new paths (the fill replaces them, so the weight never changes)
            if (gO && pp < 1) outline(gO, ox, W);       // ahead of the pen: old paths still to edit
            if (pf > 0) clipX(gN, 0, pad + (gN.width + 6) * pf);
            if (pf < 1) anchorsFor(gN, pad + (gN.width + 6) * pf, ox);
            if (gO && pp < 1) anchorsFor(gO, ox, W);
            if (pp > 0 && pp < 1) { penX = ox; penY = gN.top + (gN.bottom - gN.top) * (.5 + .35 * Math.sin(t * 9)); }
          });
          if (penX !== null) penIcon(penX, penY);
        }
      } else {
        var A0 = cur[0], B0 = cur[1], O0 = prv ? prv[0] : null, O1 = prv ? prv[1] : null;
        if (kind === 2) {
          // print: the screen holds the new copy as a pale stencil; one slow squeegee pull leaves solid ink behind it
          var L = pad - 26, eM = pad + Math.max(A0.width, B0.width, O0 ? O0.width : 0, O1 ? O1.width : 0) + 26;
          var vS = (eM - L) / 3.1, x = t < .5 ? L : L + vS * (t - .5), sweeping = t > .5 && x < W + 50;   // one steady speed, straight off the screen
          var top = A0.top + size * .04, bot = B0.bottom - size * .02;
          var STENCIL = "rgba(255,255,255,.2)";
          if (t < .5 && prv) both(function (g, i) { drawText(prv[i], "fill", WHITE); });
          else if (x >= eM) both(function (g, i) { paint(g, i, 2); });
          else {
            both(function (g, i) { paintClip(g, i, 2, 0, x); });                       // printed: final colour straight away
            if (prv) both(function (g, i) { paintClip(prv[i], i, cbPrev, x, W); });     // not printed yet: the previous copy
          }
          if (sweeping) {
            CMYK.forEach(function (c, i) { ctx.fillStyle = c; ctx.fillRect(x + i * 4, top, 3, bot - top); });
            ctx.fillStyle = "#e6e9ef"; ctx.fillRect(x - 2, top - 10, 22, 10); ctx.fillRect(x - 2, bot, 22, 10);   // squeegee holder, top and bottom
            ctx.fillStyle = "rgba(230,236,245,.9)"; ctx.fillRect(x + 17, top, 3, bot - top);
          }
        } else {
          // finishing: the laser works letter by letter; each letter is revealed from the real line once its outline is cut
          setFont(size);
          var letters = [];
          [A0, B0].forEach(function (g, gi) { g.lines.forEach(function (l) {
            for (var c = 0; c < l.text.length; c++) { if (l.text[c] === " ") continue;
              var x0 = pad + ctx.measureText(l.text.slice(0, c)).width, x1 = pad + ctx.measureText(l.text.slice(0, c + 1)).width;
              letters.push({ x0: x0, x1: x1, line: l, gi: gi }); } }); });
          var T0 = .3, T1 = 3.6, per = (T1 - T0) / letters.length, at = (t - T0) / per, idx = t < T0 ? -1 : Math.min(letters.length, Math.floor(at)), lp = at - Math.floor(at);
          var cut = [pad - 40, pad - 40];
          for (var i = 0; i < idx; i++) cut[letters[i].gi] = Math.max(cut[letters[i].gi], letters[i].x1);
          var finished = idx >= letters.length;
          [A0, B0].forEach(function (g, gi) {
            if (finished) { drawText(g, "fill", WHITE); return; }
            clipX(g, 0, cut[gi]);                                  // cut letters: new copy
            if (t >= T0 || !prv) {                                  // not yet reached: faint cutting path of the new letters
              ctx.save(); ctx.beginPath(); ctx.rect(cut[gi], 0, W, H); ctx.clip(); ctx.lineWidth = Math.max(1, size / 110); ctx.strokeStyle = "rgba(255,255,255,.28)"; drawText(g, "stroke"); ctx.restore();
            } else paintClip(prv[gi], gi, cbPrev, 0, W);
          });
          if (idx >= 0 && !finished) {
            var lt = letters[idx], bx = lt.x0, bw = lt.x1 - lt.x0, by = lt.line.y - size * .74, bh = size * .74;
            ctx.save(); ctx.beginPath(); ctx.rect(bx - 2, 0, bw + 4, H); ctx.clip();   // glowing outline of the letter being cut
            ctx.lineWidth = Math.max(1.5, size / 70); ctx.strokeStyle = "rgba(255,240,200," + (.35 + .6 * lp) + ")";
            var g0 = lt.gi === 0 ? A0 : B0; drawText(g0, "stroke"); ctx.restore();
            var per2 = 2 * (bw + bh), d = per2 * lp, hx, hy;
            if (d < bw) { hx = bx + d; hy = by; } else if (d < bw + bh) { hx = bx + bw; hy = by + d - bw; } else if (d < 2 * bw + bh) { hx = bx + bw - (d - bw - bh); hy = by + bh; } else { hx = bx; hy = by + bh - (d - 2 * bw - bh); }
            ctx.fillStyle = "rgba(9,95,224,.35)"; ctx.beginPath(); ctx.arc(hx, hy, 18, 0, Math.PI * 2); ctx.fill();   // solid halo, no gradient
            ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(hx, hy, 5, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = "rgba(200,235,255,.4)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(hx, 0); ctx.lineTo(hx, hy); ctx.stroke();
            if (!reduce) for (var k = 0; k < 2; k++) sparks.push({ x: hx, y: hy, vx: (Math.random() - .5) * 240, vy: -Math.random() * 200 - 30, life: .4 + Math.random() * .4, age: 0 });
          }
        }
      }
    }
    function drawSparks(dt) {
      for (var i = sparks.length - 1; i >= 0; i--) {
        var s = sparks[i]; s.age += dt;
        if (s.age > s.life) { sparks.splice(i, 1); continue; }
        s.vy += 620 * dt; s.x += s.vx * dt; s.y += s.vy * dt;
        var a = 1 - s.age / s.life;
        ctx.fillStyle = "rgba(255," + Math.round(200 + 55 * a) + "," + Math.round(150 * a) + "," + a + ")";
        ctx.fillRect(s.x, s.y, 2, 2);
      }
    }
    function setSteps(t) {
      stepEls.forEach(function (li, i) {   // the step bar follows the chapter (planning / design / print / finishing)
        li.classList.toggle("on", i === cbCh);
        li.classList.toggle("done", i < cbCh);
        li.querySelector("i").style.transform = "scaleX(" + (i < cbCh ? 1 : i === cbCh ? clamp(t / LOOP) : 0) + ")";
      });
    }
    var start = performance.now(), last = start;
    function loop(now) {
      var t = ((now - start) / 1000) % LOOP, dt = Math.min(.05, (now - last) / 1000); last = now;
      var k = Math.floor(Math.max(0, now - start) / 1000 / LOOP);
      cbK = k; cbCh = k % 4; cbPrev = k > 0 ? (k - 1) % 4 : -1; groups = cbG[cbCh];
      frame(t); drawSparks(dt); setSteps(t);
      heroRAF = requestAnimationFrame(loop);
    }
    function onResize() { layout(); if (reduce) { frame(8); setSteps(9.5); } }
    window.addEventListener("resize", onResize);
    var heroEl = document.getElementById("hero");
    function onHeroClick(e) {
      var r = cv.getBoundingClientRect();
      cbClicks.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: (performance.now() - cbT0) / 1000 });
      if (cbClicks.length > 12) cbClicks.shift();
    }
    if (heroEl) heroEl.addEventListener("pointerdown", onHeroClick);
    heroCleanup = function () { window.removeEventListener("resize", onResize); if (heroEl) heroEl.removeEventListener("pointerdown", onHeroClick); };
    var go = function () {
      layout();
      if (reduce) { frame(8); setSteps(9.5); return; }
      start = performance.now(); last = start;
      heroRAF = requestAnimationFrame(loop);
    };
    if (document.fonts && document.fonts.load) document.fonts.load("850 100px Archivo").then(go, go); else go();
  }

  /* ---------------- ABOUT ---------------- */
  function about() {
    return '' +
    '<section class="page-head inner">' +
      '<span class="label" style="color:var(--grey)">About / Services</span>' +
      '<h1 class="display" style="margin-top:20px">We design it.<br>We make it.</h1>' +
      '<div class="row"><span></span><p>CHOUNGO BLUE는 디자인 스튜디오의 감각과 제작사의 실행력을 함께 가진 회사입니다. 브랜드가 매장과 거리에서 사람을 만나는 모든 접점을 기획하고, 디자인하고, 직접 만듭니다.</p></div>' +
    '</section>' +
    '<section class="section dark" style="padding-top:0">' +
      '<div class="inner"><div class="stat-strip">' +
        '<div><h3>One team</h3><p>디자이너와 제작 엔지니어가 같은 프로젝트를 처음부터 함께 봅니다.</p></div>' +
        '<div><h3>One roof</h3><p>스튜디오와 제작센터가 연결되어 샘플 확인과 수정이 빠릅니다.</p></div>' +
        '<div><h3>One line</h3><p>기획부터 설치까지 하나의 일정과 하나의 책임으로 관리합니다.</p></div>' +
      '</div></div>' +
    '</section>' +
    '<section class="section inner">' +
      '<div class="sec-head"><div><span class="label">Services</span><h2 class="display">What we do</h2></div></div>' +
      '<div class="svc-rows">' + SERVICES.map(function (s) {
        return '<div class="svc-row"><h3>' + esc(s[0]) + '</h3><p><b style="font-weight:500;color:var(--black)">' + esc(s[1]) + '</b><br>' + esc(s[2]) + '</p><span class="label">' + esc(s[3]) + '</span></div>';
      }).join("") + '</div>' +
    '</section>' +
    '<section class="section paper inner">' +
      '<span class="label" style="color:var(--grey);display:block;margin-bottom:20px">Process</span>' +
      '<h2 class="display process-title">From idea<span>to in-store.</span></h2>' +
      '<ol class="steps">' + STEPS.map(function (s, i) {
        return '<li><span class="no">' + pad(i + 1) + '</span><h3>' + esc(s[0]) + '</h3><p>' + esc(s[1]) + '</p></li>';
      }).join("") + '</ol>' +
    '</section>' +
    '<div class="work-grid">' + D.projects.slice(0, 4).map(tile).join("") + '</div>' +
    cta();
  }

  /* ---------------- PORTFOLIO ---------------- */
  var currentFilter = "all";
  function portfolio() {
    var counts = { all: D.projects.length };
    D.projects.forEach(function (p) { counts[p.category] = (counts[p.category] || 0) + 1; });
    var btns = [{ id: "all", label: "All" }].concat(D.categories).map(function (c) {
      return '<button type="button" data-f="' + c.id + '" aria-pressed="' + (c.id === currentFilter) + '">' + esc(c.label) + '<sup>' + (counts[c.id] || 0) + '</sup></button>';
    }).join("");
    return '' +
    '<section class="page-head inner" style="padding-bottom:40px">' +
      '<span class="label" style="color:var(--grey)">Selected work</span>' +
      '<h1 class="display" style="margin-top:20px">Portfolio</h1>' +
    '</section>' +
    '<div class="portfolio-bar inner"><div class="filters" id="filters" role="group" aria-label="카테고리 필터">' + btns + '</div>' +
      '<span class="note-sample">' + D.projects.length + ' projects</span></div>' +
    '<div class="work-grid cols-3" id="pgrid">' + D.projects.map(tile).join("") + '</div>' +
    cta();
  }
  function bindPortfolio() {
    var grid = document.getElementById("pgrid");
    if (!grid) return;
    var buttons = document.querySelectorAll("#filters button");
    function apply(f, animate) {
      currentFilter = f;
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.f === f)); });
      var tiles = Array.prototype.slice.call(grid.children);
      if (!animate) { tiles.forEach(function (t) { t.hidden = !(f === "all" || t.dataset.cat === f); }); return; }
      tiles.forEach(function (t) { if (!t.hidden) t.classList.add("out"); });
      setTimeout(function () {
        var k = 0;
        tiles.forEach(function (t) {
          var show = f === "all" || t.dataset.cat === f;
          t.classList.remove("out", "in");
          t.hidden = !show;
          if (show) { t.style.animationDelay = (k++ * 45) + "ms"; void t.offsetWidth; t.classList.add("in"); }
        });
      }, 240);
    }
    buttons.forEach(function (b) { b.addEventListener("click", function () { if (b.dataset.f !== currentFilter) apply(b.dataset.f, true); }); });
    apply(currentFilter, false);
  }

  /* ---------------- PROJECT DETAIL ---------------- */
  function project(slug) {
    var p = bySlug[slug];
    if (!p) return portfolio();
    var idx = D.projects.indexOf(p);
    var prev = D.projects[(idx - 1 + D.projects.length) % D.projects.length];
    var next = D.projects[(idx + 1) % D.projects.length];
    return '' +
    '<section class="p-hero"><img src="' + p.images[0] + '" alt="' + esc(p.title) + ' 대표 이미지">' +
      '<div class="t inner"><a class="label back" href="#portfolio">← Portfolio</a><h1 class="display">' + esc(p.title) + '</h1></div>' +
    '</section>' +
    '<div class="inner"><dl class="meta">' +
      '<div><dt class="label">Client</dt><dd>' + esc(p.client) + '</dd></div>' +
      '<div><dt class="label">Category</dt><dd>' + esc(catLabel[p.category]) + '</dd></div>' +
      '<div><dt class="label">Scope</dt><dd>' + p.scope.map(esc).join(", ") + '</dd></div>' +
      '<div><dt class="label">Images</dt><dd>' + p.images.length + '</dd></div>' +
    '</dl></div>' +
    '<section class="section dark inner"><div class="p-text">' +
      '<h2 class="display">' + esc(p.type) + ' Design</h2>' +
      '<div><p>' + esc(p.description) + '</p></div>' +
    '</div></section>' +
    '<div class="gallery inner" id="gallery">' + p.images.map(function (src, i) {
      return '<button type="button" data-i="' + i + '" aria-label="이미지 ' + (i + 1) + ' 확대"><img src="' + src + '" alt="' + esc(p.title) + ' 이미지 ' + (i + 1) + '"></button>';
    }).join("") + '</div>' +
    '<nav class="p-next" aria-label="다른 프로젝트">' +
      '<a href="#work-' + prev.slug + '"><img src="' + prev.images[0] + '" alt=""><span class="t"><span class="label">← Previous</span><h3>' + esc(prev.title) + '</h3></span></a>' +
      '<a class="nx" href="#work-' + next.slug + '"><img src="' + next.images[0] + '" alt=""><span class="t"><span class="label">Next →</span><h3>' + esc(next.title) + '</h3></span></a>' +
    '</nav>';
  }
  function bindGallery(slug) {
    var g = document.getElementById("gallery");
    if (!g) return;
    var p = bySlug[slug];
    g.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () { openLB(p.images, +b.dataset.i, p.title); });
    });
  }

  /* ---------------- FACILITIES ---------------- */
  function facilities() {
    return '' +
    '<section class="page-head inner">' +
      '<span class="label" style="color:var(--grey)">Facilities</span>' +
      '<h1 class="display" style="margin-top:20px">Production<br>floor.</h1>' +
      '<div class="row"><span></span><p>디자인 스튜디오와 함께 자체 제작센터를 운영합니다. 인쇄, 가공, 조립을 직접 하기 때문에 샘플 확인이 빠르고, 디자인 의도를 양산 단계까지 지킬 수 있습니다.</p></div>' +
    '</section>' +
    '<div class="fac-band">' + slot("", "facilities-top.jpg", "2400 × 1050", "제작센터") + '</div>' +
    '<section>' + D.facilities.map(function (f, i) {
      return '<article class="fac">' +
        (f.image ? '<button type="button" class="media" data-i="' + i + '" aria-label="' + esc(f.nameKo) + ' 이미지 확대"><img src="' + f.image + '" alt="' + esc(f.nameKo) + '"></button>' : '<div class="media">' + slot("", "fac-" + f.id + ".jpg", "1600 × 1000", f.nameKo) + '</div>') +
        '<div class="body"><span class="label no">' + pad(i + 1) + ' / ' + pad(D.facilities.length) + '</span>' +
          '<h2>' + esc(f.name) + '</h2><p class="ko">' + esc(f.nameKo) + '</p><p>' + esc(f.desc) + '</p>' +
          '<dl class="specs">' + f.specs.map(function (s) { return '<div><dt>' + esc(s[0]) + '</dt><dd>' + esc(s[1]) + '</dd></div>'; }).join("") + '</dl>' +
          (f.model && f.model.length ? '<span class="spec-note">Equipment — ' + f.model.map(esc).join(" · ") + '</span>' : '') +
        '</div></article>';
    }).join("") + '</section>' +
    cta();
  }
  function bindFacilities() {
    var imgs = D.facilities.map(function (f) { return f.image; });
    document.querySelectorAll(".fac button.media").forEach(function (b) {
      b.addEventListener("click", function () { openLB(imgs, +b.dataset.i, "Facilities"); });
    });
  }

  /* ---------------- CONTACT ---------------- */
  function contact() {
    var c = D.company;
    var types = ["POP / POSM", "Graphic & Print", "Display / VMD", "Signage", "Interior", "기타"];
    return '' +
    '<section class="page-head inner">' +
      '<span class="label" style="color:var(--grey)">Contact</span>' +
      '<h1 class="display" style="margin-top:20px">Let’s talk.</h1>' +
    '</section>' +
    '<section class="section inner"><div class="contact-grid">' +
      '<div class="contact-info"><p style="font-size:18px;max-width:420px">프로젝트 개요와 일정, 예상 수량을 알려주시면 영업일 기준 1–2일 안에 담당자가 연락드립니다.</p>' +
        '<dl><div><dt class="label">Telephone</dt><dd>' + esc(c.phone) + '</dd></div>' +
        '<div><dt class="label">Email</dt><dd>' + esc(c.email) + '</dd></div>' +
        '<div><dt class="label">Studio & Factory</dt><dd class="ko">' + esc(c.address) + '</dd></div>' +
        '<div><dt class="label">Hours</dt><dd class="ko">' + esc(c.hours) + '</dd></div></dl></div>' +
      '<form class="brief" id="brief" novalidate>' +
        '<div class="f2"><div class="f"><label for="c-name">Name *</label><input id="c-name" name="name" autocomplete="name"></div>' +
        '<div class="f"><label for="c-company">Company</label><input id="c-company" name="company" autocomplete="organization"></div></div>' +
        '<div class="f2"><div class="f"><label for="c-email">Email *</label><input id="c-email" name="email" type="email" autocomplete="email"></div>' +
        '<div class="f"><label for="c-phone">Phone</label><input id="c-phone" name="phone" type="tel" autocomplete="tel"></div></div>' +
        '<div class="f"><span class="label" style="color:var(--grey);font-size:11px">Project type</span><div class="chips">' + types.map(function (t, i) {
          return '<label><input type="checkbox" id="c-type-' + i + '" name="type" value="' + esc(t) + '"><span>' + esc(t) + '</span></label>';
        }).join("") + '</div></div>' +
        '<div class="f"><label for="c-msg">Project brief</label><textarea id="c-msg" name="msg" placeholder="예: 신제품 출시용 카운터 디스플레이 300개, 4월 첫째 주 매장 입고 희망"></textarea></div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:20px;align-items:center"><button class="btn-solid" type="submit">Send brief →</button><span class="form-msg" id="formMsg" role="status"></span></div>' +
      '</form>' +
    '</div></section>';
  }
  function bindContact() {
    var f = document.getElementById("brief");
    if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = document.getElementById("formMsg");
      if (!f.elements.name.value.trim() || !/\S+@\S+\.\S+/.test(f.elements.email.value)) {
        msg.style.color = "#c43a2c";
        msg.textContent = "이름과 올바른 이메일 주소를 입력해 주세요.";
        return;
      }
      msg.style.color = "";
      msg.textContent = "입력 확인 완료 — 시안 단계라 실제 전송은 연결되어 있지 않습니다.";
    });
  }

  /* ---------------- Lightbox ---------------- */
  var lb = document.getElementById("lightbox"), lbImg = document.getElementById("lbImg");
  var lbList = [], lbI = 0, lbLast = null;
  function lbShow(n, instant) {
    lbI = (n + lbList.length) % lbList.length;
    var go = function () {
      lbImg.src = lbList[lbI];
      document.getElementById("lbCount").textContent = pad(lbI + 1) + " / " + pad(lbList.length);
      lbImg.classList.remove("swap");
    };
    if (instant) go(); else { lbImg.classList.add("swap"); setTimeout(go, 180); }
  }
  function openLB(list, i, title) {
    lbList = list; lbLast = document.activeElement;
    document.getElementById("lbTitle").textContent = title;
    lbShow(i, true);
    lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.getElementById("lbClose").focus();
  }
  function closeLB() {
    lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lbLast) lbLast.focus();
  }
  document.getElementById("lbClose").addEventListener("click", closeLB);
  document.getElementById("lbPrev").addEventListener("click", function () { lbShow(lbI - 1); });
  document.getElementById("lbNext").addEventListener("click", function () { lbShow(lbI + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lb-stage")) closeLB(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLB();
    if (e.key === "ArrowLeft") lbShow(lbI - 1);
    if (e.key === "ArrowRight") lbShow(lbI + 1);
  });
  var tx = null;
  lb.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) lbShow(lbI + (dx < 0 ? 1 : -1));
  });

  /* ---------------- Mobile menu ---------------- */
  var mm = document.getElementById("mobileMenu");
  function setMenu(open) {
    mm.classList.toggle("open", open);
    mm.setAttribute("aria-hidden", String(!open));
    document.getElementById("menuOpen").setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  document.getElementById("menuOpen").addEventListener("click", function () { setMenu(true); });
  document.getElementById("menuClose").addEventListener("click", function () { setMenu(false); });
  mm.querySelectorAll("nav a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });

  /* ---------------- Router ---------------- */
  var routeName = "home";
  function parse() {
    var h = (location.hash || "").replace(/^#/, "");
    if (!h || h === "home" || h === "top") return { r: "home" };
    if (h.indexOf("work-") === 0) return { r: "work", slug: h.slice(5) };
    if (["about", "portfolio", "facilities", "contact"].indexOf(h) > -1) return { r: h };
    return { r: "home" };
  }
  function updateHeader() {
    header.classList.toggle("solid", routeName !== "home" || window.scrollY > 60);
  }
  function render(first) {
    var R = parse();
    stopHero();
    var draw = function () {
      routeName = R.r === "work" ? "work" : R.r;
      var html = R.r === "about" ? about() : R.r === "portfolio" ? portfolio() : R.r === "facilities" ? facilities() :
        R.r === "contact" ? contact() : R.r === "work" ? project(R.slug) : home();
      view.innerHTML = html;
      window.scrollTo(0, 0);
      document.querySelectorAll(".nav a").forEach(function (a) {
        var r = a.dataset.r;
        a.classList.toggle("active", r === routeName || (routeName === "work" && r === "portfolio"));
      });
      // hero pages keep a transparent header at top
      routeName = (R.r === "home") ? "home" : (R.r === "work" ? "home" : R.r);
      updateHeader();
      if (R.r === "home") { startHero(); bindHomeGrid(); }
      if (R.r === "portfolio") bindPortfolio();
      if (R.r === "work") bindGallery(R.slug);
      if (R.r === "facilities") bindFacilities();
      if (R.r === "contact") bindContact();
      view.classList.remove("leaving");
      if (!first) { view.classList.remove("entering"); void view.offsetWidth; view.classList.add("entering"); }
    };
    if (first) draw();
    else { view.classList.add("leaving"); setTimeout(draw, 220); }
  }

  document.getElementById("footer").innerHTML = footer();
  window.addEventListener("hashchange", function () { if (lb.classList.contains("open")) closeLB(); render(false); });
  window.addEventListener("scroll", updateHeader, { passive: true });
  render(true);
})();
