"use client"
// Styles
import "@rainbow-me/rainbowkit/styles.css"
import "./globals.scss"

// RainbowKit
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit"

// Wagmi
import { configureChains, createConfig, WagmiConfig } from "wagmi"
import { sepolia } from "wagmi/chains"
import { alchemyProvider } from "@wagmi/core/providers/alchemy"

// React
import { ReactNode } from "react"
import Head from "next/head"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Font-awesome
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core"
config.autoAddCss = false

// Services
import PortalContextProvider from "@/services/PortalContext"
import TokenContextProvider from "@/services/TokenContext"
import TransactionContextProvider from "@/services/TransactionsContext"
import ChainContextProvider from "@/services/ChainContext"

// Components
import ShaderGradientBackground from "../components/ui/shader-gradient"
import LoadingScreen from "@/components/ui/loading-screen/loading-screen"
import { Toaster } from "@/components/ui/toaster"
import { Layout } from "@/components/layout/layout"

const queryClient = new QueryClient()

const { chains, publicClient } = configureChains(
  [sepolia],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? "" })]
)

const { connectors } = getDefaultWallets({
  appName: "PortalSig",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID ?? "",
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="custom-scrollbar">
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
      <body className="relative">
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider
            chains={chains}
            theme={darkTheme({
              accentColor: "#fff",
              accentColorForeground: "#000",
              borderRadius: "small",
              overlayBlur: "small",
            })}
          >
            <QueryClientProvider client={queryClient}>
              <ChainContextProvider>
                <PortalContextProvider>
                  <TokenContextProvider>
                    <TransactionContextProvider>
                      <Layout>{children}</Layout>
                    </TransactionContextProvider>
                  </TokenContextProvider>
                </PortalContextProvider>
              </ChainContextProvider>
            </QueryClientProvider>
          </RainbowKitProvider>
        </WagmiConfig>
        <ShaderGradientBackground />
        <LoadingScreen />
        <Toaster />
      </body>
    </html>
  )
}
