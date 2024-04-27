export default function Center({ children }: { children: React.ReactNode }) {
	return <div className={`flex flex-col justify-center items-center flex-1`}>{children}</div>;
}
