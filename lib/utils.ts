"use client"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Address } from "viem"
import {
	prepareWriteContract,
	writeContract,
	waitForTransaction,
	readContract
} from "@wagmi/core"

export enum ContractCallType {
	READ = "READ",
	WRITE = "WRITE"
}

export interface ContractCallParams {
	contractAddress: Address
	abi: any
	method: string
	args: any[]
	type: ContractCallType
}

export interface ToastParams {
	title: string
	description: string
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getShortenedAddress(address: Address): string {
	return address ? address.slice(0, 6) + "..." + address.slice(-4) : address
}

export async function callContract({
	contractAddress,
	abi,
	method,
	args,
	type
}: ContractCallParams): Promise<any> {
	const payload = {
		address: contractAddress,
		abi,
		functionName: method,
		args
	}

	if (type === ContractCallType.READ) {
		const result: any = await readContract(payload)
		return result
	}

	if (type === ContractCallType.WRITE) {
		const { request } = await prepareWriteContract(payload)
		const { hash } = await writeContract(request)
		const result = await waitForTransaction({ hash })
		return result
	}
}
