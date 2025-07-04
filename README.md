<h1>쇼핑몰 1인 개발 / 2024.12 ~ </h1>
<p align="center">
<img src="https://github.com/user-attachments/assets/b160556b-07c2-4af6-a10c-65b0fb57e5c1" width="80%" height="80%"/>
</p>
<p align="center">초기엔 ELB와 ACM을 썼지만, 비용 문제로 지우고 Certbot으로 전환</p>

https://dlta.kr  
next.js 15, typeScript, tailwind

### 어필
<ul>
  <li>next.js 앱 라우터 사용</li>
    <li>클라이언트 컴포넌트도 서버에서 만들어지는 걸 인지</li>
  <ul>
    <li>로컬 스토리지는 useEffect() 또는 funtion 안에서 써야함</li>
  </ul>
  <li>standalone 빌드 + 필요한 것만 압축해서 배포 시간 1분 줄임</li>
  <li>useSeachParam 사용 시 pre-redner 불가 → 서버 컴포넌트 사용</li>
  <li>비용 절감을 위해 상품 상세 페이지만 SSR 적용</li>
  <li>ES6 문법으로 클린 코드 작성</li>
  <li>가시성있는 UI를 위해 모달 사용</li>
  <li>글로벌 로딩 애니메이션 적용 (loading.tsx)</li>
  <li>글로벌 에러 처리 적용 (global-error.tsx)</li>
</ul>

