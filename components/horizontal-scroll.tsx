import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import React, { useRef } from "react";

interface HorizontalScrollProps {
  children: React.ReactNode;
  scrollAmount?: number;
  disabled?: boolean;
}

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  children,
  disabled,
  scrollAmount = 500,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentScrollContainerRef = scrollContainerRef.current;
  const [leftButtonEnabled, setLeftButtonEnabled] = React.useState(false);
  const [rightButtonEnabled, setRightButtonEnabled] = React.useState(true);

  React.useEffect(() => {
    const handleScroll = () => {
      if (currentScrollContainerRef) {
        setLeftButtonEnabled(currentScrollContainerRef.scrollLeft > 0);
        setRightButtonEnabled(
          currentScrollContainerRef.scrollLeft <
            currentScrollContainerRef.scrollWidth -
              currentScrollContainerRef.clientWidth,
        );
      }
    };

    if (currentScrollContainerRef) {
      currentScrollContainerRef.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
    }

    return () => {
      if (currentScrollContainerRef) {
        currentScrollContainerRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [currentScrollContainerRef]);

  const scrollLeft = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div id="horizontal-scroll">
      <button
        className="scroll-left-button"
        disabled={!leftButtonEnabled}
        onClick={scrollLeft}
      >
        <ChevronLeft />
      </button>
      <div className="scroll-container" ref={scrollContainerRef}>
        {children}
      </div>
      <button
        className="scroll-right-button"
        disabled={!rightButtonEnabled}
        onClick={scrollRight}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default HorizontalScroll;
