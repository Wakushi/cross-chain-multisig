import { PayFeesIn } from "@/services/TokenContext"
import { Address } from "viem"

export interface Transaction {
	destination: Address
	token: Address
	destinationChainSelector: string
	amount: bigint
	numberOfConfirmations: string
	gasLimit: string
	data: string
	executed: boolean
	executesOnRequirementMet: boolean
	payFeesIn: PayFeesIn
}
