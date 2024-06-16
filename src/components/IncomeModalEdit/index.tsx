import type { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "typescript-cookie";
import { setError } from "../../stores/Error";
import type { IRootState, TBudget } from "../../types";
import { request } from "../../utils";
import Modal from "../Modal";

function IncomeModalEdit() {
	const dispatch: Dispatch = useDispatch();

	const budget: TBudget = useSelector((state: IRootState) => state.budget);

	const handleSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		try {
			dispatch(setError(""));

			event.preventDefault();

			const form: FormData = new FormData(event.currentTarget);
			const income: number = Number.parseInt(form.get("income") as string);
			const authorization: string | undefined = getCookie("Authorization");

			if (!authorization) {
				dispatch(setError("Please login to continue"));
				return;
			}

			if (income <= 0 || Number.isNaN(income)) {
				dispatch(setError("Please enter valid amount"));
				return;
			}

			await request.post("budgets/update", {
				json: {
					income_amount_monthly: income,
				},
				headers: {
					Authorization: `Bearer ${authorization}`,
				},
			});

			window.location.reload();
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError("Failed to update income! 😢"));
			}
		}
	};

	return (
		<Modal index={10}>
			<form className="flex flex-col w-80" onSubmit={handleSubmit}>
				<div className="flex flex-col gap-y-3 p-4 ">
					<h1 className="text-sm text-white font-medium font-rubik">
						Set monthly income ✍️
					</h1>

					<div className="flex items-center justify-between p-2 border-[1px] border-[#4B4B4B] rounded-lg">
						<input
							className="bg-transparent w-full text-sm text-white placeholder:text-white font-light font-rubik focus:outline-none"
							type="number"
							name="income"
							id="income"
							placeholder={budget.income_amount_monthly.toString()}
							required
						/>

						<span className="text-xs text-white font-light font-rubik">
							€/M
						</span>
					</div>
				</div>

				<button type="submit" className="btn border-t border-t-[#242424]">
					<div className="flex gap-x-1 items-center justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1.25em"
							height="1.25em"
							viewBox="0 0 24 24"
						>
							<title>Save</title>
							<path
								fill="#895FF5"
								d="M21 7v12q0 .825-.587 1.413T19 21H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h12zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"
							/>
						</svg>
						<span className="text-sm text-[#895FF5] font-normal font-rubik">
							Save
						</span>
					</div>
				</button>
			</form>
		</Modal>
	);
}

export default IncomeModalEdit;
