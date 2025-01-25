import Client from "./Client";

export default async function Page({ params }: { params: Promise<{ colorItemId: number }> }) {
  const colorItemId = (await params).colorItemId;
  const res = await fetch(`http://localhost:8080/api/colorItems/${colorItemId}`, {
    cache: "no-store",
  });
  const data: ColorItemType = await res.json();
  return <Client colorItem={data} />;
}

