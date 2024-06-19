import type { KyResponse } from "ky";
import React from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import type { TExtraincome } from "../../types";
import { request } from "../../utils";
import Modal from "../Modal";

function ExtraincomeModal() {
	const navigate: NavigateFunction = useNavigate();

	const [addExtraincome, setAddExtraincome] = React.useState<boolean>(false);
	const [extraincomes, setExtraincomes] = React.useState<TExtraincome[]>([]);

	const handleGetExtraincomes = React.useCallback(
		async (authorization: string): Promise<void> => {
			try {
				const response: KyResponse = await request.get("extraincomes/get-all", {
					headers: {
						Authorization: `Bearer ${authorization}`,
					},
				});

				const extraincomes: TExtraincome[] = await response.json();

				if (Object.keys(extraincomes).length === 0) {
					return;
				}

				setExtraincomes(extraincomes);
			} catch (error) {
				if (error instanceof Error) {
					console.error(error.message);
				}
			}
		},
		[],
	);

	React.useEffect((): void => {
		async function onLoad(): Promise<void> {
			const authorization: string | undefined = getCookie("Authorization");

			if (!authorization) {
				navigate("/");
				return;
			}

			handleGetExtraincomes(authorization);
		}

		onLoad();
	}, [handleGetExtraincomes, navigate]);

	return (
		<Modal index={50}>
			<div className="flex flex-col w-80">
				{addExtraincome ? (
					<form className="flex flex-col">
						<div className="flex px-4 pt-4">
							<h1 className="text-sm text-white font-normal font-rubik">
								Add new Extraincome 💰
							</h1>
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

								<span className="text-sm text-white font-normal font-rubik">
									€/MO
								</span>
							</div>
						</div>

						<button
							type="submit"
							className="btn border-t border-t-[#242424] py-2.5"
						>
							<span className="text-sm text-[#895FF5] font-normal font-rubik">
								Save
							</span>
						</button>
					</form>
				) : (
					<div className="flex flex-col">
						<div className="flex items-center justify-between px-4 py-4">
							<span className="text-sm text-white font-normal font-rubik">
								Extraincome 💰
							</span>
							<span className="text-sm text-white font-medium font-rubik">
								1062.50 €
							</span>
						</div>

						<div className="flex flex-col px-4 pb-4">
							{extraincomes.map((extraincome: TExtraincome) => (
								<button
									key={extraincome.extraincome_type}
									type="button"
									className="flex items-center justify-between"
								>
									<span className="text-sm text-[#4B4B4B] font-normal font-rubik">
										{extraincome.extraincome_type}
									</span>
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
							<span className="text-sm text-[#895FF5] font-normal font-rubik">
								+ Add New
							</span>
						</button>
					</div>
				)}
			</div>
		</Modal>
	);
}

export default ExtraincomeModal;
