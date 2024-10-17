import React from "react";
import { createRoot } from "react-dom/client";
import AppNavigator from "./components/AppNavigator/index.tsx";
import "./main.css";

const root: HTMLElement | null = document.getElementById("root");

if (root) {
	createRoot(root).render(<AppNavigator />);
}
