import React from "react";
import ReactDOM from "react-dom/client";
import MenuFilter from "./MenuFilter.jsx";
import "./index.css";

const container = document.getElementById("react-root");

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <MenuFilter />
    </React.StrictMode>
  );
}

