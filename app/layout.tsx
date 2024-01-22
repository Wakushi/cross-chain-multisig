"use client"
// Styles
import "@rainbow-me/rainbowkit/styles.css"
import "./globals.scss"
// RainbowKit
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"
// Wagmi
import { configureChains, createConfig, WagmiConfig } from "wagmi"
import { sepolia } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"
// React
import { ReactNode } from "react"

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
			<body>
				<WagmiConfig config={wagmiConfig}>
					<RainbowKitProvider chains={chains}>
						{children}
					</RainbowKitProvider>
				</WagmiConfig>
			</body>
		</html>
	)
}
