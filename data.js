/* ==========================================================================
   PLINTH — 사이트 콘텐츠 데이터
   --------------------------------------------------------------------------
   홈페이지의 포트폴리오·장비·연락처 정보는 모두 이 파일 하나에서 관리합니다.
   · 포트폴리오 순서 = projects 배열의 순서 (위에 있을수록 먼저 노출)
   · 메인 화면에는 전체 프로젝트 중 16개가 무작위로 노출되고, '더 보기'로 8개씩 추가
   · images: 첫 번째 이미지가 대표(썸네일) 이미지, 여러 장 등록 가능
   · category 값은 아래 categories 의 id 중 하나
   ========================================================================== */
window.PLINTH_DATA = {
  company: {
    name: "PLINTH",
    descriptor: "Creative Production",
    slogan: "Designed here. Built here.",
    phone: "02-0000-0000",
    email: "hello@plinth.example",
    address: "서울 (디자인 스튜디오) · 경기도 파주시 (제작센터)",
    hours: "평일 09:00 – 18:00"
  },

  categories: [
    { id: "pop", label: "POP & POSM" },
    { id: "print", label: "Graphic & Print" },
    { id: "display", label: "Display & VMD" },
    { id: "signage", label: "Signage" }
  ],

  projects: [
    {"slug": "w9", "title": "삼성전자 기어 웨어러블", "client": "삼성전자", "category": "pop", "type": "POP", "scope": ["POP 디자인", "구조 설계", "제작"], "description": "매장 판매대에서 제품의 기능을 바로 보여주는 POP 집기입니다. 그래픽과 구조를 함께 설계하고 자체 제작센터에서 제작했습니다.", "images": ["img/work/p09-0.jpg", "img/work/p10-0.jpg"]},
    {"slug": "w11", "title": "삼성전자 갤럭시 탭 S4", "client": "삼성전자", "category": "pop", "type": "POP", "scope": ["POP 디자인", "구조 설계", "제작"], "description": "매장 판매대에서 제품의 기능을 바로 보여주는 POP 집기입니다. 그래픽과 구조를 함께 설계하고 자체 제작센터에서 제작했습니다.", "images": ["img/work/p11-0.jpg", "img/work/p11-1.jpg", "img/work/p11-2.jpg"]},
    {"slug": "w12", "title": "삼성전자 갤럭시 S8 · 노트", "client": "삼성전자", "category": "pop", "type": "POP", "scope": ["POP 디자인", "구조 설계", "제작"], "description": "매장 판매대에서 제품의 기능을 바로 보여주는 POP 집기입니다. 그래픽과 구조를 함께 설계하고 자체 제작센터에서 제작했습니다.", "images": ["img/work/p12-0.jpg"]},
    {"slug": "w13", "title": "삼성전자 갤럭시 워치", "client": "삼성전자", "category": "pop", "type": "POP", "scope": ["POP 디자인", "구조 설계", "제작"], "description": "매장 판매대에서 제품의 기능을 바로 보여주는 POP 집기입니다. 그래픽과 구조를 함께 설계하고 자체 제작센터에서 제작했습니다.", "images": ["img/work/p13-0.jpg"]},
    {"slug": "w14", "title": "삼성전자 냉장고", "client": "삼성전자", "category": "pop", "type": "POP", "scope": ["POP 디자인", "구조 설계", "제작"], "description": "매장 판매대에서 제품의 기능을 바로 보여주는 POP 집기입니다. 그래픽과 구조를 함께 설계하고 자체 제작센터에서 제작했습니다.", "images": ["img/work/p15-1.jpg", "img/work/p14-0.jpg", "img/work/p14-1.jpg", "img/work/p14-2.jpg", "img/work/p15-0.jpg"]},
    {"slug": "w16", "title": "삼성전자 김치냉장고", "client": "삼성전자", "category": "pop", "type": "POP", "scope": ["POP 디자인", "구조 설계", "제작"], "description": "매장 판매대에서 제품의 기능을 바로 보여주는 POP 집기입니다. 그래픽과 구조를 함께 설계하고 자체 제작센터에서 제작했습니다.", "images": ["img/work/p16-0.jpg", "img/work/p16-1.jpg", "img/work/p17-0.jpg", "img/work/p17-1.jpg", "img/work/p18-0.jpg"]},
    {"slug": "w19", "title": "삼성전자 세탁기 · 건조기", "client": "삼성전자", "category": "pop", "type": "POP", "scope": ["POP 디자인", "구조 설계", "제작"], "description": "매장 판매대에서 제품의 기능을 바로 보여주는 POP 집기입니다. 그래픽과 구조를 함께 설계하고 자체 제작센터에서 제작했습니다.", "images": ["img/work/p19-0.jpg"]},
    {"slug": "w20", "title": "삼성전자 세탁기", "client": "삼성전자", "category": "pop", "type": "POP", "scope": ["POP 디자인", "구조 설계", "제작"], "description": "매장 판매대에서 제품의 기능을 바로 보여주는 POP 집기입니다. 그래픽과 구조를 함께 설계하고 자체 제작센터에서 제작했습니다.", "images": ["img/work/p21-2.jpg", "img/work/p20-0.jpg", "img/work/p20-1.jpg", "img/work/p21-0.jpg", "img/work/p21-1.jpg"]},
    {"slug": "w22", "title": "삼성전자 TV", "client": "삼성전자", "category": "pop", "type": "POP", "scope": ["POP 디자인", "구조 설계", "제작"], "description": "매장 판매대에서 제품의 기능을 바로 보여주는 POP 집기입니다. 그래픽과 구조를 함께 설계하고 자체 제작센터에서 제작했습니다.", "images": ["img/work/p22-0.jpg", "img/work/p22-1.jpg", "img/work/p23-0.jpg", "img/work/p24-0.jpg", "img/work/p25-0.jpg"]},
    {"slug": "w26", "title": "삼성전자 에어컨", "client": "삼성전자", "category": "pop", "type": "POP", "scope": ["POP 디자인", "구조 설계", "제작"], "description": "매장 판매대에서 제품의 기능을 바로 보여주는 POP 집기입니다. 그래픽과 구조를 함께 설계하고 자체 제작센터에서 제작했습니다.", "images": ["img/work/p27-0.jpg", "img/work/p26-0.jpg", "img/work/p26-1.jpg", "img/work/p26-2.jpg", "img/work/p28-0.jpg"]},
    {"slug": "w29", "title": "삼성전자 청소기", "client": "삼성전자", "category": "pop", "type": "POP", "scope": ["POP 디자인", "구조 설계", "제작"], "description": "매장 판매대에서 제품의 기능을 바로 보여주는 POP 집기입니다. 그래픽과 구조를 함께 설계하고 자체 제작센터에서 제작했습니다.", "images": ["img/work/p30-0.jpg", "img/work/p29-0.jpg", "img/work/p29-1.jpg", "img/work/p29-2.jpg", "img/work/p30-1.jpg"]},
    {"slug": "w31", "title": "삼성전자 전기레인지", "client": "삼성전자", "category": "pop", "type": "POP", "scope": ["POP 디자인", "구조 설계", "제작"], "description": "매장 판매대에서 제품의 기능을 바로 보여주는 POP 집기입니다. 그래픽과 구조를 함께 설계하고 자체 제작센터에서 제작했습니다.", "images": ["img/work/p31-0.jpg", "img/work/p31-1.jpg"]},
    {"slug": "w32", "title": "삼성전자 모바일 포토프린터", "client": "삼성전자", "category": "pop", "type": "POP", "scope": ["POP 디자인", "구조 설계", "제작"], "description": "매장 판매대에서 제품의 기능을 바로 보여주는 POP 집기입니다. 그래픽과 구조를 함께 설계하고 자체 제작센터에서 제작했습니다.", "images": ["img/work/p32-0.jpg", "img/work/p32-1.jpg"]},
    {"slug": "w33", "title": "삼성전자 스마트빔", "client": "삼성전자", "category": "pop", "type": "POP", "scope": ["POP 디자인", "구조 설계", "제작"], "description": "매장 판매대에서 제품의 기능을 바로 보여주는 POP 집기입니다. 그래픽과 구조를 함께 설계하고 자체 제작센터에서 제작했습니다.", "images": ["img/work/p33-0.jpg"]},
    {"slug": "w34", "title": "삼성전자 노트북", "client": "삼성전자", "category": "pop", "type": "POP", "scope": ["POP 디자인", "구조 설계", "제작"], "description": "매장 판매대에서 제품의 기능을 바로 보여주는 POP 집기입니다. 그래픽과 구조를 함께 설계하고 자체 제작센터에서 제작했습니다.", "images": ["img/work/p34-0.jpg", "img/work/p34-1.jpg", "img/work/p35-0.jpg", "img/work/p35-2.jpg"]},
    {"slug": "w36", "title": "캐논 디지털 카메라", "client": "캐논", "category": "pop", "type": "POP", "scope": ["POP 디자인", "구조 설계", "제작"], "description": "매장 판매대에서 제품의 기능을 바로 보여주는 POP 집기입니다. 그래픽과 구조를 함께 설계하고 자체 제작센터에서 제작했습니다.", "images": ["img/work/p37-0.jpg", "img/work/p36-0.jpg", "img/work/p36-1.jpg"]},
    {"slug": "w38", "title": "필립스 핸드블렌더 진열대", "client": "필립스", "category": "pop", "type": "POP", "scope": ["POP 디자인", "구조 설계", "제작"], "description": "매장 판매대에서 제품의 기능을 바로 보여주는 POP 집기입니다. 그래픽과 구조를 함께 설계하고 자체 제작센터에서 제작했습니다.", "images": ["img/work/p38-0.jpg"]},
    {"slug": "w39", "title": "딤채 전기밥솥", "client": "딤채", "category": "pop", "type": "POP", "scope": ["POP 디자인", "구조 설계", "제작"], "description": "매장 판매대에서 제품의 기능을 바로 보여주는 POP 집기입니다. 그래픽과 구조를 함께 설계하고 자체 제작센터에서 제작했습니다.", "images": ["img/work/p39-1.jpg", "img/work/p39-0.jpg"]},
    {"slug": "w40", "title": "스타벅스 플래너 진열대", "client": "스타벅스", "category": "pop", "type": "POP", "scope": ["POP 디자인", "구조 설계", "제작"], "description": "매장 판매대에서 제품의 기능을 바로 보여주는 POP 집기입니다. 그래픽과 구조를 함께 설계하고 자체 제작센터에서 제작했습니다.", "images": ["img/work/p40-0.jpg"]},
    {"slug": "w42", "title": "삼성전자 세탁기 · 건조기 진열 집기", "client": "삼성전자", "category": "pop", "type": "POSM", "scope": ["POSM 디자인", "진열 집기", "제작 · 설치"], "description": "제품 진열과 판매 촉진을 위한 매장용 제작물입니다. 매장 환경에 맞춰 크기와 구조를 정하고 제작부터 설치까지 진행했습니다.", "images": ["img/work/p42-0.jpg"]},
    {"slug": "w43", "title": "삼성전자 포터블 SSD 런칭", "client": "삼성전자", "category": "pop", "type": "POSM", "scope": ["POSM 디자인", "진열 집기", "제작 · 설치"], "description": "제품 진열과 판매 촉진을 위한 매장용 제작물입니다. 매장 환경에 맞춰 크기와 구조를 정하고 제작부터 설치까지 진행했습니다.", "images": ["img/work/p43-1.jpg", "img/work/p43-0.jpg"]},
    {"slug": "w44", "title": "삼성전자 청소기 진열 집기", "client": "삼성전자", "category": "pop", "type": "POSM", "scope": ["POSM 디자인", "진열 집기", "제작 · 설치"], "description": "제품 진열과 판매 촉진을 위한 매장용 제작물입니다. 매장 환경에 맞춰 크기와 구조를 정하고 제작부터 설치까지 진행했습니다.", "images": ["img/work/p44-0.jpg", "img/work/p44-1.jpg", "img/work/p44-2.jpg"]},
    {"slug": "w45", "title": "삼성전자 기어 런칭", "client": "삼성전자", "category": "pop", "type": "POSM", "scope": ["POSM 디자인", "진열 집기", "제작 · 설치"], "description": "제품 진열과 판매 촉진을 위한 매장용 제작물입니다. 매장 환경에 맞춰 크기와 구조를 정하고 제작부터 설치까지 진행했습니다.", "images": ["img/work/p45-0.jpg"]},
    {"slug": "w46", "title": "삼성전자 PC 게임존", "client": "삼성전자", "category": "pop", "type": "POSM", "scope": ["POSM 디자인", "진열 집기", "제작 · 설치"], "description": "제품 진열과 판매 촉진을 위한 매장용 제작물입니다. 매장 환경에 맞춰 크기와 구조를 정하고 제작부터 설치까지 진행했습니다.", "images": ["img/work/p46-1.jpg", "img/work/p46-0.jpg"]},
    {"slug": "w47", "title": "SK텔레콤 루나워치 런칭", "client": "SK텔레콤", "category": "pop", "type": "POSM", "scope": ["POSM 디자인", "진열 집기", "제작 · 설치"], "description": "제품 진열과 판매 촉진을 위한 매장용 제작물입니다. 매장 환경에 맞춰 크기와 구조를 정하고 제작부터 설치까지 진행했습니다.", "images": ["img/work/p47-0.jpg"]},
    {"slug": "w48", "title": "매직 슈퍼쿡 진열대", "client": "매직", "category": "pop", "type": "POSM", "scope": ["POSM 디자인", "진열 집기", "제작 · 설치"], "description": "제품 진열과 판매 촉진을 위한 매장용 제작물입니다. 매장 환경에 맞춰 크기와 구조를 정하고 제작부터 설치까지 진행했습니다.", "images": ["img/work/p48-0.jpg"]},
    {"slug": "w49", "title": "딤채 전기밥솥", "client": "딤채", "category": "pop", "type": "POSM", "scope": ["POSM 디자인", "진열 집기", "제작 · 설치"], "description": "제품 진열과 판매 촉진을 위한 매장용 제작물입니다. 매장 환경에 맞춰 크기와 구조를 정하고 제작부터 설치까지 진행했습니다.", "images": ["img/work/p50-1.jpg", "img/work/p49-0.jpg", "img/work/p49-1.jpg", "img/work/p50-0.jpg"]},
    {"slug": "w52", "title": "삼성전자 TV 체험존", "client": "삼성전자", "category": "display", "type": "VMD", "scope": ["VMD 기획", "공간 디자인", "제작 · 시공"], "description": "매장 공간과 고객 동선을 함께 설계한 비주얼 머천다이징입니다. 연출 집기와 그래픽, 시공까지 한 번에 진행했습니다.", "images": ["img/work/p53-1.jpg", "img/work/p52-0.jpg", "img/work/p52-1.jpg", "img/work/p53-0.jpg"]},
    {"slug": "w54", "title": "삼성전자 하만 오디오존", "client": "삼성전자", "category": "display", "type": "VMD", "scope": ["VMD 기획", "공간 디자인", "제작 · 시공"], "description": "매장 공간과 고객 동선을 함께 설계한 비주얼 머천다이징입니다. 연출 집기와 그래픽, 시공까지 한 번에 진행했습니다.", "images": ["img/work/p54-0.jpg"]},
    {"slug": "w55", "title": "삼성전자 TV 매장 연출", "client": "삼성전자", "category": "display", "type": "VMD", "scope": ["VMD 기획", "공간 디자인", "제작 · 시공"], "description": "매장 공간과 고객 동선을 함께 설계한 비주얼 머천다이징입니다. 연출 집기와 그래픽, 시공까지 한 번에 진행했습니다.", "images": ["img/work/p56-0.jpg", "img/work/p55-0.jpg", "img/work/p55-1.jpg"]},
    {"slug": "w57", "title": "삼성전자 에어드레서", "client": "삼성전자", "category": "display", "type": "VMD", "scope": ["VMD 기획", "공간 디자인", "제작 · 시공"], "description": "매장 공간과 고객 동선을 함께 설계한 비주얼 머천다이징입니다. 연출 집기와 그래픽, 시공까지 한 번에 진행했습니다.", "images": ["img/work/p57-0.jpg", "img/work/p57-1.jpg"]},
    {"slug": "w58", "title": "삼성전자 세탁 · 건조기", "client": "삼성전자", "category": "display", "type": "VMD", "scope": ["VMD 기획", "공간 디자인", "제작 · 시공"], "description": "매장 공간과 고객 동선을 함께 설계한 비주얼 머천다이징입니다. 연출 집기와 그래픽, 시공까지 한 번에 진행했습니다.", "images": ["img/work/p58-1.jpg", "img/work/p58-0.jpg"]},
    {"slug": "w59", "title": "삼성전자 에어컨", "client": "삼성전자", "category": "display", "type": "VMD", "scope": ["VMD 기획", "공간 디자인", "제작 · 시공"], "description": "매장 공간과 고객 동선을 함께 설계한 비주얼 머천다이징입니다. 연출 집기와 그래픽, 시공까지 한 번에 진행했습니다.", "images": ["img/work/p60-0.jpg", "img/work/p59-0.jpg", "img/work/p60-1.jpg"]},
    {"slug": "w61", "title": "삼성전자 시즌 가전 매장", "client": "삼성전자", "category": "display", "type": "VMD", "scope": ["VMD 기획", "공간 디자인", "제작 · 시공"], "description": "매장 공간과 고객 동선을 함께 설계한 비주얼 머천다이징입니다. 연출 집기와 그래픽, 시공까지 한 번에 진행했습니다.", "images": ["img/work/p64-0.jpg", "img/work/p61-0.jpg", "img/work/p62-0.jpg", "img/work/p63-0.jpg"]},
    {"slug": "w65", "title": "더페이스샵 매장 VMD", "client": "더페이스샵", "category": "display", "type": "VMD", "scope": ["VMD 기획", "공간 디자인", "제작 · 시공"], "description": "매장 공간과 고객 동선을 함께 설계한 비주얼 머천다이징입니다. 연출 집기와 그래픽, 시공까지 한 번에 진행했습니다.", "images": ["img/work/p65-1.jpg", "img/work/p65-0.jpg", "img/work/p65-2.jpg"]},
    {"slug": "w66", "title": "비욘드 매장 VMD", "client": "비욘드", "category": "display", "type": "VMD", "scope": ["VMD 기획", "공간 디자인", "제작 · 시공"], "description": "매장 공간과 고객 동선을 함께 설계한 비주얼 머천다이징입니다. 연출 집기와 그래픽, 시공까지 한 번에 진행했습니다.", "images": ["img/work/p66-0.jpg", "img/work/p66-1.jpg", "img/work/p66-2.jpg"]},
    {"slug": "w67", "title": "리복 매장 VMD", "client": "리복", "category": "display", "type": "VMD", "scope": ["VMD 기획", "공간 디자인", "제작 · 시공"], "description": "매장 공간과 고객 동선을 함께 설계한 비주얼 머천다이징입니다. 연출 집기와 그래픽, 시공까지 한 번에 진행했습니다.", "images": ["img/work/p67-0.jpg", "img/work/p67-1.jpg", "img/work/p67-2.jpg"]},
    {"slug": "w69", "title": "삼성전자 포스터", "client": "삼성전자", "category": "print", "type": "EDITORIAL", "scope": ["편집 디자인", "인쇄"], "description": "제품과 브랜드 정보를 읽기 쉽게 정리한 인쇄물입니다.", "images": ["img/work/p70-0.jpg", "img/work/p69-0.jpg", "img/work/p69-1.jpg", "img/work/p69-2.jpg", "img/work/p69-3.jpg"]},
    {"slug": "w71", "title": "삼성전자 리플렛", "client": "삼성전자", "category": "print", "type": "EDITORIAL", "scope": ["편집 디자인", "인쇄"], "description": "제품과 브랜드 정보를 읽기 쉽게 정리한 인쇄물입니다.", "images": ["img/work/p71-2.jpg", "img/work/p71-0.jpg", "img/work/p71-1.jpg"]},
    {"slug": "w72", "title": "삼성전자 카탈로그", "client": "삼성전자", "category": "print", "type": "EDITORIAL", "scope": ["편집 디자인", "인쇄"], "description": "제품과 브랜드 정보를 읽기 쉽게 정리한 인쇄물입니다.", "images": ["img/work/p72-0.jpg", "img/work/p72-1.jpg", "img/work/p72-2.jpg", "img/work/p72-3.jpg", "img/work/p72-4.jpg", "img/work/p72-5.jpg"]},
    {"slug": "w73", "title": "삼성전자 셰프컬렉션 카탈로그", "client": "삼성전자", "category": "print", "type": "EDITORIAL", "scope": ["편집 디자인", "인쇄"], "description": "제품과 브랜드 정보를 읽기 쉽게 정리한 인쇄물입니다.", "images": ["img/work/p73-0.jpg", "img/work/p73-1.jpg", "img/work/p73-2.jpg", "img/work/p73-3.jpg"]},
    {"slug": "w74", "title": "캐논 포스터 · 배너", "client": "캐논", "category": "print", "type": "EDITORIAL", "scope": ["편집 디자인", "인쇄"], "description": "제품과 브랜드 정보를 읽기 쉽게 정리한 인쇄물입니다.", "images": ["img/work/p74-0.jpg"]},
    {"slug": "w75", "title": "대우조선해양 애뉴얼 리포트", "client": "대우조선해양", "category": "print", "type": "EDITORIAL", "scope": ["편집 디자인", "인쇄"], "description": "제품과 브랜드 정보를 읽기 쉽게 정리한 인쇄물입니다.", "images": ["img/work/p75-1.jpg", "img/work/p75-0.jpg", "img/work/p75-2.jpg", "img/work/p75-3.jpg", "img/work/p75-4.jpg"]},
    {"slug": "w77", "title": "삼성전자 갤럭시 J2 프로", "client": "삼성전자", "category": "print", "type": "PROMOTION", "scope": ["프로모션 기획", "그래픽", "제작물"], "description": "판매 행사와 시즌 캠페인을 위한 프로모션 디자인입니다.", "images": ["img/work/p77-0.jpg"]},
    {"slug": "w78", "title": "삼성전자 판매 프로모션", "client": "삼성전자", "category": "print", "type": "PROMOTION", "scope": ["프로모션 기획", "그래픽", "제작물"], "description": "판매 행사와 시즌 캠페인을 위한 프로모션 디자인입니다.", "images": ["img/work/p78-1.jpg", "img/work/p78-0.jpg", "img/work/p78-2.jpg"]},
    {"slug": "w79", "title": "삼성전자 웨딩 프로모션", "client": "삼성전자", "category": "print", "type": "PROMOTION", "scope": ["프로모션 기획", "그래픽", "제작물"], "description": "판매 행사와 시즌 캠페인을 위한 프로모션 디자인입니다.", "images": ["img/work/p79-1.jpg", "img/work/p79-0.jpg"]},
    {"slug": "w80", "title": "삼성전자 S아카데미", "client": "삼성전자", "category": "print", "type": "PROMOTION", "scope": ["프로모션 기획", "그래픽", "제작물"], "description": "판매 행사와 시즌 캠페인을 위한 프로모션 디자인입니다.", "images": ["img/work/p80-0.jpg"]},
    {"slug": "w81", "title": "삼성전자 판매 프로모션", "client": "삼성전자", "category": "print", "type": "PROMOTION", "scope": ["프로모션 기획", "그래픽", "제작물"], "description": "판매 행사와 시즌 캠페인을 위한 프로모션 디자인입니다.", "images": ["img/work/p81-0.jpg", "img/work/p81-1.jpg", "img/work/p81-2.jpg", "img/work/p81-3.jpg", "img/work/p81-4.jpg", "img/work/p81-5.jpg"]},
    {"slug": "w82", "title": "삼성전자 TV 프로모션", "client": "삼성전자", "category": "print", "type": "PROMOTION", "scope": ["프로모션 기획", "그래픽", "제작물"], "description": "판매 행사와 시즌 캠페인을 위한 프로모션 디자인입니다.", "images": ["img/work/p82-2.jpg", "img/work/p82-0.jpg", "img/work/p82-1.jpg"]},
    {"slug": "w84", "title": "농협 내외부 사인", "client": "농협", "category": "signage", "type": "SIGN", "scope": ["사인 디자인", "제작", "시공"], "description": "매장 안팎의 사인물과 대형 출력물을 디자인하고 제작·시공했습니다.", "images": ["img/work/p84-1.jpg", "img/work/p84-0.jpg", "img/work/p84-2.jpg"]},
    {"slug": "w85", "title": "대형 현수막", "client": "하이마트 외", "category": "signage", "type": "SIGN", "scope": ["사인 디자인", "제작", "시공"], "description": "매장 안팎의 사인물과 대형 출력물을 디자인하고 제작·시공했습니다.", "images": ["img/work/p85-0.jpg"]},
    {"slug": "w86", "title": "매장 사인 · 인테리어", "client": "가전 매장 외", "category": "signage", "type": "SIGN", "scope": ["사인 디자인", "제작", "시공"], "description": "매장 안팎의 사인물과 대형 출력물을 디자인하고 제작·시공했습니다.", "images": ["img/work/p88-1.jpg", "img/work/p86-0.jpg", "img/work/p86-1.jpg", "img/work/p87-0.jpg", "img/work/p87-1.jpg", "img/work/p87-2.jpg", "img/work/p87-3.jpg", "img/work/p88-0.jpg", "img/work/p89-0.jpg", "img/work/p89-1.jpg"]}
  ],

  /* 자체 제작센터 보유 장비 (2026 장비 목록 기준)
     model: 화면에 작게 표시되는 보유 모델 — 필요 없으면 빈 배열로 */
  facilities: [
    {
      id: "laser",
      name: "Laser Cutting",
      nameKo: "레이저 커팅기",
      image: "",
      desc: "400W급 RF 발진기를 쓰는 대형 레이저 커팅기입니다. 두께 20–30mm 소재까지 절단하고, 볼트식 클램프로 소재를 고정해 뒤틀림 없이 가공합니다.",
      specs: [["출력", "400W급 RF 발진기"], ["가공 두께", "20 – 30 mm"], ["주요 소재", "아크릴 · 목재 · MDF · 유리 · 원단 · 종이 · 가죽 · 고무"]],
      model: ["FC-400RB (동부하이텍)"]
    },
    {
      id: "cnc",
      name: "CNC Routing",
      nameKo: "CNC 멀티 라우터",
      image: "",
      desc: "공구 자동 교환(ATC) 장치를 갖춘 멀티 라우터로 절단과 조각을 한 번에 처리합니다. 아크릴 같은 경질 소재부터 폼보드, 골판지, 스펀지 같은 연질 소재까지 깔끔하게 가공합니다.",
      specs: [["방식", "ATC 장착 멀티 라우터"], ["가공", "절단 · 조각"], ["주요 소재", "아크릴 · 폼보드 · 골판지 · 스펀지 · 목재"]],
      model: ["FA-LA2500 (동부하이텍)"]
    },
    {
      id: "fabrication",
      name: "Panel Cutting & Fabrication",
      nameKo: "정밀 재단 · 아크릴 가공",
      image: "",
      desc: "고정밀 스핀들 재단기로 판재를 정확한 직각으로 자릅니다. 루터, 대패, 횡절단기, 탁상드릴, 경면기로 아크릴과 목재 부품을 다듬고 조립까지 마칩니다.",
      specs: [["재단", "정밀 판재 재단기"], ["가공 설비", "대형·소형 루터 · 대패 · 횡절단기 · 탁상드릴"], ["마감", "경면기 (아크릴 단면 광택)"]],
      model: ["재단기 MSW-48 (미림테크)", "루터 RM-701 · DJ2150T2", "대패 1804N · 드릴 KMT-400B6"]
    },
    {
      id: "print",
      name: "Large Format Printing",
      nameKo: "대형 실사출력",
      image: "",
      desc: "솔벤트, 안료, 오일 잉크 출력기를 모두 갖춰 실내 POP용 고해상도 출력부터 외부 대형 현수막까지 소재와 용도에 맞게 출력합니다.",
      specs: [["솔벤트", "폭 1.5 – 1.8 m · 4–6색 720dpi · Flex, PVC, Mesh, 배너"], ["안료", "폭 1.5 – 1.8 m · 6색 최대 1440×1440dpi · PET배너, 인화지, 합성지"], ["오일", "폭 1.8 m · 6색 720dpi · 외부 대형 현수막"]],
      model: ["TS34-1800A", "HP 9000S", "Thunder Jet", "XF-640", "FJ-740", "HP DesignJet 6100", "Dura Jet-1904T"]
    },
    {
      id: "finishing",
      name: "Finishing",
      nameKo: "후가공 · 코팅",
      image: "",
      desc: "출력물은 자동·수동 코팅기로 표면을 보호하고, 시트 커팅기와 스피드컷 재단기로 정확하게 잘라 바로 포장과 납품으로 넘깁니다.",
      specs: [["코팅", "자동 코팅기 2대 · 수동 코팅기"], ["재단", "시트 커팅기 (120) · 스피드컷 재단기"], ["설비", "냉동식 에어 드라이어 · 컴프레서"]],
      model: []
    }
  ]
};
