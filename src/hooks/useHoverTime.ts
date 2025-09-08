import {useRef} from "react";

export function useHoverTime(onHoverEnd?: (time: number) => void) {

  const hoverStart = useRef<number | null>(null);

  const handleMouseEnter = () => {
    hoverStart.current = Date.now();
  }

  const handleMouseLeave = () => {
    if (hoverStart.current) {
      const timeSpent = (Date.now() - hoverStart.current) / 1000;
      hoverStart.current = null;
      if(onHoverEnd) {
        onHoverEnd(timeSpent);
      }
    }
  }
  return{
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave
  }
}
