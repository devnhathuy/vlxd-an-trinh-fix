import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const timer = setTimeout(() => {
      const element = document.querySelector(location.hash);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return null;
}