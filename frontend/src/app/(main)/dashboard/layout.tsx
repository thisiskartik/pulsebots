import Sidebar from "@General/Sidebar";

export default function DashbboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-1 min-h-0">
			<div className="flex flex-1 h-full">
				<div className="w-1/6 h-full border-r border-divider py-6">
					<Sidebar />
				</div>
				<main className="w-5/6 h-full overflow-y-auto p-6">{children}</main>
			</div>
		</div>
	);
}
