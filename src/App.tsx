import { RouterProvider, createBrowserRouter } from "react-router-dom";
import CreateAnAccount from "./routes/CreateAnAccount";
import Login from "./routes/Login";

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
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
