import Spline from "@splinetool/react-spline";
import React, { type ReactNode } from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";

const Landing = (): ReactNode => {
	const navigate: NavigateFunction = useNavigate();

	return (
		<div className="h-screen py-4 md:py-0 px-10 md:px-0 animate__faster animate__animated animate__fadeIn animate__delay-1s">
			<div className="flex gap-x-3 flex-wrap-reverse items-center justify-center h-fit md:h-screen">
				<div className="flex flex-col gap-y-12">
					<h1 className="text-5xl md:text-8xl text-white text-center font-medium">
						BudgetPartner <br /> simplifies <br /> budgeting
					</h1>

					<div className="flex flex-col gap-y-2 items-center justify-center">
						<button
							type="button"
							className="btn bg-[#007AFF] w-full px-2.5 py-3 md:px-3 md:py-3.5 rounded-lg"
							onClick={(): void => navigate("/login")}
						>
							<span className="text-xl md:text-2xl text-white font-medium">Login</span>
						</button>
					</div>
				</div>

				<div className="hidden md:block">
					<Spline scene="https://prod.spline.design/0lbtSgPIX6ZHmqHi/scene.splinecode" renderOnDemand />
				</div>

				<div className="block md:hidden">
					<Spline scene="https://prod.spline.design/6dIIgvIz7s9A6CsI/scene.splinecode" renderOnDemand />
				</div>
			</div>
		</div>
	);
};

export default Landing;
