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
									<span className="text-sm text-[#B7B7B7] font-light font-rubik">Income</span>
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<title>Trending Up</title>
										<g clip-path="url(#clip0_626_63)">
											<path
												d="M2.5 14.1667L7.5 9.16667L10.8333 12.5L17.5 5.83333"
												stroke="#B7B7B7"
												stroke-width="0.5"
											/>
											<path d="M11.6667 5.83333H17.5V11.6667" stroke="#B7B7B7" stroke-width="0.5" />
										</g>
										<defs>
											<clipPath id="clip0_626_63">
												<rect width="20" height="20" fill="white" />
											</clipPath>
										</defs>
									</svg>
								</div>

								<div className="flex gap-x-3 items-center">
									<button type="button" onClick={(): void => {}}>
										<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
											<title>Maximize</title>
											<g clip-path="url(#clip0_626_56)">
												<path
													d="M2.5 14.1667C2.5 13.9457 2.5878 13.7337 2.74408 13.5774C2.90036 13.4211 3.11232 13.3333 3.33333 13.3333H5.83333C6.05435 13.3333 6.26631 13.4211 6.42259 13.5774C6.57887 13.7337 6.66667 13.9457 6.66667 14.1667V16.6667C6.66667 16.8877 6.57887 17.0996 6.42259 17.2559C6.26631 17.4122 6.05435 17.5 5.83333 17.5H3.33333C3.11232 17.5 2.90036 17.4122 2.74408 17.2559C2.5878 17.0996 2.5 16.8877 2.5 16.6667V14.1667Z"
													stroke="#B7B7B7"
													stroke-width="0.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
												<path
													d="M3.33334 10V5C3.33334 4.55797 3.50894 4.13405 3.8215 3.82149C4.13406 3.50893 4.55798 3.33333 5.00001 3.33333H15C15.442 3.33333 15.866 3.50893 16.1785 3.82149C16.4911 4.13405 16.6667 4.55797 16.6667 5V15C16.6667 15.442 16.4911 15.8659 16.1785 16.1785C15.866 16.4911 15.442 16.6667 15 16.6667H10"
													stroke="#B7B7B7"
													stroke-width="0.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
												<path
													d="M10 6.66667H13.3333V10"
													stroke="#B7B7B7"
													stroke-width="0.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
												<path
													d="M13.3333 6.66667L9.16666 10.8333"
													stroke="#B7B7B7"
													stroke-width="0.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
											</g>
											<defs>
												<clipPath id="clip0_626_56">
													<rect width="20" height="20" fill="white" />
												</clipPath>
											</defs>
										</svg>
									</button>

									<button type="button" onClick={(): void => handleClose()}>
										<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
											<title>Close</title>
											<path d="M15 5L5 15" stroke="#B7B7B7" stroke-width="0.5" />
											<path d="M5 5L15 15" stroke="#B7B7B7" stroke-width="0.5" />
										</svg>
									</button>
								</div>
							</div>

							{extraincomesOrderedAscendingByAmount.length > 0 && (
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
									</table>
								</div>
							)}

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
