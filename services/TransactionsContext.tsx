import { Transaction } from "@/types/Transaction"
import { createContext, ReactNode, useState } from "react"
import { Address } from "viem"
import { readContract } from "@wagmi/core"
import { PORTALSIG_WALLET_CONTRACT_ABI } from "@/constants/constants"

interface PortalTransactions {
  portalAddress: string
  transactions: Transaction[]
}

interface TransactionContextProviderProps {
  children: ReactNode
}

interface TransactionContextProps {
  allPortalsTransactions: PortalTransactions[]
  fetchPortalTransactions: (portalAddress: Address) => Promise<void>
  getPortalTransactions: (portalAddress: Address) => Transaction[]
}

const TransactionContext = createContext<TransactionContextProps>({
  allPortalsTransactions: [],
  fetchPortalTransactions: async () => {
    return
  },
  getPortalTransactions: () => {
    return []
  },
})
export default function TransactionContextProvider(
  props: TransactionContextProviderProps
) {
  const [allPortalsTransactions, setAllPortalsTransactions] = useState<
    PortalTransactions[]
  >([])

  async function fetchPortalTransactions(
    portalAddress: Address
  ): Promise<void> {
    if (!portalAddress) return
    const transactions: any = await readContract({
      address: portalAddress,
      abi: PORTALSIG_WALLET_CONTRACT_ABI,
      functionName: "getTransactions",
    })
    handlePortalTransactionsStorage(portalAddress, transactions)
  }

  function handlePortalTransactionsStorage(
    portalAddress: Address,
    transactions: Transaction[]
  ) {
    if (!allPortalsTransactions.length) {
      setAllPortalsTransactions([
        { portalAddress: portalAddress, transactions: transactions },
      ])
      return
    }
    const portalIndex = allPortalsTransactions.findIndex(
      (portal) => portal.portalAddress === portalAddress
    )
    if (portalIndex > -1) {
      const newPortalTransactions = allPortalsTransactions
      newPortalTransactions[portalIndex].transactions = transactions
      setAllPortalsTransactions([...newPortalTransactions])
    } else {
      setAllPortalsTransactions((prev) => [
        ...prev,
        { portalAddress: portalAddress, transactions: transactions },
      ])
    }
  }

  function getPortalTransactions(portalAddress: Address): Transaction[] {
    const portalTransactions = allPortalsTransactions.find(
      (portal) => portal.portalAddress === portalAddress
    )
    return portalTransactions?.transactions || []
  }

  const context = {
    allPortalsTransactions,
    fetchPortalTransactions,
    getPortalTransactions,
  }

  return (
    <TransactionContext.Provider value={context}>
      {props.children}
    </TransactionContext.Provider>
  )
}

export { TransactionContext }
