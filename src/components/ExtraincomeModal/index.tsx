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
import SlideUpDialog from "../SlideUpDialog";

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
		extraincome_includes_weekends: false,
		created_at: new Date(),
		updated_at: new Date(),
	});

	const [removeExtraincomeButtonDisabled, setRemoveExtraincomeButtonDisabled] = React.useState<boolean>(false);

	const [includeWeekends, setIncludeWeekends] = React.useState<boolean>(false);
	const [invalidAmount, setInvalidAmount] = React.useState<string>("");

	const extraincomesSortedByCreatedAtAscending: IExtraincome[] = [...budget.extraincomes].sort((a, b) => {
		return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
	});

	const handleCreateExtraincome = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		try {
			event.preventDefault();
			setInvalidAmount("");

			const form: FormData = new FormData(event.currentTarget);
			const extraincomeType: string = form.get("extraincome_type") as string;
			const extraincomeAmountMonthly: number = Number.parseInt(form.get("extraincome_amount_monthly") as string);

			if (Number.isNaN(extraincomeAmountMonthly) || extraincomeAmountMonthly <= 0) {
				setInvalidAmount("Invalid amount !");
				return;
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
				<SlideUpDialog classes="gap-y-6 px-6 py-6">
					<button
						type="button"
						className="flex items-center justify-center"
						onClick={(): void => {
							dispatch(
								setModals({
									extraincome: false,
									extraexpense: false,
									language: false,
									settings: false,
								}),
							);
						}}
					>
						<button
							type="button"
							className="bg-White px-0 py-[0.18rem] w-28 rounded-lg"
							onClick={(): void => {
								dispatch(
									setModals({
										extraincome: false,
										extraexpense: false,
										language: false,
										settings: false,
									}),
								);
							}}
						/>
					</button>

					{!createExtraincomeModal && !removeExtraincomeModal ? (
						<div className="flex flex-col gap-y-4">
							<div className="flex items-center justify-between">
								<div className="flex gap-x-0.5 items-center">
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<title>Trending Up</title>
										<path d="M3.35999 17L9.11999 11L12.96 15L20.64 7" stroke="#895FF5" stroke-width="2" />
										<path d="M13.92 7H20.64V14" stroke="#895FF5" stroke-width="2" />
									</svg>

									<span className="text-base text-Purple font-normal font-rubik">
										{handleGetTotalExtraincome(budget.extraincomes).toFixed(2)}€
									</span>
								</div>

								<button
									type="button"
									className="btn bg-GreyTransparentStroke px-4 py-0.5"
									onClick={(): void => setCreateExtraincomeModal(true)}
								>
									<span className="text-sm text-GreyLight font-normal font-rubik">+ Add new</span>
								</button>
							</div>

							<div className="flex flex-col">
								<div className="flex gap-x-2 items-center justify-between px-0 py-1 border-b border-b-Grey">
									<span className="w-16 text-sm text-White font-normal font-rubik">ID</span>
									<span className="w-80 text-sm text-White font-normal font-rubik">Income</span>
									<span className="w-40 text-sm text-White font-normal font-rubik">Amount</span>
									<span className="w-52 text-sm text-White font-normal font-rubik">Date</span>
								</div>

								<div className="max-h-[17.05rem] overflow-y-scroll">
									{extraincomesSortedByCreatedAtAscending.length > 0 &&
										extraincomesSortedByCreatedAtAscending.map((extraincome: IExtraincome, index: number) => (
											<div
												className="flex gap-x-2 items-center justify-between py-1 bg-GreyTransparent border-t border-t-Grey cursor-pointer"
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
												<div className="w-16 text-sm text-White font-normal font-rubik truncate">
													<span>{index + 1}</span>
												</div>
												<div className="w-80 text-sm text-White font-normal font-rubik truncate">
													<span>{extraincome.extraincome_type}</span>
												</div>
												<div className="w-40 text-sm text-White font-normal font-rubik truncate">
													<span>{extraincome.extraincome_amount_monthly.toFixed(1)}€</span>
												</div>
												<div className="w-52 text-sm text-White font-normal font-rubik truncate">
													<span>{new Date(extraincome.created_at).toLocaleDateString()}</span>
												</div>
											</div>
										))}
								</div>
							</div>
						</div>
					) : (
						<form className="flex flex-col gap-y-8" onSubmit={handleCreateExtraincome}>
							<div className="flex items-center justify-between">
								<h2 className="text-base text-White font-medium font-rubik">New Income</h2>

								<button type="button" onClick={(): void => setCreateExtraincomeModal(false)}>
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

							<div className="flex flex-col gap-y-2">
								<div className="flex items-center justify-between px-2 py-2 bg-GreyTransparentStroke rounded-md">
									<input
										className="bg-transparent w-full text-lg text-GreyLight font-normal font-rubik focus:outline-none"
										type="text"
										name="extraincome_type"
										id="extraincome_type"
										placeholder="income"
										required
									/>
								</div>

								<div className="flex items-center justify-between px-2 py-2 bg-GreyTransparentStroke rounded-md">
									<input
										className="bg-transparent w-full text-lg text-GreyLight font-normal font-rubik focus:outline-none"
										type="text"
										name="extraincome_amount_monthly"
										id="extraincome_amount_monthly"
										placeholder="amount"
										required
									/>

									<span className="text-lg text-GreyLight font-normal font-rubik">€</span>
								</div>

								<span className="text-lg text-red-600 font-medium font-rubik">{invalidAmount}</span>
							</div>

							<div className="flex flex-col gap-y-2">
								<div className="w-full md:w-80">
									<p className="text-lg text-GreyLight font-normal font-rubik leading-tight">
										If ‘Include Weekends’ is enabled, then the income is calculated for all days in the month, including
										weekends.
									</p>
								</div>

								<div className="flex gap-x-1 items-center justify-between">
									<span className="text-xl text-PurpleBright font-normal font-rubik">Include Weekends</span>

									<button type="button" onClick={() => setIncludeWeekends(!includeWeekends)}>
										{includeWeekends ? (
											<svg width="48" height="28" viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg">
												<title>Checkbox Checked</title>
												<rect width="48" height="28" rx="14" fill="#313131" />
												<circle cx="34" cy="14" r="10" fill="#6D28D9" />
											</svg>
										) : (
											<svg width="48" height="28" viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg">
												<title>Checkbox Not Checked</title>
												<rect width="48" height="28" rx="14" fill="#313131" />
												<circle cx="14" cy="14" r="10" fill="#b7b7b7" />
											</svg>
										)}
									</button>
								</div>
							</div>

							<button type="submit" className="btn bg-GreyTransparentStroke px-4 py-2">
								<span className="text-base text-GreyLight font-normal font-rubik">Save</span>
							</button>
						</form>
					)}
				</SlideUpDialog>
			)}
		</>
	);
}

export default ExtraincomeModal;
