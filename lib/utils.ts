import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Address } from "viem"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getShortenedAddress(address: Address): string {
	return address ? address.slice(0, 6) + "..." + address.slice(-4) : address
}
