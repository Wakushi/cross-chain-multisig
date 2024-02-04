"use client"
import TransactionList from "@/components/transaction-list"
import LoaderHive from "@/components/ui/loader-hive/loader-hive"
import { PortalContext } from "@/services/PortalContext"
import { useContext } from "react"

export default function TransactionsPage() {
  const { currentPortal } = useContext(PortalContext)

  if (!currentPortal) {
    return <LoaderHive />
  }

  return <TransactionList portal={currentPortal} />
}
