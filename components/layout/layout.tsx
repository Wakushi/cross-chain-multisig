import { Header } from "./header"
import { Footer } from "./footer"
import { LayoutProps } from "@/types/LayoutProps"

export const Layout = ({ children }: LayoutProps) => {
	return (
		<div>
			<Header />
			<main>{children}</main>
			{/* <Footer /> */}
		</div>
	)
}
