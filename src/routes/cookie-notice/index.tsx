import React, { type ReactNode } from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";

const CookieNotice = (): ReactNode => {
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
					<h1>Cookie Notice</h1>
					<p>Effective Date: October 12, 2024</p>
					<br />
					<h2>1. What Are Cookies?</h2>
					<p>
						Cookies are small text files stored on your device when you visit a website. They help improve your browsing
						experience by remembering your preferences and recognizing you when you return.
					</p>
					<br />
					<h2>2. How We Use Cookies</h2>
					<p>We use cookies to:</p>
					<p>Ensure the proper functioning of our website.</p>
					<p>Understand and analyze how our users interact with our website.</p>
					<br />
					<h2>3. Types of Cookies We Use</h2>
					<p>
						<b>Essential Cookies:</b> These cookies are necessary for the website to function and cannot be switched off
						in our systems.
					</p>
					<p>
						<b>Performance Cookies:</b> These cookies collect information about how visitors use a website, for
						instance, which pages visitors go to most often.
					</p>
					<br />
					<h2>4. Managing Cookies</h2>
					<p>
						You can manage your cookie preferences through your web browser settings. Note that disabling cookies may
						affect the functionality of our website.
					</p>
					<br />
					<h2>5. Google AdSense</h2>
					<p>
						Our website uses Google AdSense, which uses cookies to deliver targeted advertisements. For more
						information, please review Google's Privacy Policy.
					</p>
					<br />
					<h2>6. Contact Us</h2>
					<p>
						If you have any questions about our use of cookies, please contact us at{" "}
						<a href="mailto:support@budgetpartner.app">support@budgetpartner.app</a>.
					</p>
				</div>
			</div>
		</div>
	);
};

export default CookieNotice;
