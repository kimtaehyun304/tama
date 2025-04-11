"use client";

import Image from "next/image";

export default () => {
  return (
    <button>
      <div className="border-x grid grid-flow-col items-center px-5">
        <Image
          src="/icon/icon-hamburger.png"
          alt="mypae"
          width={30}
          height={30}
        />
        <div className="py-2">전체 카테고리</div>
      </div>
    </button>
  );
};
