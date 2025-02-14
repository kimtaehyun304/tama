type OnCompleteType = {
  zonecode: string; // 국가기초구역번호 (새 우편번호)
  address: string; // 기본 주소
  addressEnglish: string; // 기본 영문 주소
  addressType: "R" | "J"; // 검색된 기본 주소 타입 (R: 도로명, J: 지번)
  userSelectedType: "R" | "J"; // 사용자가 선택한 주소 타입
  noSelected: "Y" | "N"; // "선택 안함" 여부
  userLanguageType: "K" | "E"; // 사용자가 선택한 언어 타입 (K: 한글, E: 영어)
  roadAddress: string; // 도로명 주소
  roadAddressEnglish: string; // 영문 도로명 주소
  jibunAddress: string; // 지번 주소
  jibunAddressEnglish: string; // 영문 지번 주소
  autoRoadAddress: string; // 자동 매핑된 도로명 주소
  autoRoadAddressEnglish: string; // 자동 매핑된 영문 도로명 주소
  autoJibunAddress: string; // 자동 매핑된 지번 주소
  autoJibunAddressEnglish: string; // 자동 매핑된 영문 지번 주소
  buildingCode: string; // 건물관리번호
  buildingName: string; // 건물명
  apartment: "Y" | "N"; // 공동주택 여부
  sido: string; // 도/시 이름
  sidoEnglish: string; // 도/시 이름의 영문
  sigungu: string; // 시/군/구 이름
  sigunguEnglish: string; // 시/군/구 이름의 영문
  sigunguCode: string; // 시/군/구 코드
  roadnameCode: string; // 도로명 코드
  bcode: string; // 법정동/법정리 코드
  roadname: string; // 도로명 값
  roadnameEnglish: string; // 도로명 영문 값
  bname: string; // 법정동/법정리 이름
  bnameEnglish: string; // 법정동/법정리 이름 영문
  bname1?: string; // 법정리의 읍/면 이름 (동 지역은 공백)
  bname1English?: string; // 법정리의 읍/면 영문 이름 (동 지역은 공백)
  bname2: string; // 법정동/법정리 이름
  bname2English: string; // 법정동/법정리 이름 영문
  hname?: string; // 행정동 이름 (필요할 경우)
  query: string; // 사용자가 입력한 검색어
};
