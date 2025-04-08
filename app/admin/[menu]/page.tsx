"use client";

import { useParams } from "next/navigation";
import Item from "../Item";
import Order from "../Order";
import MenuList from "./MenuList";
import { useContext } from "react";
import { AuthContext } from "@/components/context/AuthContext";

export default () => {
  const params = useParams<{ menu: string }>();
  const paramsMenu = params.menu;
  const authContext = useContext(AuthContext);

  function getMenuComponent(paramsMenu: string) {
    switch (paramsMenu) {
      case "order":
        return <Order />;
      case "item":
        return <Item />;
    }
  }

  return (
    <article className="xl:mx-32 m-[2%] flex flex-wrap gap-x-16 gap-y-4 justify-center xl:justify-start">
      {authContext?.isLogined && <MenuList />}
      {getMenuComponent(paramsMenu)}
    </article>
  );
};
