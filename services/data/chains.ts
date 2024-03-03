import { Token } from "@/types/Token"
import ethIcon from "@/assets/icons/ethereum.svg"
import usdc from "@/assets/icons/USDC.svg"
import weth from "@/assets/icons/weth.webp"
import link from "@/assets/icons/link.png"
import { Address } from "viem"
import { Network } from "alchemy-sdk"
import { SEPOLIA_ETHEREUM } from "./chains/sepolia-ethereum"
import { POLYGON_MUMBAI } from "./chains/polygon-mumbai"
import { OPTIMISM_SEPOLIA } from "./chains/optimism-sepolia"
import { ARBITRUM_SEPOLIA } from "./chains/arbitrum-sepolia"
import { BASE_SEPOLIA } from "./chains/base-sepolia"

export interface Chain {
  name: string
  alchemyNetwork: Network
  chainId: string
  chainSelector: string
  destinationChains: DestinationChainsData[]
  portalFactoryAddress: Address
  ccipRouterAddress: Address
  linkTokenAddress: Address
  portalGateAddress: Address
  explorerUrl?: string
  icon: string
}

export interface DestinationChainsData {
  destinationChain: string
  destinationChainSelector: string
  tokens: Token[]
}

export const tokenLogos = {
  USDC: usdc.src,
  ETH: ethIcon.src,
  WETH: weth.src,
  LINK: link.src,
}

export const registeredChains: Chain[] = [
  SEPOLIA_ETHEREUM,
  POLYGON_MUMBAI,
  OPTIMISM_SEPOLIA,
  ARBITRUM_SEPOLIA,
  BASE_SEPOLIA,
]
