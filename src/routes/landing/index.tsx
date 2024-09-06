import Spline from "@splinetool/react-spline";
import type React from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";

function Landing(): React.ReactNode {
	const navigate: NavigateFunction = useNavigate();

	return (
		<div className="flex gap-x-3 flex-wrap items-center justify-center h-screen py-10 px-10 animate__faster animate__animated animate__fadeIn animate__delay-1s">
			<div className="flex flex-col gap-y-12">
				<h1 className="text-6xl md:text-8xl text-white text-center font-medium">
					BudgetPartner <br /> simplifies <br /> budgeting
				</h1>

				<div className="flex flex-col gap-y-2 items-center justify-center">
					<button
						type="button"
						className="btn bg-[#007AFF] w-full px-3 py-3.5 rounded-lg"
						onClick={(): void => navigate("/login")}
					>
						<span className="text-2xl text-white font-medium">Login</span>
					</button>
				</div>
			</div>

			<div className="">
				<Spline scene="https://prod.spline.design/0lbtSgPIX6ZHmqHi/scene.splinecode" renderOnDemand />
			</div>
		</div>
	);
}

export default Landing;
