import React from "react";
import ReactDOM from "react-dom/client";

import { MeteorContextProvider } from "@meteor-web3/hooks";

import App from "./App";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <MeteorContextProvider>
    <App />
  </MeteorContextProvider>,
);
