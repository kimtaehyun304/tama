"use client";
import { useFetchAccessToken } from "./useFetchAccessToken";

//서버 컴포넌트 force-dynamic 중이라 "use client" 못 써서 분리
export default () => {
  useFetchAccessToken();
  return null;
};
