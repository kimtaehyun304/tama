"use client";

import { AuthContext } from "@/components/context/AuthContext";

import { useContext, useState } from "react";
import { useEffect } from "react";
import { LoginModalContext } from "@/components/context/LoginModalContext";
import LoginScreen from "@/components/LoginScreen";
import MenuList from "./MenuList";
import { useParams } from "next/navigation";
import Order from "../Order";
import Address from "../Address/Address";
import Item from "../Item";

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
