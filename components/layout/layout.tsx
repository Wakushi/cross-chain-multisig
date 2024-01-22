import { Header } from "./header"
import { Footer } from "./footer"
import { LayoutProps } from "@/types/LayoutProps"
import ShaderGradientBackground from "../ui/shader-gradient"

export const Layout = ({ children }: LayoutProps) => {
	return (
		<div className="relative">
			<Header />
			{children}
			{/* <Footer /> */}
			<ShaderGradientBackground />
		</div>
	)
}
