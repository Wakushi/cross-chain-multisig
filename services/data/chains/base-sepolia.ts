import { Network } from "alchemy-sdk"
import { Chain } from "../chains"
import { ZERO_ADDRESS } from "@/lib/utils"
import ethIcon from "@/assets/icons/ethereum.svg"
import baseIcon from "@/assets/icons/base.svg"

export const BASE_SEPOLIA: Chain = {
  name: "Base Sepolia",
  alchemyNetwork: Network.BASE_SEPOLIA,
  chainId: "84532",
  chainSelector: "10344971235874465080",
  explorerUrl: "https://sepolia.basescan.org/",
  portalFactoryAddress: "0x9c6F992b10b1eb3e8Ce53F3729B8F0fA46F424F1",
  ccipRouterAddress: "0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93",
  linkTokenAddress: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410",
  portalGateAddress: "0x01e56968bfF1E926fBe225C421d1BA72703c3741",
  destinationChains: [
    {
      destinationChain: "Base Sepolia",
      destinationChainSelector: "10344971235874465080",
      tokens: [
        {
          address: ZERO_ADDRESS,
          name: "Ethereum",
          symbol: "ETH",
          decimals: 18,
          logo: ethIcon.src,
        },
      ],
    },
    {
      destinationChain: "Ethereum Sepolia",
      destinationChainSelector: "16015286601757825753",
      tokens: [
        {
          address: "0x88A2d74F47a237a62e7A51cdDa67270CE381555e",
          name: "CCIP-BnM",
          symbol: "CCIP-BnM",
          decimals: 18,
        },
        {
          address: "0xA98FA8A008371b9408195e52734b1768c0d1Cb5c",
          name: "CCIP-LnM",
          symbol: "CCIP-LnM",
          decimals: 18,
        },
        {
          address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
          name: "USDC",
          symbol: "USDC",
          decimals: 6,
        },
      ],
    },
    {
      destinationChain: "Optimism Sepolia",
      destinationChainSelector: "5224473277236331295",
      tokens: [
        {
          address: "0x88A2d74F47a237a62e7A51cdDa67270CE381555e",
          name: "CCIP-BnM",
          symbol: "CCIP-BnM",
          decimals: 18,
        },
        {
          address: "0xA98FA8A008371b9408195e52734b1768c0d1Cb5c",
          name: "CCIP-LnM",
          symbol: "CCIP-LnM",
          decimals: 18,
        },
        {
          address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
          name: "USDC",
          symbol: "USDC",
          decimals: 6,
        },
      ],
    },
    {
      destinationChain: "Base Sepolia",
      destinationChainSelector: "10344971235874465080",
      tokens: [
        {
          address: "0x88A2d74F47a237a62e7A51cdDa67270CE381555e",
          name: "CCIP-BnM",
          symbol: "CCIP-BnM",
          decimals: 18,
        },
        {
          address: "0xA98FA8A008371b9408195e52734b1768c0d1Cb5c",
          name: "CCIP-LnM",
          symbol: "CCIP-LnM",
          decimals: 18,
        },
        {
          address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
          name: "USDC",
          symbol: "USDC",
          decimals: 6,
        },
      ],
    },
  ],
  icon: baseIcon.src,
}
