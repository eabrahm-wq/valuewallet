import { useState, useEffect } from "react";
import Landing from "./Landing.jsx";
import App from "./App.jsx";

export default function Root() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (to) => {
    window.history.pushState({}, "", to);
    setPath(to);
  };

  if (path.startsWith("/app")) {
    return <App />;
  }

  return <Landing onLaunchApp={() => navigate("/app")} />;
}
