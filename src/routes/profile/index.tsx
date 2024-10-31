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

					throw new Error(removeUserResponseError.message);
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
		<div className="flex justify-center">
			<div className="flex flex-col gap-y-12 w-full w-full md:w-[40rem] animate__animated animate__slideInRight animate__faster">
				<nav className="flex items-center justify-start px-6 md:px-0 py-3 border-b-[0.33px] border-b-[#454545]">
					<button type="button" className="btn" onClick={(): void => navigate("/")}>
						<span className="text-xl text-[#66666F] font-bold font-rubik">Back</span>
					</button>
				</nav>

				<div className="flex flex-col gap-y-6 px-6 md:px-0">
					<button type="button" onClick={(): Promise<void> => handleDelete()}>
						<span className="text-lg text-[#66666F] font-bold underline">Delete Account</span>
					</button>

					<button type="button" onClick={(): void => handleLogout()}>
						<span className="text-lg text-[#66666F] font-bold underline">Logout</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default Profile;
