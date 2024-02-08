"use client"
import { Portal } from "@/types/Portal"
import { Transaction } from "@/types/Transaction"
import { TransactionContext } from "@/services/TransactionsContext"
import { useContext, useEffect, useState } from "react"
import { DataTable } from "./transactions-table/data-table"
import { columns } from "./transactions-table/columns"

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
    <div>
      <DataTable columns={columns} data={transactions} />
    </div>
  )
}
