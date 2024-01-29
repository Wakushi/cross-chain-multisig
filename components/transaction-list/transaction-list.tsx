import { Portal } from "@/types/Portal"
import { useEffect, useState } from "react"
import { Address } from "viem"
import { readContract } from "@wagmi/core"
import { PORTALSIG_WALLET_CONTRACT_ABI } from "@/constants/constants"
import { Transaction } from "@/types/Transaction"
import TransactionCard from "../transaction-card/transaction-card"

interface TransactionListProps {
	portal: Portal
}

export default function TransactionList({ portal }: TransactionListProps) {
	const [transactions, setTransactions] = useState<Transaction[]>([])

	useEffect(() => {
		if (portal) {
			getTransactions(portal.address)
		}
	}, [])

	async function getTransactions(portalAddress: Address): Promise<void> {
		if (!portalAddress) return
		const transactions: any = await readContract({
			address: portalAddress,
			abi: PORTALSIG_WALLET_CONTRACT_ABI,
			functionName: "getTransactions"
		})
		setTransactions(transactions)
	}

	return (
		<div className="flex items-baseline justify-center flex-wrap gap-5 mt-5">
			{transactions.map((transaction, index) => {
				return <TransactionCard key={index} transaction={transaction} />
			})}
		</div>
	)
}
