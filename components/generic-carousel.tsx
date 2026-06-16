import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { ForwardedRef, forwardRef, useState } from "react";
import { SwipeEventData, useSwipeable } from "react-swipeable";

interface GenericCarouselProps {
  children: React.ReactNode[];
  childrenCount?: number;
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  slideStyle?: React.CSSProperties;
  showDots?: boolean;
  disableSwipe?: boolean;
  showArrows?: boolean;
  onTap?: () => void;
}

export interface CarouselHandles {
  handleNextClick: () => void;
  handlePrevClick: () => void;
}

const GenericCarousel = forwardRef<CarouselHandles, GenericCarouselProps>(
  (
    {
      children,
      childrenCount,
      style,
      containerStyle,
      slideStyle,
      showDots,
      showArrows,
      disableSwipe,
      onTap,
    }: GenericCarouselProps,
    ref: ForwardedRef<CarouselHandles>,
  ) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [swipePosition, setSwipePosition] = useState(0);

    const childrenLength = childrenCount || children?.length || 0;

    React.useEffect(() => {
      setCurrentIndex(0);
    }, [children, childrenLength]);

    const handlePrevClick = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : childrenLength - 1,
      );
    };

    const handleNextClick = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentIndex((prevIndex) =>
        prevIndex < childrenLength - 1 ? prevIndex + 1 : 0,
      );
    };

    const handleDotClick = (index: number) => {
      setCurrentIndex(index);
    };

    const handleSwiping = (eventData: SwipeEventData) => {
      if (disableSwipe) return;
      setSwipePosition(eventData.deltaX);
    };

    const handleSwiped = (eventData: SwipeEventData) => {
      if (disableSwipe) return;

      if (eventData.dir === "Left" && currentIndex < childrenLength - 1) {
        handleNextClick();
      } else if (eventData.dir === "Right" && currentIndex > 0) {
        handlePrevClick();
      }
      setSwipePosition(0);
    };

    const handlers = useSwipeable({
      onSwiping: handleSwiping,
      onSwiped: handleSwiped,
      onTap: onTap,
      trackTouch: true,
    });

    // Forwarding ref to parent component
    React.useImperativeHandle<CarouselHandles, CarouselHandles>(ref, () => ({
      handleNextClick,
      handlePrevClick,
    }));

    const refPassthrough = (el: HTMLDivElement) => {
      // call useSwipeable ref prop with el
      handlers.ref(el);

      // set myRef el so you can access it yourself
      if (ref) {
        (ref as any).current = el;
      }
    };

    return (
      <div id="generic-carousel">
        <div
          className="navigator-section"
          style={style}
          {...handlers}
          ref={refPassthrough}
        >
          <div
            className="navigator-container"
            style={{
              transform: `translateX(${-currentIndex * 100 + swipePosition / 4}%)`,
              ...containerStyle,
            }}
          >
            {React.Children.map(children, (child, index) => (
              <div key={index} className="navigator-slide" style={slideStyle}>
                {child}
              </div>
            ))}
          </div>
        </div>
        {showArrows && (
          <div className="navigation">
            <IconButton
              size="small"
              onClick={handlePrevClick}
              sx={{
                marginLeft: "10px",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                "&:hover": {
                  scale: 1.4,
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                },
                "&:active": { scale: 0.8 },
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleNextClick}
              sx={{
                marginRight: "10px",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                "&:hover": {
                  scale: 1.4,
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                },
                "&:active": { scale: 0.8 },
              }}
            >
              <ChevronRight />
            </IconButton>
          </div>
        )}
        {showDots && (
          <div className="pagination-dots">
            {children.map(
              (_, index) =>
                index < childrenLength && (
                  <span
                    key={index}
                    className={`dot ${currentIndex === index ? "active" : ""}`}
                    onClick={() => handleDotClick(index)}
                  ></span>
                ),
            )}
          </div>
        )}
      </div>
    );
  },
);

GenericCarousel.displayName = "GenericCarousel";

export default GenericCarousel;

interface GenericCarouselProps {
  children: React.ReactNode[];
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  slideStyle?: React.CSSProperties;
  showDots?: boolean;
  disableSwipe?: boolean;
  showArrows?: boolean;
  onTap?: () => void;
}

export interface CarouselHandles {
  handleNextClick: () => void;
  handlePrevClick: () => void;
}
