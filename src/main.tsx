import { type Store, configureStore } from "@reduxjs/toolkit";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./index.css";
import { errorStore } from "./stores/Error";
import { extraincomesStore } from "./stores/Extraincomes/index.tsx";
import { modalStore } from "./stores/Modal/index.tsx";
import { recurringexpensesStore } from "./stores/Recurringexpenses/index.tsx";
import { userStore } from "./stores/User";
import { budgetsStore } from "./stores/Budgets/index.tsx";
import { budgetStore } from "./stores/Budget/index.tsx";

const rootElement: HTMLElement | null = document.getElementById("root");

const store: Store = configureStore({
	reducer: {
		error: errorStore.reducer,
		user: userStore.reducer,

		budget: budgetStore.reducer,
		budgets: budgetsStore.reducer,

		extraincomes: extraincomesStore.reducer,
		recurringexpenses: recurringexpensesStore.reducer,
		modal: modalStore.reducer,
	},
});

if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<Provider store={store}>
			<App />
		</Provider>,
	);
}
