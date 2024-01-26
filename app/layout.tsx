"use client"
// Styles
import "@rainbow-me/rainbowkit/styles.css"
import "./globals.scss"

// RainbowKit
import {
	getDefaultWallets,
	RainbowKitProvider,
	darkTheme
} from "@rainbow-me/rainbowkit"

// Wagmi
import { configureChains, createConfig, WagmiConfig } from "wagmi"
import { sepolia } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"

// React
import { ReactNode } from "react"
import Head from "next/head"

// Font-awesome
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core"
config.autoAddCss = false

// Shader gradient
import ShaderGradientBackground from "../components/ui/shader-gradient"
import ErrorContextProvider from "@/services/ErrorContext"
import LoadingScreen from "@/components/ui/loading-screen/loading-screen"

const { chains, publicClient } = configureChains([sepolia], [publicProvider()])

const { connectors } = getDefaultWallets({
	appName: "Cross-Chain Multisig",
	projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID ?? "",
	chains
})

const wagmiConfig = createConfig({
	autoConnect: true,
	connectors,
	publicClient
})

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<Head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Tilt+Neon&display=swap"
					rel="stylesheet"
				/>
			</Head>
			<body className="relative overflow-hidden">
				<WagmiConfig config={wagmiConfig}>
					<RainbowKitProvider
						chains={chains}
						theme={darkTheme({
							accentColor: "#fff",
							accentColorForeground: "#000",
							borderRadius: "small",
							overlayBlur: "small",
							fontStack: "system"
						})}
					>
						<ErrorContextProvider>{children}</ErrorContextProvider>
					</RainbowKitProvider>
				</WagmiConfig>
				<ShaderGradientBackground />
				<LoadingScreen />
			</body>
		</html>
	)
}
