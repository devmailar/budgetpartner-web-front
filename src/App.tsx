import { type Store, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Budget from "./routes/Budget";
import CreateAnAccount from "./routes/CreateAnAccount";
import Login from "./routes/Login";
import { authStore } from "./stores/Auth";

const store: Store = configureStore({
	reducer: {
		auth: authStore.reducer,
	},
});

const router = createBrowserRouter([
	{
		path: "/",
		index: true,
		element: <Login />,
	},
	{
		path: "/create-an-account",
		element: <CreateAnAccount />,
	},
	{
		path: "/budget",
		element: <Budget />,
	},
]);

function App() {
	return (
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	);
}

export default App;
