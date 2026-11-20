(function () {
  "use strict";
  var D = window.PLINTH_DATA;
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
  function tile(p, i) {
    return '<a class="tile in" href="#work-' + p.slug + '" data-cat="' + p.category + '" style="animation-delay:' + ((i % 8) * 40) + 'ms">' +
      '<img src="' + p.images[0] + '" alt="' + esc(p.title) + '" loading="lazy">' +
      '<span class="ov"><span class="label">' + esc(catLabel[p.category]) + '</span><h3>' + esc(p.title) + '</h3></span></a>';
  }
  function slot(src, name, size, alt) {
    if (src) return '<img src="' + src + '" alt="' + esc(alt) + '" loading="lazy">';
    return '<span class="slot"><b>이미지 자리</b><span>' + esc(name) + '</span><span>' + esc(size) + '</span></span>';
  }
  function shuffled(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  function footer() {
    var c = D.company;
    return '<div class="inner">' +
      '<div class="foot-contact">' +
        '<div><span class="label">Telephone</span><span class="v">' + esc(c.phone) + '</span></div>' +
        '<div><span class="label">Studio & Factory</span><span class="v">SEOUL — PAJU</span></div>' +
        '<div><span class="label">Email</span><span class="v">' + esc(c.email.toUpperCase()) + '</span></div>' +
      '</div>' +
      '<div class="foot-bottom"><span class="logo"><span class="logo-word" style="font-size:16px">PLINTH</span></span>' +
        '<span>회사명과 로고는 임시안입니다.</span>' +
        '<span>© 2026 PLINTH Creative Production</span></div>' +
    '</div>';
  }

  /* ---------------- HOME ---------------- */
  var homeOrder = [], homeShown = 0;
  function home() {
    homeOrder = shuffled(D.projects);
    homeShown = Math.min(16, homeOrder.length);
    var spotPool = D.projects.filter(function (p) { return p.images.length >= 3; });
    var spot = spotPool[Math.floor(Math.random() * spotPool.length)] || D.projects[0];
    var steps = STEPS.map(function (s, i) {
      return '<li><span class="no">' + pad(i + 1) + '</span><span class="nm">' + esc(s[0]) + '</span><i></i></li>';
    }).join("");

    return '' +
    '<section class="hero hero-motion" id="hero">' +
      '<canvas id="heroCanvas" aria-hidden="true"></canvas>' +
      '<h1 class="sr-only">Designed here. Built here. 기획부터 디자인, 제작, 설치까지 한 곳에서.</h1>' +
      '<p class="label kicker hero-kicker inner" id="heroKicker">One-stop creative production</p>' +
      '<ol class="hero-steps inner" id="heroSteps">' + steps + '</ol>' +
    '</section>' +

    '<section class="section inner">' +
      '<div class="intro">' +
        '<h2 class="display">A creative studio with its own <em>production floor.</em></h2>' +
        '<div class="copy"><p>PLINTH는 광고디자인 스튜디오이자 자체 제작센터를 갖춘 크리에이티브 프로덕션입니다. 아이디어를 그리는 팀과 그것을 실제로 만드는 팀이 한 회사 안에서 일합니다.</p>' +
        '<p>그래픽과 편집디자인부터 POP, 디스플레이, 사인, 매장 연출까지. 기획에서 설치까지 하나의 흐름으로 이어지기 때문에 디자인 의도가 마지막 단계까지 그대로 남습니다.</p>' +
        '<p><a class="link-arrow" href="#about">About PLINTH</a></p></div>' +
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
    var LOOP = 10.5;
    // timeline (seconds)
    var T = { grid: [0, .8], aS: [.5, 2.3], aP: [2.2, 3.6], bS: [3.3, 4.7], bL: [4.6, 6.6], fade: [9.6, 10.5] };
    var STEP_T = [0, .5, 2.2, 3.6, 6.6, 9.6];
    var CMYK = ["#00a6e2", "#e4007f", "#ffe100", "#ffffff"];
    var BLUE = "#2b44d6";
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
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pad = Math.max(16, Math.min(56, W * 0.04));
      var narrow = W < 720;
      var A = narrow ? ["DESIGNED", "HERE."] : ["DESIGNED HERE."];
      var B = narrow ? ["BUILT", "HERE."] : ["BUILT HERE."];
      setFont(100);
      var widest = 0;
      A.concat(B).forEach(function (l) { widest = Math.max(widest, ctx.measureText(l).width); });
      var stepsH = (document.getElementById("heroSteps") || { offsetHeight: 80 }).offsetHeight;
      var lines = A.length + B.length;
      var maxByH = (H - stepsH - 150) / (lines * 0.9);
      size = Math.min((W - pad * 2) / widest * 100, maxByH, 230);
      var lh = size * 0.9;
      var bottom = H - stepsH - Math.max(28, size * 0.3);
      var y = bottom - (lines - 1) * lh;
      groups = [A, B].map(function (g) {
        var ls = g.map(function (t) { var o = { text: t, y: y }; y += lh; return o; });
        setFont(size);
        var w = 0; ls.forEach(function (l) { w = Math.max(w, ctx.measureText(l.text).width); });
        return { lines: ls, top: ls[0].y - size * 0.78, bottom: ls[ls.length - 1].y + size * 0.06, width: w };
      });
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
      ctx.fillStyle = "#0b0b0c"; ctx.fillRect(0, 0, W, H);
      var fadeOut = 1 - prog(t, T.fade);
      // cutting-mat grid
      var ga = prog(t, T.grid) * 0.07, step = Math.max(28, size * 0.42);
      ctx.strokeStyle = "rgba(255,255,255," + ga + ")"; ctx.lineWidth = 1;
      ctx.beginPath();
      for (var x = pad; x < W; x += step) { ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, H); }
      for (var y2 = H - pad; y2 > 0; y2 -= step) { ctx.moveTo(0, y2 + .5); ctx.lineTo(W, y2 + .5); }
      ctx.stroke();
      // registration / crop marks around the artboard
      var ma = prog(t, T.grid) * 0.55;
      ctx.strokeStyle = "rgba(255,255,255," + ma + ")";
      var x0 = pad, x1 = W - pad, y0 = Math.max(96, groups[0].top - 70), y1 = groups[1].bottom + Math.max(18, size * 0.18), m = 14;
      ctx.beginPath();
      [[x0, y0, -1, -1], [x1, y0, 1, -1], [x0, y1, -1, 1], [x1, y1, 1, 1]].forEach(function (c) {
        ctx.moveTo(c[0], c[1] + c[3] * 6); ctx.lineTo(c[0], c[1] + c[3] * (6 + m));
        ctx.moveTo(c[0] + c[2] * 6, c[1]); ctx.lineTo(c[0] + c[2] * (6 + m), c[1]);
      });
      ctx.stroke();
      // registration target + color bar (top right)
      var rx = x1 - 10, ry = W >= 720 ? y0 + 26 : y0 - 30;
      ctx.beginPath(); ctx.arc(rx, ry, 7, 0, Math.PI * 2); ctx.moveTo(rx - 12, ry); ctx.lineTo(rx + 12, ry); ctx.moveTo(rx, ry - 12); ctx.lineTo(rx, ry + 12); ctx.stroke();
      var cb = ["#00a6e2", "#e4007f", "#ffe100", "#1a1a1a", "#7fd3f1", "#f27fbf", "#fff080", "#8c8c88"];
      if (W >= 720) cb.forEach(function (c, i) { ctx.globalAlpha = ma * 1.6; ctx.fillStyle = c; ctx.fillRect(rx - 26 - (cb.length - i) * 12, ry - 5, 10, 10); });
      ctx.globalAlpha = 1;
      ctx.globalAlpha = fadeOut;
      // A: outline drawing (design)
      var A = groups[0], B = groups[1];
      var pa = ease(prog(t, T.aS)), L = size * 6;
      ctx.lineWidth = Math.max(1, size / 110); ctx.strokeStyle = "rgba(255,255,255,.9)";
      ctx.setLineDash([L, L]); ctx.lineDashOffset = L * (1 - pa);
      if (pa > 0) drawText(A, "stroke");
      ctx.setLineDash([]);
      // A: print-head fill (production)
      var pp = prog(t, T.aP), headX = pad - 30 + (A.width + 60) * ease(pp);
      if (pp > 0) {
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, headX, H); ctx.clip(); drawText(A, "fill", "#ffffff"); ctx.restore();
        if (pp < 1) {
          var hy0 = A.top - size * 0.12, hy1 = A.bottom + size * 0.12;
          var gr = ctx.createLinearGradient(headX - 90, 0, headX, 0);
          gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(255,255,255,.18)");
          ctx.fillStyle = gr; ctx.fillRect(headX - 90, hy0, 90, hy1 - hy0);
          CMYK.forEach(function (c, i) { ctx.fillStyle = c; ctx.fillRect(headX + i * 4, hy0, 3, hy1 - hy0); });
          ctx.fillStyle = "#d9d9d6"; ctx.fillRect(headX - 4, hy0 - 10, 26, 10); ctx.fillRect(headX - 4, hy1, 26, 10);
        }
      }
      // B: outline (prototype)
      var pb = ease(prog(t, T.bS));
      ctx.lineWidth = Math.max(1, size / 110); ctx.strokeStyle = "rgba(255,255,255,.75)";
      ctx.setLineDash([L, L]); ctx.lineDashOffset = L * (1 - pb);
      if (pb > 0) drawText(B, "stroke");
      ctx.setLineDash([]);
      // B: laser cut reveal
      var pl = prog(t, T.bL);
      if (pl > 0) {
        var lx = pad - 10 + (B.width + 20) * pl;
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, lx, H); ctx.clip();
        var off = Math.max(2, size * 0.035);
        ctx.save(); ctx.translate(off, off); drawText(B, "fill", BLUE); ctx.restore();
        drawText(B, "fill", "#ffffff");
        ctx.restore();
        if (pl < 1) {
          var span = B.bottom - B.top, ly = B.top + span * (0.5 + 0.48 * Math.sin(t * 38));
          var glow = ctx.createRadialGradient(lx, ly, 0, lx, ly, 34);
          glow.addColorStop(0, "rgba(255,255,255,1)"); glow.addColorStop(.2, "rgba(140,170,255,.85)"); glow.addColorStop(1, "rgba(43,68,214,0)");
          ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(lx, ly, 34, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = "rgba(160,185,255,.5)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, ly); ctx.stroke();
          if (!reduce) for (var k = 0; k < 3; k++) sparks.push({ x: lx, y: ly, vx: (Math.random() - .3) * 260, vy: -Math.random() * 220 - 40, life: .5 + Math.random() * .4, age: 0 });
        }
      }
      ctx.globalAlpha = 1;
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
      stepEls.forEach(function (li, i) {
        var a = STEP_T[i], b = STEP_T[i + 1];
        li.classList.toggle("on", t >= a && t < b);
        li.classList.toggle("done", t >= b);
        li.querySelector("i").style.transform = "scaleX(" + clamp((t - a) / (b - a)) + ")";
      });
    }
    var start = performance.now(), last = start;
    function loop(now) {
      var t = ((now - start) / 1000) % LOOP, dt = Math.min(.05, (now - last) / 1000); last = now;
      frame(t); drawSparks(dt); setSteps(t);
      heroRAF = requestAnimationFrame(loop);
    }
    function onResize() { layout(); if (reduce) { frame(8); setSteps(9.5); } }
    window.addEventListener("resize", onResize);
    heroCleanup = function () { window.removeEventListener("resize", onResize); };
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
      '<div class="row"><span></span><p>PLINTH는 디자인 스튜디오의 감각과 제작사의 실행력을 함께 가진 회사입니다. 브랜드가 매장과 거리에서 사람을 만나는 모든 접점을 기획하고, 디자인하고, 직접 만듭니다.</p></div>' +
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
      return '<button type="button" data-i="' + i + '" aria-label="이미지 ' + (i + 1) + ' 확대"><img src="' + src + '" alt="' + esc(p.title) + ' 이미지 ' + (i + 1) + '" loading="lazy"></button>';
    }).join("") + '</div>' +
    '<nav class="p-next" aria-label="다른 프로젝트">' +
      '<a href="#work-' + prev.slug + '"><img src="' + prev.images[0] + '" alt="" loading="lazy"><span class="t"><span class="label">← Previous</span><h3>' + esc(prev.title) + '</h3></span></a>' +
      '<a class="nx" href="#work-' + next.slug + '"><img src="' + next.images[0] + '" alt="" loading="lazy"><span class="t"><span class="label">Next →</span><h3>' + esc(next.title) + '</h3></span></a>' +
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
        (f.image ? '<button type="button" class="media" data-i="' + i + '" aria-label="' + esc(f.nameKo) + ' 이미지 확대"><img src="' + f.image + '" alt="' + esc(f.nameKo) + '" loading="lazy"></button>' : '<div class="media">' + slot("", "fac-" + f.id + ".jpg", "1600 × 1000", f.nameKo) + '</div>') +
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
