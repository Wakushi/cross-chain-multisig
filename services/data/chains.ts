import { Token } from "@/types/Token"
import { ZERO_ADDRESS } from "@/lib/utils"
import ethIcon from "@/assets/icons/ethereum.svg"
import optimismIcon from "@/assets/icons/optimism.svg"
import polygonIcon from "@/assets/icons/polygon.svg"
import fujiIcon from "@/assets/icons/avalanche.svg"
import bnbIcon from "@/assets/icons/bnb.svg"
import baseIcon from "@/assets/icons/base.svg"
import arbitrumIcon from "@/assets/icons/arbitrum.svg"
import usdc from "@/assets/icons/USDC.svg"
import weth from "@/assets/icons/weth.webp"
import link from "@/assets/icons/link.png"
import { Address } from "viem"
import { Network } from "alchemy-sdk"

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
  {
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
    ],
    icon: ethIcon.src,
  },
  {
    name: "Polygon Mumbai",
    alchemyNetwork: Network.MATIC_MUMBAI,
    chainId: "80001",
    chainSelector: "12532609583862916517",
    explorerUrl: "https://mumbai.polygonscan.com/tx/",
    portalFactoryAddress: "0x960F9bFcCeC2ca1271482E95512F456D3d9F9890",
    ccipRouterAddress: "0x1035CabC275068e0F4b745A29CEDf38E13aF41b1",
    linkTokenAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    portalGateAddress: "0x60f7b9f6f83b38e98CCAB2b594F4bABd830307Ae",
    destinationChains: [
      {
        destinationChain: "Polygon Mumbai",
        destinationChainSelector: "12532609583862916517",
        tokens: [
          {
            address: ZERO_ADDRESS,
            name: "Matic",
            symbol: "MATIC",
            decimals: 18,
            logo: polygonIcon.src,
          },
        ],
      },
      {
        destinationChain: "Ethereum Sepolia",
        destinationChainSelector: "16015286601757825753",
        tokens: [
          {
            address: "0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40",
            name: "CCIP-BnM",
            symbol: "CCIP-BnM",
            decimals: 18,
          },
          {
            address: "0xc1c76a8c5bFDE1Be034bbcD930c668726E7C1987",
            name: "CCIP-LnM",
            symbol: "CCIP-LnM",
            decimals: 18,
          },
          {
            address: "0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97",
            name: "USDC",
            symbol: "USDC",
            decimals: 6,
          },
        ],
      },
    ],
    icon: polygonIcon.src,
  },
  // {
  //   name: "Optimism Goerli",
  //   chainId: "420",
  //   chainSelector: "2664363617261496610",
  //   supportedTokens: [
  //     {
  //       address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
  //       decimals: 18,
  //       name: "CCIP-BnM",
  //       symbol: "CCIP-BnM",
  //     },
  //     {
  //       address: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1",
  //       decimals: 18,
  //       name: "CCIP-LnM",
  //       symbol: "CCIP-LnM",
  //     },
  //   ],
  //   icon: optimismIcon.src,
  // },
  // {
  //   name: "Avalanche Fuji",
  //   chainId: "43113",
  //   chainSelector: "14767482510784806043",
  //   supportedTokens: [
  //     {
  //       address: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1",
  //       name: "CCIP-LnM",
  //       symbol: "CCIP-LnM",
  //       decimals: 18,
  //     },
  //     {
  //       address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
  //       name: "CCIP-BnM",
  //       symbol: "CCIP-BnM",
  //       decimals: 18,
  //     },
  //     {
  //       address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  //       name: "USDC",
  //       symbol: "USDC",
  //       decimals: 6,
  //     },
  //   ],
  //   icon: fujiIcon.src,
  // },
  // {
  //   name: "BNB chain",
  //   chainId: "97",
  //   chainSelector: "13264668187771770619",
  //   supportedTokens: [
  //     {
  //       address: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1",
  //       name: "CCIP-LnM",
  //       symbol: "CCIP-LnM",
  //       decimals: 18,
  //     },
  //     {
  //       address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
  //       name: "CCIP-BnM",
  //       symbol: "CCIP-BnM",
  //       decimals: 18,
  //     },
  //   ],
  //   icon: bnbIcon.src,
  // },
  // {
  //   name: "Base Goerli",
  //   chainId: "84531",
  //   chainSelector: "5790810961207155433",
  //   supportedTokens: [
  //     {
  //       address: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1",
  //       name: "CCIP-LnM",
  //       symbol: "CCIP-LnM",
  //       decimals: 18,
  //     },
  //     {
  //       address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
  //       name: "CCIP-BnM",
  //       symbol: "CCIP-BnM",
  //       decimals: 18,
  //     },
  //   ],
  //   icon: baseIcon.src,
  // },
  // {
  //   name: "Arbitrum Sepolia",
  //   chainId: "421614",
  //   chainSelector: "3478487238524512106",
  //   supportedTokens: [
  //     {
  //       address: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1",
  //       name: "CCIP-LnM",
  //       symbol: "CCIP-LnM",
  //       decimals: 18,
  //     },
  //     {
  //       address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
  //       name: "CCIP-BnM",
  //       symbol: "CCIP-BnM",
  //       decimals: 18,
  //     },
  //     {
  //       address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  //       name: "USDC",
  //       symbol: "USDC",
  //       decimals: 6,
  //     },
  //   ],
  //   icon: arbitrumIcon.src,
  // },
]
