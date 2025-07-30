<h1>쇼핑몰 1인 개발 / 2024.12 ~ </h1>

### 인프라
<p align="center">
<img src="https://github.com/user-attachments/assets/fee97e3b-fe2a-4662-b7e6-555f3c8f68e5" />
</p>
<p align="center">초기엔 ELB 썻지만 비용 발생해서 지움</p>

<p align="center">
<img src="https://github.com/user-attachments/assets/b3528f47-4cdb-4fd4-a5bb-2eed72233c6c" />
</p>

### 페이지
공통 UI
<ul>
  <li>pc·모바일 반응형 웹 제작</li>
  <li>이쁜 알림창을 위해 모달 사용</li>
</ul>

페이지 종류
<ul>
  <li>상품 검색·인기 상품</li>
  <li>장바구니·상품 주문</li>
  <li>마이 페이지 (주문 조회·배송지 조회·유저 정보 변경)</li>
  <li>관리자 페이지 (주문 조회·상품 등록)</li>
</ul>

### 기능


<ul>
  <li>next.js 앱 라우터 사용</li>
    <li>클라이언트 컴포넌트도 서버에서 만들어지는 걸 인지</li>
  <ul>
    <li>로컬 스토리지는 useEffect() 또는 funtion 안에서 써야함</li>
  </ul>
  <li>standalone 빌드 + 필요한 것만 압축해서 배포 시간 1분 줄임</li>
  <li>useSeachParam 사용 시 pre-redner 불가 → force-dynamic</li>
  <li>비용 절감을 위해 상품 상세 페이지만 SSR 적용</li>
  <li>ES6 문법으로 클린 코드 작성</li>
  <li>가시성있는 UI를 위해 모달 사용</li>
  <li>글로벌 로딩 애니메이션 적용 (loading.tsx)</li>
  <li>글로벌 에러 처리 적용 (global-error.tsx)</li>
</ul>

