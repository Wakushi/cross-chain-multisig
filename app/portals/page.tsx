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
import LoaderHive from "@/components/ui/loader-hive/loader-hive"
import { useRouter } from "next/navigation"

export default function WalletsPage() {
	const { address, isConnected } = useAccount()
	const [portals, setPortals] = useState<Portal[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const router = useRouter()

	useEffect(() => {
		if (isConnected) {
			getPortalSigs()
		}
	}, [isConnected])

	async function getPortalSigs(): Promise<void> {
		setIsLoading(true)
		const portalsAddresses: any = await readContract({
			address: PORTALSIG_FACTORY_CONTRACT_ADDRESS,
			abi: PORTALSIG_FACTORY_CONTRACT_ABI,
			functionName: "getWalletsByOwner",
			args: [address]
		})

		const portals: Portal[] = []
		for (let portalAddress of portalsAddresses) {
			const owners = await getPortalOwners(portalAddress)
			const balance = await getPortalBalance(portalAddress)
			const transactionsCount = await getTransactionsCount(portalAddress)
			portals.push({
				address: portalAddress,
				owners: owners,
				balance: balance,
				numberOfTransactions: transactionsCount,
				lastTransaction: 0
			})
		}

		setIsLoading(false)
		setPortals(portals)
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
		return transactionCount.toString()
	}

	function navigateToPortal(portalAddress: Address): void {
		router.push(`/portals/${portalAddress}`)
	}

	if (isLoading) {
		return (
			<div
				className={`${classes.wallets_page} flex items-center justify-center fade-in`}
			>
				<LoaderHive />
			</div>
		)
	}

	return (
		<div
			className={`${classes.wallets_page} flex items-center justify-center fade-in`}
		>
			<div className="flex gap-5">
				{portals?.map(
					({
						address,
						owners,
						balance,
						numberOfTransactions,
						lastTransaction
					}: Portal) => (
						<Card
							key={address}
							className={`${classes.portal_card}`}
							onClick={() => navigateToPortal(address)}
						>
							<CardHeader>
								<CardTitle>
									{getShortenedAddress(address)}
								</CardTitle>
								<CardDescription>
									{numberOfTransactions} transaction
									{+numberOfTransactions > 1 ? "s" : ""}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<h3>Owners</h3>
								<div>
									<ul>
										{owners?.map((owner: Address) => (
											<li key={owner}>{owner}</li>
										))}
									</ul>
								</div>
							</CardContent>
							<CardFooter>
								<p>{balance} ETH</p>
							</CardFooter>
						</Card>
					)
				)}
			</div>
		</div>
	)
}
