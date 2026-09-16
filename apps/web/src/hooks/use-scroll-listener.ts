import { createContext, useEffect, useState } from "react";

export function useScrollListener() {
  const [data, setData] = useState(() => ({
    x: window.scrollX,
    y: window.scrollY,
    lastX: window.scrollX,
    lastY: window.scrollY,
  }));

  useEffect(() => {
    const handleScroll = () => {
      setData(last => ({
        x: window.scrollX,
        y: window.scrollY,
        lastX: last.x,
        lastY: last.y,
      }));
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return data;
}

export const ScrollContext = createContext(null);
