import type { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import { setError } from "../../stores/Error";
import { setForceLogin } from "../../stores/ForceLogin";
import { setModals } from "../../stores/Modals";
import type { IBudget, IExtraincome, IResponseError, IRootState } from "../../types";
import { Utils } from "../../utils";
import Modal from "../Modal";

function ExtraincomeModal(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const auth: string = useSelector((state: IRootState) => state.auth);
	const budget: IBudget = useSelector((state: IRootState) => state.budget);

	const [createExtraincomeModal, setCreateExtraincomeModal] = React.useState<boolean>(false);
	const [removeExtraincomeModal, setRemoveExtraincomeModal] = React.useState<boolean>(false);
	const [removeExtraincome, setRemoveExtraincome] = React.useState<IExtraincome>({
		id: 0,
		user_id: 0,
		extraincome_type: "",
		extraincome_amount_monthly: 0,
		created_at: new Date(),
		updated_at: new Date(),
	});

	const [removeExtraincomeButtonDisabled, setRemoveExtraincomeButtonDisabled] = React.useState<boolean>(false);
	const [includeWeekends, setIncludeWeekends] = React.useState<boolean>(false);

	const extraincomesOrderedAscendingByAmount: IExtraincome[] = [...budget.extraincomes].sort((a, b) => {
		return b.extraincome_amount_monthly - a.extraincome_amount_monthly;
	});

	const handleCreateExtraincome = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		try {
			event.preventDefault();

			const form: FormData = new FormData(event.currentTarget);
			const extraincomeType: string = form.get("extraincome_type") as string;
			const extraincomeAmountMonthly: number = Number.parseInt(form.get("extraincome_amount_monthly") as string);

			if (Number.isNaN(extraincomeAmountMonthly) || extraincomeAmountMonthly <= 0) {
				throw new Error("Please enter valid amount");
			}

			if (!auth) {
				dispatch(setForceLogin(true));
				return;
			}

			const createExtraincomeResponse: Response = await fetch(`${Utils.baseurl}/extraincomes/create`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${auth}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					budget_id: budget.id,
					extraincome_type: extraincomeType,
					extraincome_amount_monthly: extraincomeAmountMonthly,
					extraincome_includes_weekends: includeWeekends,
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
			setRemoveExtraincomeButtonDisabled(true);

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
				setTimeout((): void => setRemoveExtraincomeButtonDisabled(false), 2000);
			}
		}
	};

	const handleClose = (): void => {
		try {
			dispatch(
				setModals({
					extraincome: false,
					extraexpense: false,
					language: false,
					settings: false,
				}),
			);
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	const handleGetTotalExtraincome = (extraincomes: IExtraincome[]): number => {
		try {
			const totalExtraincome: number = extraincomes.reduce((accumulator: number, extraincome: IExtraincome) => {
				return accumulator + extraincome.extraincome_amount_monthly;
			}, 0);

			return totalExtraincome;
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}

		return 0;
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
		<>
			{removeExtraincomeModal ? (
				<Modal index={40} classes="gap-y-3 items-center justify-center px-6 py-6 w-[20rem] md:min-w-[20rem]">
					<div className="flex flex-col gap-y-2">
						<span className="text-lg text-center text-purple font-medium font-rubik">Warning</span>

						<span className="text-base text-center text-light font-light font-rubik">
							This operation is permanent and will delete{" "}
							<b>
								{removeExtraincome.extraincome_type} {removeExtraincome.extraincome_amount_monthly.toFixed(1)}€
							</b>
						</span>
					</div>

					<div className="flex gap-x-3 items-center">
						<button
							className="btn px-2.5 py-1.5 border border-red hover:bg-red text-red hover:text-light stroke-red hover:stroke-light"
							type="submit"
							onClick={(): Promise<void> => handleRemoveExtraincome(removeExtraincome.id)}
							disabled={removeExtraincomeButtonDisabled}
						>
							<div className="flex gap-x-0 items-center">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
									<title>Flame</title>
									<g clipPath="url(#clip0_307_158)">
										<path
											d="M12 12C14 9.04 12 5 11 4C11 7.038 9.227 8.741 8 10C6.774 11.26 6 13.24 6 15C6 16.5913 6.63214 18.1174 7.75736 19.2426C8.88258 20.3679 10.4087 21 12 21C13.5913 21 15.1174 20.3679 16.2426 19.2426C17.3679 18.1174 18 16.5913 18 15C18 13.468 16.944 11.06 16 10C14.214 13 13.209 13 12 12Z"
											stroke=""
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</g>
									<defs>
										<clipPath id="clip0_307_158">
											<rect width="24" height="24" fill="" />
										</clipPath>
									</defs>
								</svg>

								<span className="text-base font-normal font-rubik">Delete</span>
							</div>
						</button>

						<button
							type="submit"
							className="btn px-2.5 py-1.5 border border-light"
							onClick={(): void => setRemoveExtraincomeModal(false)}
						>
							<span className="text-base text-light font-normal font-rubik">Cancel</span>
						</button>
					</div>
				</Modal>
			) : (
				<Modal
					index={40}
					classes="gap-y-4 px-5 py-5 w-[20rem] md:w-fit md:min-w-[25rem] animate__animated animate__fadeInDown animate__faster"
				>
					{!createExtraincomeModal && !removeExtraincomeModal ? (
						<div className="flex flex-col gap-y-4">
							<div className="flex items-center justify-between">
								<div className="flex gap-x-1 items-center">
									<span className="text-base text-[#B7B7B7] font-normal font-rubik">incomes</span>

									<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<title>Trending Up</title>
										<g clip-path="url(#clip0_626_63)">
											<path d="M3 17L9 11L13 15L21 7" stroke="#D9D9D9" stroke-width="1.5" />
											<path d="M14 7H21V14" stroke="#D9D9D9" stroke-width="1.5" />
										</g>
										<defs>
											<clipPath id="clip0_626_63">
												<rect width="24" height="24" fill="white" />
											</clipPath>
										</defs>
									</svg>
								</div>

								<button type="button" onClick={(): void => handleClose()}>
									<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
										<title>Close</title>
										<path
											d="M22.3125 21.25L13.8125 12.75ZM13.8125 21.25L22.3125 12.75ZM32.2292 17C32.2292 9.17575 25.8868 2.83333 18.0625 2.83333C10.2383 2.83333 3.89584 9.17575 3.89584 17C3.89584 24.8242 10.2383 31.1667 18.0625 31.1667C25.8868 31.1667 32.2292 24.8242 32.2292 17Z"
											fill="#232224"
										/>
										<path
											d="M22.3125 21.25L13.8125 12.75M13.8125 21.25L22.3125 12.75M32.2292 17C32.2292 9.17575 25.8868 2.83333 18.0625 2.83333C10.2383 2.83333 3.89584 9.17575 3.89584 17C3.89584 24.8242 10.2383 31.1667 18.0625 31.1667C25.8868 31.1667 32.2292 24.8242 32.2292 17Z"
											stroke="#A0A0A0"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</button>
							</div>

							<div className="overflow-auto">
								<table className="w-full">
									<thead>
										<tr>
											<th className="px-0 py-1 text-left text-sm text-white font-medium font-rubik">ID</th>
											<th className="px-3 py-1 text-left text-sm text-white font-medium font-rubik">Income</th>
											<th className="px-3 py-1 text-left text-sm text-white font-medium font-rubik">Amount</th>
											<th className="px-0 py-1 text-right text-sm text-white font-medium font-rubik">Created</th>
										</tr>
									</thead>

									{extraincomesOrderedAscendingByAmount.length > 0 && (
										<tbody className="overflow-y-auto table-fixed">
											{extraincomesOrderedAscendingByAmount.map((extraincome: IExtraincome, index: number) => (
												<tr
													className="border-t border-t-dark cursor-pointer"
													key={extraincome.id}
													onClick={(): void => {
														setRemoveExtraincome(extraincome);
														setRemoveExtraincomeModal(true);
													}}
													onKeyUp={(): void => {
														setRemoveExtraincome(extraincome);
														setRemoveExtraincomeModal(true);
													}}
												>
													<td className="px-0 py-2 text-left text-sm text-light font-normal font-rubik truncate">
														<span>{index + 1}</span>
													</td>
													<td className="px-3 py-2 text-left text-sm text-light font-normal font-rubik truncate">
														<span>{extraincome.extraincome_type}</span>
													</td>
													<td className="px-3 py-2 text-left text-sm text-light font-normal font-rubik truncate">
														<span>{extraincome.extraincome_amount_monthly.toFixed(1)}€</span>
													</td>
													<td className="px-0 py-2 text-right text-sm text-light font-normal font-rubik truncate">
														<span>{new Date(extraincome.created_at).toLocaleDateString()}</span>
													</td>
												</tr>
											))}
										</tbody>
									)}
								</table>
							</div>

							<div className="flex items-center justify-end">
								<span className="text-sm text-purple font-bold font-rubik truncate">
									+{handleGetTotalExtraincome(budget.extraincomes).toFixed(1)}€
								</span>
							</div>

							<button
								type="button"
								className="btn bg-dark rounded-xl"
								onClick={(): void => setCreateExtraincomeModal(true)}
							>
								<span className="text-sm text-white font-normal font-rubik">Add New</span>
							</button>
						</div>
					) : (
						<form className="flex flex-col gap-y-4" onSubmit={handleCreateExtraincome}>
							<div className="flex items-center justify-between">
								<span className="text-sm text-light font-medium font-rubik">NEW INCOME</span>

								<button className="mr-[-0.25rem]" type="button" onClick={(): void => setCreateExtraincomeModal(false)}>
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
										<title>Close</title>
										<g clipPath="url(#clip0_283_267)">
											<path
												d="M18 6L6 18"
												stroke="#B7B7B7"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M6 6L18 18"
												stroke="#B7B7B7"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</g>
										<defs>
											<clipPath id="clip0_283_267">
												<rect width="24" height="24" fill="#B7B7B7" />
											</clipPath>
										</defs>
									</svg>
								</button>
							</div>

							<div className="flex items-center justify-between px-0 py-2 border-b border-b-grey">
								<input
									className="bg-transparent w-full text-sm text-white placeholder:text-light font-normal font-rubik focus:outline-none"
									type="text"
									name="extraincome_type"
									id="extraincome_type"
									placeholder="Salary"
									required
								/>
							</div>

							<div className="flex items-center justify-between px-0 py-2 border-b border-b-grey">
								<input
									className="bg-transparent w-full text-sm text-white placeholder:text-light font-normal font-rubik focus:outline-none"
									type="number"
									name="extraincome_amount_monthly"
									id="extraincome_amount_monthly"
									placeholder="0.00"
									required
								/>

								<span className="text-sm text-light font-normal font-rubik">€/MO</span>
							</div>

							<div className="flex flex-col gap-y-2">
								<div className="w-full md:w-80">
									<p className="text-xs text-grey font-normal font-rubik leading-tight">
										If ‘Include Weekends’ is enabled, then the income is calculated for all days in the month, including
										weekends.
									</p>
								</div>

								<div className="flex gap-x-1 items-center justify-between">
									<span className="text-sm text-light font-normal font-rubik">Include Weekends</span>

									<button type="button" onClick={() => setIncludeWeekends(!includeWeekends)}>
										{includeWeekends ? (
											<svg width="48" height="28" viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg">
												<title>Checkbox Checked</title>
												<rect width="48" height="28" rx="14" fill="#252525" />
												<circle cx="34" cy="14" r="10" fill="#895FF5" />
											</svg>
										) : (
											<svg width="48" height="28" viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg">
												<title>Checkbox Not Checked</title>
												<rect width="48" height="28" rx="14" fill="#252525" />
												<circle cx="14" cy="14" r="10" fill="#b7b7b7" />
											</svg>
										)}
									</button>
								</div>
							</div>

							<button type="submit" className="btn bg-purple rounded-xl">
								<span className="text-sm text-white font-normal font-rubik">Save</span>
							</button>
						</form>
					)}
				</Modal>
			)}
		</>
	);
}

export default ExtraincomeModal;
