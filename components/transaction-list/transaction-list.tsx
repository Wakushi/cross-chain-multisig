"use client"
import { Portal } from "@/types/Portal"
import { Transaction } from "@/types/Transaction"
import { TransactionContext } from "@/services/TransactionsContext"
import TransactionCard from "../transaction-card/transaction-card"
import { useContext, useEffect, useState } from "react"

interface TransactionListProps {
  portal: Portal
}

export default function TransactionList({ portal }: TransactionListProps) {
  const {
    fetchPortalTransactions,
    allPortalsTransactions,
    getPortalTransactions,
  } = useContext(TransactionContext)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (portal) {
      fetchPortalTransactions(portal.address)
    }
  }, [])

  useEffect(() => {
    setTransactions(getPortalTransactions(portal.address))
  }, [allPortalsTransactions])

  return (
    <div className="flex justify-center flex-wrap gap-5 mt-5">
      {transactions.map((transaction, index) => {
        return (
          <TransactionCard
            key={index}
            transactionId={index}
            transaction={transaction}
            portalSig={portal}
            fetchPortalTransactions={fetchPortalTransactions}
          />
        )
      })}
    </div>
  )
}
