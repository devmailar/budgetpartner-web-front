import { type Store, configureStore } from "@reduxjs/toolkit";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import AppNavigator from "./components/AppNavigator/index.tsx";
import "./main.css";
import { authStore } from "./stores/auth/index.tsx";
import { budgetStore } from "./stores/budget/index.tsx";
import { budgetsStore } from "./stores/budgets/index.tsx";
import { userStore } from "./stores/user/index.tsx";

const root: HTMLElement | null = document.getElementById("root");

if (root) {
	const store: Store = configureStore({
		reducer: {
			auth: authStore.reducer,
			user: userStore.reducer,
			budget: budgetStore.reducer,
			budgets: budgetsStore.reducer,
		},
	});

	createRoot(root).render(
		<Provider store={store}>
			<AppNavigator />
		</Provider>,
	);
}
