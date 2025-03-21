"use client";
import Image from "next/image";
import Link from "next/link";
import React, { use, useContext, useState } from "react";
import { LoginModalContext } from "./context/LoginModalContext";
import { AuthContext } from "./context/AuthContext";
import { SimpleModalContext } from "./context/SimpleModalContex";

export default () => {
  return (
    <section className="flex justify-center">
      <div className="font-bold text-3xl">Forbidden Page</div>
    </section>
  );
};
