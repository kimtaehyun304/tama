import Client from "./Client";

export default async function Page({
  params,
}: {
  params: Promise<{ colorItemId: number }>;
}) {
  const colorItemId = (await params).colorItemId;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/color-items/${colorItemId}`,
    {
      cache: "no-store",
    }
  );
  const colorItem: ColorItemType = await res.json();

  if (!res.ok) return colorItem;

  return <Client colorItem={colorItem} />;
}
