"use client"

// Components
import TransactionList from "@/components/transaction-list"
import LoaderHive from "@/components/ui/loader-hive/loader-hive"

// Services & Utils
import { PortalContext } from "@/services/PortalContext"
import { TransactionContext } from "@/services/TransactionsContext"

// React
import { useContext } from "react"
import { useQuery } from "@tanstack/react-query"
import { Transaction } from "@/types/Transaction"
import { Card } from "@/components/ui/card"

export default function TransactionsPage() {
  const { currentPortal } = useContext(PortalContext)
  const { getPortalTransactions } = useContext(TransactionContext)

  const { data: transactions, isLoading } = useQuery<Transaction[], Error>(
    ["transactions", currentPortal?.address],
    () => {
      if (!currentPortal?.address) {
        throw new Error("Portal address is undefined")
      }
      return getPortalTransactions()
    },
    {
      enabled: !!currentPortal?.address,
    }
  )

  if (isLoading) {
    return (
      <div className="min-h-[800px] flex items-center justify-center fade-in">
        <LoaderHive />
      </div>
    )
  }

  if (!transactions) {
    return (
      <div className="min-h-[800px] flex items-center justify-center fade-in">
        <div className="flex flex-col gap-5 justify-center items-center">
          <p className="text-3xl">No transactions found</p>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <TransactionList transactions={transactions} />
    </Card>
  )
}
