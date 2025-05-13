import ProductGallerySlider from "./ProductGallerySlider";
import { ProductImage } from "@/types/producto_admin";

interface Props {
  images: ProductImage[];
  altText: string;
}

export default function Gallery({ images, altText }: Props) {
  return (
    <ProductGallerySlider
      images={images}
      altText={altText}
      aspectRatio="portrait"
      rounded
      largeButtons
      layout="vertical"
    />
  );
}
