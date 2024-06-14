import React from "react";
import { getCookie } from "typescript-cookie";
import { request } from "../../utils";

function BudgetGetStarted() {
	const [step, setStep] = React.useState<number>(0);
	const [error, setError] = React.useState<string>("");

	const [regularIncomeModal, setRegularIncomeModal] =
		React.useState<boolean>(false);

	const handleSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		try {
			event.preventDefault();
			setError("");

			const form: FormData = new FormData(event.currentTarget);
			const incomeString: string = form.get("income") as string;
			const income: number = Number.parseInt(incomeString);

			if (income <= 0 || Number.isNaN(income)) {
				setError("Please enter a valid income amount.");
				return;
			}

			const authorization: string | undefined = getCookie("Authorization");
			if (!authorization) {
				return;
			}

			await request.post(
				"budgets/create",
				{
					income_amount_monthly: income,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${authorization}`,
					},
				},
			);

			setRegularIncomeModal(false);
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw error;
			}
		}
	};

	return (
		<div className="flex items-center justify-center bg-radial-gradient w-screen h-screen">
			{step === 0 && (
				<div className="flex flex-col gap-y-6 justify-center w-[400px]">
					<div className="flex flex-col gap-y-1 items-center">
						<img
							src="https://ucarecdn.com/5be54da1-0bf6-4d18-8209-07fe1c228ddc/-/preview/512x512/"
							alt="Growth"
							width="160"
							height="160"
						/>

						<h1 className="text-2xl text-white font-medium font-rubik">
							Setup budget
						</h1>

						<p className="text-sm text-white font-normal font-rubik text-center">
							We’ll guide you through the steps of setting up your budget.
						</p>
					</div>

					<button
						type="button"
						className="btn bg-[#895FF5] py-2 rounded-lg"
						onClick={(): void => setStep(1)}
					>
						<span className="text-sm text-white font-medium font-rubik">
							Get started
						</span>
					</button>
				</div>
			)}

			{step === 1 && (
				<div className="flex flex-col gap-y-6 justify-center w-[400px]">
					<div className="flex flex-col gap-y-1 items-center">
						<img
							src="https://ucarecdn.com/683b3c65-2bfe-4667-bc9d-998ff4d11f36/-/preview/174x173/"
							alt="Growth"
							width="160"
							height="160"
						/>

						<h1 className="text-2xl text-white font-medium font-rubik">
							{new Date().getFullYear()}
						</h1>

						<p className="text-sm text-white font-normal font-rubik">
							Set your regular income to start a budget.
						</p>
					</div>

					<div className="flex flex-col gap-y-2 mx-6">
						<button
							type="button"
							className={`btn ${regularIncomeModal ? "bg-[#4B4B4B]" : "bg-[#895FF5]"} py-2 rounded-lg`}
							onClick={(): void => setRegularIncomeModal(true)}
							disabled={regularIncomeModal}
						>
							<span className="text-sm text-white font-medium font-rubik">
								Set regular income
							</span>
						</button>

						{regularIncomeModal && (
							<form
								className="flex flex-col gap-y-6 px-4 py-6 bg-[#202020] rounded-lg"
								onSubmit={handleSubmit}
							>
								<div className="flex flex-col gap-y-6">
									<span className="text-sm text-white font-medium font-rubik">
										What is your regular income?
									</span>

									<div className="flex flex-col gap-y-3">
										<div className="flex gap-x-4 items-center justify-between p-2 border-[1px] border-[#4B4B4B] rounded-lg">
											<input
												className="bg-transparent w-full text-sm text-white placeholder:text-white font-light font-rubik focus:outline-none"
												type="number"
												name="income"
												id="income"
												placeholder="0.00"
												required
											/>

											<span className="text-xs text-white font-light font-rubik">
												EUR/MONTH
											</span>
										</div>

										{error && (
											<span className="text-xs text-red-500 font-light font-rubik">
												{error}
											</span>
										)}
									</div>
								</div>

								<button
									type="submit"
									className="btn bg-[#895FF5] py-2 rounded-lg"
								>
									<span className="text-xs text-white font-medium font-rubik">
										Save
									</span>
								</button>
							</form>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default BudgetGetStarted;
