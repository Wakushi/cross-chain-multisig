import { Header } from "./header"
import { ReactNode } from "react"

interface LayoutProps {
	children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
	return (
		<div className="overflow-hidden">
			<Header />
			<main>{children}</main>
			{/* <Footer /> */}
		</div>
	)
}
