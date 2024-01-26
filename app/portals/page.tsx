"use client"
import { useAccount } from "wagmi"
import { fetchBalance } from "@wagmi/core"
import { Address } from "viem"
import classes from "./wallets.module.scss"
import {
	PORTALSIG_FACTORY_CONTRACT_ABI,
	PORTALSIG_FACTORY_CONTRACT_ADDRESS,
	PORTALSIG_WALLET_CONTRACT_ABI
} from "@/constants/constants"
import { readContract } from "@wagmi/core"
import { useEffect, useState } from "react"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { getShortenedAddress } from "@/lib/utils"
import { Portal } from "@/types/Portal"

export default function WalletsPage() {
	const { address, isConnected } = useAccount()
	const [portals, setPortals] = useState<Portal[]>([])

	useEffect(() => {
		if (isConnected) {
			getPortalSigs()
		}
	}, [isConnected])

	async function getPortalSigs(): Promise<void> {
		const portalsAddresses: any = await readContract({
			address: PORTALSIG_FACTORY_CONTRACT_ADDRESS,
			abi: PORTALSIG_FACTORY_CONTRACT_ABI,
			functionName: "getWalletsByOwner",
			args: [address]
		})

		const portals: Portal[] = portalsAddresses.map(
			async (portal: Address) => {
				console.log("fetching: ", portal)
				const owners = await getPortalOwners(portal)
				const balance = await getPortalBalance(portal)
				const transactionsCount = await getTransactionsCount(portal)
				return {
					address: portal,
					owners: owners,
					balance: balance,
					numberOfTransactions: transactionsCount,
					lastTransaction: 0
				}
			}
		)

		setPortals(portals)
		console.log("fetched ! ")
	}

	async function getPortalOwners(portalAddress: Address): Promise<Address[]> {
		const owners: any = await readContract({
			address: portalAddress,
			abi: PORTALSIG_WALLET_CONTRACT_ABI,
			functionName: "getOwners"
		})
		return owners
	}

	async function getPortalBalance(portalAddress: Address) {
		const balance = await fetchBalance({
			address: portalAddress
		})
		return balance?.formatted
	}

	async function getTransactionsCount(
		portalAddress: Address
	): Promise<string> {
		const transactionCount: any = await readContract({
			address: portalAddress,
			abi: PORTALSIG_WALLET_CONTRACT_ABI,
			functionName: "getTransactionCount"
		})
		return transactionCount
	}

	// Address
	// Owners
	// Balance
	// Number of transactions
	// Last transaction

	return (
		<div
			className={`${classes.wallets_page} flex items-center justify-center fade-in`}
		>
			<div className="flex gap-5">
				{portals.map((portal: Portal) => (
					<Card key={portal.address} className={classes.portal_card}>
						<CardHeader>
							<CardTitle>
								{getShortenedAddress(portal.address)}
							</CardTitle>
							<CardDescription>
								<p>Owners</p>
								<ul>
									{portal.owners.map((owner: Address) => (
										<li key={owner}>{owner}</li>
									))}
								</ul>
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p>Card Content</p>
						</CardContent>
						<CardFooter>
							<p>Card Footer</p>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	)
}
