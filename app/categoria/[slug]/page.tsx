import ProductListingPage from "@/components/productos/categorias/productListing";
interface CategoryPageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  return <ProductListingPage slug={params.slug} />;
}
