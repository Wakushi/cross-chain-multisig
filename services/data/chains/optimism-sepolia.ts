import { Network } from "alchemy-sdk"
import { Chain } from "../chains"
import { ZERO_ADDRESS } from "@/lib/utils"
import optimismIcon from "@/assets/icons/optimism.svg"
import ethIcon from "@/assets/icons/ethereum.svg"

export const OPTIMISM_SEPOLIA: Chain = {
  name: "Optimism Sepolia",
  alchemyNetwork: Network.OPT_SEPOLIA,
  chainId: "11155420",
  chainSelector: "5224473277236331295",
  explorerUrl: "https://sepolia-optimism.etherscan.io/tx/",
  portalFactoryAddress: "0x9c6F992b10b1eb3e8Ce53F3729B8F0fA46F424F1",
  ccipRouterAddress: "0x114a20a10b43d4115e5aeef7345a1a71d2a60c57",
  linkTokenAddress: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410",
  portalGateAddress: "0x01e56968bfF1E926fBe225C421d1BA72703c3741",
  destinationChains: [
    {
      destinationChain: "Optimism Sepolia",
      destinationChainSelector: "5224473277236331295",
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
          address: "0x8aF4204e30565DF93352fE8E1De78925F6664dA7",
          name: "CCIP-BnM",
          symbol: "CCIP-BnM",
          decimals: 18,
        },
        {
          address: "0x044a6B4b561af69D2319A2f4be5Ec327a6975D0a",
          name: "CCIP-LnM",
          symbol: "CCIP-LnM",
          decimals: 18,
        },
        {
          address: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
          name: "USDC",
          symbol: "USDC",
          decimals: 6,
        },
      ],
    },
    {
      destinationChain: "Polygon Mumbai",
      destinationChainSelector: "12532609583862916517",
      tokens: [
        {
          address: "0x8aF4204e30565DF93352fE8E1De78925F6664dA7",
          name: "CCIP-BnM",
          symbol: "CCIP-BnM",
          decimals: 18,
        },
        {
          address: "0x044a6B4b561af69D2319A2f4be5Ec327a6975D0a",
          name: "CCIP-LnM",
          symbol: "CCIP-LnM",
          decimals: 18,
        },
        {
          address: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
          name: "USDC",
          symbol: "USDC",
          decimals: 6,
        },
      ],
    },
    {
      destinationChain: "Arbitrum Sepolia",
      destinationChainSelector: "3478487238524512106",
      tokens: [
        {
          address: "0x8aF4204e30565DF93352fE8E1De78925F6664dA7",
          name: "CCIP-BnM",
          symbol: "CCIP-BnM",
          decimals: 18,
        },
        {
          address: "0x044a6B4b561af69D2319A2f4be5Ec327a6975D0a",
          name: "CCIP-LnM",
          symbol: "CCIP-LnM",
          decimals: 18,
        },
        {
          address: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
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
          address: "0x8aF4204e30565DF93352fE8E1De78925F6664dA7",
          name: "CCIP-BnM",
          symbol: "CCIP-BnM",
          decimals: 18,
        },
        {
          address: "0x044a6B4b561af69D2319A2f4be5Ec327a6975D0a",
          name: "CCIP-LnM",
          symbol: "CCIP-LnM",
          decimals: 18,
        },
        {
          address: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
          name: "USDC",
          symbol: "USDC",
          decimals: 6,
        },
      ],
    },
  ],
  icon: optimismIcon.src,
}
