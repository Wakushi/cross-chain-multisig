"use client"
// Components
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import Copy from "../ui/copy/copy"
// Utils
import { getShortenedAddress } from "@/lib/utils"
import { Address } from "viem"
// Styles / Assets
import classes from "./portal-card.module.scss"
import ethIcon from "../../assets/icons/ethereum.svg"
// Types
import { PortalCardProps, PortalCardView } from "@/types/PortalCardProps"
// Next / React
import Image from "next/image"
import { useRouter } from "next/navigation"
import CreateTransactionDialog from "../create-transaction-dialog/create-transaction-dialog"

export default function PortalCard({ portal, view }: PortalCardProps) {
	const { address, owners, balance, numberOfTransactions, lastTransaction } =
		portal
	const router = useRouter()

	function navigateToPortal(portalAddress: Address): void {
		router.push(`/portals/${portalAddress}`)
	}

	function isDetailedView(): boolean {
		return view === PortalCardView.DETAIL
	}

	return (
		<Card
			key={address}
			className={`${classes.portal_card} ${
				isDetailedView() ? classes.detail : classes.small
			}`}
			onClick={() => navigateToPortal(address)}
		>
			<CardHeader>
				<CardTitle className={classes.title}>
					{isDetailedView()
						? `Portal : ${address}`
						: getShortenedAddress(address)}
					<Copy contentToCopy={address} />
				</CardTitle>
				<CardDescription>
					{numberOfTransactions} transaction
					{+numberOfTransactions > 1 ? "s" : ""}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<h3>Owners</h3>
				<ul className={classes.owner_list}>
					{owners?.map((owner: Address) => (
						<li key={owner}>
							{owner} <Copy contentToCopy={owner} />
						</li>
					))}
				</ul>
			</CardContent>
			<CardFooter className="flex justify-between items-center">
				<div className="flex items-center gap-1">
					<p>{balance} </p>
					<Image
						src={ethIcon}
						style={{ filter: "invert(1)" }}
						alt="Ethereum logo"
						width={10}
						height={10}
					/>
				</div>
				{isDetailedView() && (
					<CreateTransactionDialog portalSigAddress={address} />
				)}
			</CardFooter>
		</Card>
	)
}
