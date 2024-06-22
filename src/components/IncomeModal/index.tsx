import type { Dispatch } from "@reduxjs/toolkit";
import { eachDayOfInterval, endOfMonth, startOfMonth } from "date-fns";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "../../stores/Modal";
import { type IRootState, Period, type TBudget, type TExtraincome } from "../../types";
import Modal from "../Modal";

function IncomeModal() {
	const dispatch: Dispatch = useDispatch();

	const budget: TBudget = useSelector((state: IRootState) => state.budget);
	const extraincomes: TExtraincome[] = useSelector((state: IRootState) => state.extraincomes);

	const [selectedPeriod, setSelectedPeriod] = useState<Period>(Period.DAY);

	const currentDaysInMonth: Date[] = eachDayOfInterval({
		start: startOfMonth(new Date()),
		end: endOfMonth(new Date()),
	});

	const totalExtraincomes: number = extraincomes.reduce((accumulator: number, extraincome: TExtraincome) => {
		return accumulator + extraincome.extraincome_amount_monthly;
	}, 0);

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
				<div className="flex flex-col">
					<div className="flex flex-col gap-y-4 px-4 pt-4">
						<div className="flex justify-center">
							<nav className="flex items-center gap-x-1 p-1 bg-[#202020] rounded-2xl">
								<button
									type="button"
									className={`flex items-center ${selectedPeriod === Period.DAY && "bg-[#4B4B4B]"} p-[5px] rounded-full`}
									onClick={(): void => {
										setSelectedPeriod(Period.DAY);
									}}
								>
									<span
										className={`text-sm ${selectedPeriod === Period.DAY ? "text-white" : "text-[#4B4B4B]"} font-normal font-rubik`}
									>
										DA
									</span>
								</button>

								<button
									type="button"
									className={`flex items-center ${selectedPeriod === Period.MONTH && "bg-[#4B4B4B]"} p-[5px] rounded-full`}
									onClick={(): void => {
										setSelectedPeriod(Period.MONTH);
									}}
								>
									<span
										className={`text-sm ${selectedPeriod === Period.MONTH ? "text-white" : "text-[#4B4B4B]"} font-normal font-rubik`}
									>
										MO
									</span>
								</button>

								<button
									type="button"
									className={`flex items-center ${selectedPeriod === Period.YEAR && "bg-[#4B4B4B]"} p-[5px] rounded-full`}
									onClick={(): void => {
										setSelectedPeriod(Period.YEAR);
									}}
								>
									<span
										className={`text-sm ${selectedPeriod === Period.YEAR ? "text-white" : "text-[#4B4B4B]"} font-normal font-rubik`}
									>
										YE
									</span>
								</button>
							</nav>
						</div>

						<div className="flex items-center justify-between ">
							<h1 className="text-sm text-white font-normal font-rubik">Budget 📊</h1>
							<span className="text-sm text-white font-medium font-rubik">
								{convertPeriodAmount(budget.income_amount_monthly + totalExtraincomes, selectedPeriod).toFixed(2)} €
							</span>
						</div>
					</div>

					<div className="flex flex-col gap-y-1 px-4 py-4">
						<div className="flex items-center justify-between w-full">
							<div className="flex gap-x-2 items-center">
								<span className="text-sm text-[#4B4B4B] font-normal font-rubik">Income</span>
								<button
									type="button"
									className="flex items-center bg-[#4B4B4B] p-1 rounded-full"
									onClick={(): void => {
										dispatch(
											setModal({
												extraincomeModal: false,
												recurringexpensesModal: false,
												incomeModal: false,
												incomeModalEdit: true,
											}),
										);
									}}
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="1.20em" height="1.20em" viewBox="0 0 24 24">
										<title>Settings</title>
										<path
											fill="white"
											fillRule="evenodd"
											d="M14.279 2.152C13.909 2 13.439 2 12.5 2s-1.408 0-1.779.152a2.008 2.008 0 0 0-1.09 1.083c-.094.223-.13.484-.145.863a1.615 1.615 0 0 1-.796 1.353a1.64 1.64 0 0 1-1.579.008c-.338-.178-.583-.276-.825-.308a2.026 2.026 0 0 0-1.49.396c-.318.242-.553.646-1.022 1.453c-.47.807-.704 1.21-.757 1.605c-.07.526.074 1.058.4 1.479c.148.192.357.353.68.555c.477.297.783.803.783 1.361c0 .558-.306 1.064-.782 1.36c-.324.203-.533.364-.682.556a1.99 1.99 0 0 0-.399 1.479c.053.394.287.798.757 1.605c.47.807.704 1.21 1.022 1.453c.424.323.96.465 1.49.396c.242-.032.487-.13.825-.308a1.64 1.64 0 0 1 1.58.008c.486.28.774.795.795 1.353c.015.38.051.64.145.863c.204.49.596.88 1.09 1.083c.37.152.84.152 1.779.152s1.409 0 1.779-.152a2.008 2.008 0 0 0 1.09-1.083c.094-.223.13-.483.145-.863c.02-.558.309-1.074.796-1.353a1.64 1.64 0 0 1 1.579-.008c.338.178.583.276.825.308c.53.07 1.066-.073 1.49-.396c.318-.242.553-.646 1.022-1.453c.47-.807.704-1.21.757-1.605a1.99 1.99 0 0 0-.4-1.479c-.148-.192-.357-.353-.68-.555c-.477-.297-.783-.803-.783-1.361c0-.558.306-1.064.782-1.36c.324-.203.533-.364.682-.556a1.99 1.99 0 0 0 .399-1.479c-.053-.394-.287-.798-.757-1.605c-.47-.807-.704-1.21-1.022-1.453a2.026 2.026 0 0 0-1.49-.396c-.242.032-.487.13-.825.308a1.64 1.64 0 0 1-1.58-.008a1.615 1.615 0 0 1-.795-1.353c-.015-.38-.051-.64-.145-.863a2.007 2.007 0 0 0-1.09-1.083M12.5 15c1.67 0 3.023-1.343 3.023-3S14.169 9 12.5 9c-1.67 0-3.023 1.343-3.023 3s1.354 3 3.023 3"
											clipRule="evenodd"
										/>
									</svg>
								</button>
							</div>

							<span className="text-sm text-white font-medium font-rubik">
								{convertPeriodAmount(budget.income_amount_monthly, selectedPeriod).toFixed(2)} €
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-[#895FF5] font-normal font-rubik">Extraincome</span>
							<span className="text-sm text-white font-medium font-rubik">
								{convertPeriodAmount(totalExtraincomes, selectedPeriod).toFixed(2)} €
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-[#9E553C] font-normal font-rubik">Recurring expenses</span>
							<span className="text-sm text-white font-medium font-rubik">0.00 €</span>
						</div>
					</div>
				</div>

				<button
					type="button"
					className="btn border-t border-t-[#202020] py-2.5"
					onClick={(): void => {
						dispatch(
							setModal({
								extraincomeModal: false,
								recurringexpensesModal: false,
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
