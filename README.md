<h1>쇼핑몰 1인 개발 / 2024.12 ~ </h1>

### 인프라
<p align="center">
  <img src="https://github.com/user-attachments/assets/fee97e3b-fe2a-4662-b7e6-555f3c8f68e5" />
  <img src="https://github.com/user-attachments/assets/b3528f47-4cdb-4fd4-a5bb-2eed72233c6c" />
</p>

<p>https://dlta.kr</p>

### 프로젝트 스킬
next.js 15 앱 라우터, typeScript 5, tailwind 3

### 문제 해결 고민
onClick이 useEffect보다 나았다
<ul>
  <li>결론! onClick으로 수동으로 주문 수량을 변경하는게 객관적이고 쉽다</li>
  <li>(장바구니 상품을 로컬 스토리지에 저장한 상태)</li>
  <li>주문 수량 변경을 자동으로 로컬 스토리지에 반영하기 위해 useEffect 사용</li>
  <li>ㄴ로컬 스토리지의 useState가 할당됐는지 if문 필요</li>
  <li>ㄴ로직이 흩어져 있어서 결과 예측이 잘 안 됨</li>
</ul>

useState의 setState는 즉시 적용되지 않음
<ul>
  <li>원인: 비동기로 처리하여 불필요한 연산을 줄이도록 설계했기 때문</li>
  <li>해결: prev 또는 input tag event.value를 활용하면 즉시 적용됨</li>
</ul>

useState 배열은 setState로 일부만 바꿀 수 없음
<ul>
  <li>원인: 성능을 위해 참조만 비교해, 변경 여부를 판단하기 때문</li>
  <li>해결: 아예 새로운 배열을 만들어서 할당하면 됨</li>
</ul>

타입스크립트 에러 - is possibly 'undefined'
<ul>
  <li>해결! fetch api 완료 전에는 로딩 애니메이션을 출력</li>
  <li>fetch api 응답이 배열이면 빈 배열로 초기화하면 되지만, 다른 타입이 있으면 기본값 할당 필요</li>
  <li>ㄴ기본값 할당하면 api 데이터로 바뀌는 순간 어지러움 & 번거롭고 코드 복잡</li>
</ul>

<a href="https://velog.io/@hyungman304/%ED%86%A0%ED%81%B0-%EB%B3%B4%EA%B4%80-%EC%9C%84%EC%B9%98-%EA%B3%A0%EC%B0%B0">
  jwt 저장소 고민 (쿠키 vs 로컬 스토리지)
</a>

쿠키 특징
- xss 공격으로부터 안전 ex) httpOnly, secure, sameSite
- csrf 공격으로부터 위험 ex) csrf 토큰을 사용하면 되지만 메모리 필요

로컬 스토리지 특징
- xss 공격으로부터 안전 ex) API 서버에서 응답을 이스케이프 하면 안전
- csrf 공격으로부터 안전

로컬 스토리지로 결정했지만 CSR만 가능하여 관리자 페이지 URL 들킴
<ul>
  <li>로컬 스토리지는 브라우저에서 관리자 API를 호출하여 들킴</li>
  <li>ex) 응답은 거절되지만, 개발자 도구에서 API 호출 기록이 있는걸 보고 유추 가능</li>
  <li>쿠키 방식은 next.js 서버에서 API를 미리 호출 가능하여 안 들킴 (SSR)</li>
</ul>

### 프로젝트로 얻은 경혐
next.js 렌더링
<ul>
  <li>서버에서 만들거나 빌드 시점에, 페이지를 미리 만들어 렌더링 속도 향상 (pre-render)</li>
  <li>csr의 경우도 pre-render 가능 (단, API 호출로 세팅한 useState, useSeachParam 사용한 경우 제외)</li>
  <li>첫 접속은 SSR → "localStorage is not defined" 가능성 → 로컬 스토리지 사용은 useEffect에서 하기</li>
  <li>서버 컴포넌트가 SSR 적용 안될 때 → force-dynamic으로 강제</li>  
  <li>폰트 최적화를 위해 로컬 폰트 사용</li>
</ul>

next.js 클린 코드 및 성능
<ul>
  <li>try-catch를 대신하기 위해, error.tsx 사용 (공통 예외 처리)</li>
  <li>렌더링 중 자동으로 로딩 애니메이션 출력 (loading.tsx)</li>
  <li>공통 레이아웃을 위해, layout.tsx 사용</li>  
  <li>이미지 크기를 줄이기 위해 next.js Image 컴포넌트 사용</li>
  <li>이미지 캐싱을 위해, cdn(aws cloudFront) 사용</li>
  <li>standalone 빌드 + 최소한의 파일만 압축 → aws 배포 시간 1분 감소</li>
</ul>

react-hook-form으로 props 줄이기
<ul>
  <li>기존엔 state를 모두 넘겨야 해서 힘들었음</li>
  <li>react-hook-form 도입 후 register, watch만 props로 넘기면 돼서 편해짐</li>
  <li>useRef도 일일히 넘기는 게 아니라, SetFocus 하나만 넘기면 돼서 편해짐</li>
</ul>

typeScript 사용
<ul>
  <li>응답 필드 타입을 지정해두니 자동완성돼서 오타날 일이 줄음</li>
  <li>로컬 스토리지 변수에도 타입을 지정해두면 까먹어도 다시 볼 수 있음</li>
</ul>

tailwind 사용
<ul>
  <li>next.js가 추천하는 css 프레임워크라 사용 결정</li>
  <li>next.js 공식 사이트에 스타일 컴포넌트는 추천하지 않는다는 글이 있음</li>
</ul>

<a href="https://github.com/kimtaehyun304/tama/blob/309649ccf024d3f8a79896fe5216417f5f0d516f/app/order/page.tsx#L92">
  주문 페이지 컴포넌트 분리
</a>
<ul>
  <li>코드가 1,000 줄이 넘어가서 분리</li>
  <li>page.tsx / 주문 입력 폼 / 주문 아이템 / 주문 버튼 컴포넌트</li>
  <li>page.tsx에서 컴포넌트에 useState props 전달</li>
</ul>

### 페이지
<ul>
  <li>상품 검색</li>
  <li>인기 상품</li>
  <li>장바구니</li>
  <li>상품 주문</li>
  <li>마이 페이지 (개인 주문 조회·배송지 조회·유저 정보 변경)</li>
  <li>관리자 페이지 (전체 주문 조회·상품 등록)</li>
</ul>

### UI/UX
<ul>
  <li>tailwind의 grid·flex·breakpoint prefix로 반응형 웹(pc·모바일) 제작</li>
  <li>렌더링 대기 시간 동안 로딩 애니메이션 출력</li>
  <li>알림 메시지가 잘 보이도록 모달 사용</li>
  <li>이미지 슬라이더 사용</li>
</ul>

### 화면
<h4 align="center">메인 페이지</h4>
<p align="center">
<img src="https://github.com/user-attachments/assets/a2eb56ba-5ce4-4659-bac0-aff5b75a0887" />
</p>

<h4 align="center">상품 검색</h4>
<p align="center">
<img src="https://github.com/user-attachments/assets/2725d254-418a-413a-a349-526648ed98a8" />
</p>

<h4 align="center">주문 조회</h4>
<p align="center">
<img src="https://github.com/user-attachments/assets/0e69a6a8-eb4b-4a16-b827-7875befa78ed" />
</p>

<p align="center">
<img src="https://github.com/user-attachments/assets/3987367e-4403-4355-9e77-7a3fedacd27b" />
</p>






