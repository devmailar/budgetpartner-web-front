import type { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import { setError } from "../../stores/Error";
import type { IRootState, TExtraincome } from "../../types";
import { Utils } from "../../utils";
import Modal from "../Modal";

function ExtraincomeModal() {
	const navigate: NavigateFunction = useNavigate();
	const dispatch: Dispatch = useDispatch();

	const extraincomes: TExtraincome[] = useSelector((state: IRootState) => state.extraincomes);

	const totalExtraincomes: number = extraincomes.reduce((accumulator: number, extraincome: TExtraincome) => {
		return accumulator + extraincome.extraincome_amount_monthly;
	}, 0);

	const [addExtraincome, setAddExtraincome] = React.useState<boolean>(false);

	const handleAddExtraincome = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		try {
			dispatch(setError(""));

			event.preventDefault();

			const form: FormData = new FormData(event.currentTarget);
			const extraincomeType: string = form.get("extraincome_type") as string;
			const extraincomeAmountMonthly: number = Number.parseInt(form.get("extraincome_amount_monthly") as string);
			const authorization: string | undefined = getCookie("Authorization");

			if (!authorization) {
				dispatch(setError("Please login to continue"));
				return;
			}

			if (extraincomeAmountMonthly <= 0 || Number.isNaN(extraincomeAmountMonthly)) {
				dispatch(setError("Please enter valid amount"));
				return;
			}

			await Utils.request.post("extraincomes/create", {
				json: {
					extraincome_type: extraincomeType,
					extraincome_amount_monthly: extraincomeAmountMonthly,
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

	React.useEffect((): void => {
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
				{addExtraincome ? (
					<form className="flex flex-col" onSubmit={handleAddExtraincome}>
						<div className="flex px-4 pt-4">
							<h1 className="text-sm text-white font-normal font-rubik">Add new Extraincome 💰</h1>
						</div>

						<div className="flex flex-col gap-y-2.5 px-4 py-4">
							<div className="flex items-center justify-between p-2.5 border-[0.5px] border-[#4B4B4B] rounded-lg">
								<input
									className="bg-transparent w-full text-sm text-white placeholder:text-white font-normal font-rubik focus:outline-none"
									type="text"
									name="extraincome_type"
									id="extraincome_type"
									placeholder="Description"
									required
								/>
							</div>

							<div className="flex items-center justify-between p-2.5 border-[0.5px] border-[#4B4B4B] rounded-lg">
								<input
									className="bg-transparent w-full text-sm text-white placeholder:text-white font-normal font-rubik focus:outline-none"
									type="number"
									name="extraincome_amount_monthly"
									id="extraincome_amount_monthly"
									placeholder="0.00"
									required
								/>

								<span className="text-sm text-white font-normal font-rubik">€/MO</span>
							</div>
						</div>

						<button type="submit" className="btn border-t border-t-[#242424] py-2.5">
							<span className="text-sm text-[#895FF5] font-normal font-rubik">Save</span>
						</button>
					</form>
				) : (
					<div className="flex flex-col">
						<div className="flex items-center justify-between px-4 py-4">
							<span className="text-sm text-white font-normal font-rubik">Extraincome 💰</span>
							<span className="text-sm text-white font-medium font-rubik">{totalExtraincomes.toFixed(2)} €</span>
						</div>

						<div className="flex flex-col px-4 pb-4">
							{extraincomes.map((extraincome: TExtraincome) => (
								<button key={extraincome.extraincome_type} type="button" className="flex items-center justify-between">
									<span className="text-sm text-[#4B4B4B] font-normal font-rubik">{extraincome.extraincome_type}</span>
									<span className="text-sm text-white font-medium font-rubik">
										{extraincome.extraincome_amount_monthly.toFixed(2)} €
									</span>
								</button>
							))}
						</div>

						<button
							type="button"
							className="btn border-t border-t-[#202020] py-2.5"
							onClick={(): void => setAddExtraincome(true)}
						>
							<span className="text-sm text-[#895FF5] font-normal font-rubik">+ Add New</span>
						</button>
					</div>
				)}
			</div>
		</Modal>
	);
}

export default ExtraincomeModal;
