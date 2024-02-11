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

export interface Chain {
  name: string
  chainId: string
  chainSelector: string
  supportedTokens: Token[]
  explorerUrl?: string
  icon: string
}

export const tokenLogos = {
  USDC: usdc.src,
  ETH: ethIcon.src,
  WETH: weth.src,
  LINK: link.src,
}

export const ethToken: Token = {
  address: ZERO_ADDRESS,
  name: "Ethereum",
  symbol: "ETH",
  decimals: 18,
  logo: ethIcon.src,
}

export const registeredChains: Chain[] = [
  {
    name: "Ethereum Sepolia",
    chainId: "11155111",
    chainSelector: "16015286601757825753",
    explorerUrl: "https://sepolia.etherscan.io/tx/",
    supportedTokens: [
      ethToken,
      {
        address: "0x779877a7b0d9e8603169ddbd7836e478b4624789",
        name: "ChainLink Token",
        symbol: "LINK",
        decimals: 18,
      },
      {
        address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
        name: "CCIP-BnM",
        symbol: "CCIP-BnM",
        decimals: 18,
      },
    ],
    icon: ethIcon.src,
  },
  {
    name: "Optimism Goerli",
    chainId: "420",
    chainSelector: "2664363617261496610",
    supportedTokens: [
      {
        address: "0x1b791d05E437C78039424749243F5A79E747525e",
        decimals: 18,
        name: "Synthetic USD Token v3",
        symbol: "snxUSD",
      },
      {
        address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
        decimals: 18,
        name: "CCIP-BnM",
        symbol: "CCIP-BnM",
      },
      {
        address: "0xB3c3977B0aC329A9035889929482a4c635B50573",
        decimals: 18,
        name: "CCIP-TEST-AMKT",
        symbol: "CCIP-TEST-AMKT",
      },
      {
        address: "0x94095e6514411C65E7809761F21eF0febe69A977",
        decimals: 8,
        name: "CACHE Gold",
        symbol: "CGT",
      },
      {
        address: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1",
        decimals: 18,
        name: "CCIP-LnM",
        symbol: "CCIP-LnM",
      },
    ],
    icon: optimismIcon.src,
  },
  {
    name: "Polygon Mumbai",
    chainId: "80001",
    chainSelector: "12532609583862916517",
    supportedTokens: [
      {
        address: "0x1b791d05E437C78039424749243F5A79E747525e",
        name: "Synthetic USD Token v3",
        symbol: "snxUSD",
        decimals: 18,
      },
      {
        address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
        name: "CCIP-BnM",
        symbol: "CCIP-BnM",
        decimals: 18,
      },
      {
        address: "0x94095e6514411C65E7809761F21eF0febe69A977",
        name: "CACHE Gold",
        symbol: "CGT",
        decimals: 8,
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
    icon: polygonIcon.src,
  },
  {
    name: "Avalanche Fuji",
    chainId: "43113",
    chainSelector: "14767482510784806043",
    supportedTokens: [
      {
        address: "0x94095e6514411C65E7809761F21eF0febe69A977",
        name: "CACHE Gold",
        symbol: "CGT",
        decimals: 8,
      },
      {
        address: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1",
        name: "CCIP-LnM",
        symbol: "CCIP-LnM",
        decimals: 18,
      },
      {
        address: "0xB3c3977B0aC329A9035889929482a4c635B50573",
        name: "CCIP-TEST-AMKT",
        symbol: "CCIP-TEST-AMKT",
        decimals: 18,
      },
      {
        address: "0x784c400D6fF625051d2f587dC0276E3A1ffD9cda",
        name: "BankToken",
        symbol: "BANK",
        decimals: 18,
      },
      {
        address: "0x2Ca7afAC86D0b28d9f7e512b969cEaD9E3048303",
        name: "Australian Dollar Digital Coin",
        symbol: "A$DC",
        decimals: 6,
      },
      {
        address: "0x94025780a1aB58868D9B2dBBB775f44b32e8E6e5",
        name: "BetSwirl v2",
        symbol: "BETS",
        decimals: 18,
      },
      {
        address: "0xF92E4b278380f39fADc24483C7baC61b73EE93F2",
        name: "BondToken",
        symbol: "TBND",
        decimals: 18,
      },
      {
        address: "0x14f7b60b3234aCF3321198fE6d9792dE130a502c",
        name: "Singapore Dollar Digital Coin",
        symbol: "SG$DC",
        decimals: 6,
      },
      {
        address: "0xb7c8bCA891143221a34DB60A26639785C4839040",
        name: "InsurAce Sepolia",
        symbol: "insurToken",
        decimals: 18,
      },
      {
        address: "0x4e51e0a8a5e31Acb0a0B5EB9E5301a21DeBFAbbe",
        name: "New Zealand Dollar Digital Coin",
        symbol: "NZ$DC",
        decimals: 6,
      },
      {
        address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
        name: "CCIP-BnM",
        symbol: "CCIP-BnM",
        decimals: 18,
      },
      {
        address: "0x832bA6abcAdC68812be372F4ef20aAC268bA20B7",
        name: "FugaziUSDCToken",
        symbol: "FUGAZIUSDC",
        decimals: 6,
      },
      {
        address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        name: "USDC",
        symbol: "USDC",
        decimals: 6,
      },
    ],
    icon: fujiIcon.src,
  },
  {
    name: "BNB chain",
    chainId: "97",
    chainSelector: "13264668187771770619",
    supportedTokens: [
      {
        address: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1",
        name: "CCIP-LnM",
        symbol: "CCIP-LnM",
        decimals: 18,
      },
      {
        address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
        name: "CCIP-BnM",
        symbol: "CCIP-BnM",
        decimals: 18,
      },
    ],
    icon: bnbIcon.src,
  },
  {
    name: "Base Goerli",
    chainId: "84531",
    chainSelector: "5790810961207155433",
    supportedTokens: [
      {
        address: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1",
        name: "CCIP-LnM",
        symbol: "CCIP-LnM",
        decimals: 18,
      },
      {
        address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
        name: "CCIP-BnM",
        symbol: "CCIP-BnM",
        decimals: 18,
      },
    ],
    icon: baseIcon.src,
  },
  {
    name: "Arbitrum Sepolia",
    chainId: "421614",
    chainSelector: "3478487238524512106",
    supportedTokens: [
      {
        address: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1",
        name: "CCIP-LnM",
        symbol: "CCIP-LnM",
        decimals: 18,
      },
      {
        address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
        name: "CCIP-BnM",
        symbol: "CCIP-BnM",
        decimals: 18,
      },
      {
        address: "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60",
        name: "Gho Token",
        symbol: "GHO",
        decimals: 18,
      },
      {
        address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        name: "USDC",
        symbol: "USDC",
        decimals: 6,
      },
    ],
    icon: arbitrumIcon.src,
  },
]
