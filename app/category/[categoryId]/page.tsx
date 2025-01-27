import { CardTypeMap } from "@mui/material";
import Client from "./Client";

export default async ({
  params,
}: {
  params: Promise<{ categoryId: number }>;
}) => {
  const categoriesRes = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/category`
  );
  const categories: CateogoryType[] = await categoriesRes.json();

  if (!categoriesRes.ok) {
    return categories;
  }

  //const categoryId = (await params).categoryId;

  const colorsRes = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/colors`
  );
  const colors: ColorType[] = await colorsRes.json();

  if (!colorsRes.ok) {
    return colors;
  }
  return <Client categories={categories} colors={colors} />;
};
