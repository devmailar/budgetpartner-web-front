import Modal from "../Modal";

function SettingsModal(): React.ReactNode {
	return (
		<Modal index={40}>
			<div className="flex flex-col">
				<h1 className="text-white">Settings</h1>
			</div>
		</Modal>
	);
}

export default SettingsModal;
