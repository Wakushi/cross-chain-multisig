import { createContext, ReactNode, useContext, useState } from "react"
import { Address } from "viem"
import { Chain, DestinationChainsData, tokenLogos } from "./data/chains"
import { Token } from "@/types/Token"
import {
  Alchemy,
  Network,
  TokenBalancesResponseErc20,
  TokenMetadataResponse,
} from "alchemy-sdk"
import { fetchBalance } from "@wagmi/core"
import { PortalContext } from "./PortalContext"
import { ChainContext } from "./ChainContext"
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
  getAllAddressTokens: (address: Address, network?: Network) => Promise<Token[]>
  getTokenByAddress: (tokenAddress: Address) => Token | null
  getERC20TokenBalance: (account: Address, token: Token) => Promise<any>
  getSupportedTokens: () => Promise<DestinationChainsData[]>
  getAddressTotalBalanceInUSD: (address: Address) => Promise<number>
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
  getSupportedTokens: async () => {
    return []
  },
  getAddressTotalBalanceInUSD: async () => {
    return 0
  },
})

export default function TokenContextProvider(props: TokenContextProviderProps) {
  const { currentPortal } = useContext(PortalContext)
  const [currentPortalTokens, setCurrentPortalTokens] = useState<Token[]>([])

  async function getSupportedTokens(): Promise<DestinationChainsData[]> {
    if (!currentPortal) return []
    const supportedTokens: DestinationChainsData[] = [
      ...currentPortal.chain.destinationChains,
    ]

    const portalTokens: Token[] = await getAllAddressTokens(
      currentPortal!.address,
      currentPortal.chain.alchemyNetwork
    )

    supportedTokens?.map((supportedToken: DestinationChainsData) => {
      if (
        supportedToken.destinationChainSelector ===
        currentPortal.chain?.chainSelector
      ) {
        supportedToken.tokens = portalTokens
      }
    })

    return supportedTokens
  }

  async function getAllAddressTokens(
    address: Address,
    network?: Network
  ): Promise<Token[]> {
    const alchemy = getAlchemyInstance(network)
    const { tokenBalances } = await getAddressTokenBalances(address, alchemy)

    const addressTokens: Token[] = []

    const activeChainDestinationData: DestinationChainsData | undefined =
      currentPortal?.chain?.destinationChains.find(
        (destinationChain: DestinationChainsData) => {
          return (
            destinationChain.destinationChainSelector ===
            currentPortal.chain?.chainSelector
          )
        }
      )

    if (activeChainDestinationData) {
      const nativeToken = activeChainDestinationData.tokens.find(
        (token: Token) => token.address === ZERO_ADDRESS
      )
      if (nativeToken) {
        addressTokens.push({
          ...nativeToken,
          balance: await getNativeBalance(address, alchemy),
        })
      }
    }

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
      const tokenName = token.name.split(" ")[0].toUpperCase()
      if (tokenName === "WRAPPED") {
        continue
      }
      token.price = await getERC20TokenPrice(token)
      if (token.balance && token.price) {
        token.value = token.price * +token.balance
      }
    }

    setCurrentPortalTokens(addressTokens)
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

  async function getNativeBalance(address: Address, alchemyInstance: Alchemy) {
    const nativeBalance = await (
      await alchemyInstance.core.getBalance(address)
    ).toString()
    return (+nativeBalance / Math.pow(10, 18)).toFixed(4)
  }

  function getTokenByAddress(tokenAddress: Address): Token | null {
    const portalToken = currentPortalTokens.find(
      (token) => token.address.toLowerCase() === tokenAddress.toLowerCase()
    )
    if (portalToken) return portalToken
    const currentChainDestinationChains =
      currentPortal?.chain?.destinationChains
    const token = currentChainDestinationChains
      ?.map((destinationChain) => destinationChain.tokens)
      .flat()
      .find(
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
    return fetch(
      `https://api.mobula.io/api/1/market/data?symbol=${tokenName} `,
      {
        method: "GET",
        headers: {
          Authorization: process.env.NEXT_PUBLIC_MOBULA_API_KEY ?? "",
        },
      }
    )
      .then((response) => response.json())
      .then(({ data }) => data?.price)
  }

  async function getAddressTotalBalanceInUSD(
    address: Address
  ): Promise<number> {
    const tokens = await getAllAddressTokens(address)
    let total = 0
    for (let token of tokens) {
      if (token.value) {
        total += token.value
      }
    }
    return total
  }

  const context = {
    getAllAddressTokens,
    getTokenByAddress,
    getERC20TokenBalance,
    getSupportedTokens,
    getAddressTotalBalanceInUSD,
  }

  return (
    <TokenContext.Provider value={context}>
      {props.children}
    </TokenContext.Provider>
  )
}

export { TokenContext }
