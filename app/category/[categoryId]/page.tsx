
import { CardTypeMap } from "@mui/material";
import Client from "./Client";

export default async ({ params }: { params: Promise<{ categoryId: number }> }) => {
    
  const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/category`);
  const categories: CateogoryType[] = await categoriesRes.json();

  const categoryId = (await params).categoryId;
  const categoryItemRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/items?categoryId=${categoryId}&page=0&size=1`, {
    cache: "no-store",
  });
  const categoryItems: CategoryItemType = await categoryItemRes.json();

  const colorsRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/colors`);
  const colors: ColorType[] = await colorsRes.json();

  return <Client categories={categories} categoryItems={categoryItems} colors={colors}/>;
} 

