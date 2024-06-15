function Modal({
	index,
	children,
}: { index: number; children: React.ReactNode }) {
	return (
		<div
			className={`absolute z-${index} flex items-center justify-center w-screen h-screen bg-black bg-opacity-40`}
		>
			<div className="flex flex-col bg-[#1A1A1A] rounded-2xl max-w-96">
				{children}
			</div>
		</div>
	);
}

export default Modal;
