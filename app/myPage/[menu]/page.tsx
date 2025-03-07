"use client";

import { AuthContext } from "@/components/context/AuthContext";

import { useContext, useState } from "react";
import { useEffect } from "react";
import { LoginModalContext } from "@/components/context/LoginModalContext";
import LoginScreen from "@/components/LoginScreen";
import MenuList from "./MenuList";
import { useParams } from "next/navigation";
import Information from "../Information";
import Order from "../Order";
import Address from "../Address/Address";
export default () => {
  const params = useParams<{ menu: string }>();
  const paramsMenu = params.menu;

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

  return (
    <article className="xl:mx-32 m-[2%] flex gap-x-16 justify-center xl:justify-start">
      <MenuList />
      {getMenuComponent(paramsMenu)}
    </article>
  );
};
