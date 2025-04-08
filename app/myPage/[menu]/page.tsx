"use client";
import { useParams, useRouter } from "next/navigation";
import Address from "../Address/Address";
import Information from "../Information";
import Order from "../Order";
import MenuList from "./MenuList";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/components/context/AuthContext";

export default () => {
  const params = useParams<{ menu: string }>();
  const paramsMenu = params.menu;
  const authContext = useContext(AuthContext);
  const router = useRouter();
  function getMenuComponent(paramsMenu: string) {
    switch (paramsMenu) {
      case "order":
        return <Order />;
      case "information":
        return <Information />;
      case "address":
        return <Address />;
    }
  }

  useEffect(() => {
    async function fetchMemberInfo() {
      //console.log(authContext?.isLogined)
      //if (!authContext?.isLogined) alert("로그인 해주세요");
      if (authContext?.isLogined) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/member/information`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer " + localStorage.getItem("tamaAccessToken"),
            },
          }
        );
        const member: MemberInformationType = await res.json();

        if (!res.ok) {
          alert("에러 발생");
          return;
        }

        if (member.authority === "ADMIN") router.push("/admin/order");
      }
    }
    fetchMemberInfo();
  }, [authContext?.isLogined]);

  return (
    <article className="xl:mx-32 m-[2%] flex flex-wrap gap-x-16 gap-y-4 justify-center xl:justify-start">
       {authContext?.isLogined && <MenuList />}
      {getMenuComponent(paramsMenu)}
    </article>
  );
};
