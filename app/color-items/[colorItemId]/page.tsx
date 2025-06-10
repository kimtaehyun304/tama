import { Metadata } from "next";
import Client from "./Client";

type Props = {
  params: Promise<{ colorItemId: number }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const colorItemId = (await params).colorItemId;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/colorItems/${colorItemId}`,
    {
      cache: "no-store",
    }
  );
  const colorItem: ColorItemType = await res.json();

  if (!res.ok) {
    return { title: "상품상세" };
  }

  return {
    title: colorItem.common.name,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ colorItemId: number }>;
}) {
  const colorItemId = (await params).colorItemId;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/colorItems/${colorItemId}`,
    {
      cache: "no-store",
    }
  );
  const colorItem = await res.json();
  if (!res.ok) throw new Error(colorItem.message)

  return <Client colorItem={colorItem} />;
}
