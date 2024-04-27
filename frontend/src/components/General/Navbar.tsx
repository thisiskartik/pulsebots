"use client";

import { useState, useCallback, Fragment, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
	Navbar as NextUINavbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenuToggle,
	NavbarMenu,
	NavbarMenuItem,
	Button,
	Link as NextUILink,
} from "@nextui-org/react";
import Logout from "@Auth/Logout";

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const renderNavitem = useCallback(
		(label: string, path: string) => {
			const isActive = pathname === path;
			return (
				<NavbarItem isActive={isActive}>
					<NextUILink as={Link} color={isActive ? undefined : "foreground"} href={path}>
						{label}
					</NextUILink>
				</NavbarItem>
			);
		},
		[pathname]
	);

	const isMarketingView = useMemo(
		() => /^\/(pricing|contact|about|auth(.*))?$/.test(pathname),
		[pathname]
	);
	const isDashboardView = useMemo(
		() => isLoggedIn && /^\/(dashboard(.*)|billing|profile)$/.test(pathname),
		[isLoggedIn, pathname]
	);
	const menuItems = useMemo(() => {
		return [
			{
				label: "Home",
				path: "/",
				condition: isMarketingView,
			},
			{
				label: "Pricing",
				path: "/pricing",
				condition: isMarketingView,
			},
			{
				label: "Contact",
				path: "/contact",
				condition: isMarketingView,
			},
			{
				label: "About",
				path: "/about",
				condition: isMarketingView,
			},
			{
				label: "Dashboard",
				path: "/dashboard",
				condition: isDashboardView,
			},
			{
				label: "Billing",
				path: "/dashboard/billing",
				condition: isDashboardView,
			},
			{
				label: "Profile",
				path: "/dashboard/profile",
				condition: isDashboardView,
			},
		];
	}, [isMarketingView, isDashboardView]);

	return (
		<NextUINavbar onMenuOpenChange={setIsMenuOpen} isBordered position="static" maxWidth="full">
			<NavbarContent>
				<NavbarMenuToggle
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
					className="sm:hidden"
				/>
				<NavbarBrand>
					<NextUILink
						as={Link}
						className="font-bold text-2xl"
						color="foreground"
						href={isLoggedIn ? "/dashboard" : "/"}
					>
						ChatWise
					</NextUILink>
				</NavbarBrand>
			</NavbarContent>
			<NavbarContent justify="end">
				{menuItems
					.filter(({ condition }) => condition)
					.map(({ label, path }) => (
						<Fragment key={path}>{renderNavitem(label, path)}</Fragment>
					))}
				{isLoggedIn ? (
					<>
						{isMarketingView ? (
							<NavbarItem>
								<Button as={Link} href="/dashboard" variant="flat" color="primary">
									Go to dashboard
								</Button>
							</NavbarItem>
						) : (
							<Logout />
						)}
					</>
				) : (
					<>
						<NavbarItem>
							<Button as={Link} href="/auth/login" variant="bordered" color="primary">
								Login
							</Button>
						</NavbarItem>
						<NavbarItem>
							<Button as={Link} href="/auth/sign-up" variant="flat" color="primary">
								Sign Up
							</Button>
						</NavbarItem>
					</>
				)}
			</NavbarContent>
			{/* <NavbarMenu className="overflow-hidden">
				{menuItems
					.filter(({ condition }) => condition)
					.map(({ label, path }) => (
						<NavbarMenuItem key={path}>{renderNavitem(label, path)}</NavbarMenuItem>
					))}
			</NavbarMenu> */}
		</NextUINavbar>
	);
}
