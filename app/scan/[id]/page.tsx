import { getPoster, recordScan } from "../../../lib/firebase";
import { fetchProductsForPoster, formatPrice } from "../../../lib/shopify";
import { notFound } from "next/navigation";
import ScanClient from "./ScanClient";

export default async function ScanPage({ params }: { params: { id: string } }) {
  const poster = await getPoster(params.id);
  if (!poster) notFound();

  await recordScan(params.id);

  const products = poster.showProducts
    ? await fetchProductsForPoster(poster.shopifyCollectionId, poster.shopifyTag)
    : [];

  return <ScanClient poster={poster} products={products} />;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const poster = await getPoster(params.id);
  return { title: poster ? `${poster.name} — byprithu AR` : "byprithu AR" };
}
