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
    ["Brand Design", "브랜드 아이덴티티, 로고·CI", "로고와 컬러, 서체, 사용 규정까지 브랜드의 얼굴을 설계하고 매장과 인쇄물, 웹에 일관되게 적용합니다.", "Branding"],
    ["Editorial Design", "카탈로그, 브로슈어, 편집디자인", "정보가 많은 카탈로그도 읽기 쉬운 구조로 정리합니다. 인쇄 사양과 후가공까지 함께 설계합니다.", "Graphic & Print"],
    ["Web Design", "홈페이지, 반응형 웹", "기업 홈페이지와 브랜드 사이트를 기획부터 디자인, 반응형 구축까지 진행합니다.", "Web Design"],
    ["POP Design", "매장 내 판매촉진 광고물", "계산대, 매대, 진열장 앞에서 구매를 이끄는 POP를 기획하고 직접 제작합니다.", "POP & POSM"],
    ["POSM Design", "진열 및 판매촉진 제작물", "FSDU, 카운터 디스플레이, 쉘프 토퍼와 워블러까지 매장 운영 방식에 맞춰 설계합니다.", "POP & POSM"],
    ["Sign Design", "사인물, 옥내외 광고물", "채널 사인, 라이트박스, 안내 사인 체계까지 낮과 밤 모두에서 읽히는 사인을 만듭니다.", "Signage"],
    ["Interior Design", "상업공간 디자인 및 시공", "팝업 스토어와 쇼룸, 매장 인테리어를 설계부터 시공까지 한 팀이 책임집니다.", "Display & VMD"],
    ["Promotion Design", "각종 프로모션 디자인", "시즌 캠페인과 행사, 팝업까지 짧은 기간에 많은 매장으로 퍼지는 프로모션을 준비합니다.", "POP & POSM"]
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
  var tileIO = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.target.classList.toggle("live", e.isIntersecting); if (e.isIntersecting && e.target.classList.contains("pan")) setPan(e.target); });   // re-measure once visible (a cached image can be measured before layout)
  }, { rootMargin: "120px 0px" }) : null;
  function setPan(t) {
    var im = t.querySelector("img"); if (!im) return;
    var go = function () {
      if (!im.offsetHeight || !t.clientHeight) return;
      var d = im.offsetHeight - t.clientHeight, v = (d > 0 ? -d : 0) + "px";
      if (t.style.getPropertyValue("--pan") === v) return;
      t.style.setProperty("--pan", v);
      im.style.animation = "none"; void im.offsetWidth; im.style.animation = "";   // Safari keeps the old value inside a running animation, so restart it
    };
    go(); im.addEventListener("load", go, { once: true });
  }
  function watchTiles(root) {
    (root || document).querySelectorAll(".tile").forEach(function (t) {
      if (t.dataset.w) return; t.dataset.w = "1";
      if (tileIO) tileIO.observe(t); else t.classList.add("live");
      if (t.classList.contains("pan")) setPan(t);
    });
  }
  window.addEventListener("resize", function () { document.querySelectorAll(".tile.pan").forEach(setPan); });
  // endless rows (portfolio pictures on phones, partner logos): moved by script, so they keep running even when
  // the phone asks for reduced motion and Safari would freeze a CSS animation; off-screen rows are skipped
  var marqs = [], marqT = 0;
  function startMarq() {
    document.querySelectorAll(".m-track, .p-track").forEach(function (el) {
      if (el._mq) return;
      var rev = !!el.closest(".m-row.rev");
      el._mq = { x: 0, dir: rev ? -1 : 1, speed: el.classList.contains("p-track") ? 55 : 26, hover: false, start: rev };
      var host = el.closest(".partners");
      if (host && window.matchMedia("(hover: hover)").matches) {
        host.addEventListener("mouseenter", function () { el._mq.hover = true; });
        host.addEventListener("mouseleave", function () { el._mq.hover = false; });
      }
      if (el.classList.contains("m-track")) swipeRow(el);
      marqs.push(el);
    });
    if (!marqT) marqT = requestAnimationFrame(marqTick);
  }
  function wrapX(el, x) { var half = el.scrollWidth / 2; return half ? ((x % half) + half) % half : 0; }
  // picture rows can be dragged left/right; they glide on a little, then go back to the slow drift
  function swipeRow(el) {
    var m = el._mq, row = el.parentNode;
    row.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      m.drag = { x0: e.clientX, y0: e.clientY, mx: m.x, last: e.clientX, t: performance.now(), v: 0, moved: false }; m.vel = 0;
    });
    row.addEventListener("pointermove", function (e) {
      var d = m.drag; if (!d) return;
      var dx = e.clientX - d.x0;
      if (!d.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - d.y0)) d.moved = true;
      if (!d.moved) return;
      var now = performance.now(), dt = Math.max(1, now - d.t);
      d.v = .7 * d.v + .3 * ((e.clientX - d.last) / dt * 1000); d.last = e.clientX; d.t = now;
      m.x = wrapX(el, d.mx - dx);
      el.style.transform = "translate3d(" + (-m.x).toFixed(1) + "px,0,0)";
    });
    function end() {
      var d = m.drag; if (!d) return; m.drag = null;
      if (d.moved) { m.vel = Math.max(-2500, Math.min(2500, -d.v)); m.suppress = true; setTimeout(function () { m.suppress = false; }, 350); }
    }
    row.addEventListener("pointerup", end); row.addEventListener("pointercancel", end); row.addEventListener("pointerleave", end);
    // a drag is not a tap: don't show the caption or open the picture
    row.addEventListener("click", function (e) { if (m.suppress) { e.preventDefault(); e.stopPropagation(); m.suppress = false; } }, true);
  }
  var marqLast = 0;
  function marqTick(t) {
    var dt = marqLast ? Math.min(.05, (t - marqLast) / 1000) : 0; marqLast = t;
    marqs = marqs.filter(function (el) { return document.body.contains(el); });
    marqs.forEach(function (el) {
      var m = el._mq; if (m.hover) return;
      var r = el.parentNode.getBoundingClientRect();   // visibility checked directly every frame (no observer, which Safari can miss for very wide rows)
      if (!r.width || r.bottom < -80 || r.top > innerHeight + 80) return;
      if (!m.loaded) { m.loaded = true; el.querySelectorAll('img[loading="lazy"]').forEach(function (i) { i.loading = "eager"; }); }   // Safari skips lazy pictures inside a moving row
      if (m.drag) return;   // the finger is moving it
      var half = el.scrollWidth / 2; if (!half) return;
      if (m.start) { m.x = half / 2; m.start = false; }
      if (m.vel && Math.abs(m.vel) > 8) { m.x += m.vel * dt; m.vel *= Math.pow(.04, dt); }   // glide after a swipe
      else if (!el.querySelector(".tile.show")) { m.vel = 0; m.x += m.speed * dt * m.dir; }   // slow drift (held while a caption is open)
      m.x = ((m.x % half) + half) % half;
      el.style.transform = "translate3d(" + (-m.x).toFixed(1) + "px,0,0)";
    });
    marqT = marqs.length ? requestAnimationFrame(marqTick) : 0;
    if (!marqT) marqLast = 0;
  }
  function webIdx(p) { return D.projects.filter(function (q) { return q.category === "web"; }).indexOf(p); }   // staggers the web previews
  function tile(p, i) {
    var motion = p.category === "web" ? " pan" : (!p.cover && KB.indexOf(p.images[0]) >= 0 ? " kb" : "");   // curated covers stay still
    return '<a class="tile in' + motion + '" href="#work-' + p.slug + '" data-cat="' + p.category + '" style="animation-delay:' + ((i % 8) * 40) + 'ms">' +
      '<img src="' + (p.cover ? p.cover.replace("img/feat/", "img/thumb/feat-") : p.images[0].replace("img/work/", "img/thumb/")) + '" alt="' + esc(p.title) + '" loading="lazy" decoding="async"' + (p.category === "web" ? ' style="animation-delay:' + (webIdx(p) * 4.5) + 's"' : '') + '>' +
      '<span class="ov"><span class="label">' + esc(catLabel[p.category]) + '</span><h3>' + esc(p.title) + '</h3></span></a>';
  }
  // phones: an endless, slowly moving row of pictures (no captions, no gaps); dir 1 runs the other way
  function mrow(list, dir) {
    if (!list.length) return "";
    var set = list.slice(); while (set.length < 4) set = set.concat(list);
    return '<div class="m-row' + (dir ? ' rev' : '') + '"><div class="m-track" style="--dur:' + (set.length * 7) + 's">' + set.concat(set).map(tile).join("") + '</div></div>';
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
      '<div class="p-track"><span class="p-item"><img src="img/partners/samsung.png" alt="Samsung" style="height:31px"></span><span class="p-item"><img src="img/partners/sktelecom.png" alt="SK telecom" style="height:51px"></span><span class="p-item"><img src="img/partners/lottehimart.png" alt="롯데하이마트" style="height:33px"></span><span class="p-item"><img src="img/partners/lottealuminium.png" alt="롯데알미늄" style="height:38px"></span><span class="p-item"><img src="img/partners/dimchae.png" alt="딤채" style="height:47px"></span><span class="p-item"><img src="img/partners/philips.png" alt="Philips" style="height:35px"></span><span class="p-item"><img src="img/partners/canon.png" alt="Canon" style="height:40px"></span><span class="p-item"><img src="img/partners/lg.png" alt="LG전자" style="height:44px"></span><span class="p-item"><img src="img/partners/lguplus.png" alt="LG U+" style="height:43px"></span><span class="p-item"><img src="img/partners/hp.png" alt="HP" style="height:46px"></span><span class="p-item"><img src="img/partners/olympus.png" alt="Olympus" style="height:37px"></span><span class="p-item"><img src="img/partners/nespresso.png" alt="Nespresso" style="height:35px"></span><span class="p-item"><img src="img/partners/innisfree.png" alt="innisfree" style="height:60px"></span><span class="p-item"><img src="img/partners/thefaceshop.png" alt="The Face Shop" style="height:26px"></span><span class="p-item"><img src="img/partners/nhinvest.png" alt="NH투자증권" style="height:33px"></span><span class="p-item"><img src="img/partners/ibk.png" alt="IBK기업은행" style="height:47px"></span><span class="p-item"><img src="img/partners/hellomobile.png" alt="hello mobile" style="height:54px"></span><span class="p-item"><img src="img/partners/samsung.png" alt="Samsung" style="height:31px"></span><span class="p-item"><img src="img/partners/sktelecom.png" alt="SK telecom" style="height:51px"></span><span class="p-item"><img src="img/partners/lottehimart.png" alt="롯데하이마트" style="height:33px"></span><span class="p-item"><img src="img/partners/lottealuminium.png" alt="롯데알미늄" style="height:38px"></span><span class="p-item"><img src="img/partners/dimchae.png" alt="딤채" style="height:47px"></span><span class="p-item"><img src="img/partners/philips.png" alt="Philips" style="height:35px"></span><span class="p-item"><img src="img/partners/canon.png" alt="Canon" style="height:40px"></span><span class="p-item"><img src="img/partners/lg.png" alt="LG전자" style="height:44px"></span><span class="p-item"><img src="img/partners/lguplus.png" alt="LG U+" style="height:43px"></span><span class="p-item"><img src="img/partners/hp.png" alt="HP" style="height:46px"></span><span class="p-item"><img src="img/partners/olympus.png" alt="Olympus" style="height:37px"></span><span class="p-item"><img src="img/partners/nespresso.png" alt="Nespresso" style="height:35px"></span><span class="p-item"><img src="img/partners/innisfree.png" alt="innisfree" style="height:60px"></span><span class="p-item"><img src="img/partners/thefaceshop.png" alt="The Face Shop" style="height:26px"></span><span class="p-item"><img src="img/partners/nhinvest.png" alt="NH투자증권" style="height:33px"></span><span class="p-item"><img src="img/partners/ibk.png" alt="IBK기업은행" style="height:47px"></span><span class="p-item"><img src="img/partners/hellomobile.png" alt="hello mobile" style="height:54px"></span></div>' +
      '</section>' +
      '<div class="inner">' +
      '<div class="foot-contact">' +
        '<div><span class="label">Telephone</span><span class="v">' + esc(c.phone) + '</span></div>' +
        '<div><span class="label">Fax</span><span class="v">' + esc(c.fax) + '</span></div>' +
        '<div><span class="label">Studio & Factory</span><span class="v" style="font-family:var(--body);font-weight:500">' + esc(c.address) + '</span></div>' +
      '</div>' +
      '<div class="foot-bottom"><span class="logo"><span class="logo-word" style="font-size:16px">CHOUNGO <b>BLUE</b></span></span>' +
        
        '<span>© 2026 CHOUNGO BLUE</span></div>' +
    '</div>';
  }

  var facTimer = 0;
  function bindFacRot() {
    clearInterval(facTimer);
    var imgs = document.querySelectorAll(".fac-rot img"), rows = document.querySelectorAll(".fac-list li"), cur = 0, hold = false;
    if (!imgs.length) return;
    function show(i) { cur = i; imgs.forEach(function (im, k) { im.classList.toggle("on", k === i); }); rows.forEach(function (r, k) { r.classList.toggle("on", k === i); }); }
    rows.forEach(function (r) {
      r.addEventListener("mouseenter", function () { hold = true; show(+r.getAttribute("data-i")); });
      r.addEventListener("mouseleave", function () { hold = false; });
    });
    function restart() { clearInterval(facTimer); facTimer = setInterval(function () { if (!hold) show((cur + 1) % imgs.length); }, 3200); }
    restart();
    // swipe the picture left/right (or tap a row) to step through the machines quickly
    var box = document.querySelector(".fac-rot"), sx = null, sy = 0;
    box.addEventListener("pointerdown", function (e) { sx = e.clientX; sy = e.clientY; });
    function up(e) {
      if (sx === null) return; var dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
      if (Math.abs(dx) < 30 || Math.abs(dx) < Math.abs(dy)) return;
      show((cur + (dx < 0 ? 1 : -1) + imgs.length) % imgs.length); restart();
    }
    box.addEventListener("pointerup", up); box.addEventListener("pointercancel", function () { sx = null; });
    rows.forEach(function (r) { r.addEventListener("click", function () { show(+r.getAttribute("data-i")); restart(); }); });
  }
  /* ---------------- HOME ---------------- */
  var homeOrder = [], homeShown = 0;
  function home() {
    var webP = D.projects.filter(function (p) { return p.category === "web"; });
    var bySlug = {}; D.projects.forEach(function (p) { bySlug[p.slug] = p; });
    homeOrder = (window.CHOUNGO_FEATURED || []).map(function (s) { return bySlug[s]; }).filter(Boolean);
    webP.forEach(function (p, k) { homeOrder.splice(Math.min(homeOrder.length, k * 4), 0, p); });   // 3-column grid: slots 0, 4, 8 (diagonal, never side by side)
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
      '<div class="work-grid cols-3" id="homeGrid">' + homeOrder.slice(0, homeShown).map(tile).join("") +
        '<a class="tile tile-all" href="#portfolio"><span>View all<br>projects</span><i>' + D.projects.length + ' works →</i></a>' +
      '</div>' +
      '<div class="m-marq">' + mrow(homeOrder.filter(function (p, i) { return i % 2 === 0; }), 0) + mrow(homeOrder.filter(function (p, i) { return i % 2 === 1; }), 1) + '</div>' +
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
      '<div class="media fac-rot">' + D.facilities.map(function (f, i) { return '<img src="' + f.image + '" alt="' + esc(f.nameKo) + '"' + (i ? '' : ' class="on"') + '>'; }).join("") + '</div>' +
      '<div class="body inner">' +
        '<span class="label" style="color:var(--grey)">In-house production</span>' +
        '<h2 class="display">We build<br>what we design.</h2>' +
        '<p style="color:#a3a3a0;max-width:460px">샘플 하나부터 전국 매장 롤아웃까지. 자체 제작센터에서 출력, 가공, 조립을 직접 진행합니다.</p>' +
        '<ul class="eq-list fac-list">' + D.facilities.map(function (f, i) { return '<li data-i="' + i + '"' + (i ? '' : ' class="on"') + '><span>' + esc(f.name) + '</span><span>' + esc(f.nameKo) + '</span></li>'; }).join("") + '</ul>' +
        '<p><a class="link-arrow" href="#facilities">Facilities</a></p>' +
      '</div>' +
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
      watchTiles(grid);
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
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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
      var cur = cbG[cbCh], prv = cbPrev >= 0 ? cbG[cbPrev] : null, WHITE = "#ffffff", CYAN = "#095fe0";
      function colOf(ch) { return ch % 2 === 0 ? "#007fff" : WHITE; }   // chapters 1 and 3 in blue, 2 and 4 in white
      var CUR = colOf(cbCh), PRV = cbPrev >= 0 ? colOf(cbPrev) : WHITE;   // point colour on the navy hero
      function linesOf(g) { return g ? g[0].lines.concat(g[1].lines) : []; }
      function clipX(g, x0, x1, col) { ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, x1 - x0, H); ctx.clip(); drawText(g, "fill", col || CUR); ctx.restore(); }
      function both(fn) { fn(cur[0], 0); fn(cur[1], 1); }
      var INK = ["#ffe58a", "#ffb3cd", "#a9e7ff", "#ffcb9a", "#aef0c8", "#ffb4ab", "#e6f5a0", "#d6c8ff", "#ffd9a0", "#a8f2e6", "#f7c0f0", "#c4e3ff"];   // pastel ink, a different one for each letter
      function paint(g, gi, chap) { drawText(g, "fill", colOf(chap)); }
      function paintClip(g, gi, chap, x0, x1) { ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, x1 - x0, H); ctx.clip(); paint(g, gi, chap); ctx.restore(); }
      var kind = cbCh;
      if (kind === 0) {
        setFont(size); ctx.fillStyle = PRV;
        var Ln = linesOf(cur), Lo = linesOf(prv), del = prog(t, [.2, .9]), typ = prog(t, [1.0, 3.0]);
        var caret = null;
        if (t < 1.0 && Lo.length) {           // backspace the old copy from the end
          var tot = 0; Lo.forEach(function (l) { tot += l.text.length; });
          var keep = Math.round(tot * (1 - del));
          Lo.forEach(function (l) { var n = Math.max(0, Math.min(l.text.length, keep)); keep -= l.text.length;
            var tx = l.text.slice(0, n); ctx.fillText(tx, pad, l.y); if (n > 0 || !caret) caret = { x: pad + ctx.measureText(tx).width, y: l.y }; });
          if (del >= 1) caret = { x: pad, y: Lo[0].y };
        } else {                               // type the new copy
          ctx.fillStyle = CUR;
          var totN = 0; Ln.forEach(function (l) { totN += l.text.length; });
          var shown = Math.floor(totN * typ);
          Ln.forEach(function (l) { var n = Math.max(0, Math.min(l.text.length, shown)); shown -= l.text.length;
            var tx = l.text.slice(0, n); ctx.fillText(tx, pad, l.y); if (n > 0 || !caret) caret = { x: pad + ctx.measureText(tx).width, y: l.y }; });
        }
        if (caret && (t < 3.0 || Math.sin(t * 6) > 0)) { ctx.fillStyle = CUR === WHITE ? CYAN : WHITE; ctx.fillRect(caret.x + size * .04, caret.y - size * .78, Math.max(3, size * .05), size * .84); }
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
        // select the old copy -> it is deleted -> the corner is dragged out and the new copy appears as a picture (a plate)
        // -> the pen tool traces each letter -> the plate around the letters is cut away and only the letters stay
        var T_IN = .3, T_DRAG = 1.0, T_DEL = 1.7, T_GROW = 2.4, T_PEN = 2.7, T_A = 3.6, T_B = 4.5, T_BK = 4.55, T_CLICK = 4.95, T_FILL = 5.5, T_END = 5.9;   // select → blur → paths over the faint copy → paint bucket fills 100%
        // blurred copy: the letters are drawn small and scaled back up (a real soft blur, works in Safari too), cached per copy
        function offFont(x) { x.font = ctx.font; if ("fontStretch" in x) x.fontStretch = "condensed"; x.textBaseline = "alphabetic"; }
        function blurImg(gs, col) {
          var key = col + W + "x" + H + "@" + size;
          if (gs[0]._bk === key) return gs[0]._bi;
          var f = Math.max(6, size / 22), c = document.createElement("canvas");
          c.width = Math.ceil(W / f); c.height = Math.ceil(H / f);
          var x = c.getContext("2d"); setFont(size); offFont(x); x.scale(1 / f, 1 / f); x.fillStyle = col;
          gs.forEach(function (g) { g.lines.forEach(function (l) { x.fillText(l.text, pad, l.y); }); });
          // smooth the small image (two box-blur passes on the alpha) so the scaled-up blur has no steps
          var cw = c.width, chh = c.height, id = x.getImageData(0, 0, cw, chh), d = id.data, tmp = new Float32Array(cw * chh), al = new Float32Array(cw * chh), i, j, q, sum;
          for (i = 0; i < cw * chh; i++) al[i] = d[i * 4 + 3];
          for (var pass = 0; pass < 2; pass++) {
            for (j = 0; j < chh; j++) for (i = 0; i < cw; i++) { sum = 0; for (q = -1; q <= 1; q++) sum += al[j * cw + Math.min(cw - 1, Math.max(0, i + q))]; tmp[j * cw + i] = sum / 3; }
            for (j = 0; j < chh; j++) for (i = 0; i < cw; i++) { sum = 0; for (q = -1; q <= 1; q++) sum += tmp[Math.min(chh - 1, Math.max(0, j + q)) * cw + i]; al[j * cw + i] = sum / 3; }
          }
          var rgb = col === "#ffffff" || col === "#fff" ? [255, 255, 255] : [parseInt(col.slice(1, 3), 16), parseInt(col.slice(3, 5), 16), parseInt(col.slice(5, 7), 16)];
          for (i = 0; i < cw * chh; i++) { d[i * 4] = rgb[0]; d[i * 4 + 1] = rgb[1]; d[i * 4 + 2] = rgb[2]; d[i * 4 + 3] = al[i]; }
          x.putImageData(id, 0, 0);
          gs[0]._bk = key; gs[0]._bi = c; return c;
        }
        function haze(gs, col, amount) {
          if (amount <= 0) return;
          ctx.save(); ctx.globalAlpha = .35 * amount; ctx.imageSmoothingEnabled = true; if ("imageSmoothingQuality" in ctx) ctx.imageSmoothingQuality = "high";
          ctx.drawImage(blurImg(gs, col), 0, 0, W, H); ctx.restore();
        }
        var PATH = "#095fe0";
        var lw = Math.max(1.5, size / 80);
        var oX0 = pad, oY0 = prv ? prv[0].top : cur[0].top, oX1 = pad + (prv ? Math.max(prv[0].width, prv[1].width) : 40), oY1 = prv ? prv[1].bottom : cur[1].bottom;
        var nX0 = pad - size * .06, nY0 = cur[0].top - size * .05, nX1 = pad + Math.max(cur[0].width, cur[1].width) + size * .06, nY1 = cur[1].bottom + size * .06;   // tighter plate, stays clear of the line above
        var sx0 = oX1 + 30, sy0 = oY1 + 30;
        function outlinePts(g) {
          var key = W + "@" + size; if (g._pk === key) return g._pts;
          var pts = [], inkPts = [], oy = Math.ceil(size * 1.0), h = Math.ceil(size * 1.25), w = Math.ceil(W), c = document.createElement("canvas");
          c.width = w; c.height = h; var x = c.getContext("2d"); setFont(size); offFont(x);
          g.lines.forEach(function (l) {
            x.clearRect(0, 0, w, h); x.fillStyle = "#000"; x.fillText(l.text, pad, oy);
            var d = x.getImageData(0, 0, w, h).data;
            function ink(cx, cy) { return d[(cy * w + cx) * 4 + 3] > 140; }
            for (var ci = 0; ci < l.text.length; ci++) {
              if (l.text[ci] === " ") continue;
              var c0 = Math.max(0, Math.floor(pad + x.measureText(l.text.slice(0, ci)).width)), c1 = Math.min(w - 1, Math.ceil(pad + x.measureText(l.text.slice(0, ci + 1)).width));
              var top = -1, bot = -1, lef = -1, rig = -1, r, k;
              for (r = 0; r < h && top < 0; r++) for (k = c0; k < c1; k++) if (ink(k, r)) { top = r; break; }
              if (top < 0) continue;
              for (r = h - 1; r >= 0 && bot < 0; r--) for (k = c0; k < c1; k++) if (ink(k, r)) { bot = r; break; }
              for (k = c0; k < c1 && lef < 0; k++) for (r = top; r <= bot; r++) if (ink(k, r)) { lef = k; break; }
              for (k = c1 - 1; k >= c0 && rig < 0; k--) for (r = top; r <= bot; r++) if (ink(k, r)) { rig = k; break; }
              function runX(row) { var a = -1, b = -1; for (var q = c0; q < c1; q++) if (ink(q, row)) { if (a < 0) a = q; b = q; } return (a + b) / 2; }
              function runY(col) { var a = -1, b = -1; for (var q = top; q <= bot; q++) if (ink(col, q)) { if (a < 0) a = q; b = q; } return (a + b) / 2; }
              var dy = l.y - oy;
              pts.push([runX(top), top + dy], [runX(bot), bot + 1 + dy], [lef, runY(lef) + dy], [rig + 1, runY(rig) + dy]);
              var mr = Math.round(top + (bot - top) * .55), bs = -1, bl = 0, rs = -1;   // a point inside the letter's ink (for the paint bucket)
              for (var q = c0; q <= c1; q++) { if (q < c1 && ink(q, mr)) { if (rs < 0) rs = q; } else if (rs >= 0) { if (q - rs > bl) { bl = q - rs; bs = rs; } rs = -1; } }
              if (bs >= 0) inkPts.push([bs + bl / 2, mr + dy]);
            }
          });
          g._pk = key; g._pts = pts; g._ink = inkPts; return pts;
        }
        function anchorsFor(g, x0, x1) {
          ctx.fillStyle = "#fff"; ctx.strokeStyle = PATH; ctx.lineWidth = 1.5;
          outlinePts(g).forEach(function (p) { if (p[0] < x0 || p[0] > x1) return; ctx.fillRect(p[0] - 3.5, p[1] - 3.5, 7, 7); ctx.strokeRect(p[0] - 3.5, p[1] - 3.5, 7, 7); });
        }
        // marching-ants selection (area only, no fill)
        function ants(x0, y0, x1, y1, al) {
          ctx.save(); ctx.globalAlpha = al; ctx.lineWidth = 1.2;
          ctx.strokeStyle = "#000055"; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
          ctx.setLineDash([6, 5]); ctx.lineDashOffset = -t * 18; ctx.strokeStyle = "#ffffff"; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
          ctx.restore();
        }
        // paint bucket cursor (hotspot = tip of the drip)
        function bucket(x, y) {
          ctx.save(); ctx.translate(x, y); ctx.scale(1.3, 1.3); ctx.lineWidth = 1.4; ctx.strokeStyle = "#000055"; ctx.fillStyle = "#fff";
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-3, -5, 0, -9); ctx.quadraticCurveTo(3, -5, 0, 0); ctx.fill(); ctx.stroke();   // drip
          ctx.translate(13, -17); ctx.rotate(-.75);
          ctx.beginPath(); ctx.moveTo(-9, -7); ctx.lineTo(9, -7); ctx.lineTo(7, 9); ctx.lineTo(-7, 9); ctx.closePath(); ctx.fill(); ctx.stroke();   // body
          ctx.beginPath(); ctx.ellipse(0, -7, 9, 2.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();   // mouth
          ctx.lineWidth = 2; ctx.strokeStyle = "#fff"; ctx.beginPath(); ctx.arc(0, -7, 11, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();   // handle
          ctx.restore();
        }
        if (t < T_DEL) {
          // 1) marquee-select the old copy, it goes soft
          var soft = ease(prog(t, [T_DRAG + .1, T_DEL]));
          if (prv) {
            ctx.globalAlpha = 1 - soft; drawText(prv[0], "fill", PRV); drawText(prv[1], "fill", PRV); ctx.globalAlpha = 1;
            haze([prv[0], prv[1]], PRV, Math.min(1, soft * 3));
          }
          var dp = ease(prog(t, [T_IN, T_DRAG])), cxp = sx0 + (oX0 - 20 - sx0) * dp, cyp = sy0 + (oY0 - 20 - sy0) * dp;
          if (t > T_IN && t < T_DRAG) ants(cxp, cyp, sx0, sy0, 1);
          if (t >= T_DRAG) ants(oX0 - 12, oY0 - 12, oX1 + 12, oY1 + 12, 1);
          var mv = ease(prog(t, [0, T_IN]));
          arrow(t < T_IN ? W * .7 + (sx0 - W * .7) * mv : (t < T_DRAG ? cxp : oX1 + 12), t < T_IN ? H * .95 + (sy0 - H * .95) * mv : (t < T_DRAG ? cyp : oY1 + 12));
        } else {
          // 2) the selection is dragged out; the blurred old copy turns into the blurred, faint new copy
          var gp = ease(prog(t, [T_DEL, T_GROW]));
          var bx0 = oX0 - 12 + (nX0 - oX0) * gp, by0 = oY0 - 12 + (nY0 - oY0) * gp, bx1 = oX1 + 12 + (nX1 - oX1) * gp, by1 = oY1 + 12 + (nY1 - oY1) * gp;
          var fill = ease(prog(t, [T_CLICK, T_FILL])), pathA = 1 - ease(prog(t, [T_FILL, T_END]));
          var kx = pad + cur[0].width * .32, ky = (cur[0].top + cur[0].bottom) / 2;   // where the bucket clicks: on a letter, not in the gap between letters
          outlinePts(cur[0]); (cur[0]._ink || []).reduce(function (best, p) { var d = Math.abs(p[0] - (pad + cur[0].width * .32)); if (d < best) { kx = p[0]; ky = p[1]; return d; } return best; }, 1e9);
          var kR = fill * Math.hypot(Math.max(kx - nX0, nX1 - kx), Math.max(ky - nY0, nY1 - ky));
          ctx.save();
          if (fill > 0) { ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(kx, ky, kR, 0, Math.PI * 2); ctx.clip("evenodd"); }
          if (prv) haze([prv[0], prv[1]], PRV, 1 - gp);
          haze([cur[0], cur[1]], CUR, gp);
          ctx.restore();
          // 4) paint bucket: 100% colour floods out from the click
          if (fill > 0) { ctx.save(); ctx.beginPath(); ctx.arc(kx, ky, kR, 0, Math.PI * 2); ctx.clip(); drawText(cur[0], "fill", CUR); drawText(cur[1], "fill", CUR); ctx.restore(); }
          var antA = 1 - ease(prog(t, [T_GROW + .05, T_PEN])); if (antA > 0) ants(bx0, by0, bx1, by1, antA);   // selection goes away before the pen starts
          if (t < T_GROW + .15) arrow(bx1, by1);
          // 3) pen tool traces every letter over the faint blur (no fill yet)
          var penX = null, penY = null;
          [[0, T_PEN, T_A], [1, T_A, T_B]].forEach(function (d) {
            var g = cur[d[0]], pp = ease(prog(t, [d[1], d[2]])), ox = pad - 6 + (g.width + 12) * pp;
            if (pp <= 0 || pathA <= 0) return;
            ctx.save(); ctx.globalAlpha = pathA; ctx.beginPath(); ctx.rect(0, 0, ox, H); ctx.clip();
            ctx.lineWidth = lw; ctx.strokeStyle = PATH; drawText(g, "stroke"); ctx.restore();
            ctx.save(); ctx.globalAlpha = pathA; anchorsFor(g, pad - 10, ox); ctx.restore();
            if (pp < 1) { penX = ox; penY = g.top + (g.bottom - g.top) * (.5 + .35 * Math.sin(t * 9)); }
          });
          if (penX !== null) penIcon(penX, penY);
          if (t >= T_BK && t < T_FILL + .2) {
            var bm = ease(prog(t, [T_BK, T_CLICK])), sx = pad + cur[1].width + 20, sy = (cur[1].top + cur[1].bottom) / 2;
            var dip = t > T_CLICK && t < T_CLICK + .12 ? 3 : 0;
            bucket(sx + (kx - sx) * bm, sy + (ky - sy) * bm + dip);
          }
        }
      } else {
        var A0 = cur[0], B0 = cur[1], O0 = prv ? prv[0] : null, O1 = prv ? prv[1] : null;
        if (kind === 2) {
          // print: the screen holds the new copy as a pale stencil; one slow squeegee pull leaves solid ink behind it
          var L = pad - 26, eM = pad + Math.max(A0.width, B0.width, O0 ? O0.width : 0, O1 ? O1.width : 0) + 26;
          var vS = (eM - L) / 3.1, x = t < .5 ? L : L + vS * (t - .5), sweeping = t > .5 && x < W + 50;   // one steady speed, straight off the screen
          var top = A0.top + size * .04, bot = B0.bottom - size * .02;
          var STENCIL = "rgba(255,255,255,.2)";
          if (t < .5 && prv) both(function (g, i) { drawText(prv[i], "fill", PRV); });
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
            if (finished) { drawText(g, "fill", CUR); return; }
            clipX(g, 0, cut[gi]);                                  // cut letters: new copy
            if (t >= T0 || !prv) {                                  // not yet reached: nothing (the laser writes onto an empty field)
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
    var heroOn = true, heroEl2 = document.getElementById("hero");
    if ("IntersectionObserver" in window && heroEl2) new IntersectionObserver(function (es) { heroOn = es[0].isIntersecting; }).observe(heroEl2);
    function loop(now) {
      if (!heroOn || document.hidden) { last = now; heroRAF = requestAnimationFrame(loop); return; }   // nothing to draw while the hero is off screen
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
  // portfolio page order: shuffled once per visit, so new work can simply be added anywhere in data.js
  var plist = null;
  // look-alike work (posters, web pages) never sits next to or right under another one, in 1-, 2- or 3-column layouts
  function lookKey(p) { return p.type === "POSTER" ? "poster" : p.category === "web" ? "web" : ""; }
  function spread(list, colsList) {
    var out = [], rest = list.slice();
    function ok(p, pos) {
      var k = lookKey(p); if (!k) return true;
      return colsList.every(function (c) {
        var n = [pos - c]; if (pos % c) n.push(pos - 1);
        return n.every(function (q) { return q < 0 || lookKey(out[q]) !== k; });
      });
    }
    var forced = false;
    while (rest.length) { var i = 0; while (i < rest.length && !ok(rest[i], out.length)) i++; if (i === rest.length) { i = 0; forced = true; } out.push(rest.splice(i, 1)[0]); }
    out.forced = forced;
    return out;
  }
  function portfolio() {
    for (var tries = 0; !plist || (plist.forced && tries < 40); tries++) {   // reshuffle until nothing look-alike touches
      plist = D.projects.slice(); for (var i = plist.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = plist[i]; plist[i] = plist[j]; plist[j] = t; }
      plist = spread(plist, [1, 2, 3]);
    }
    var counts = { all: D.projects.length };
    D.projects.forEach(function (p) { counts[p.category] = (counts[p.category] || 0) + 1; });
    var btns = [{ id: "all", label: "All" }].concat(D.categories).map(function (c) {
      return '<button type="button" data-f="' + c.id + '" aria-pressed="' + (c.id === currentFilter) + '">' + esc(c.label) + '<sup>' + (counts[c.id] || 0) + '</sup></button>';
    }).join("");
    return '' +
    '<section class="page-head inner">' +
      '<span class="label" style="color:var(--grey)">Selected work</span>' +
      '<h1 class="display" style="margin-top:20px">Our<br>portfolio.</h1>' +
      '<div class="row"><span></span><p>브랜드 홈페이지부터 매장 POP, 인쇄물, 디스플레이, 사인까지. 기획하고 디자인한 것을 직접 만들어 현장에 세운 작업들입니다.</p></div>' +
    '</section>' +
    '<div class="portfolio-bar inner"><div class="filters" id="filters" role="group" aria-label="카테고리 필터">' + btns + '</div>' +
      '<span class="note-sample">' + D.projects.length + ' projects</span></div>' +
    '<div class="work-grid cols-3" id="pgrid">' + plist.map(tile).join("") + '</div>' +
    // phones: one swipeable row per category, so each category takes about one screen
    '<div class="pgroups">' + (function () { var gi = 0; return D.categories.map(function (c) {
      var list = spread(plist.filter(function (p) { return p.category === c.id; }), [1]);
      if (!list.length) return "";
      return '<section class="pgroup"><div class="pg-head inner"><h3>' + esc(c.label) + '</h3><span>' + list.length + ' works</span></div>' +
        mrow(list, gi++ % 2) + '</section>';
    }).join(""); })() + '</div>' +
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
    '<div class="fac-band">' + slot("img/fac/facilities-top.jpg", "facilities-top.jpg", "2400 × 1050", "제작센터") + '</div>' +
    '<section class="fac-wrap">' + D.facilities.map(function (f, i) {
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
      '<h1 class="display" style="margin-top:20px">Let’s talk.<br>Let’s make it.</h1>' +
      '<div class="row"><span></span><p>아직 정리되지 않은 아이디어도 괜찮습니다. 일정과 예산, 수량을 알려주시면 디자인부터 제작, 설치까지 맞는 방법을 함께 제안드립니다.</p></div>' +
    '</section>' +
    '<section class="section inner"><div class="contact-grid">' +
      '<div class="contact-info"><p style="font-size:18px;max-width:420px">프로젝트 개요와 일정, 예상 수량을 알려주시면 영업일 기준 1–2일 안에 담당자가 연락드립니다.</p>' +
        '<dl><div><dt class="label">Telephone</dt><dd>' + esc(c.phone) + '</dd></div>' +
        '<div><dt class="label">Fax</dt><dd>' + esc(c.fax) + '</dd></div>' +
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
  var lbList = [], lbI = 0, lbLast = null, lbProjects = [];
  function lbShow(n, instant) {
    lbI = (n + lbList.length) % lbList.length;
    var go = function () {
      lbImg.src = lbList[lbI];
      if (lbProjects.length === lbList.length && lbProjects[lbI]) document.getElementById("lbTitle").textContent = lbProjects[lbI].title;
      document.getElementById("lbCount").textContent = pad(lbI + 1) + " / " + pad(lbList.length);
      lbImg.classList.remove("swap");
    };
    if (instant) go(); else { lbImg.classList.add("swap"); setTimeout(go, 180); }
  }
  function openLB(list, i, title, projects) {
    lbList = list; lbProjects = projects || []; lbLast = document.activeElement;
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
  // portfolio tiles open the images in the viewer instead of a full detail page
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest('a.tile[href^="#work-"]');
    if (!t) return;
    var slug = t.getAttribute("href").slice(6), p = D.projects.filter(function (q) { return q.slug === slug; })[0];
    if (!p) return;
    e.preventDefault();
    // touch screens, moving rows: the first tap shows the title on the picture, the second opens it
    if (t.closest(".m-row") && !t.classList.contains("show")) {
      document.querySelectorAll(".m-row .tile.show").forEach(function (x) { x.classList.remove("show"); });
      t.classList.add("show"); clearTimeout(t._sh); t._sh = setTimeout(function () { t.classList.remove("show"); }, 3500);
      return;
    }
    // arrows step through the projects shown in this grid (one picture each), not inside one project
    var grid = t.parentNode, tiles = Array.prototype.slice.call(grid.querySelectorAll('a.tile[href^="#work-"]')).filter(function (x) { return !x.hidden && x.offsetParent !== null; });
    if (!tiles.length) tiles = [t];
    lbProjects = tiles.map(function (x) { var sl = x.getAttribute("href").slice(6); return D.projects.filter(function (q) { return q.slug === sl; })[0]; }).filter(function (q, k, a) { return q && a.indexOf(q) === k; });
    var idx = lbProjects.indexOf(p); if (idx < 0) { lbProjects = [p]; idx = 0; }
    openLB(lbProjects.map(function (q) { return q.cover || q.images[0]; }), idx, p.title, lbProjects);
  });
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

  /* logo or menu link to the page you are already on: glide back to the top instead of doing nothing */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || a.closest("#mobileMenu")) return;
    var target = a.getAttribute("href"), here = location.hash || "#home";
    if (target === here || (target === "#home" && (here === "#" || here === ""))) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
  // tapped item turns blue first, then the page changes
  mm.querySelectorAll("nav a").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var href = a.getAttribute("href");
      a.classList.add("tapped");
      setTimeout(function () { setMenu(false); a.classList.remove("tapped"); if (href === (location.hash || "#home")) window.scrollTo({ top: 0, behavior: "smooth" }); else location.hash = href; }, 320);
    });
  });

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
      if (R.r === "home") { startHero(); bindHomeGrid(); bindFacRot(); }
      if (R.r === "portfolio") bindPortfolio();
      watchTiles(document.getElementById("view"));
      startMarq();
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
  var scrollT = null;   // switch hover effects off while scrolling, back on shortly after
  window.addEventListener("scroll", function () {
    if (!scrollT) document.body.classList.add("scrolling");
    clearTimeout(scrollT); scrollT = setTimeout(function () { document.body.classList.remove("scrolling"); scrollT = null; }, 140);
  }, { passive: true });
  render(true);
})();
