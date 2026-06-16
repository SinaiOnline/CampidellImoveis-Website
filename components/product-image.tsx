/* eslint-disable @next/next/no-img-element */
import * as PropertyService from "@/services/property";
import Property from "@/types/property";
import { NoImagePlaceholder } from "@/utils/default-image";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";
import dynamic from "next/dynamic";
import Image from "next/image";
import React from "react";
import { CarouselHandles } from "./generic-carousel";

const Tooltip = dynamic(() => import("@mui/material/Tooltip"), {
  ssr: false,
});

const GenericCarousel = dynamic(
  () => import("./generic-carousel"),
  { ssr: false },
);

const ProductImage = ({
  product,
  disableSwipe,
  onClick,
  enableCarousel,
}: {
  product: Property;
  disableSwipe?: boolean;
  onClick?: () => void;
  enableCarousel?: boolean;
}) => {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isTouchScreen, setIsTouchScreen] = React.useState(false);

  const images = PropertyService.GetPictures(product);
  const carouselRef = React.useRef<CarouselHandles>(null);

  React.useEffect(() => {
    setIsFavorite(PropertyService.IsFavorite(product.codimovel));
  }, [product]);

  // client-only touch detection
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const nav = navigator as any;
    setIsTouchScreen(
      "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        nav.msMaxTouchPoints > 0,
    );
  }, []);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setIsFavorite(
      PropertyService.IsFavorite(product.codimovel)
        ? PropertyService.UnmarkAsFavorite(product.codimovel)
        : PropertyService.MarkAsFavorite(product.codimovel),
    );
  };

  return (
    <div className="product-image-component">
      {enableCarousel ? (
        <GenericCarousel
          onTap={isTouchScreen ? onClick : undefined}
          showArrows
          disableSwipe={disableSwipe}
          ref={carouselRef}
        >
          {images.map((image, index) => (
            <img
              key={index}
              onClick={onClick}
              loading={
                index === 0 ||
                index === 1 ||
                index === images.length - 1
                  ? "eager"
                  : "lazy"
              }
              alt=""
              src={image}
              onError={(e) => {
                e.currentTarget.src = NoImagePlaceholder;
              }}
            />
          ))}
        </GenericCarousel>
      ) : (
        <Image
          fill
          loading="lazy"
          unoptimized
          sizes="(max-width: 768px) 50vw, 25vw"
          onClick={onClick}
          alt="Product Image"
          src={images[0] || NoImagePlaceholder}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              NoImagePlaceholder;
          }}
        />
      )}

      <div className="overlay">
        <div className="top">
          <p className="cod-imovel">CÓDIGO: {product.codimovel}</p>
          <Tooltip placement="top" title="Adicionar aos favoritos">
            <IconButton
              onClick={toggleFavorite}
              size="small"
              className="favorite-icon"
            >
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ProductImage;
