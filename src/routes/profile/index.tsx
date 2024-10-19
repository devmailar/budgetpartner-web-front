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
			if (confirm("Are you sure you want to delete your account?")) {
				const removeUserResponse: Response = await fetch(`${Utils.baseUrl}/users/remove`, {
					method: "DELETE",
					headers: { Authorization: `Bearer ${auth}` },
				});

				if (!removeUserResponse.ok) {
					const removeUserResponseError: IResponseError = await removeUserResponse.json();

					throw new Error(removeUserResponseError.errorMessage);
				}

				handleLogout();
			}
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
		<div className="flex flex-col gap-y-12 animate__animated animate__slideInRight animate__faster">
			<nav className="flex items-center justify-start px-8 pt-3">
				<button type="button" onClick={(): void => navigate("/")}>
					<span className="text-xl text-[#66666F] font-bold">Back</span>
				</button>
			</nav>

			<div className="flex flex-col gap-y-6 px-8">
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
