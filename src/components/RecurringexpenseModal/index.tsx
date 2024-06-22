import type { Dispatch } from "@reduxjs/toolkit";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import { setError } from "../../stores/Error";
import type { IRootState, TRecurringexpense } from "../../types";
import { Utils } from "../../utils";
import Modal from "../Modal";

function RecurringexpenseModal(): ReactNode {
	const navigate: NavigateFunction = useNavigate();
	const dispatch: Dispatch = useDispatch();

	const recurringexpenses: TRecurringexpense[] = useSelector((state: IRootState) => state.recurringexpenses);

	const totalRecurringexpenses: number = recurringexpenses.reduce(
		(accumulator: number, recurringexpense: TRecurringexpense) => {
			return accumulator + recurringexpense.recurringexpense_amount_monthly;
		},
		0,
	);

	const [addRecurringexpense, setAddRecurringexpense] = useState<boolean>(false);

	const handleAddRecurringexpense = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		try {
			dispatch(setError(""));

			event.preventDefault();

			const form: FormData = new FormData(event.currentTarget);
			const recurringexpenseType: string = form.get("recurringexpense_type") as string;
			const recurringexpenseAmountMonthly: number = Number.parseInt(
				form.get("recurringexpense_amount_monthly") as string,
			);
			const authorization: string | undefined = getCookie("Authorization");

			if (!authorization) {
				dispatch(setError("Please login to continue"));
				return;
			}

			if (recurringexpenseAmountMonthly <= 0 || Number.isNaN(recurringexpenseAmountMonthly)) {
				dispatch(setError("Please enter valid amount"));
				return;
			}

			await Utils.request.post("recurringexpenses/create", {
				json: {
					recurringexpense_type: recurringexpenseType,
					recurringexpense_amount_monthly: recurringexpenseAmountMonthly,
				},
				headers: {
					Authorization: `Bearer ${authorization}`,
				},
			});

			window.location.reload();
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		}
	};

	useEffect((): void => {
		async function onLoad(): Promise<void> {
			const authorization: string | undefined = getCookie("Authorization");

			if (!authorization) {
				navigate("/");
				return;
			}
		}

		onLoad();
	}, [navigate]);

	return (
		<Modal index={40}>
			<div className="flex flex-col w-80">
				{addRecurringexpense ? (
					<form className="flex flex-col" onSubmit={handleAddRecurringexpense}>
						<div className="flex px-4 pt-4">
							<h1 className="text-sm text-white font-normal font-rubik">Add new Recurring expense 💰</h1>
						</div>

						<div className="flex flex-col gap-y-2.5 px-4 py-4">
							<div className="flex items-center justify-between p-2.5 border-[0.5px] border-[#4B4B4B] rounded-lg">
								<input
									className="bg-transparent w-full text-sm text-white placeholder:text-white font-normal font-rubik focus:outline-none"
									type="text"
									name="recurringexpense_type"
									id="recurringexpense_type"
									required
								/>
							</div>

							<div className="flex items-center justify-between p-2.5 border-[0.5px] border-[#4B4B4B] rounded-lg">
								<input
									className="bg-transparent w-full text-sm text-white placeholder:text-white font-normal font-rubik focus:outline-none"
									type="number"
									name="recurringexpense_amount_monthly"
									id="recurringexpense_amount_monthly"
									placeholder="0.00"
									required
								/>

								<span className="text-sm text-white font-normal font-rubik">€/MO</span>
							</div>
						</div>

						<button type="submit" className="btn border-t border-t-[#242424] py-2.5">
							<span className="text-sm text-[#9E553C] font-normal font-rubik">Save</span>
						</button>
					</form>
				) : (
					<div className="flex flex-col">
						<div className="flex items-center justify-between px-4 py-4">
							<span className="text-sm text-white font-normal font-rubik">Recurring expenses 💰</span>
							<span className="text-sm text-white font-medium font-rubik">{totalRecurringexpenses.toFixed(2)} €</span>
						</div>

						<div className="flex flex-col px-4 pb-4">
							{recurringexpenses.map((recurringexpense: TRecurringexpense) => (
								<button
									key={recurringexpense.recurringexpense_type}
									type="button"
									className="flex items-center justify-between"
								>
									<span className="text-sm text-[#9E553C] font-normal font-rubik">
										{recurringexpense.recurringexpense_type}
									</span>
									<span className="text-sm text-white font-medium font-rubik">
										{recurringexpense.recurringexpense_amount_monthly.toFixed(2)} €
									</span>
								</button>
							))}
						</div>

						<button
							type="button"
							className="btn border-t border-t-[#202020] py-2.5"
							onClick={(): void => setAddRecurringexpense(true)}
						>
							<span className="text-sm text-[#9E553C] font-normal font-rubik">+ Add New</span>
						</button>
					</div>
				)}
			</div>
		</Modal>
	);
}

export default RecurringexpenseModal;
