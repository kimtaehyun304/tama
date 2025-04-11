"use client";

import { AuthContext } from "@/components/context/AuthContext";

import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import LoginScreen from "@/components/LoginScreen";
import { useContext, useEffect, useState } from "react";

export default () => {
  const [memberInfo, setMemberInfo] = useState<MemberInformationType>();
  const authContext = useContext(AuthContext);
  const simpleModalContext = useContext(SimpleModalContext);

  const changeMemberInfo = (
    key: keyof MemberInformationType,
    value: string | number
  ) => {
    setMemberInfo(
      (prev) =>
        prev && {
          ...prev,
          [key]: value,
        }
    );
  };


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
        setMemberInfo(member);
      }
    }
    fetchMemberInfo();
  }, [authContext?.isLogined]);

  async function updateMemberInfo() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/member/information`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("tamaAccessToken"),
        },
        body: JSON.stringify({
          height: memberInfo?.height,
          weight: memberInfo?.weight,
        }),
      }
    );
    const member: SimpleResponseType = await res.json();
    //setMemberInfo(member);
    simpleModalContext?.setMessage(member.message);
    simpleModalContext?.setIsOpenSimpleModal(true);
  }

  if (!memberInfo && !authContext?.isLogined) {
    return <LoginScreen />;
  }

  return (
    <section className="max-w-[30rem] space-y-4">
      <div className="font-bold text-xl">회원정보 수정</div>

      {memberInfo && (
        <>
          <div className="flex items-center">
            <label className="w-20 whitespace-nowrap">아이디</label>
            <input
              type="text"
              value={memberInfo.email}
              readOnly
              className="ml-2  p-3 focus:outline-none grow "
            />
          </div>

          <div className="flex items-center">
            <label className="w-20 whitespace-nowrap">닉네임</label>
            <input
              type="text"
              value={memberInfo.nickname}
              readOnly
              className="ml-2  p-3 focus:outline-none grow"
            />
          </div>

          {/*변경시 인증 필요해서 일단 수정 미구현 
      <div className="flex items-center">
        <label className="whitespace-nowrap">휴대폰 번호</label>
        <input
          type="text"
          value={memberInfo.phone}
          readOnly
          className="ml-2 border p-1 focus:outline-none"
        />
      </div>

      <div className="flex items-center">
        <label className="whitespace-nowrap">비밀번호</label>
        <input type="password" className="ml-2 border p-1 focus:outline-none" />
      </div>
     */}

          <div className="flex items-center">
            <label className="w-20 whitespace-nowrap">키</label>
            <div className="flex items-center">
              <input
                type="text"
                value={memberInfo.height ?? ""}
                onChange={(event) =>
                  changeMemberInfo("height", event.target.value)
                }
                className="ml-2 border text-right p-3  focus:outline-none grow"
              />
              <span className="border p-3 border-l-0 w-12">cm</span>
            </div>
          </div>

          <div className="flex items-center">
            <label className="w-20 whitespace-nowrap">몸무게</label>
            <div className="flex items-center">
              <input
                type="text"
                value={memberInfo.weight ?? ""}
                onChange={(event) =>
                  changeMemberInfo("weight", event.target.value)
                }
                className="ml-2 border text-right p-3  focus:outline-none grow"
              />
              <span className="border p-3 border-l-0 w-12">kg</span>
            </div>
          </div>

          {/* 성별 변경은 사이드 이펙트 발생 가능 -> 핸드폰 인증으로 고정하는게 아니면 안쓰는게 난 듯 */}
          {/*}
            <div className="flex items-center">
              <label className="w-20 whitespace-nowrap">성별</label>
              <div className="flex items-center ml-2">
                <button
                  className={`border p-3 mr-2 ${
                    memberInfo?.gender === "MALE"
                      ? "bg-gray-300 border-black"
                      : ""
                  }`}
                >
                  남성
                </button>
                <button
                  className={`border p-3 ${
                    memberInfo?.gender === "FEMALE"
                      ? "bg-gray-300 border-black"
                      : ""
                  }`}
                >
                  여성
                </button>
              </div>
            </div>
            */}

          <div className="">
            <button
              className="border p-3 w-full  bg-black text-white"
              onClick={updateMemberInfo}
            >
              변경하기
            </button>
          </div>
        </>
      )}
    </section>
  );
};
