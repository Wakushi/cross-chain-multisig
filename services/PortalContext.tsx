// React
import { createContext, ReactNode, useState } from "react"
// Types
import { Portal } from "@/types/Portal"
// Wagmi / Viem
import { fetchBalance } from "@wagmi/core"
import { Address } from "viem"
import { readContract, getNetwork } from "@wagmi/core"
import { useAccount } from "wagmi"
// Utils
import {
  PORTALSIG_FACTORY_CONTRACT_ABI,
  PORTALSIG_FACTORY_CONTRACT_ADDRESS,
  PORTALSIG_WALLET_CONTRACT_ABI,
} from "@/constants/constants"
import { Chain, registeredChains } from "./data/chains"

interface PortalContextProviderProps {
  children: ReactNode
}

interface PortalContextProps {
  portals: Portal[]
  currentPortal: Portal | null
  getPortal: (portalAddress: Address) => Promise<Portal>
  isExternalChain: (chainSelector: string) => boolean
  getPortalETHBalance: (portalAddress: Address) => Promise<string>
  getAllPortals: () => Promise<void>
  setCurrentPortalByAddress: (portalAddress: Address) => Promise<void>
}

const PortalContext = createContext<PortalContextProps>({
  portals: [],
  currentPortal: null,
  getPortal: (portalAddress: Address) => Promise.resolve({} as Portal),
  isExternalChain: (chainSelector: string) => false,
  getPortalETHBalance: (portalAddress: Address) => Promise.resolve(""),
  getAllPortals: () => Promise.resolve(),
  setCurrentPortalByAddress: (portalAddress: Address) => Promise.resolve(),
})
export default function PortalContextProvider(
  props: PortalContextProviderProps
) {
  const { address } = useAccount()
  const { chain } = getNetwork()
  const [portals, setPortals] = useState<Portal[]>([])
  const [currentPortal, setCurrentPortal] = useState<Portal | null>(null)

  async function getPortal(portalAddress: Address): Promise<Portal> {
    const savedPortal = findLocalPortal(portalAddress)
    if (savedPortal) {
      return savedPortal
    }
    const owners = await getPortalOwners(portalAddress)
    const balance = await getPortalETHBalance(portalAddress)
    const transactionsCount = await getTransactionsCount(portalAddress)
    const requiredConfirmationsAmount = await getRequiredConfirmationsAmount(
      portalAddress
    )
    return {
      address: portalAddress,
      owners: owners,
      balance: balance,
      numberOfTransactions: transactionsCount,
      requiredConfirmationsAmount: requiredConfirmationsAmount,
      lastTransaction: 0,
    }
  }

  async function setCurrentPortalByAddress(
    portalAddress: Address
  ): Promise<void> {
    const portal = await getPortal(portalAddress)
    setCurrentPortal(portal)
  }

  async function getAllPortals(): Promise<void> {
    const portals: Portal[] = []
    for (let portalAddress of await getPortalAddresses()) {
      const portal = await getPortal(portalAddress)
      portals.push(portal)
    }
    savePortals(portals)
  }

  async function getPortalAddresses(): Promise<Address[]> {
    const portalsAddresses: any = await readContract({
      address: PORTALSIG_FACTORY_CONTRACT_ADDRESS,
      abi: PORTALSIG_FACTORY_CONTRACT_ABI,
      functionName: "getWalletsByOwner",
      args: [address],
    })
    return portalsAddresses
  }

  async function getPortalOwners(portalAddress: Address): Promise<Address[]> {
    const owners: any = await readContract({
      address: portalAddress,
      abi: PORTALSIG_WALLET_CONTRACT_ABI,
      functionName: "getOwners",
    })
    return owners
  }

  async function getPortalETHBalance(portalAddress: Address): Promise<string> {
    const balance: any = await fetchBalance({
      address: portalAddress,
    })
    return balance?.formatted
  }

  async function getTransactionsCount(portalAddress: Address): Promise<string> {
    const transactionCount: any = await readContract({
      address: portalAddress,
      abi: PORTALSIG_WALLET_CONTRACT_ABI,
      functionName: "getTransactionCount",
    })
    return transactionCount.toString()
  }

  async function getRequiredConfirmationsAmount(
    portalAddress: Address
  ): Promise<string> {
    const requiredConfirmationsAmount: any = await readContract({
      address: portalAddress,
      abi: PORTALSIG_WALLET_CONTRACT_ABI,
      functionName: "getRequiredConfirmationsAmount",
    })
    return requiredConfirmationsAmount.toString()
  }

  function savePortals(portals: Portal[]): void {
    setPortals(portals)
  }

  function findLocalPortal(portalAddress: Address): Portal | undefined {
    return portals.find((portal) => portal.address === portalAddress)
  }

  function getPortalChain(): Chain | undefined {
    return registeredChains.find(
      (registeredChain) => +registeredChain.chainId === chain?.id
    )
  }

  function isExternalChain(chainSelector: string): boolean {
    return (
      chainSelector !== "" && chainSelector !== getPortalChain()?.chainSelector
    )
  }

  const context = {
    portals,
    currentPortal,
    getPortal,
    getAllPortals,
    isExternalChain,
    getPortalETHBalance,
    setCurrentPortalByAddress,
  }

  return (
    <PortalContext.Provider value={context}>
      {props.children}
    </PortalContext.Provider>
  )
}

export { PortalContext }
