import type { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import { setError } from "../../stores/Error";
import { setForceLogin } from "../../stores/ForceLogin";
import { setModals } from "../../stores/Modals";
import type { IBudget, IExtraexpense, IResponseError, IRootState } from "../../types";
import { Utils } from "../../utils";
import Modal from "../Modal";

function ExtraexpenseModal(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

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
				headers: {
					Authorization: `Bearer ${auth}`,
					"Content-Type": "application/json",
					"ngrok-skip-browser-warning": "69420",
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
			const auth: string = getCookie("Authorization") ?? "";
			if (!auth) {
				dispatch(setForceLogin(true));
				return;
			}

			const removeExtraexpenseResponse: Response = await fetch(
				`${Utils.baseurl}/extraexpenses/remove/${extraexpense_id}`,
				{
					method: "DELETE",
					headers: { Authorization: `Bearer ${auth}`, "ngrok-skip-browser-warning": "69420" },
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
		<Modal
			index={40}
			classes="gap-y-4 px-4 pt-4 pb-4 min-w-[25rem] border border-dark animate__animated animate__fadeInDown animate__faster"
		>
			{!createExtraexpenseModal && !removeExtraexpenseModal ? (
				<div className="flex flex-col gap-y-4">
					<div className="flex items-center justify-between">
						<div className="flex gap-x-1 items-center">
							<span className="text-base text-white font-medium font-rubik">expenses</span>

							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
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

						<button className="mr-[-0.25rem]" type="button" onClick={(): void => handleClose()}>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
								<title>Close</title>
								<g clip-path="url(#clip0_283_267)">
									<path d="M18 6L6 18" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
									<path d="M6 6L18 18" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
								</g>
								<defs>
									<clipPath id="clip0_283_267">
										<rect width="24" height="24" fill="white" />
									</clipPath>
								</defs>
							</svg>
						</button>
					</div>

					<div className="overflow-auto">
						<table className="w-full">
							<thead className="border-b border-b-grey">
								<tr>
									<th className="-bg-yellow-600 px-0 py-1 text-left text-sm text-white font-medium font-rubik">ID</th>
									<th className="-bg-violet-600 px-3 py-1 text-left text-sm text-white font-medium font-rubik">
										Title
									</th>
									<th className="-bg-pink-600 px-3 py-1 text-left text-sm text-white font-medium font-rubik">Amount</th>
									<th className="-bg-cyan-600 px-0 py-1 text-right text-sm text-white font-medium font-rubik">
										Created
									</th>
								</tr>
							</thead>

							<tbody className="overflow-y-auto table-fixed">
								{budget.extraexpenses.map((extraexpense: IExtraexpense, index: number) => (
									<tr
										className="border-b border-b-grey cursor-pointer transition-all duration-300 ease-in-out"
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
										<td className="px-0 py-2 text-left text-sm text-light font-medium font-rubik truncate">
											<span>{index + 1}</span>
										</td>
										<td className="px-3 py-2 text-left text-sm text-light font-medium font-rubik truncate">
											<span>{extraexpense.extraexpense_type}</span>
										</td>
										<td className="px-3 py-2 text-left text-sm text-light font-medium font-rubik truncate">
											<span>{extraexpense.extraexpense_amount_monthly.toFixed(1)}€</span>
										</td>
										<td className="px-0 py-2 text-right text-sm text-light font-medium font-rubik truncate">
											<span>{new Date(extraexpense.created_at).toLocaleDateString()}</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<button
						type="button"
						className="btn border border-grey rounded-xl"
						onClick={(): void => setCreateExtraexpenseModal(true)}
					>
						<span className="text-base text-light font-normal font-rubik">Create</span>
					</button>
				</div>
			) : createExtraexpenseModal ? (
				<form className="flex flex-col gap-y-4" onSubmit={handleCreateExtraexpense}>
					<span className="text-base text-white font-normal font-rubik">Create new Expense 🚀</span>

					<div className="flex flex-col gap-y-3">
						<div className="flex items-center justify-between px-0 py-2 border-b border-b-white">
							<input
								className="bg-transparent w-full text-sm text-white placeholder:text-light font-normal font-rubik focus:outline-none"
								type="text"
								name="extraexpense_type"
								id="extraexpense_type"
								placeholder="Source"
								required
							/>
						</div>

						<div className="flex items-center justify-between px-0 py-2 border-b border-b-white">
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
					</div>

					<div className="flex items-center justify-center">
						<button type="submit" className="btn border border-dark rounded-xl">
							<span className="text-base text-white font-normal font-rubik">Save</span>
						</button>
					</div>
				</form>
			) : (
				removeExtraexpenseModal && (
					<div className="flex flex-col gap-y-4 items-center justify-center px-2 py-2">
						<span className="text-lg text-center text-white font-medium font-rubik">Warning</span>

						<span className="text-base text-center text-light font-medium font-rubik">
							This operation is permanent and will delete expense <br />
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
		</Modal>
	);
}

export default ExtraexpenseModal;
