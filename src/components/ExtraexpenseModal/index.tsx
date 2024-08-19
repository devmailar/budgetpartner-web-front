import type { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import { setError } from "../../stores/Error";
import { setForceLogin } from "../../stores/ForceLogin";
import type { IBudget, IExtraexpense, IResponseError, IRootState } from "../../types";
import { Utils } from "../../utils";
import Modal from "../Modal";
import SlideUpDialog from "../SlideUpDialog";

function ExtraexpenseModal(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const auth: string = useSelector((state: IRootState) => state.auth);
	const budget: IBudget = useSelector((state: IRootState) => state.budget);

	const [createExtraexpenseModal, setCreateExtraexpenseModal] = React.useState<boolean>(false);
	const [removeExtraexpenseModal, setRemoveExtraexpenseModal] = React.useState<boolean>(false);
	const [removeExtraexpense, setRemoveExtraexpense] = React.useState<IExtraexpense>({
		id: 0,
		user_id: 0,
		extraexpense_type: "",
		extraexpense_amount_monthly: 0,
		created_at: new Date(),
		updated_at: new Date(),
	});

	const [removeExtraexpenseButtonDisabled, setRemoveExtraexpenseButtonDisabled] = React.useState<boolean>(false);

	const extraexpensesSortedByCreatedAtAscending: IExtraexpense[] = [...budget.extraexpenses].sort((a, b) => {
		return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
	});

	const handleCreateExtraexpense = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		try {
			event.preventDefault();

			const form: FormData = new FormData(event.currentTarget);
			const extraexpenseType: string = form.get("extraexpense_type") as string;
			const extraexpenseAmountMonthly: number = Number.parseInt(form.get("extraexpense_amount_monthly") as string);

			if (Number.isNaN(extraexpenseAmountMonthly) || extraexpenseAmountMonthly <= 0) {
				throw new Error("Please enter valid amount");
			}

			if (!auth) {
				dispatch(setForceLogin(true));
				return;
			}

			const createExtraexpenseResponse: Response = await fetch(`${Utils.baseurl}/extraexpenses/create`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${auth}`,
					"Content-Type": "application/json",
				},
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
			setRemoveExtraexpenseButtonDisabled(true);

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
				setTimeout((): void => setRemoveExtraexpenseButtonDisabled(false), 2000);
			}
		}
	};

	const handleGetTotalExtraexpense = (extraexpenses: IExtraexpense[]): number => {
		try {
			const totalExtraexpense: number = extraexpenses.reduce((accumulator: number, extraexpense: IExtraexpense) => {
				return accumulator + extraexpense.extraexpense_amount_monthly;
			}, 0);

			return totalExtraexpense;
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
			{removeExtraexpenseModal ? (
				<Modal index={40} classes="gap-y-3 items-center justify-center px-6 py-6 w-[20rem] md:min-w-[20rem]">
					<div className="flex flex-col gap-y-2">
						<span className="text-lg text-center text-orange font-medium font-rubik">Warning</span>

						<span className="text-base text-center text-light font-light font-rubik">
							This operation is permanent and will delete{" "}
							<b>
								{removeExtraexpense.extraexpense_type} {removeExtraexpense.extraexpense_amount_monthly.toFixed(1)}€
							</b>
						</span>
					</div>

					<div className="flex gap-x-3 items-center">
						<button
							type="submit"
							className="btn px-2.5 py-1.5 border border-red hover:bg-red text-red hover:text-light stroke-red hover:stroke-light"
							onClick={(): Promise<void> => handleRemoveExtraexpense(removeExtraexpense.id)}
							disabled={removeExtraexpenseButtonDisabled}
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
							onClick={(): void => setRemoveExtraexpenseModal(false)}
						>
							<span className="text-base text-light font-normal font-rubik">Cancel</span>
						</button>
					</div>
				</Modal>
			) : (
				<SlideUpDialog classes="gap-y-4 px-8 py-6">
					{!createExtraexpenseModal && !removeExtraexpenseModal ? (
						<div className="flex flex-col gap-y-6">
							<div className="flex items-center justify-center">
								<button type="button" className="bg-White px-0 py-[0.18rem] w-28 rounded-lg" />
							</div>

							<div className="flex flex-col">
								<div className="flex items-center justify-between">
									<div className="flex flex-col">
										<h2 className="text-base text-White font-normal font-rubik">expenses</h2>

										<span className="text-base text-Orange font-normal font-rubik">
											+{handleGetTotalExtraexpense(budget.extraexpenses).toFixed(1)}€
										</span>
									</div>

									<button type="button" className="btn bg-transparent px-3 py-1.5 border-2 border-Orange rounded-full">
										<span className="text-[0.813rem] text-White font-medium font-rubik">+ Add new</span>
									</button>
								</div>

								<div className="overflow-auto">
									<table className="w-full">
										<thead>
											<tr>
												<th className="px-0 py-2 text-left text-sm text-White font-normal font-rubik">ID</th>
												<th className="px-3 py-2 text-left text-sm text-White font-normal font-rubik">Expense</th>
												<th className="px-3 py-2 text-left text-sm text-White font-normal font-rubik">Amount</th>
												<th className="px-0 py-2 text-right text-sm text-White font-normal font-rubik">Created</th>
											</tr>
										</thead>

										{extraexpensesSortedByCreatedAtAscending.length > 0 && (
											<tbody className="overflow-y-auto table-fixed">
												{extraexpensesSortedByCreatedAtAscending.map((extraexpense: IExtraexpense, index: number) => (
													<tr
														className="border-t border-t-Grey cursor-pointer"
														key={extraexpense.id}
														onClick={(): void => {
															setRemoveExtraexpense(extraexpense);
															setRemoveExtraexpenseModal(true);
														}}
														onKeyUp={(): void => {
															setRemoveExtraexpense(extraexpense);
															setRemoveExtraexpenseModal(true);
														}}
													>
														<td className="px-0 py-1 text-left text-sm text-White font-normal font-rubik truncate">
															<span>{index + 1}</span>
														</td>
														<td className="px-3 py-1 text-left text-sm text-White font-normal font-rubik truncate">
															<span>{extraexpense.extraexpense_type}</span>
														</td>
														<td className="px-3 py-1 text-left text-sm text-White font-normal font-rubik truncate">
															<span>{extraexpense.extraexpense_amount_monthly.toFixed(1)}€</span>
														</td>
														<td className="px-0 py-1 text-right text-sm text-White font-normal font-rubik truncate">
															<span>{new Date(extraexpense.created_at).toLocaleDateString()}</span>
														</td>
													</tr>
												))}
											</tbody>
										)}
									</table>
								</div>
							</div>
						</div>
					) : (
						<form className="flex flex-col gap-y-4" onSubmit={handleCreateExtraexpense}>
							<div className="flex items-center justify-between">
								<span className="text-sm text-light font-medium font-rubik">NEW EXPENSE</span>

								<button type="button" onClick={(): void => setCreateExtraexpenseModal(false)}>
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<title>Close</title>
										<path
											d="M15.75 15L9.75 9M9.75 15L15.75 9M22.75 12C22.75 6.477 18.273 2 12.75 2C7.227 2 2.75 6.477 2.75 12C2.75 17.523 7.227 22 12.75 22C18.273 22 22.75 17.523 22.75 12Z"
											stroke="white"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</button>
							</div>

							<div className="flex items-center justify-between px-0 py-2 border-b border-b-grey">
								<input
									className="bg-transparent w-full text-sm text-white placeholder:text-light font-normal font-rubik focus:outline-none"
									type="text"
									name="extraexpense_type"
									id="extraexpense_type"
									placeholder="Rent"
									required
								/>
							</div>

							<div className="flex items-center justify-between px-0 py-2 border-b border-b-grey">
								<input
									className="bg-transparent w-full text-sm text-white placeholder:text-light font-normal font-rubik focus:outline-none"
									type="number"
									name="extraexpense_amount_monthly"
									id="extraexpense_amount_monthly"
									placeholder="0.00"
									required
								/>

								<span className="text-sm text-light font-normal font-rubik">€/MO</span>
							</div>

							<button type="submit" className="btn bg-dark rounded-xl">
								<span className="text-sm text-white font-normal font-rubik">Save</span>
							</button>
						</form>
					)}
				</SlideUpDialog>
			)}
		</>
	);
}

export default ExtraexpenseModal;
