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

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
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
		<Modal index={50}>
			<form className="flex flex-col w-80" onSubmit={handleSubmit}>
				<div className="flex flex-col">
					<div className="flex px-4 pt-4">
						<h1 className="text-sm text-white font-normal font-rubik">Set new Income ✍️</h1>
					</div>

					<div className="px-4 py-4">
						<div className="flex items-center justify-between p-2.5 border-[0.5px] border-[#4B4B4B] rounded-lg">
							<input
								className="bg-transparent w-full text-sm text-white placeholder:text-white font-normal font-rubik focus:outline-none"
								type="number"
								name="income"
								id="income"
								placeholder={budget.income_amount_monthly.toString()}
								required
							/>

							<span className="text-sm text-white font-normal font-rubik">€/MO</span>
						</div>
					</div>
				</div>

				<button type="submit" className="btn border-t border-t-[#242424] py-2.5">
					<span className="text-sm text-[#895FF5] font-normal font-rubik">Save</span>
				</button>
			</form>
		</Modal>
	);
}

export default IncomeModalEdit;
