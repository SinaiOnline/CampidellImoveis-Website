import Image from "next/image";
import React from "react";

import Gallery, { ReactImageGalleryProps } from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import {
  ReactZoomPanPinchContentRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";

import IsIOS from "@/lib/detect-device";
import { HandlePhotoError, HandlePhotoLoaded, ImageOrNoImagePlaceholder, IsNoImagePlaceholder, NoImagePlaceholder, NoImagePlaceholderClassName } from "@/utils/default-image";

import * as PropertyService from "@/services/property";
import Property from "@/types/property";

const ReactImageGallery = (Gallery as any).default
  ? (Gallery as any).default
  : Gallery;

interface props {
  property: Property;
  largeScreen: boolean;
}

export default function PropertyPhotoGallery(props: props) {
  const { property, largeScreen } = props;

  const galleryRef = React.useRef<ReactImageGalleryProps>();
  const galleryContainerRef = React.useRef<HTMLDivElement>();
  const transformWrapperRef = React.useRef<ReactZoomPanPinchContentRef>();

  const isIOS = React.useMemo(() => IsIOS(), []);

  const [isZoomingIn, setIsZoomingIn] = React.useState(false);
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  React.useEffect(() => {
    const thumbnailContainer = document.querySelector(
      ".image-gallery-thumbnails",
    );
    if (!thumbnailContainer) return;

    const handleWheel = (e: Event) => e.stopPropagation();
    thumbnailContainer.addEventListener("wheel", handleWheel, {
      passive: true,
    });

    return () => {
      thumbnailContainer.removeEventListener("wheel", handleWheel);
    };
  }, [isFullScreen, isZoomingIn, largeScreen]);

  const resetZoom = async () => {
    transformWrapperRef.current?.resetTransform(50);
    await new Promise((resolve) => setTimeout(resolve, 50));
  };

  async function toggleFullScreen(slideIndex?: number) {
    if (!property) return;
    if (isIOS) return;

    if (PropertyService.GetFirstPicture(property) === NoImagePlaceholder) {
      return;
    }

    let isFullScreen = Boolean(document.fullscreenElement);
    const isTouchScreen =
      "ontouchstart" in window ||
      window.matchMedia("(pointer: coarse)").matches;

    try {
      if (!isFullScreen) {
        await resetZoom();
        await galleryContainerRef?.current?.requestFullscreen();
        setIsFullScreen(true);
      } else if (isTouchScreen || !isZoomingIn) {
        await resetZoom();
        await document.exitFullscreen();
        setIsFullScreen(false);
      }
    } catch (e) {
      console.error(e);
    }

    if (slideIndex !== undefined) {
      (galleryRef.current as any)?.slideToIndex(slideIndex);
    }
  }

  const firstPicture = React.useMemo(() => PropertyService.GetFirstPicture(property), [property])

  return (
    <>
      {largeScreen && (
        <div className="image-grid">
          <div className="image-grid-item">
            <Image
              loading="eager"
              unoptimized
              height={500}
              width={666.66}
              onClick={() => toggleFullScreen(0)}
              src={ImageOrNoImagePlaceholder(firstPicture)}
              className={"main-image" + (IsNoImagePlaceholder(firstPicture) ? ` ${NoImagePlaceholderClassName}` : "")}
              onError={HandlePhotoError} 
              onLoad={HandlePhotoLoaded}
              alt={property.imovel}
            />
          </div>
            <div className="other-images">
              {PropertyService.GetPictures(property)
                .slice(1)
                .filter((_, index) => index < 12)
                .map((image, index) => (
                  <div key={index} className="image-grid-item">
                    <Image
                      loading="lazy"
                      unoptimized
                      height={255}
                      width={332.5}
                      src={ImageOrNoImagePlaceholder(image)}
                      className={IsNoImagePlaceholder(image) ? NoImagePlaceholderClassName : ""}
                      onError={HandlePhotoError} 
                      onLoad={HandlePhotoLoaded}
                      alt={property.imovel}
                      onClick={() => toggleFullScreen(index + 1)}
                    />
                  </div>
              ))}
            </div>
        </div>
      )}
      <div
        className={`gallery-container ${largeScreen ? "largeScreen" : ""}`}
        ref={galleryContainerRef as any}
      >
        <TransformWrapper
          ref={transformWrapperRef as any}
          limitToBounds
          disablePadding
          doubleClick={{ disabled: true }}
          onTransformed={(_, state) => setIsZoomingIn(state.scale > 1)}
          disabled={!isFullScreen} // disable outside fullscreen
          // wheel={{wheelDisabled: true}} // disable with mouse
        >
          <TransformComponent>
            <ReactImageGallery
              ref={galleryRef}
              onClick={() => toggleFullScreen()}
              showFullscreenButton={false}
              showPlayButton={false}
              showThumbnails={largeScreen}
              showNav={!isZoomingIn}
              slideDuration={100}
              disableSwipe={isZoomingIn}
              disableThumbnailScroll
              onBeforeSlide={() => resetZoom()}
              onErrorImageURL={NoImagePlaceholder}
              onSlide={(currentIndex: number) => {
                const thumnails = Array.from(document.querySelector(".image-gallery-thumbnails-container")?.children || [])
                const currentThumnail = thumnails[currentIndex]
                currentThumnail?.scrollIntoView({ "behavior": "smooth", "block": "center" })
              }}
              thumbnailPosition={largeScreen ? "right" : "bottom"}
              items={PropertyService.GetPictures(property).map((img, index) => ({
                original: img,
                thumbnail: img,
                originalClass: "featured-slide",
                thumbnailClass: "thumbnail-slide",
                loading: index === 0 ? "eager" : "lazy",
              }))}
              lazyLoad
              renderItem={(item: { original: string, loading: "lazy" | "eager" }) => (
                 <Image
                  unoptimized
                  src={ImageOrNoImagePlaceholder(item.original)}
                  className={IsNoImagePlaceholder(item.original) ? NoImagePlaceholderClassName : ""}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  loading={item.loading}
                  onError={HandlePhotoError}
                  onLoad={HandlePhotoLoaded}
                />
              )}
              renderThumbInner={(item: { thumbnail: string }) => (
                <span className="image-gallery-thumbnail-inner">
                  <Image
                    unoptimized
                    src={ImageOrNoImagePlaceholder(item.thumbnail)}
                    className={`image-gallery-thumbnail-image ${IsNoImagePlaceholder(item.thumbnail) ? NoImagePlaceholderClassName : ""}`}
                    alt=""
                    height={100}
                    width={100}
                    style={{ objectFit: "cover" }}
                    loading="lazy"
                    onError={HandlePhotoError}
                    onLoad={HandlePhotoLoaded}
                  />
                </span>
              )}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>
    </>
  );
}
