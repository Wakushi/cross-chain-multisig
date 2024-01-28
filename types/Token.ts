import { Address } from "viem"

export interface Token {
	address: Address
	name: string
	symbol: string
	decimals: number
	balance?: number
}
