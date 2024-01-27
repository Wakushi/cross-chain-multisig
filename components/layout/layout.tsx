import { Header } from "./header"
import { Footer } from "./footer"
import { ReactNode } from "react"

interface LayoutProps {
	children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
	return (
		<div>
			<Header />
			<main>{children}</main>
			{/* <Footer /> */}
		</div>
	)
}
