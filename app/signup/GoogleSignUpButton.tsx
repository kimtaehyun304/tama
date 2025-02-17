import Image from "next/image";
import Link from "next/link";

export default () => {
  const crypto = require("crypto");
  const random = crypto.randomBytes(16);
  const state = BigInt("0x" + random.toString("hex")).toString();

  return (
    <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/oauth2/authorization/google`}>
      <button className="block border w-full p-4 text-center">
        <Image
          src="/icon/icon-google.png"
          width={24}
          height={24}
          alt="구글로 가입하기"
          className="inline mr-3"
        />
        구글로 가입하기
      </button>
    </Link>
  );
};
