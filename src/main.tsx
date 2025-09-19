import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppContextProvider } from "./context/AppContext";

/* import { TempoDevtools } from 'tempo-devtools'; [deprecated] */
/* TempoDevtools.init() [deprecated] */ const basename = import.meta.env
  .BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
