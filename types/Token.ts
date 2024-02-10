import { Address } from "viem"

export interface Token {
  address: Address
  name: string
  symbol: string
  decimals: number
  logo?: string
  balance?: string
}
