import React, { type ReactNode } from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";

const TermsOfService = (): ReactNode => {
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
					<h1>Terms of Service</h1>
					<p>Effective Date: October 12, 2024</p>
					<br />
					<h2>1. Acceptance of Terms</h2>
					<p>
						By accessing and using the BudgetPartner platform, you agree to comply with and be bound by these Terms of
						Service. If you do not agree to these terms, you should not use our platform.
					</p>
					<br />
					<h2>2. Description of Services</h2>
					<p>
						BudgetPartner provides tools and resources to help you manage and plan your budget. All services, content,
						and software provided through the platform are subject to these terms.
					</p>
					<br />
					<h2>3. User Accounts</h2>
					<p>
						To access certain features of BudgetPartner, you may need to create an account. You are responsible for
						maintaining the confidentiality of your account information and for all activities that occur under your
						account. You agree to notify us immediately of any unauthorized use of your account.
					</p>
					<br />
					<h2>4. Privacy Policy</h2>
					<p>
						Your use of BudgetPartner is also governed by our Privacy Policy. Please review our Privacy Policy for
						information on how we collect, use, and protect your personal data.
					</p>
					<br />
					<h2>5. User Conduct</h2>
					<p>You agree not to use BudgetPartner for any unlawful or prohibited activities. You agree not to:</p>
					<p>Violate any applicable laws or regulations.</p>
					<p>Upload or distribute any harmful or malicious software.</p>
					<p>Engage in any activity that disrupts or interferes with the operation of the platform.</p>
					<br />
					<h2>6. Intellectual Property</h2>
					<p>
						All content and software on BudgetPartner, including text, graphics, logos, and code, are the property of
						BudgetPartner or its licensors and are protected by intellectual property laws. You agree not to reproduce,
						distribute, or create derivative works based on this content without our explicit permission.
					</p>
					<br />
					<h2>7. Disclaimer of Warranties</h2>
					<p>
						BudgetPartner is provided on an "as-is" and "as-available" basis. We do not warrant that the platform will
						be uninterrupted, error-free, or free of viruses. We disclaim all warranties, express or implied, including
						but not limited to warranties of merchantability and fitness for a particular purpose.
					</p>
					<br />
					<h2>8. Limitation of Liability</h2>
					<p>
						In no event shall BudgetPartner be liable for any indirect, incidental, special, or consequential damages
						arising out of or in connection with your use of the platform.
					</p>
					<br />
					<h2>9. Changes to Terms</h2>
					<p>
						We may modify these Terms of Service from time to time. If we make material changes, we will notify you by
						email or through the platform. Your continued use of BudgetPartner after any changes constitutes your
						acceptance of the new terms.
					</p>
					<br />
					<h2>10. Contact Us</h2>
					<p>
						If you have any questions about these Terms of Service, please contact us at{" "}
						<a href="mailto:support@budgetpartner.app">support@budgetpartner.app</a>.
					</p>
				</div>
			</div>
		</div>
	);
};

export default TermsOfService;
