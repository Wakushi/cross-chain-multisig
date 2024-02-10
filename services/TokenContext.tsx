import { createContext, ReactNode, useEffect, useState } from "react"
import { Address } from "viem"
import { registeredChains, tokenLogos } from "./data/chains"
import { Token } from "@/types/Token"
import { Alchemy, Network, TokenMetadataResponse } from "alchemy-sdk"
import { fetchBalance } from "@wagmi/core"
import { ZERO_ADDRESS } from "@/lib/utils"

export interface ChainSupportedTokens {
  chainId: string
  chainSelector: string
  supportedTokens: Token[]
}

export enum PayFeesIn {
  NATIVE = 0,
  LINK = 1,
}

interface TokenContextProviderProps {
  children: ReactNode
}

interface TokenContextProps {
  allSupportedTokens: ChainSupportedTokens[]
  getAllAddressTokens: (address: Address, network?: Network) => Promise<Token[]>
  getTokenByAddress: (tokenAddress: Address) => Token | null
  getERC20TokenBalance: (account: Address, token: Token) => Promise<any>
}

const TokenContext = createContext<TokenContextProps>({
  allSupportedTokens: [],
  getAllAddressTokens: async () => {
    return []
  },
  getTokenByAddress: () => {
    return null
  },
  getERC20TokenBalance: async () => {
    return
  },
})
export default function TokenContextProvider(props: TokenContextProviderProps) {
  const [allSupportedTokens, setAllSupportedTokens] = useState<
    ChainSupportedTokens[]
  >([])

  useEffect(() => {
    async function getChainsSupportedTokens() {
      const allSupportedTokens: ChainSupportedTokens[] = []
      for (let registeredChain of registeredChains) {
        allSupportedTokens.push({
          chainId: registeredChain.chainId,
          chainSelector: registeredChain.chainSelector,
          supportedTokens: registeredChain.supportedTokens,
        })
      }
      setAllSupportedTokens(allSupportedTokens)
    }

    getChainsSupportedTokens()
  }, [])

  async function getAllAddressTokens(
    address: Address,
    network?: Network
  ): Promise<Token[]> {
    const alchemy = new Alchemy({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
      network: network ? network : Network.ETH_SEPOLIA,
    })
    const balances = await alchemy.core.getTokenBalances(address)
    const nonZeroBalances = balances.tokenBalances.filter((token: any) => {
      return (
        token.tokenBalance !==
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      )
    })

    const addressTokens: Token[] = []

    const ethToken: Token = {
      address: ZERO_ADDRESS,
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      balance: "0",
      logo: tokenLogos.ETH,
    }

    const ethBalance = await (await alchemy.core.getBalance(address)).toString()
    ethToken.balance = (+ethBalance / Math.pow(10, 18)).toFixed(4)
    addressTokens.push(ethToken)

    for (let token of nonZeroBalances) {
      let balance: any = token.tokenBalance
      const metadata: TokenMetadataResponse =
        await alchemy.core.getTokenMetadata(token.contractAddress)

      if (!metadata.logo && metadata.symbol) {
        metadata.logo = tokenLogos[metadata.symbol as keyof typeof tokenLogos]
      }

      if (balance) {
        balance = (balance / Math.pow(10, metadata.decimals || 18)).toFixed(4)
      }

      addressTokens.push({
        address: token.contractAddress as Address,
        name: metadata.name || "",
        symbol: metadata.symbol || "",
        decimals: metadata.decimals || 18,
        balance: balance,
        logo: metadata.logo || "",
      })
    }
    return addressTokens
  }

  function getTokenByAddress(tokenAddress: Address): Token | null {
    const supportedTokens = registeredChains
      .map((chain) => chain.supportedTokens)
      .flat()
    const token = supportedTokens.find(
      (token) => token.address.toLowerCase() === tokenAddress.toLowerCase()
    )

    return token || null
  }

  async function getERC20TokenBalance(
    account: Address,
    token: Token
  ): Promise<any> {
    const balance: any = await fetchBalance({
      address: account,
      token: token.address,
    })
    return balance
  }

  const context = {
    allSupportedTokens,
    getAllAddressTokens,
    getTokenByAddress,
    getERC20TokenBalance,
  }

  return (
    <TokenContext.Provider value={context}>
      {props.children}
    </TokenContext.Provider>
  )
}

export { TokenContext }
