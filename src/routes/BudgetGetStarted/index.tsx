import type { Dispatch } from "@reduxjs/toolkit";
import React, { type MouseEvent } from "react";
import { useDispatch } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import { setError } from "../../stores/Error";
import { Utils } from "../../utils";

function BudgetGetStarted() {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const handleCreate = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
		try {
			e.preventDefault();
			setError("");

			const authorization: string | undefined = getCookie("Authorization");
			if (!authorization) {
				dispatch(setError("Please login to continue"));
				return;
			}

			await Utils.request.post("budgets/create", {
				headers: {
					Authorization: `Bearer ${authorization}`,
				},
			});

			// TODO: Direct to budget page

			// navigate("/");
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError("Budget already exists"));
			}
		}
	};

	React.useEffect((): void => {
		const authorization: string | undefined = getCookie("Authorization");

		if (!authorization) {
			navigate("/");
		}
	}, [navigate]);

	return (
		<div className="flex items-center justify-center bg-radial-gradient w-screen h-screen">
			<div className="flex flex-col gap-y-6 justify-center w-[400px]">
				<div className="flex flex-col gap-y-1 items-center">
					<img
						src="https://ucarecdn.com/5be54da1-0bf6-4d18-8209-07fe1c228ddc/-/preview/512x512/"
						alt="Growth"
						width="160"
						height="160"
					/>

					<h1 className="text-2xl text-white font-medium font-rubik">Setup budget</h1>

					<p className="text-sm text-white font-normal font-rubik text-center">
						We’ll guide you through the steps of setting up your budget.
					</p>
				</div>

				<button type="button" className="btn bg-[#895FF5] py-2 rounded-lg" onClick={handleCreate}>
					<span className="text-sm text-white font-medium font-rubik">Get started</span>
				</button>
			</div>
		</div>
	);
}

export default BudgetGetStarted;
