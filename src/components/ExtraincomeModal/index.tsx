import type { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import { setError } from "../../stores/Error";
import { setModal } from "../../stores/Modal";
import type { IResponseError, IRootState, TBudget, TExtraincome } from "../../types";
import Modal from "../Modal";

function ExtraincomeModal() {
	const navigate: NavigateFunction = useNavigate();
	const dispatch: Dispatch = useDispatch();

	const budget: TBudget = useSelector((state: IRootState) => state.budget);
	const [createExtraincome, setCreateExtraincome] = React.useState<boolean>(false);

	const totalExtraincomes: number = budget.extraincomes.reduce((accumulator: number, extraincome: TExtraincome) => {
		return accumulator + extraincome.extraincome_amount_monthly;
	}, 0);

	const handleCreateExtraincome = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		try {
			event.preventDefault();

			const form: FormData = new FormData(event.currentTarget);
			const extraincomeType: string = form.get("extraincome_type") as string;
			const extraincomeAmountMonthly: number = Number.parseInt(form.get("extraincome_amount_monthly") as string);

			if (Number.isNaN(extraincomeAmountMonthly) || extraincomeAmountMonthly <= 0) {
				throw new Error("Please enter valid amount");
			}

			const auth: string = getCookie("Authorization") ?? "";
			if (!auth) {
				throw new Error("Please login to move forward");
			}

			const createExtraincomeResponse: Response = await fetch("http://localhost:8080/extraincomes/create", {
				method: "POST",
				headers: { Authorization: `Bearer ${auth}`, "Content-Type": "application/json" },
				body: JSON.stringify({
					budget_id: budget.id,
					extraincome_type: extraincomeType,
					extraincome_amount_monthly: extraincomeAmountMonthly,
				}),
			});

			if (!createExtraincomeResponse.ok) {
				const createExtraincomeResponseError: IResponseError = await createExtraincomeResponse.json();

				throw new Error(createExtraincomeResponseError.message);
			}

			window.location.reload();
		} catch (error) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	const handleClose = (): void => {
		try {
			dispatch(
				setModal({
					extraincomeModal: false,
					extraexpenseModal: false,
					incomeModal: false,
					incomeModalEdit: false,
					languageModal: false,
				}),
			);
		} catch (error) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	React.useEffect((): void => {
		const onLoad = async (): Promise<void> => {
			const auth: string = getCookie("Authorization") ?? "";
			if (!auth) {
				return navigate("/");
			}
		};

		onLoad();
	}, [navigate]);

	return (
		<Modal index={40}>
			<div className="animate__animated animate__fadeInDown animate__faster w-80 px-2.5 py-2.5 bg-dark border border-darker rounded-2xl">
				<div className="flex flex-col">
					<div className="flex items-center justify-end">
						<button type="button" onClick={(): void => handleClose()}>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
								<title>Close</title>
								<g clip-path="url(#clip0_245_208)">
									<path
										d="M15 5L5 15"
										stroke="#4B4B4B"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M5 5L15 15"
										stroke="#4B4B4B"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</g>
								<defs>
									<clipPath id="clip0_245_208">
										<rect width="20" height="20" fill="white" />
									</clipPath>
								</defs>
							</svg>
						</button>
					</div>
					{createExtraincome ? (
						<form className="flex flex-col gap-y-4 px-4" onSubmit={handleCreateExtraincome}>
							<span className="text-sm text-white font-medium font-rubik">Create new Income 🚀</span>

							<div className="flex flex-col gap-y-3">
								<div className="flex items-center justify-between p-2.5 border-[0.5px] border-[#4B4B4B] rounded-lg">
									<input
										className="bg-transparent text-sm text-white placeholder:text-light font-normal font-rubik focus:outline-none"
										type="text"
										name="extraincome_type"
										id="extraincome_type"
										placeholder="Source"
										required
									/>
								</div>

								<div className="flex items-center justify-between p-2.5 border-[0.5px] border-[#4B4B4B] rounded-lg">
									<input
										className="bg-transparent text-sm text-white placeholder:text-light font-normal font-rubik focus:outline-none"
										type="number"
										name="extraincome_amount_monthly"
										id="extraincome_amount_monthly"
										placeholder="0.00"
										required
									/>

									<span className="text-sm text-light font-normal font-rubik">€/MO</span>
								</div>
							</div>

							<button type="submit" className="btn bg-transparent px-3 py-2 rounded-xl">
								<span className="text-sm text-purple font-medium font-rubik">Save</span>
							</button>
						</form>
					) : (
						<div className="flex flex-col gap-y-3 items-center py-2.5">
							<div className="flex gap-x-3 items-center">
								<span className="text-sm text-white font-medium font-rubik">Total Income 🌱</span>
								<span className="text-sm text-white font-medium font-rubik">{totalExtraincomes.toFixed(1)}€</span>
							</div>

							<div>
								{budget.extraincomes.map((extraincome: TExtraincome) => (
									<button key={extraincome.extraincome_type} type="button" className="flex items-center">
										<span className="text-sm text-white font-normal font-rubik">
											{extraincome.extraincome_type}: {extraincome.extraincome_amount_monthly.toFixed(1)}€
										</span>
									</button>
								))}
							</div>

							<button
								type="button"
								className="btn bg-transparent px-3 py-2 rounded-xl"
								onClick={(): void => setCreateExtraincome(true)}
							>
								<span className="text-sm text-purple font-medium font-rubik">Create</span>
							</button>
						</div>
					)}
				</div>
			</div>
		</Modal>
	);
}

export default ExtraincomeModal;
