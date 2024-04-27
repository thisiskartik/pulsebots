import type { Metadata } from "next";
import "../globals.css";
import Provider from "@General/Provider";

export const metadata: Metadata = {
	title: "PulseBots",
	description: "Create custom AI bots for your business",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<Provider>
					<main className="light absolute bottom-8 right-8">{children}</main>
				</Provider>
			</body>
		</html>
	);
}
