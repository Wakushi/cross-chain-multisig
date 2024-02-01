import { createContext, ReactNode, useEffect, useState } from "react"
import { Address } from "viem"
import { registeredChains } from "./data/chains"
import { Token } from "@/types/Token"
import { Alchemy, Network, TokenMetadataResponse } from "alchemy-sdk"
import { fetchBalance } from "@wagmi/core"
import { FetchEventResult } from "next/dist/server/web/types"
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
  getTokenBalance: (account: Address, token: Token) => Promise<any>
}

const TokenContext = createContext<TokenContextProps>({
  allSupportedTokens: [],
  getAllAddressTokens: async () => {
    return []
  },
  getTokenByAddress: () => {
    return null
  },
  getTokenBalance: async () => {
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
    for (let token of nonZeroBalances) {
      let balance: any = token.tokenBalance
      const metadata: TokenMetadataResponse =
        await alchemy.core.getTokenMetadata(token.contractAddress)
      if (balance) {
        balance = balance / Math.pow(10, metadata.decimals || 18)
        balance = balance.toFixed(2)
      }
      addressTokens.push({
        address: token.contractAddress as Address,
        name: metadata.name || "",
        symbol: metadata.symbol || "",
        decimals: metadata.decimals || 18,
        balance: balance,
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

  async function getTokenBalance(account: Address, token: Token): Promise<any> {
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
    getTokenBalance,
  }

  return (
    <TokenContext.Provider value={context}>
      {props.children}
    </TokenContext.Provider>
  )
}

export { TokenContext }
