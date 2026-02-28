import { useState } from "react";
import Landing from "./Landing.jsx";
import App from "./App.jsx";

export default function Root() {
  const [showApp, setShowApp] = useState(false);
  if (showApp) return <App onBack={() => setShowApp(false)} />;
  return <Landing onLaunchApp={() => setShowApp(true)} />;
}
