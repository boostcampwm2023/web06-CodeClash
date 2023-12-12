import { createBrowserHistory } from "history";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const preventBack = () => {
  useEffect(() => {
    const preventGoBack = () => {
      alert("뒤로가기는 금지되어있습니다.");
      window.history.pushState(null, "", location.href);
    };

    window.history.pushState(null, "", location.href);
    window.addEventListener("popstate", preventGoBack);

    return () => {
      window.removeEventListener("popstate", preventGoBack);
    };
  }, []);
};

const history = createBrowserHistory();

export const useBlock = () => {
  const location = useLocation();
  useEffect(() => {
    const unlisten = history.listen(his => {
      if (his.action === "POP") {
        history.push(location);
      }
    });
    return unlisten;
  }, [location]);
};
