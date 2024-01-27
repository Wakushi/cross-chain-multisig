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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "../ui/button"
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
import { Input } from "../ui/input"

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
					<Dialog>
						<DialogTrigger asChild>
							<Button>Create transaction</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Edit profile</DialogTitle>
								<DialogDescription>
									Make changes to your profile here. Click
									save when you're done.
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-4 items-center gap-4">
									<Label
										htmlFor="name"
										className="text-right"
									>
										Name
									</Label>
									<Input
										id="name"
										value="Pedro Duarte"
										className="col-span-3"
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label
										htmlFor="username"
										className="text-right"
									>
										Username
									</Label>
									<Input
										id="username"
										value="@peduarte"
										className="col-span-3"
									/>
								</div>
							</div>
							<DialogFooter>
								<Button type="submit">Save changes</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				)}
			</CardFooter>
		</Card>
	)
}
