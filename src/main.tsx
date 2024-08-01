import { type Store, configureStore } from "@reduxjs/toolkit";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./index.css";
import { budgetStore } from "./stores/Budget/index.tsx";
import { budgetsStore } from "./stores/Budgets/index.tsx";
import { errorStore } from "./stores/Error";
import { forceLoginStore } from "./stores/ForceLogin/index.tsx";
import { languageStore } from "./stores/Language/index.tsx";
import { loaderStore } from "./stores/Loader/index.tsx";
import { modalsStore } from "./stores/Modals/index.tsx";
import { userStore } from "./stores/User";

const root: HTMLElement | null = document.getElementById("root");

const store: Store = configureStore({
	reducer: {
		user: userStore.reducer,
		budget: budgetStore.reducer,
		budgets: budgetsStore.reducer,
		modals: modalsStore.reducer,
		error: errorStore.reducer,
		language: languageStore.reducer,
		loader: loaderStore.reducer,
		forceLogin: forceLoginStore.reducer,
	},
});

if (root) {
	ReactDOM.createRoot(root).render(
		<React.StrictMode>
			<Provider store={store}>
				<App />
			</Provider>
		</React.StrictMode>,
	);
}
