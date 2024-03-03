import { Network } from "alchemy-sdk"
import { Chain } from "../chains"
import { ZERO_ADDRESS } from "@/lib/utils"
import ethIcon from "@/assets/icons/ethereum.svg"
import arbitrumIcon from "@/assets/icons/arbitrum.svg"

export const ARBITRUM_SEPOLIA: Chain = {
  name: "Arbitrum Sepolia",
  alchemyNetwork: Network.ARB_SEPOLIA,
  chainId: "421614",
  chainSelector: "3478487238524512106",
  explorerUrl: "https://sepolia.arbiscan.io/tx/",
  portalFactoryAddress: "0x0bbc414f42DB6Ad35eEF14c553c49B63e368E965",
  ccipRouterAddress: "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165",
  linkTokenAddress: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E",
  portalGateAddress: "0x3e27c46Af3a01FA21984dd5a4d3A8b0bd0719a87",
  destinationChains: [
    {
      destinationChain: "Arbitrum Sepolia",
      destinationChainSelector: "3478487238524512106",
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
          address: "0xA8C0c11bf64AF62CDCA6f93D3769B88BdD7cb93D",
          name: "CCIP-BnM",
          symbol: "CCIP-BnM",
          decimals: 18,
        },
        {
          address: "0x139E99f0ab4084E14e6bb7DacA289a91a2d92927",
          name: "CCIP-LnM",
          symbol: "CCIP-LnM",
          decimals: 18,
        },
        {
          address: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
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
          address: "0xA8C0c11bf64AF62CDCA6f93D3769B88BdD7cb93D",
          name: "CCIP-BnM",
          symbol: "CCIP-BnM",
          decimals: 18,
        },
        {
          address: "0x139E99f0ab4084E14e6bb7DacA289a91a2d92927",
          name: "CCIP-LnM",
          symbol: "CCIP-LnM",
          decimals: 18,
        },
        {
          address: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
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
          address: "0xA8C0c11bf64AF62CDCA6f93D3769B88BdD7cb93D",
          name: "CCIP-BnM",
          symbol: "CCIP-BnM",
          decimals: 18,
        },
        {
          address: "0x139E99f0ab4084E14e6bb7DacA289a91a2d92927",
          name: "CCIP-LnM",
          symbol: "CCIP-LnM",
          decimals: 18,
        },
        {
          address: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
          name: "USDC",
          symbol: "USDC",
          decimals: 6,
        },
      ],
    },
  ],
  icon: arbitrumIcon.src,
}
