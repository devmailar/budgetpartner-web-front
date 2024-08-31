import type { Dispatch } from "@reduxjs/toolkit";
import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { setDialogStore } from "../../stores/dialog";
import type { IBudget, IExtraincome, IRootState } from "../../types";

function ExtraincomesDialog(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const budgetStore: IBudget = useSelector((state: IRootState) => state.budget);

	const totalExtraincomes: number = budgetStore?.extraincomes?.reduce(
		(accumulator: number, extraincome: IExtraincome) => {
			return accumulator + extraincome.extraincome_amount_monthly;
		},
		0,
	);

	const extraincomesSortedByCreatedAtAscending: IExtraincome[] = [...budgetStore.extraincomes].sort((a, b) => {
		return new Date(b.extraincome_date).getTime() - new Date(a.extraincome_date).getTime();
	});

	return (
		<div className="flex flex-col gap-4 absolute bottom-0 bg-[#18181B] w-full h-[64%] px-7 pb-5 border border-[#212121] rounded-3xl">
			<button
				type="button"
				className="flex items-center justify-center pt-[18px]"
				onClick={(): void => {
					dispatch(
						setDialogStore({
							extraincome: false,
							extraexpenses: false,
						}),
					);
				}}
			>
				<button
					type="button"
					className="w-[125px] h-[5px] bg-white rounded-lg"
					onClick={(): void => {
						dispatch(
							setDialogStore({
								extraincome: false,
								extraexpenses: false,
							}),
						);
					}}
				/>
			</button>

			<div className="flex items-center justify-between">
				<span className="text-base text-[#007AFF] font-semibold">Total Income</span>
				<span className="text-lg text-white font-bold">
					{totalExtraincomes ? totalExtraincomes.toFixed(2) : "···"}€
				</span>

				<div className="flex">
					<button
						type="button"
						className="btn bg-transparent"
						onClick={() => {
							navigate("/new-extraincome");
						}}
					>
						<span className="text-16 text-[#007AFF] font-semibold">+ Add new</span>
					</button>
				</div>
			</div>

			<div className="h-72 overflow-scroll">
				{extraincomesSortedByCreatedAtAscending.length > 0 &&
					extraincomesSortedByCreatedAtAscending.map((extraincome: IExtraincome, index: number) => (
						<div
							key={extraincome.id}
							className="flex items-center justify-between px-1.5 py-1.5 border-y border-y-[#313131]"
						>
							<span className="text-sm text-[#007AFF] text-left w-6 font-normal">{index + 1}</span>
							<span className="text-sm text-[#BEBEC2] text-left w-32 truncate">{extraincome.extraincome_type}</span>

							<span className="text-sm text-[#BEBEC2] text-left w-20 font-normal">
								{extraincome.extraincome_amount_monthly.toFixed(2)}€
							</span>

							<span className="text-sm text-[#BEBEC2] text-left w-20 font-normal">
								{new Date(extraincome.extraincome_date).toLocaleDateString()}
							</span>
						</div>
					))}
			</div>
		</div>
	);
}

export default ExtraincomesDialog;
