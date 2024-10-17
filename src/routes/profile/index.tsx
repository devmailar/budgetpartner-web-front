import React, { type ReactNode } from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import useAuthStore, { type IAuthState } from "../../stores/auth";
import useBudgetStore, { type IBudgetState } from "../../stores/budget";
import useBudgetsStore, { type IBudgetsState } from "../../stores/budgets";
import useUserStore, { type IUserState } from "../../stores/user";
import type { IResponseError } from "../../types";
import { Utils } from "../../utils";

const Profile = (): ReactNode => {
	const navigate: NavigateFunction = useNavigate();

	const { value: auth, setAuthStore } = useAuthStore();
	const { setBudgetStore } = useBudgetStore();
	const { setBudgetsStore } = useBudgetsStore();
	const { setUserStore } = useUserStore();

	const handleDelete = async () => {
		try {
			const removeUserResponse: Response = await fetch(`${Utils.baseUrl}/users/remove`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${auth}` },
			});

			if (!removeUserResponse.ok) {
				const removeUserResponseError: IResponseError = await removeUserResponse.json();

				throw new Error(removeUserResponseError.errorMessage);
			}

			handleLogout();
		} catch (error: unknown) {
			if (error instanceof Error) {
				alert(error.message);
				throw new Error(error.stack);
			}
		}
	};

	const handleLogout = () => {
		try {
			setAuthStore("" as IAuthState["value"]);
			setBudgetStore({} as IBudgetState["value"]);
			setBudgetsStore([] as IBudgetsState["value"]);
			setUserStore({} as IUserState["value"]);

			return navigate("/");
		} catch (error: unknown) {
			if (error instanceof Error) {
				alert(error.message);
				throw new Error(error.stack);
			}
		}
	};

	return (
		<div className="h-screen animate__animated animate__slideInRight animate__faster">
			<nav className="flex items-center justify-between px-8 pt-4">
				<a href="/" className="text-lg text-white font-bold">
					BudgetPartner
				</a>

				{auth ? (
					<button type="button" className="btn px-0.5 py-0.5" onClick={(): void => navigate("/")}>
						<svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<title>Arrow Back</title>
							<path
								d="M9 14L5 10L9 6"
								stroke="#007AFF"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M5 10H16C17.0609 10 18.0783 10.4214 18.8284 11.1716C19.5786 11.9217 20 12.9391 20 14C20 15.0609 19.5786 16.0783 18.8284 16.8284C18.0783 17.5786 17.0609 18 16 18H15"
								stroke="#007AFF"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
				) : (
					<div className="relative">
						<div className="absolute -right-2 top-0 w-2 h-2 bg-[#ff0000] rounded-full" />

						<button type="button" onClick={(): void => navigate("/login")}>
							<span className="text-lg text-[#007AFF] font-medium">Login</span>
						</button>
					</div>
				)}
			</nav>

			<div className="flex flex-col gap-y-6 items-start px-8 py-8">
				<button type="button" onClick={(): Promise<void> => handleDelete()}>
					<span className="text-lg text-[#66666F] font-normal underline">Delete Account</span>
				</button>

				<button type="button" onClick={(): void => handleLogout()}>
					<span className="text-lg text-[#66666F] font-normal underline">Logout</span>
				</button>
			</div>
		</div>
	);
};

export default Profile;
