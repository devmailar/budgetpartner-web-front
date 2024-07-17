import type { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import { setError } from "../../stores/Error";
import { setForceLogin } from "../../stores/ForceLogin";
import { setModal } from "../../stores/Modal";
import type { IResponseError, IRootState, TBudget, TExtraincome } from "../../types";
import { Utils } from "../../utils";
import Modal from "../Modal";

function ExtraincomeModal(): React.ReactNode {
	const navigate: NavigateFunction = useNavigate();
	const dispatch: Dispatch = useDispatch();

	const budget: TBudget = useSelector((state: IRootState) => state.budget);
	const [createExtraincomeModal, setCreateExtraincomeModal] = React.useState<boolean>(false);
	const [removeExtraincomeModal, setRemoveExtraincomeModal] = React.useState<boolean>(false);
	const [removeExtraincome, setRemoveExtraincome] = React.useState<TExtraincome>({
		id: 0,
		user_id: 0,
		extraincome_type: "",
		extraincome_amount_monthly: 0,
		created_at: new Date(),
		updated_at: new Date(),
	});

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
				dispatch(setForceLogin(true));
				return;
			}

			const createExtraincomeResponse: Response = await fetch(`${Utils.baseurl}/extraincomes/create`, {
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
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	const handleRemoveExtraincome = async (extraincome_id: number): Promise<void> => {
		try {
			const auth: string = getCookie("Authorization") ?? "";
			if (!auth) {
				dispatch(setForceLogin(true));
				return;
			}

			const removeExtraincomeResponse: Response = await fetch(
				`${Utils.baseurl}/extraincomes/remove/${extraincome_id}`,
				{
					method: "DELETE",
					headers: { Authorization: `Bearer ${auth}` },
				},
			);

			if (!removeExtraincomeResponse.ok) {
				const removeExtraincomeResponseError: IResponseError = await removeExtraincomeResponse.json();

				throw new Error(removeExtraincomeResponseError.message);
			}

			window.location.reload();
		} catch (error: unknown) {
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
					languageModal: false,
					settingsModal: false,
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
			<div className="animate__animated animate__fadeInDown animate__faster min-w-80 px-2.5 py-2.5 bg-dark border border-darker rounded-2xl">
				<div className="flex flex-col">
					{!removeExtraincomeModal && (
						<div className="flex items-center justify-end">
							<button type="button" onClick={(): void => handleClose()}>
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
									<title>Close</title>
									<g clipPath="url(#clip0_245_208)">
										<path
											d="M15 5L5 15"
											stroke="#4B4B4B"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M5 5L15 15"
											stroke="#4B4B4B"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
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
					)}

					{!createExtraincomeModal && !removeExtraincomeModal ? (
						<div className="flex flex-col gap-4 px-7 py-2">
							<div className="flex gap-x-3 items-center justify-between">
								<div className="flex gap-x-1 items-center">
									<span className="text-base text-white font-medium font-rubik">Total income</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="28"
										height="28"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#895FF5"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<title>Trending Up</title>
										<path stroke="none" d="M0 0h24v24H0z" fill="none" />
										<path d="M3 17l6 -6l4 4l8 -8" />
										<path d="M14 7l7 0l0 7" />
									</svg>
								</div>

								<span className="text-base text-white font-medium font-rubik">{totalExtraincomes.toFixed(1)}€</span>
							</div>

							<div className="flex flex-col items-start">
								{budget.extraincomes.map((extraincome: TExtraincome) => (
									<button
										key={extraincome.extraincome_type}
										type="button"
										onClick={(): void => {
											setRemoveExtraincome(extraincome);
											setRemoveExtraincomeModal(true);
										}}
									>
										<span className="text-base text-white font-normal font-rubik">
											{extraincome.extraincome_type}: {extraincome.extraincome_amount_monthly.toFixed(1)}€
										</span>
									</button>
								))}
							</div>

							<button
								type="button"
								className="btn bg-transparent px-3 py-2 rounded-xl"
								onClick={(): void => setCreateExtraincomeModal(true)}
							>
								<span className="text-base text-purple font-medium font-rubik">Create</span>
							</button>
						</div>
					) : createExtraincomeModal ? (
						<form className="flex flex-col gap-y-4 px-4" onSubmit={handleCreateExtraincome}>
							<span className="text-base text-white font-medium font-rubik">Create new Income 🚀</span>

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
								<span className="text-base text-purple font-medium font-rubik">Save</span>
							</button>
						</form>
					) : (
						removeExtraincomeModal && (
							<div className="animate__animated animate__fadeIn flex flex-col gap-y-4 px-4 items-center justify-center max-w-80">
								<span className="text-base text-center text-white font-medium font-rubik">Warning</span>

								<span className="text-sm text-center text-light font-light font-rubik">
									This operation is permanent and will delete income{" "}
									<code>
										{removeExtraincome.extraincome_type}: {removeExtraincome.extraincome_amount_monthly.toFixed(1)}€
									</code>
								</span>

								<div className="flex gap-2 items-center">
									<button
										type="submit"
										className="btn bg-transparent px-3 py-2 rounded-xl"
										onClick={(): Promise<void> => handleRemoveExtraincome(removeExtraincome.id)}
									>
										<span className="text-base text-red font-medium font-rubik">Delete</span>
									</button>

									<button
										type="submit"
										className="btn bg-transparent px-3 py-2 rounded-xl"
										onClick={(): void => setRemoveExtraincomeModal(false)}
									>
										<span className="text-base text-light font-medium font-rubik">Cancel</span>
									</button>
								</div>
							</div>
						)
					)}
				</div>
			</div>
		</Modal>
	);
}

export default ExtraincomeModal;
