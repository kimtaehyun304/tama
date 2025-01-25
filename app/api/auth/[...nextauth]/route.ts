/*
import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: { nextauth: string[] } }
) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const provider = (await params).nextauth[1];

  if (!provider) return;

  const response = await fetch(
    `${process.env.SERVER_URL}/login/oauth2/code/${provider}?code=${code}&state=${state}`,
    {
      method: "GET",
    }
  );

  if (response.status !== 200) throw new Error(`${provider} 로그인 실패`);

  //redirect('/213213');
}
*/