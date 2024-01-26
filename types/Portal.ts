import { Address } from "viem"

export interface Portal {
	address: Address
	owners: Address[]
	balance: string
	numberOfTransactions: string
	lastTransaction: number
}
// Owners
// Number of transactions
// Balance
// Last transaction
