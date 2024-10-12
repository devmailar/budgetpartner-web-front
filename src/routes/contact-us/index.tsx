import React, { type ReactNode } from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";

const ContactUs = (): ReactNode => {
	const navigate: NavigateFunction = useNavigate();

	return (
		<div className="animate__animated animate__slideInRight animate__faster">
			<nav className="flex items-center justify-between px-5 py-2.5 border-b border-b-[#313131]">
				<a href="/" className="text-lg text-white font-medium">
					BudgetPartner
				</a>

				<button type="button" onClick={(): void => navigate("/")}>
					<span className="text-lg text-[#007AFF] font-medium">Back</span>
				</button>
			</nav>

			<div className="flex p-4 bg-black h-max">
				<div className="flex flex-col text-base text-white font-light leading-tight">
					<h1>Contact Us</h1>

					<p>
						At BudgetPartner, we value your feedback and are here to assist you with any questions or concerns you may
						have. Feel free to reach out to us through any of the methods listed below:
					</p>

					<p>
						For any inquiries, support requests, or feedback, please contact us at:{" "}
						<a href="mailto:support@budgetpartner.app">support@budgetpartner.app</a>
					</p>

					<p>
						If you need to send us physical mail, please use the following address: BudgetPartner Support Team [Your
						Company Address] [City, Postal Code] [Country]
					</p>

					<p>We aim to respond to all inquiries within 24-48 hours. Your patience is greatly appreciated.</p>

					<p>Thank you for choosing BudgetPartner. We look forward to hearing from you!</p>
				</div>
			</div>
		</div>
	);
};

export default ContactUs;
