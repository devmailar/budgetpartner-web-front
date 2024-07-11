import type { Dispatch } from "@reduxjs/toolkit";
import { eachDayOfInterval, endOfMonth, startOfMonth } from "date-fns";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "../../stores/Modal";
import { type IRootState, Period, type TBudget, type TExtraincome, type TRecurringexpense } from "../../types";
import Modal from "../Modal";

function IncomeModal() {
	const dispatch: Dispatch = useDispatch();

	const budget: TBudget = useSelector((state: IRootState) => state.budget);
	const extraincomes: TExtraincome[] = useSelector((state: IRootState) => state.extraincomes);
	const recurringexpenses: TRecurringexpense[] = useSelector((state: IRootState) => state.recurringexpenses);

	const [selectedPeriod, setSelectedPeriod] = useState<Period>(Period.DAY);

	const currentDaysInMonth: Date[] = eachDayOfInterval({
		start: startOfMonth(new Date()),
		end: endOfMonth(new Date()),
	});

	const totalExtraincomes: number = extraincomes.reduce((accumulator: number, extraincome: TExtraincome) => {
		return accumulator + extraincome.extraincome_amount_monthly;
	}, 0);

	const totalRecurringexpenses: number = recurringexpenses.reduce(
		(accumulator: number, recurringexpense: TRecurringexpense) => {
			return accumulator + recurringexpense.recurringexpense_amount_monthly;
		},
		0,
	);

	const convertPeriodAmount = (amount: number, selectedPeriod: Period): number => {
		switch (selectedPeriod) {
			case Period.DAY:
				return amount / currentDaysInMonth.length;
			case Period.MONTH:
				return amount;
			case Period.YEAR:
				return amount * 12;
			default:
				return amount;
		}
	};

	return (
		<Modal index={50}>
			<div className="flex flex-col w-80">
				<div className="flex flex-col gap-y-4 px-4 pt-4">
					<nav className="flex items-center gap-x-1 px-1 py-1 bg-[#202020] rounded-2xl w-fit">
						<button
							type="button"
							className={`flex items-center ${selectedPeriod === Period.DAY && "bg-[#4B4B4B]"} p-[3px] rounded-full`}
							onClick={(): void => {
								setSelectedPeriod(Period.DAY);
							}}
						>
							<span
								className={`text-xs ${selectedPeriod === Period.DAY ? "text-white" : "text-[#4B4B4B]"} font-bold font-rubik`}
							>
								DA
							</span>
						</button>

						<button
							type="button"
							className={`flex items-center ${selectedPeriod === Period.MONTH && "bg-[#4B4B4B]"} p-[3px] rounded-full`}
							onClick={(): void => {
								setSelectedPeriod(Period.MONTH);
							}}
						>
							<span
								className={`text-xs ${selectedPeriod === Period.MONTH ? "text-white" : "text-[#4B4B4B]"} font-bold font-rubik`}
							>
								MO
							</span>
						</button>

						<button
							type="button"
							className={`flex items-center ${selectedPeriod === Period.YEAR && "bg-[#4B4B4B]"} p-[3px] rounded-full`}
							onClick={(): void => {
								setSelectedPeriod(Period.YEAR);
							}}
						>
							<span
								className={`text-xs ${selectedPeriod === Period.YEAR ? "text-white" : "text-[#4B4B4B]"} font-bold font-rubik`}
							>
								YE
							</span>
						</button>
					</nav>

					<div className="flex items-center justify-between">
						<h1 className="text-base text-white font-normal font-rubik">Budget</h1>
						<span className="text-base text-white font-normal font-rubik">
							{convertPeriodAmount(
								budget.income_amount_monthly + totalExtraincomes - totalRecurringexpenses,
								selectedPeriod,
							).toFixed(2)}{" "}
							€
						</span>
					</div>
				</div>

				<div className="flex flex-col px-4 py-4">
					<div className="flex items-center justify-between">
						<span className="text-sm text-green-600 font-normal font-rubik">Income</span>
						<span className="text-sm text-white font-medium font-rubik">
							{convertPeriodAmount(budget.income_amount_monthly, selectedPeriod).toFixed(2)}
						</span>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-sm text-white font-normal font-rubik">Extraincome 💰</span>
						<span className="text-sm text-white font-medium font-rubik">
							{convertPeriodAmount(totalExtraincomes, selectedPeriod).toFixed(2)}
						</span>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-sm text-white font-normal font-rubik">Recurring expenses 💰</span>
						<span className="text-sm text-white font-medium font-rubik">
							{convertPeriodAmount(totalRecurringexpenses, selectedPeriod).toFixed(2)}
						</span>
					</div>
				</div>

				<button
					type="button"
					className="btn border-t border-t-[#202020] py-2.5"
					onClick={(): void => {
						dispatch(
							setModal({
								extraincomeModal: false,
								extraexpenseModal: false,
								incomeModal: false,
								incomeModalEdit: false,
							}),
						);
					}}
				>
					<span className="text-sm text-[#895FF5] font-normal font-rubik">Close</span>
				</button>
			</div>
		</Modal>
	);
}

export default IncomeModal;
