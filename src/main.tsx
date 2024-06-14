import { type Store, configureStore } from "@reduxjs/toolkit";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./index.css";
import { budgetStore } from "./stores/Budget/index.tsx";
import { errorStore } from "./stores/Error";
import { userStore } from "./stores/User";

const rootElement: HTMLElement | null = document.getElementById("root");

const store: Store = configureStore({
	reducer: {
		error: errorStore.reducer,
		user: userStore.reducer,
		budget: budgetStore.reducer,
	},
});

if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<Provider store={store}>
			<App />
		</Provider>,
	);
}
