<h1>쇼핑몰 1인 개발 / 2024.12 ~ </h1>

### 인프라
<p align="center">
<img src="https://github.com/user-attachments/assets/fee97e3b-fe2a-4662-b7e6-555f3c8f68e5" />
</p>
<p align="center">초기엔 ELB 썻지만 비용 발생해서 지움</p>

<p align="center">
<img src="https://github.com/user-attachments/assets/b3528f47-4cdb-4fd4-a5bb-2eed72233c6c" />
</p>

<p>https://dlta.kr</p>

### 프로젝트 스킬
next.js 15 앱 라우터

### 페이지
공통 UI
<ul>
  <li>pc·모바일 반응형 웹 제작</li>
  <li>대기 시간 동안 로딩 애니메이션 제공</li>
  <li>이쁜 알림창을 위해 모달 사용</li>
</ul>

페이지 종류
<ul>
  <li>상품 검색·인기 상품</li>
  <li>장바구니·상품 주문</li>
  <li>마이 페이지 (주문 조회·배송지 조회·유저 정보 변경)</li>
  <li>관리자 페이지 (주문 조회·상품 등록)</li>
</ul>

### 프로젝트로 얻은 경혐
next.js 지식
<ul>
  <li>pre-render를 통해 seo·렌더링 속도 향상</li>
  <li>csr도 pre-render 가능 (브라우저에서 API 호출한 경우·useSeachParam 사용한 경우 제외)</li>
  <li>코드 간소화를 위해 전역 에러 처리 적용</li>
  <li>첫 도메인 요청은 SSR</li>
  <li>서버 컴포넌트가 SSR 되지 않을 경우 force-dynamic 사용</li>  
</ul>

기타
<li>standalone 빌드·최소한의 파일만 압축 → 배포 시간 1분 줄임</li>
<li>협업 시 프로젝트 호환 문제를 없애기 위해 도커 사용</li>
