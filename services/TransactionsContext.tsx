import { Transaction, TransactionStatus } from "@/types/Transaction"
import { createContext, ReactNode, useContext, useState } from "react"
import { Address } from "viem"
import { readContract, getAccount, getNetwork } from "@wagmi/core"
import {
  CCIP_EXPLORER_URL,
  PORTALSIG_WALLET_CONTRACT_ABI,
} from "@/constants/constants"
import { PortalContext } from "./PortalContext"
import { ChainContext, ContractCallType } from "./ChainContext"
import { Portal } from "@/types/Portal"
import { registeredChains } from "./data/chains"

interface TransactionContextProviderProps {
  children: ReactNode
}

interface TransactionContextProps {
  getPortalTransactions: () => Promise<Transaction[]>
  getExplorerUrl: (transactionHash: string, transaction?: Transaction) => string
}

const TransactionContext = createContext<TransactionContextProps>({
  getPortalTransactions: async () => {
    return []
  },
  getExplorerUrl: () => {
    return ""
  },
})

export default function TransactionContextProvider(
  props: TransactionContextProviderProps
) {
  const { chain } = getNetwork()
  const { currentPortal, isExternalChain } = useContext(PortalContext)
  const { callContract } = useContext(ChainContext)

  async function getPortalTransactions(): Promise<Transaction[]> {
    if (!currentPortal) return []

    const transactions: any = await readContract({
      address: currentPortal.address,
      abi: PORTALSIG_WALLET_CONTRACT_ABI,
      functionName: "getTransactions",
      chainId: +currentPortal.chain.chainId,
    })

    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i]
      transaction.id = i
      transaction.status = await getTransactionStatus(
        currentPortal,
        transaction,
        i
      )
      transaction.portal = currentPortal
    }

    return transactions
  }

  async function isConfirmedByAccount(
    portal: Portal,
    transactionId: number,
    accountAddress: Address
  ): Promise<boolean> {
    const isConfirmed: any = await callContract({
      contractAddress: portal.address,
      abi: PORTALSIG_WALLET_CONTRACT_ABI,
      method: "isConfirmedByAccount",
      args: [transactionId, accountAddress],
      type: ContractCallType.READ,
      chainId: +portal.chain.chainId,
    })
    return isConfirmed
  }

  function hasEnoughConfirmations(
    portal: Portal,
    transaction: Transaction
  ): boolean {
    return (
      transaction.numberOfConfirmations.toString() ===
      portal.requiredConfirmationsAmount
    )
  }

  async function getTransactionStatus(
    portal: Portal,
    transaction: Transaction,
    transactionId: number
  ): Promise<TransactionStatus> {
    const account = getAccount()
    if (transaction.executed) {
      return TransactionStatus.EXECUTED
    } else if (hasEnoughConfirmations(portal, transaction)) {
      return TransactionStatus.APPROVED
    } else if (
      account.address &&
      (await isConfirmedByAccount(portal, transactionId, account.address))
    ) {
      return TransactionStatus.CONFIRMED
    }
    return TransactionStatus.WAITING_FOR_APPROVAL
  }

  function getExplorerUrl(
    transactionHash: string,
    transaction?: Transaction
  ): string {
    if (transaction && triggersCCIPExecution(transaction)) {
      return CCIP_EXPLORER_URL + transactionHash
    }
    const chainData = registeredChains.find(
      (registeredChain) => +registeredChain.chainId === chain?.id
    )
    if (!chainData) {
      return ""
    }
    return chainData.explorerUrl + transactionHash
  }

  function triggersCCIPExecution(transaction: Transaction): boolean {
    if (isExternalChain(transaction.destinationChainSelector)) {
      const { numberOfConfirmations, portal } = transaction
      const currentConfirmations = numberOfConfirmations.toString()
      const requiredConfirmations =
        portal.requiredConfirmationsAmount.toString()
      return +currentConfirmations === +requiredConfirmations - 1
    }
    return false
  }

  const context = {
    getPortalTransactions,
    getExplorerUrl,
  }

  return (
    <TransactionContext.Provider value={context}>
      {props.children}
    </TransactionContext.Provider>
  )
}

export { TransactionContext }
