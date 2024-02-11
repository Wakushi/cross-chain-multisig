import { createContext, ReactNode, useContext, useState } from "react"
import { Address } from "viem"
import { ethToken, registeredChains, tokenLogos } from "./data/chains"
import { Token } from "@/types/Token"
import {
  Alchemy,
  Network,
  TokenBalancesResponseErc20,
  TokenMetadataResponse,
} from "alchemy-sdk"
import { fetchBalance, getNetwork } from "@wagmi/core"
import { PortalContext } from "./PortalContext"

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
  getAllAddressTokens: (address: Address, network?: Network) => Promise<Token[]>
  getTokenByAddress: (tokenAddress: Address) => Token | null
  getERC20TokenBalance: (account: Address, token: Token) => Promise<any>
  getAllSupportedTokens: () => Promise<ChainSupportedTokens[]>
}

const TokenContext = createContext<TokenContextProps>({
  getAllAddressTokens: async () => {
    return []
  },
  getTokenByAddress: () => {
    return null
  },
  getERC20TokenBalance: async () => {
    return
  },
  getAllSupportedTokens: async () => {
    return []
  },
})

export default function TokenContextProvider(props: TokenContextProviderProps) {
  const { currentPortal } = useContext(PortalContext)
  const { chain } = getNetwork()

  async function getAllSupportedTokens(): Promise<ChainSupportedTokens[]> {
    const allSupportedTokensArray: ChainSupportedTokens[] = []
    for (let registeredChain of registeredChains) {
      allSupportedTokensArray.push({
        chainId: registeredChain.chainId,
        chainSelector: registeredChain.chainSelector,
        supportedTokens: registeredChain.supportedTokens,
      })
    }

    const portalTokens = await getAllAddressTokens(currentPortal!.address)

    allSupportedTokensArray.map((chainSupportedTokens) => {
      if (+chainSupportedTokens.chainId === chain?.id) {
        chainSupportedTokens.supportedTokens = [...portalTokens]
      }
    })

    return allSupportedTokensArray
  }

  async function getAllAddressTokens(
    address: Address,
    network?: Network
  ): Promise<Token[]> {
    const alchemy = getAlchemyInstance(network)
    const { tokenBalances } = await getAddressTokenBalances(address, alchemy)

    const addressTokens: Token[] = []

    addressTokens.push({
      ...ethToken,
      balance: await getEthBalance(address, alchemy),
    })

    for (let token of tokenBalances) {
      if (!token.tokenBalance) continue

      const metadata: TokenMetadataResponse = await getTokenMetadata(
        token.contractAddress as Address,
        alchemy
      )

      if (!metadata.logo && metadata.symbol) {
        metadata.logo = tokenLogos[metadata.symbol as keyof typeof tokenLogos]
      }

      const balance = getTokenBalanceFromBytes(
        token.tokenBalance,
        metadata.decimals || 18
      )

      addressTokens.push({
        address: token.contractAddress as Address,
        name: metadata.name || "",
        symbol: metadata.symbol || "",
        decimals: metadata.decimals || 18,
        balance: balance,
        logo: metadata.logo || "",
      })
    }

    for (let token of addressTokens) {
      token.price = await getERC20TokenPrice(token)
      if (token.balance && token.price) {
        token.value = token.price * +token.balance
      }
    }

    return addressTokens
  }

  async function getAddressTokenBalances(
    address: Address,
    alchemyInstance: Alchemy
  ): Promise<TokenBalancesResponseErc20> {
    return await alchemyInstance.core.getTokenBalances(address)
  }

  function getAlchemyInstance(network?: Network): Alchemy {
    return new Alchemy({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
      network: network ? network : Network.ETH_SEPOLIA,
    })
  }

  async function getTokenMetadata(
    tokenAddress: Address,
    alchemyInstance: Alchemy
  ) {
    return await alchemyInstance.core.getTokenMetadata(tokenAddress)
  }

  async function getEthBalance(address: Address, alchemyInstance: Alchemy) {
    const ethBalance = await (
      await alchemyInstance.core.getBalance(address)
    ).toString()
    return (+ethBalance / Math.pow(10, 18)).toFixed(4)
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

  function getTokenBalanceFromBytes(balanceInBytes: string, decimals: number) {
    return (+balanceInBytes / Math.pow(10, decimals || 18)).toFixed(4)
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

  async function getERC20TokenPrice(token: Token): Promise<number> {
    const tokenName = token.name.split(" ")[0].toUpperCase()
    return fetch(`https://api.mobula.io/api/1/market/data?asset=${tokenName}`, {
      method: "GET",
      headers: {
        Authorization: process.env.NEXT_PUBLIC_MOBULA_API_KEY ?? "",
      },
    })
      .then((response) => response.json())
      .then(({ data }) => data?.price)
      .catch((err) => console.error(err))
  }

  const context = {
    getAllAddressTokens,
    getTokenByAddress,
    getERC20TokenBalance,
    getAllSupportedTokens,
  }

  return (
    <TokenContext.Provider value={context}>
      {props.children}
    </TokenContext.Provider>
  )
}

export { TokenContext }
