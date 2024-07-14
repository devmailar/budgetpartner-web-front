import { type Store, configureStore } from "@reduxjs/toolkit";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./index.css";
import { budgetStore } from "./stores/Budget/index.tsx";
import { budgetsStore } from "./stores/Budgets/index.tsx";
import { errorStore } from "./stores/Error";
import { languageStore } from "./stores/Language/index.tsx";
import { modalStore } from "./stores/Modal/index.tsx";
import { userStore } from "./stores/User";

const rootElement: HTMLElement | null = document.getElementById("root");

const store: Store = configureStore({
	reducer: {
		error: errorStore.reducer,
		user: userStore.reducer,

		budget: budgetStore.reducer,
		budgets: budgetsStore.reducer,

		modal: modalStore.reducer,
		language: languageStore.reducer,
	},
});

if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<Provider store={store}>
			<App />
		</Provider>,
	);
}
