import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout/PublicLayout";
import Landing from "@/pages/Landing";
import Temp from "@/pages/Temp";
import PerformancePage from "@/pages/Performance/PerformancePage";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <PublicLayout />,
		children: [
			{
				index: true,
				element: <Landing />,
			},
			{
				path: "temp", // اسلش اول لازم نیست
				element: <Temp />,
			},
			{
				path: "performance", // 👈 اینو اضافه کردیم
				element: <PerformancePage />,
			},
		],
	},
]);