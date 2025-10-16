<h1>쇼핑몰 1인 개발 / 2024.12 ~ </h1>

### 인프라
<p align="center">
  <img src="https://github.com/user-attachments/assets/fee97e3b-fe2a-4662-b7e6-555f3c8f68e5" />
  <img src="https://github.com/user-attachments/assets/b3528f47-4cdb-4fd4-a5bb-2eed72233c6c" />
</p>

<p>https://dlta.kr</p>

### 프로젝트 스킬
next.js 15 앱 라우터, typeScript 5, tailwind 3

### 프로젝트로 얻은 경혐
react-hook-form으로 props 줄이기
<ul>
  <li>기존엔 state를 모두 넘겨야해서 힘들었음</li>
  <li>react-hook-form 도입 후 register, watch만 props로 넘기면 되서 편해짐</li>
  <li>useRef도 일일히 넘기는 게 아니라, SetFocus 하나만 넘기면 되서 편해짐</li>
</ul>

typeScript 사용
<ul>
  <li>응답 필드 타입을 지정해두니 자동완성이되서 오타날 일이 줄음</li>
  <li>로컬 스토리지 타입을 써둘 수 있어서 까먹어도 다시 볼 수 있음</li>
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
  <li>기존엔 코드가 하나의 파일에 모여있어서 1,000줄이 넘어가서 복잡했음</li>
  <li>page.tsx, 입력 폼, 주문 아이템, 주문 버튼 컴포넌트 분리</li>
  <li>공통 useState는 page.tsx에서 컴포넌트에 props로 전달</li>
</ul>

next.js 사용
<ul>
  <li>서버에서 만들거나 빌드 시점에, 페이지를 미리 만들어 렌더링 속도 향상 (pre-render)</li>
  <li>csr의 경우도 pre-render 가능 (단, API 호출로 세팅한 useState, useSeachParam 사용한 경우 제외)</li>
  <li>첫 접속은 SSR → "localstorage is not defined" 가능성 → 로컬 스토리지 사용은 useEffect에서 하기</li>
  <li>서버 컴포넌트가 SSR 적용 안될 때 → force-dynamic</li>  
  <li>try-catch를 대신하기 위해, error.tsx 사용 (공통 예외 처리)</li>
  <li>렌더링 중 자동으로 로딩 애니메이션 출력 (loading.tsx)</li>
  <li>공통 레이아웃을 위해, layout.tsx 사용</li>  
  <li>standalone 빌드 + 최소한의 파일만 압축 → aws 배포 시간 1분 감소</li>
  <li>폰트 최적화를 위해 로컬 폰트 사용</li>
</ul>

<a href="https://velog.io/@hyungman304/%ED%86%A0%ED%81%B0-%EB%B3%B4%EA%B4%80-%EC%9C%84%EC%B9%98-%EA%B3%A0%EC%B0%B0">
  로컬 스토리지와 쿠키 중 고민
</a>
<ul>
  <li>xss 위험은 쿠키가 안전 (httpOnly, secure, sameSite)</li>
  <li>p.s) API 서버에서 응답을 이스케이프하면 안전</li>
  <li>csrf 위험은 로컬 스토리지가 안전</li>
  <li>p.s) csrf 토큰은 메모리 필요</li>
  <li>로컬 스토리지 선택 → 문제는 브라우저에서 API 호출하므로, 관리자 페이지 URL인걸 들킴</li>
  <li>p.s) 응답은 거절되지만, 개발자 도구에서 API 호출 기록이 남기 때문</li>
  <li>쿠키 방식은 next.js 서버에서 SSR을 통해 API를 미리 호출 가능하여 안 들킴</li>
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
  <li>메시지가 잘 보이도록 모달 사용</li>
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





