

import LoadingScreen from "@/components/LoadingScreen";
import BannerSlider from "@/components/slider/BannerSlider";
import Image from "next/image";
import Link from "next/link";
import GoogleSignUpButton from "./GoogleSignUpButton";

export default function SignUp() {


  return (
    <article className="bg-[#f0f0f0] py-3">
      <section className="xl:mx-[20%] py-1 bg-white border-4 ">
        <div className="text-center space-y-3 py-4 w-[400px] mx-auto">
          <div className="text-4xl">회원가입</div>

          <Link href={"/signup/email"} className="block">
            {/* 이메일로 가입하기 버튼 */}
            <button className="block border w-full bg-black text-white p-4 text-center">
              이메일로 가입하기
            </button>
          </Link>
        </div>
      </section>
    </article>
  );
}
