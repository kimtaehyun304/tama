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
    },
  );
  const colorItem: ColorItemType = await res.json();
  const itemDescription = colorItem.common.description.substring(0, 10);
  if (!res.ok) {
    return { title: "상품상세" };
  }

  return {
    title: colorItem.common.name,
    description: itemDescription,
    openGraph: {
      type: "website",
      title: colorItem.common.name,
      description: itemDescription,
      url: `https://dlta.kr/colorItems/${colorItemId}`,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_CDN_URL}/${colorItem.uploadFiles[0].storedFileName}`,
          width: 800,
          height: 600,
          alt: "대표 이미지",
        },
      ],
    },
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
    },
  );
  const colorItem = await res.json();
  if (!res.ok) throw new Error(colorItem.message);

  return <Client colorItem={colorItem} />;
}
