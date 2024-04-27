import type { Metadata } from "next";
import "../globals.css";
import { isLoggedIn } from "@Utils/Auth/helper";
import Provider from "@General/Provider";
import Navbar from "@General/Navbar";
import InfoBar from "@General/InfoBar";

export const metadata: Metadata = {
	title: "PulseBots",
	description: "Create custom AI bots for your business",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const loginStatus = await isLoggedIn();

	return (
		<html lang="en">
			<body>
				<Provider>
					<main className="dark text-foreground bg-background flex flex-col h-screen">
						{loginStatus && <InfoBar />}
						<Navbar isLoggedIn={loginStatus} />
						{children}
					</main>
				</Provider>
			</body>
		</html>
	);
}
