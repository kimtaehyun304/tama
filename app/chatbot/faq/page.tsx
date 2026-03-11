"use client";

import { SimpleModalContext } from "@/components/context/SimpleModalContex";
import { useState, useRef, useEffect, useContext } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<FaqChatMessage[]>([]);
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

    const userMessage: FaqChatMessage = {
      role: "user",
      content: userInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatbot/faq`,
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

      const assistantRes: FaqChatMessage = await response.json();
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
    <article className="flex flex-col h-[70vh] bg-gray-50 xl:mx-standard">
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
                  <div className="">
                    {msg.content?.length === 0
                      ? "검색 결과가 없습니다"
                      : msg.content}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* ⏱ 로딩 + 타이머 표시 */}
        {loading && (
          <div className="text-gray-400 text-sm mt-2">
            검색 중... {elapsed}초
          </div>
        )}
      </div>

      {/* 입력창 */}
      <footer className="sticky bottom-0 p-4 border-t bg-white flex gap-2 flex-shrink-0">
        <input
          className="flex-1 border rounded-xl px-4 py-3 focus:outline-none"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="ex) 주문한 상품의 배송지를 변경할 수 있나요?"
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
