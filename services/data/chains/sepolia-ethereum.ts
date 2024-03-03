import { Network } from "alchemy-sdk"
import { Chain } from "../chains"
import { ZERO_ADDRESS } from "@/lib/utils"
import ethIcon from "@/assets/icons/ethereum.svg"

export const SEPOLIA_ETHEREUM: Chain = {
  name: "Ethereum Sepolia",
  alchemyNetwork: Network.ETH_SEPOLIA,
  chainId: "11155111",
  chainSelector: "16015286601757825753",
  explorerUrl: "https://sepolia.etherscan.io/tx/",
  portalFactoryAddress: "0xe7fd357e041CC34527c49A0fdFa05aEfBB3015F2",
  ccipRouterAddress: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
  linkTokenAddress: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  portalGateAddress: "0x223a49b390fbdf90f645D297522A7fcfC71233F8",
  destinationChains: [
    {
      destinationChain: "Ethereum Sepolia",
      destinationChainSelector: "16015286601757825753",
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
      destinationChain: "Polygon Mumbai",
      destinationChainSelector: "12532609583862916517",
      tokens: [
        {
          address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
          name: "CCIP-BnM",
          symbol: "CCIP-BnM",
          decimals: 18,
        },
        {
          address: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1",
          name: "CCIP-LnM",
          symbol: "CCIP-LnM",
          decimals: 18,
        },
        {
          address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
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
          address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
          name: "CCIP-BnM",
          symbol: "CCIP-BnM",
          decimals: 18,
        },
        {
          address: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1",
          name: "CCIP-LnM",
          symbol: "CCIP-LnM",
          decimals: 18,
        },
        {
          address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
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
          address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
          name: "CCIP-BnM",
          symbol: "CCIP-BnM",
          decimals: 18,
        },
        {
          address: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1",
          name: "CCIP-LnM",
          symbol: "CCIP-LnM",
          decimals: 18,
        },
        {
          address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
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
          address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
          name: "CCIP-BnM",
          symbol: "CCIP-BnM",
          decimals: 18,
        },
        {
          address: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1",
          name: "CCIP-LnM",
          symbol: "CCIP-LnM",
          decimals: 18,
        },
        {
          address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
          name: "USDC",
          symbol: "USDC",
          decimals: 6,
        },
      ],
    },
  ],
  icon: ethIcon.src,
}
