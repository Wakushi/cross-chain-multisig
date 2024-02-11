"use client"
import { Transaction } from "@/types/Transaction"
import { DataTable } from "./transactions-table/data-table"
import { columns } from "./transactions-table/columns"

interface TransactionListProps {
  transactions: Transaction[]
}

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  return <DataTable columns={columns} data={transactions} />
}
