import * as Redux from "@reduxjs/toolkit";
import * as ReactDom from "react-dom/client";
import * as ReactRedux from "react-redux";
import AppNavigator from "./components/AppNavigator/index.tsx";
import "./main.css";
import { authStore } from "./stores/auth/index.tsx";
import { budgetStore } from "./stores/budget/index.tsx";
import { budgetsStore } from "./stores/budgets/index.tsx";
import { userStore } from "./stores/user/index.tsx";

const root: HTMLElement | null = document.getElementById("root");

const store: Redux.Store = Redux.configureStore({
	reducer: {
		auth: authStore.reducer,
		user: userStore.reducer,
		budget: budgetStore.reducer,
		budgets: budgetsStore.reducer,
	},
});

if (root) {
	ReactDom.createRoot(root).render(
		<ReactRedux.Provider store={store}>
			<AppNavigator />
		</ReactRedux.Provider>,
	);
}
