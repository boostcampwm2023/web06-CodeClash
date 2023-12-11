import { useEffect } from "react";

const preventBack = () => {
  useEffect(() => {
    const preventGoBack = () => {
      history.pushState(null, "", location.href);
    };

    history.pushState(null, "", location.href);
    window.addEventListener("popstate", preventGoBack);

    return () => window.removeEventListener("popstate", preventGoBack);
  }, []);
};

export default preventBack;
