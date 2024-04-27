"use client";
import { NavbarItem, Button } from "@nextui-org/react";
import { logout } from "@Utils/Auth";

export default function Logout() {
	return (
		<NavbarItem>
			<Button
				onClick={async () => {
					await logout();
				}}
				variant="bordered"
			>
				Logout
			</Button>
		</NavbarItem>
	);
}
