import Modal from "../Modal";

function ExtraincomeModal() {
	return (
		<Modal index={10}>
			<form className="flex flex-col gap-y-2 px-4 py-4">
				<div className="flex gap-x-40 items-center justify-between border-b border-b-[#242424] pb-1">
					<span className="text-sm text-[#895FF5] font-medium font-rubik">
						Extra income
					</span>
					<span className="text-sm text-[#895FF5] font-medium font-rubik">
						1230.00€
					</span>
				</div>

				<div className="flex flex-col">
					<button type="button" className="flex items-center justify-between">
						<span className="text-sm text-[#895FF5] font-light font-rubik">
							Oneway Mission
						</span>
						<span className="text-sm text-[#895FF5] font-light font-rubik">
							1230.00
						</span>
					</button>

					<button type="button" className="flex items-center justify-between">
						<span className="text-sm text-[#895FF5] font-light font-rubik">
							Nordnet
						</span>
						<span className="text-sm text-[#895FF5] font-light font-rubik">
							150.00
						</span>
					</button>
				</div>
			</form>

			<button type="button" className="btn border-t border-t-[#242424]">
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
		</Modal>
	);
}

export default ExtraincomeModal;
