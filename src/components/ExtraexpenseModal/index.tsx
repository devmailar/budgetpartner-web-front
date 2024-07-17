import type { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import { setError } from "../../stores/Error";
import { setForceLogin } from "../../stores/ForceLogin";
import { setModal } from "../../stores/Modal";
import type { IResponseError, IRootState, TBudget, TExtraexpense } from "../../types";
import Modal from "../Modal";
import { Utils } from "../../utils";

function ExtraexpenseModal(): React.ReactNode {
	const navigate: NavigateFunction = useNavigate();
	const dispatch: Dispatch = useDispatch();

	const budget: TBudget = useSelector((state: IRootState) => state.budget);
	const [createExtraexpenseModal, setCreateExtraexpenseModal] = React.useState<boolean>(false);
	const [removeExtraexpenseModal, setRemoveExtraexpenseModal] = React.useState<boolean>(false);
	const [removeExtraexpense, setRemoveExtraexpense] = React.useState<TExtraexpense>({
		id: 0,
		user_id: 0,
		extraexpense_type: "",
		extraexpense_amount_monthly: 0,
		created_at: new Date(),
		updated_at: new Date(),
	});

	const totalExtraexpenses: number = budget.extraexpenses.reduce((accumulator: number, extraexpense: TExtraexpense) => {
		return accumulator + extraexpense.extraexpense_amount_monthly;
	}, 0);

	const handleCreateExtraexpense = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		try {
			event.preventDefault();

			const form: FormData = new FormData(event.currentTarget);
			const extraexpenseType: string = form.get("extraexpense_type") as string;
			const extraexpenseAmountMonthly: number = Number.parseInt(form.get("extraexpense_amount_monthly") as string);

			if (Number.isNaN(extraexpenseAmountMonthly) || extraexpenseAmountMonthly <= 0) {
				throw new Error("Please enter valid amount");
			}

			const auth: string = getCookie("Authorization") ?? "";
			if (!auth) {
				dispatch(setForceLogin(true));
				return;
			}

			const createExtraexpenseResponse: Response = await fetch(`${Utils.baseurl}/extraexpenses/create`, {
				method: "POST",
				headers: { Authorization: `Bearer ${auth}`, "Content-Type": "application/json" },
				body: JSON.stringify({
					budget_id: budget.id,
					extraexpense_type: extraexpenseType,
					extraexpense_amount_monthly: extraexpenseAmountMonthly,
				}),
			});

			if (!createExtraexpenseResponse.ok) {
				const createExtraexpenseResponseError: IResponseError = await createExtraexpenseResponse.json();

				throw new Error(createExtraexpenseResponseError.message);
			}

			window.location.reload();
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	const handleRemoveExtraexpense = async (extraexpense_id: number): Promise<void> => {
		try {
			const auth: string = getCookie("Authorization") ?? "";
			if (!auth) {
				dispatch(setForceLogin(true));
				return;
			}

			const removeExtraexpenseResponse: Response = await fetch(
				`${Utils.baseurl}/extraexpenses/remove/${extraexpense_id}`,
				{
					method: "DELETE",
					headers: { Authorization: `Bearer ${auth}` },
				},
			);

			if (!removeExtraexpenseResponse.ok) {
				const removeExtraexpenseResponseError: IResponseError = await removeExtraexpenseResponse.json();

				throw new Error(removeExtraexpenseResponseError.message);
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
					{!removeExtraexpenseModal && (
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

					{!createExtraexpenseModal && !removeExtraexpenseModal ? (
						<div className="flex flex-col gap-4 px-7 py-2">
							<div className="flex gap-x-3 items-center justify-between">
								<div className="flex gap-x-1 items-center">
									<span className="text-base text-white font-medium font-rubik">Total expenses</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="28"
										height="28"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#B85C3D"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<title>Trending Down</title>
										<path stroke="none" d="M0 0h24v24H0z" fill="none" />
										<path d="M3 7l6 6l4 -4l8 8" />
										<path d="M21 10l0 7l-7 0" />
									</svg>
								</div>

								<span className="text-base text-white font-medium font-rubik">{totalExtraexpenses.toFixed(1)}€</span>
							</div>

							<div className="flex flex-col items-start">
								{budget.extraexpenses.map((extraexpense: TExtraexpense) => (
									<button
										key={extraexpense.extraexpense_type}
										type="button"
										onClick={(): void => {
											setRemoveExtraexpense(extraexpense);
											setRemoveExtraexpenseModal(true);
										}}
									>
										<span className="text-base text-white font-normal font-rubik">
											{extraexpense.extraexpense_type}: {extraexpense.extraexpense_amount_monthly.toFixed(1)}€
										</span>
									</button>
								))}
							</div>

							<button
								type="button"
								className="btn bg-transparent px-3 py-2 rounded-xl"
								onClick={(): void => setCreateExtraexpenseModal(true)}
							>
								<span className="text-base text-orange font-medium font-rubik">Create</span>
							</button>
						</div>
					) : createExtraexpenseModal ? (
						<form className="flex flex-col gap-y-4 px-4" onSubmit={handleCreateExtraexpense}>
							<span className="text-base text-white font-medium font-rubik">Create new expense 🚀</span>

							<div className="flex flex-col gap-y-3">
								<div className="flex items-center justify-between p-2.5 border-[0.5px] border-[#4B4B4B] rounded-lg">
									<input
										className="bg-transparent text-sm text-white placeholder:text-light font-normal font-rubik focus:outline-none"
										type="text"
										name="extraexpense_type"
										id="extraexpense_type"
										placeholder="Source"
										required
									/>
								</div>

								<div className="flex items-center justify-between p-2.5 border-[0.5px] border-[#4B4B4B] rounded-lg">
									<input
										className="bg-transparent text-sm text-white placeholder:text-light font-normal font-rubik focus:outline-none"
										type="number"
										name="extraexpense_amount_monthly"
										id="extraexpense_amount_monthly"
										placeholder="0.00"
										required
									/>

									<span className="text-sm text-light font-normal font-rubik">€/MO</span>
								</div>
							</div>

							<button type="submit" className="btn bg-transparent px-3 py-2 rounded-xl">
								<span className="text-base text-orange font-medium font-rubik">Save</span>
							</button>
						</form>
					) : (
						removeExtraexpenseModal && (
							<div className="animate__animated animate__fadeIn flex flex-col gap-y-4 px-4 items-center justify-center max-w-80">
								<span className="text-base text-center text-white font-medium font-rubik">Warning</span>

								<span className="text-sm text-center text-light font-light font-rubik">
									This operation is permanent and will delete expense{" "}
									<code>
										{removeExtraexpense.extraexpense_type}: {removeExtraexpense.extraexpense_amount_monthly.toFixed(1)}€
									</code>
								</span>

								<div className="flex gap-2 items-center">
									<button
										type="submit"
										className="btn bg-transparent px-3 py-2 rounded-xl"
										onClick={(): Promise<void> => handleRemoveExtraexpense(removeExtraexpense.id)}
									>
										<span className="text-base text-red font-medium font-rubik">Delete</span>
									</button>

									<button
										type="submit"
										className="btn bg-transparent px-3 py-2 rounded-xl"
										onClick={(): void => setRemoveExtraexpenseModal(false)}
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

export default ExtraexpenseModal;
