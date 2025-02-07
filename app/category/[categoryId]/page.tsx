import { CardTypeMap } from "@mui/material";
import Client from "./Client";
import { Metadata } from "next";

type Props = {
  params: { categoryId: number };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  //const categoryId = await params.categoryId; 경고 뜸
  const { categoryId } = await params;

  const categoriesRes = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/category`
  );
  const categories: CateogoryType[] = await categoriesRes.json();

  if (!categoriesRes.ok) return { title: "카테고리" };

  return {
    title: categories.find((category) => category.id == categoryId)?.name,
  };
}

export default async ({
  params,
}: {
  params: Promise<{ categoryId: number }>;
}) => {
  const categoriesRes = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/category`,
    {
      cache: "no-store",
    }
  );
  const categories: CateogoryType[] = await categoriesRes.json();

  if (!categoriesRes.ok) return categories;

  const colorsRes = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/colors`,
    {
      cache: "no-store",
    }
  );
  const colors: ColorType[] = await colorsRes.json();

  if (!colorsRes.ok) return colors;

  return <Client categories={categories} colors={colors}/>;
};
