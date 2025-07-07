"use client";
import { ReactNode } from "react";
import MyPageMenuList from "./MyPageMenuList";

export default function MyPageLayout({ children }: { children: ReactNode }) {
  return (
    <article className="xl:mx-32 m-[2%] flex flex-wrap gap-x-16 gap-y-4 justify-center xl:justify-start">
      <MyPageMenuList />
      {children}
    </article>
  );
}
