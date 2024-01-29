// Types
import { Transaction } from "@/types/Transaction"
import { Token } from "@/types/Token"
// Components
import { Card, CardFooter } from "@/components/ui/card"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/components/ui/accordion"
import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import Copy from "../ui/copy/copy"
// Utils
import { formatUnits } from "viem"
import { getShortenedAddress } from "@/lib/utils"
// Services
import { PayFeesIn, TokenContext } from "@/services/TokenContext"
import { Chain, registeredChains } from "@/services/data/chains"
// React
import { useContext } from "react"

interface TransactionCardProps {
	transaction: Transaction
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
	const { getTokenByAddress } = useContext(TokenContext)
	const {
		destination,
		token,
		destinationChainSelector,
		amount,
		numberOfConfirmations,
		gasLimit,
		data,
		executed,
		executesOnRequirementMet,
		payFeesIn
	} = transaction

	const tokenMetadata: Token | null = getTokenByAddress(token)

	function getChainBySelector(chainSelector: string): Chain | null {
		return (
			registeredChains.find(
				(chain) => chain.chainSelector === chainSelector
			) || null
		)
	}

	return (
		<Card className="max-w-lg h-fit shadow-xl bg-blue-950/50 rounded-lg p-6 text-white fade-in">
			<div className="flex items-center justify-between mb-4 gap-20">
				<h3 className="text-xl font-bold">Transaction Details</h3>
				<div className="flex items-center">
					<p>Status:</p>
					<Badge color={executed ? "green" : "red"} className="ml-2">
						{executed ? "Executed" : "Pending"}
					</Badge>
				</div>
			</div>
			<Separator className="mb-4" />
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<p>
						Destinator:{" "}
						<span className="text-gray-300 font-light">
							{getShortenedAddress(destination)}
						</span>
					</p>
					<Copy contentToCopy={destination} />
				</div>
				<Separator className="mb-1" />
				<div className="flex h-5 items-center justify-between space-x-4">
					<p>
						Chain:{" "}
						<span className="text-gray-300 font-light">
							{getChainBySelector(
								destinationChainSelector.toString()
							)?.name ?? destinationChainSelector}
						</span>
					</p>
					<Separator orientation="vertical" />
					<p>
						Amount:{" "}
						<span className="text-gray-300 font-light">
							{formatUnits(amount, 18)} {tokenMetadata?.symbol}
						</span>
					</p>
				</div>
				<Separator className="mb-1" />
				<p>
					Confirmations:{" "}
					<span className="text-gray-300 font-light">
						{numberOfConfirmations.toString()}
					</span>
				</p>
				<Separator className="mb-1" />
				<Accordion type="single" collapsible>
					<AccordionItem value="item-1">
						<AccordionTrigger>Details</AccordionTrigger>
						<AccordionContent className="space-y-3">
							<p className="flex justify-between">
								Data{" "}
								<span className="text-gray-300 font-light">
									{data === "0x" ? "none" : data}
								</span>
							</p>
							<Separator className="mb-1" />
							<p className="flex justify-between">
								Gas Limit{" "}
								<span className="text-gray-300 font-light">
									{gasLimit.toString()}
								</span>
							</p>

							<Separator className="mb-1" />
							<p className="flex justify-between">
								Executes automatically{" "}
								<span className="text-gray-300 font-light">
									{executesOnRequirementMet ? "Yes" : "No"}
								</span>
							</p>
							<Separator className="mb-1" />
							<p className="flex justify-between">
								Pay Fees In{" "}
								<span className="text-gray-300 font-light">
									{payFeesIn === PayFeesIn.NATIVE
										? "Native token"
										: "Link"}
								</span>
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
			<CardFooter className="flex p-0 mt-[24px] justify-end">
				<Button>Confirm</Button>
			</CardFooter>
		</Card>
	)
}
