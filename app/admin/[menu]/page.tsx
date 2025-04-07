"use client";


import { useParams } from "next/navigation";
import Item from "../Item";
import Order from "../Order";
import MenuList from "./MenuList";

export default () => {
  const params = useParams<{ menu: string }>();
  const paramsMenu = params.menu;

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
      <MenuList />
      {getMenuComponent(paramsMenu)}
    </article>
  );
};
