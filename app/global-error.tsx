"use client"; // Error boundaries must be Client Components

//global-error.tsx는 layout.tsx가 적용안됨 -> 헤더 fetch 실패하면 발동되게 하는게 목적인데, 헤더는 서버 컴포넌트인데 되나?
//실제로 해봤는데 서버 컴포넌트 예외에도 발동
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <h3>{error.message}</h3>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
