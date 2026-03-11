import { useState, useEffect } from "react";
import "./App.css";
import SideMenu from "./components/SideMenu";
import { getSdkOptions } from "./utils/function";

function App() {
  useEffect(() => {
    // Dynamically load the script
    const script = document.createElement("script");
    script.src =
      "./build/chatbot_sdk.js?key=GY4GKNDGMM4GMNZXHBRTEOJRG43DQNZWGE3TANQ=&apiUrl=https://ragqa-chat.contus.us/rag-api";
    script.async = true;

    script.onload = () => {
      if (window.MirrorFlyAi) {
        // Initialize SDK once into a single shared container
        window.MirrorFlyAi.init({
          container: "#chatbot-root",
          ...getSdkOptions(),
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup script if necessary (though usually SDKs might leave global state)
      // document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <div className="app-container">
        <SideMenu />

        <div className="content" id="chatbot-root"></div>
      </div>
    </>
  );
}

export default App;
  