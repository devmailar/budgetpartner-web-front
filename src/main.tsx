import { type Store, configureStore } from "@reduxjs/toolkit";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./index.css";
import { budgetStore } from "./stores/Budget/index.tsx";
import { budgetsStore } from "./stores/Budgets/index.tsx";
import { errorStore } from "./stores/Error";
import { forceLoginStore } from "./stores/ForceLogin/index.tsx";
import { languageStore } from "./stores/Language/index.tsx";
import { modalsStore } from "./stores/Modals/index.tsx";
import { userStore } from "./stores/User";

const store: Store = configureStore({
	reducer: {
		user: userStore.reducer,
		budget: budgetStore.reducer,
		budgets: budgetsStore.reducer,
		modals: modalsStore.reducer,
		error: errorStore.reducer,
		language: languageStore.reducer,
		forceLogin: forceLoginStore.reducer,
	},
});

const root: HTMLElement | null = document.getElementById("root");
if (root) {
	ReactDOM.createRoot(root).render(
		<Provider store={store}>
			<App />
		</Provider>,
	);
}
