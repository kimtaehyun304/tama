"use client";

import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useContext } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [elapsed, setElapsed] = useState<number>(0); // ⏱ 타이머
  const simpleModalContext = useContext(SimpleModalContext);
  const messagesRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    if (userInput.length > 500) {
      simpleModalContext?.setMessage("500자 까지만 입력 가능합니다");
      simpleModalContext?.setIsOpenSimpleModal(true);
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      content: userInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setLoading(true);

    try {
      /*
      // ⏳ 테스트용 3초 지연
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const mockRes: ChatMessage = {
        role: "assistant",
        recommendedCondition: {
          genders: ["FEMALE"],
          seasonKeyword: "FW",
          categoryNames: ["셔츠"],
          maxPrice: 50000,
          isContainSoldOut: false,
          descriptionKeywords: ["입기 편한", "편안한", "데일리", "활동성"],
        },
        recommendedItems: [
          {
            colorItemId: 200016,
            name: "여 루즈핏 포플린 긴팔 셔츠",
            originalPrice: 39900,
            nowPrice: 35910,
            uploadFile: {
              originalFileName: "loosefit_popllin_shirt.avif",
              storedFileName:
                "loosefit_popllin_shirt-af21a91a-9ee3-47f9-99da-7ae21e0f14f3.avif",
            },
          },
          {
            colorItemId: 200023,
            name: "여 코튼 튜닉 긴팔 블라우스",
            originalPrice: 19900,
            nowPrice: 17910,
            uploadFile: {
              originalFileName: "cotton_tunic_baluse.avif",
              storedFileName:
                "cotton_tunic_baluse-aab855b2-d635-4440-9551-54bb579f9dd5.avif",
            },
          },
        ],
      };
      
      setMessages((prev) => [...prev, mockRes]);
      */

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/ai/recommend`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userInputPrompt: userInput,
          }),
        },
      );

      if (!response.ok) {
        alert("API 호출 실패");
        return;
      }

      const assistantRes: ChatMessage = await response.json();
      assistantRes.role = "assistant";
      setMessages((prev) => [...prev, assistantRes]);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  // 메시지 변경 시 자동 스크롤
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // ⏱ loading 기준 타이머 시작 / 종료
  useEffect(() => {
    if (!loading) return;

    setElapsed(0);

    const id = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [loading]);

  return (
    <article className="flex flex-col h-[80vh] bg-gray-50 xl:mx-standard">
      {/* 메시지 영역 */}
      <div ref={messagesRef} className="flex-1 overflow-auto px-4 py-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            } mb-2`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-md whitespace-pre-wrap ${
                msg.role === "assistant" ? "bg-gray-100" : "bg-white shadow"
              }`}
            >
              {msg.role === "user" && msg.content}

              {msg.role === "assistant" && (
                <div>
                  <div className="px-1 sm:px-0 gap-2 grid grid-cols-2">
                    {msg.recommendedItems?.length === 0 &&
                      "추천 결과가 없습니다"}

                    {msg.recommendedItems?.map((item, i) => (
                      <Link
                        href={`/color-items/${item.colorItemId}`}
                        key={`item-${i}`}
                      >
                        <ul>
                          <li>
                            <Image
                              src={`${process.env.NEXT_PUBLIC_CDN_URL}/${item.uploadFile.storedFileName}`}
                              alt={item.name}
                              width={232}
                              height={232}
                            />
                            <div>
                              <div className="py-1 whitespace-nowrap overflow-hidden">
                                {item.name}
                              </div>

                              <div className="flex items-center gap-x-2 py-1">
                                <span>
                                  <span className="font-semibold">
                                    {item.nowPrice
                                      ? item.nowPrice.toLocaleString("ko-KR")
                                      : item.originalPrice.toLocaleString(
                                          "ko-KR",
                                        )}
                                  </span>
                                  원
                                </span>

                                {item.nowPrice && (
                                  <span className="text-sm text-[#aaa]">
                                    {item.originalPrice.toLocaleString("ko-KR")}
                                    원
                                  </span>
                                )}
                              </div>
                            </div>
                          </li>
                        </ul>
                      </Link>
                    ))}
                  </div>
                  <details className="text-xs text-gray-500 mt-2">
                    <summary className="cursor-pointer text-blue-500">
                      추천 근거 보기
                    </summary>

                    <pre className="whitespace-pre-wrap break-words mt-2 bg-gray-100 p-2 rounded">
                      {JSON.stringify(msg.recommendedCondition, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* ⏱ 로딩 + 타이머 표시 */}
        {loading && (
          <div className="text-gray-400 text-sm mt-2">
            추천 생성 중... {elapsed}초
          </div>
        )}
      </div>

      {/* 입력창 */}
      <footer className="sticky bottom-0 p-4 border-t bg-white flex gap-2 flex-shrink-0">
        <input
          className="flex-1 border rounded-xl px-4 py-3 focus:outline-none"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="프롬프트를 입력하세요 ex) 밝은 색상의 여자 옷 추천해줘"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) handleSend();
          }}
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className={`px-4 rounded-xl ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          전송
        </button>
      </footer>
    </article>
  );
}
