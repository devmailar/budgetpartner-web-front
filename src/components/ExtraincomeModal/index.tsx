import React from "react";
import Modal from "../Modal";

function ExtraincomeModal() {
	const [addExtraincome, setAddExtraincome] = React.useState<boolean>(false);

	return (
		<Modal index={10}>
			<form className="flex flex-col gap-y-2 px-6 py-6 w-96">
				<div className="flex items-center justify-between border-b border-b-[#242424] pb-2">
					<span className="text-xs text-[#FFFFFF] font-normal font-rubik">
						Extraincome
					</span>
					<span className="text-xs text-[#FFFFFF] font-medium font-rubik">
						1230.00€
					</span>
				</div>

				<div className="flex flex-col">
					<button type="button" className="flex items-center justify-between">
						<span className="text-xs text-[#895FF5] font-thin font-rubik">
							Oneway Mission
						</span>
						<span className="text-xs text-[#895FF5] font-thin font-rubik">
							1230.00
						</span>
					</button>

					<button type="button" className="flex items-center justify-between">
						<span className="text-xs text-[#895FF5] font-thin font-rubik">
							Nordnet
						</span>
						<span className="text-xs text-[#895FF5] font-thin font-rubik">
							150.00
						</span>
					</button>
				</div>
			</form>

			{addExtraincome ? (
				<form className="flex flex-col gap-y-2 px-4 pt-4 border-t border-t-[#242424] -bg-green-400">
					<div className="flex gap-x-4 items-center justify-between p-2 border-[1px] border-[#4B4B4B] rounded-lg">
						<input
							className="bg-transparent w-full text-sm text-[#FFFFFF] placeholder:text-[#FFFFFF] font-light font-rubik focus:outline-none"
							type="number"
							name="income"
							id="income"
							placeholder="Description"
							required
						/>
					</div>

					<div className="flex gap-x-4 items-center justify-between p-2 border-[1px] border-[#4B4B4B] rounded-lg">
						<input
							className="bg-transparent w-full text-sm text-[#FFFFFF] placeholder:text-[#FFFFFF] font-light font-rubik focus:outline-none"
							type="number"
							name="income"
							id="income"
							placeholder="0.00 €"
							required
						/>

						<span className="text-xs text-[#FFFFFF] font-light font-rubik">
							EUR/MONTH
						</span>
					</div>

					<button type="button" className="btn">
						<div className="flex gap-x-1 items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1.25em"
								height="1.25em"
								viewBox="0 0 24 24"
							>
								<title>Save</title>
								<path
									fill="#895FF5"
									d="M21 7v12q0 .825-.587 1.413T19 21H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h12zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"
								/>
							</svg>
							<span className="text-sm text-[#895FF5] font-normal">Save</span>
						</div>
					</button>
				</form>
			) : (
				<button
					type="button"
					className="btn border-t border-t-[#242424]"
					onClick={(): void => setAddExtraincome(true)}
				>
					<div className="flex gap-x-1 items-center justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1.25em"
							height="1.25em"
							viewBox="0 0 24 24"
						>
							<title>Plus</title>
							<path
								fill="#895FF5"
								d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z"
							/>
						</svg>
						<span className="text-sm text-[#895FF5] font-normal">New</span>
					</div>
				</button>
			)}
		</Modal>
	);
}

export default ExtraincomeModal;
