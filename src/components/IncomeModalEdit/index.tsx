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
			<form className="flex flex-col gap-y-6 px-4 py-4" onSubmit={handleSubmit}>
				<span className="text-sm text-[#FFFFFF] font-medium font-rubik">
					Set new income ✍️
				</span>

				<div className="flex gap-x-4 items-center justify-between p-2 border-[1px] border-[#4B4B4B] rounded-lg">
					<input
						className="bg-transparent w-full text-sm text-white placeholder:text-white font-light font-rubik focus:outline-none"
						type="number"
						name="income"
						id="income"
						placeholder={budget.income_amount_monthly.toString()}
						required
					/>

					<span className="text-xs text-white font-light font-rubik">
						EUR/MONTH
					</span>
				</div>

				<button type="submit" className="btn bg-[#895FF5] py-2 rounded-lg">
					<span className="text-xs text-white font-medium font-rubik">
						Save
					</span>
				</button>
			</form>
		</Modal>
	);
}

export default IncomeModalEdit;
