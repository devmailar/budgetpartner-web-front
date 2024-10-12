import React, { type ReactNode } from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";

const PrivacyPolicy = (): ReactNode => {
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

			<div className="flex bg-black h-max">
				<div className="flex flex-col text-base text-white font-light leading-tight">
					<h1>Welcome to BudgetPartner</h1>
					<p>Effective Date: October 12, 2024</p>
					<br />
					<p>
						This Privacy Policy is meant to help you understand what information we collect, why we collect it, and how
						you can manage it.
					</p>
					<br />
					<h2>1. Information We Collect</h2>
					<p>
						As a platform dedicated to privacy and security, we strive to collect the minimum amount of information
						necessary. We DO NOT collect any personally identifiable information (PII) about you unless you choose to
						provide it to us voluntarily. You decide whether to proceed with any activity that requests personal
						information.
					</p>
					<br />
					<h3>1.1 Third-Party Services</h3>
					<p>
						Our platform is hosted on Cloudflare, which employs a feature called Browser Insights to collect performance
						and geolocation metrics. This information aids in optimizing and improving the performance of Budget
						Partner. Importantly, Cloudflare does not store any personally identifiable data from our users. For more
						in-depth information on how Cloudflare uses Browser Insights, you can visit their blog post{" "}
						<a href="https://blog.cloudflare.com/browser-insights/">here</a>.
					</p>
					<br />
					<h2>2. Use of Your Information</h2>
					<p>
						Any personal information that you provide to us, like your name and email for account setup, will be used
						solely to maintain your BudgetPartner account, provide you with the services of BudgetPartner, and
						communicate with you about your account or our services.
					</p>
					<br />
					<h2>3. Cookies and Tracking</h2>
					<p>
						BudgetPartner does not use cookies to track your activity. No third-party cookies are used on our platform,
						and no tracking cookies are used by us.
					</p>
					<br />
					<h2>4. Advertising</h2>
					<p>
						We use Google AdSense to display advertisements on the BudgetPartner platform. Google AdSense may use
						cookies and other tracking technologies to personalize and improve ads. For more information on how Google
						AdSense uses your data, please refer to their{" "}
						<a href="https://policies.google.com/privacy">privacy policy</a>.
					</p>
					<br />
					<h2>5. Data Sharing and Transfer</h2>
					<p>
						We do not sell or rent your personal information to any third parties under any circumstances. The personal
						information you provide to us is stored and processed in the location in which it was collected unless
						otherwise required by law.
					</p>
					<br />
					<h2>6. Security of Your Information</h2>
					<p>
						We prioritize the security of your information and employ administrative, technical, and physical safeguards
						designed to protect against the loss, misuse, unauthorized access, disclosure, alteration, or destruction of
						the information we collect.
					</p>
					<br />
					<h2>7. Changes to Our Privacy Policy</h2>
					<p>
						We may update our Privacy Policy from time to time. If we make changes, we will post the new policy here
						with a new effective date. Your continued use of BudgetPartner after any changes to the Privacy Policy
						constitutes your acceptance of the new terms.
					</p>
					<br />
					<h2>8. GDPR Privacy Notice</h2>
					<p>
						If you are a resident of the European Economic Area (EEA), you have certain data protection rights. Budget
						Partner aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your
						personal data.
					</p>
					<br />
					<h2>8.1 Your Data Protection Rights</h2>
					<p>You have the following data protection rights:</p>
					<p>You have the right to update or delete the information we have on you.</p>
					<p>You have the right to have your information rectified if that information is inaccurate or incomplete.</p>
					<p>You have the right to object to our processing of your personal data.</p>
					<p>You have the right to request that we restrict the processing of your personal data.</p>
					<p>
						You have the right to be provided with a copy of your personal data in a structured, machine-readable, and
						commonly used format.
					</p>
					<p>
						You also have the right to withdraw your consent at any time where BudgetPartner relied on your consent to
						process your personal information.
					</p>

					<br />
					<h2>8. Contact Us</h2>
					<p>
						If you have any questions about this Privacy Policy or our data handling practices, please contact us at{" "}
						<a href="mailto:support@budgetpartner.app">support@budgetpartner.app</a>.
					</p>
					<br />
					<p>Thank you for choosing BudgetPartner, where we value your privacy and data security.</p>
				</div>
			</div>
		</div>
	);
};

export default PrivacyPolicy;
