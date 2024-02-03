import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Address } from "viem"

export const ZERO_ADDRESS: Address =
  "0x0000000000000000000000000000000000000000"

export function getShortenedAddress(address: Address): string {
  return address ? address.slice(0, 6) + "..." + address.slice(-4) : address
}

export function isValidEthereumAddress(address: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
