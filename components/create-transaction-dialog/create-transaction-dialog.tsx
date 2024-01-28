"use client"
// Components
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// React
import { useContext, useEffect, useState } from "react"
// Wagmi / Viem
import { Address } from "viem"
import { fetchBalance, getNetwork } from "@wagmi/core"
// React Hook Forms
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { registeredChains } from "@/services/data/chains"
import { TokenContext } from "@/services/TokenContext"
import { Token } from "@/types/Token"
import { Alchemy, Network, TokenMetadataResponse } from "alchemy-sdk"
import LoaderSmall from "../ui/loader-small/loader-small"

enum PayFeesIn {
	NATIVE = 0,
	LINK = 1
}

interface CreateTransactionDialogProps {
	portalSigAddress: Address
}

const formSchema = z.object({
	destination: z
		.string()
		.min(42, { message: "Invalid address length." })
		.max(42),
	token: z.string().min(42, { message: "Invalid address length." }).max(42),
	destinationChainSelector: z.string(),
	amount: z.number(),
	data: z.string(),
	executesOnRequirementMet: z.boolean(),
	payFeesIn: z.number()
})

export default function CreateTransactionDialog({
	portalSigAddress
}: CreateTransactionDialogProps) {
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [selectedChain, setSelectedChain] = useState<string>("")
	const [selectedChainSupportedTokens, setSelectedChainSupportedTokens] =
		useState<Token[]>([])
	const [selectedToken, setSelectedToken] = useState<Token>()
	const [selectedTokenBalance, setSelectedTokenBalance] = useState<string>("")
	const { allSupportedTokens } = useContext(TokenContext)
	const { chain } = getNetwork()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			destination: "",
			token: "",
			destinationChainSelector: "",
			amount: 0,
			data: "",
			executesOnRequirementMet: false,
			payFeesIn: PayFeesIn.NATIVE
		}
	})

	useEffect(() => {
		if (portalSigAddress && allSupportedTokens.length) {
			getPortalTokens(portalSigAddress).then((portalTokens: Token[]) => {
				allSupportedTokens.map((chainSupportedTokens) => {
					if (+chainSupportedTokens.chainId === chain?.id) {
						chainSupportedTokens.supportedTokens = [...portalTokens]
					}
				})
				setIsLoading(false)
			})
		}
	}, [allSupportedTokens])

	useEffect(() => {
		const chainSupportedTokens = getChainSupportedTokens(selectedChain)
		setSelectedChainSupportedTokens(chainSupportedTokens)
	}, [selectedChain])

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log("Submitted!")
		console.log(values)
	}

	async function onTokenChange(tokenAddress: Address) {
		const selectedToken = selectedChainSupportedTokens.find(
			(token) => token.address === tokenAddress
		)
		if (selectedToken) {
			setSelectedToken(selectedToken)
		}
		const balance = await fetchBalance({
			address: portalSigAddress,
			token: tokenAddress
		})
		setSelectedTokenBalance(balance?.value.toString())
	}

	function getChainSupportedTokens(chainSelector: string): Token[] {
		const chain = allSupportedTokens.find(
			(chain) => chain.chainSelector === chainSelector
		)
		if (chain) {
			return chain.supportedTokens
		}
		return []
	}

	async function getPortalTokens(address: Address): Promise<Token[]> {
		const config = {
			apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
			network: Network.ETH_SEPOLIA
		}
		const alchemy = new Alchemy(config)
		const balances = await alchemy.core.getTokenBalances(address)
		const nonZeroBalances = balances.tokenBalances.filter((token: any) => {
			return (
				token.tokenBalance !==
				"0x0000000000000000000000000000000000000000000000000000000000000000"
			)
		})

		const portalTokens: Token[] = []
		for (let token of nonZeroBalances) {
			let balance: any = token.tokenBalance
			const metadata: TokenMetadataResponse =
				await alchemy.core.getTokenMetadata(token.contractAddress)
			if (balance) {
				balance = balance / Math.pow(10, metadata.decimals || 18)
				balance = balance.toFixed(2)
			}
			portalTokens.push({
				address: token.contractAddress as Address,
				name: metadata.name || "",
				symbol: metadata.symbol || "",
				decimals: metadata.decimals || 18,
				balance: balance
			})
		}
		return portalTokens
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Create transaction</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create transaction</DialogTitle>
					<DialogDescription>
						Enter the details of the transaction you want to create.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-8"
						>
							<FormField
								control={form.control}
								name="destination"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Destination</FormLabel>
										<FormControl>
											<Input
												placeholder="0x00"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											The address that will receive the
											transaction.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							{isLoading ? (
								<LoaderSmall />
							) : (
								<FormField
									control={form.control}
									name="destinationChainSelector"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Destination chain
											</FormLabel>
											<Select
												onValueChange={(value) => {
													field.onChange(value)
													setSelectedChain(value)
												}}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a destination chain" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{registeredChains.map(
														({
															name,
															chainSelector
														}) => (
															<SelectItem
																key={
																	chainSelector
																}
																value={
																	chainSelector
																}
															>
																{name}
															</SelectItem>
														)
													)}
												</SelectContent>
											</Select>
											<FormDescription>
												Blockchain where the transaction
												will be sent to.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
							{!!form.getValues().destinationChainSelector && (
								<FormField
									control={form.control}
									name="token"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Token</FormLabel>
											<Select
												onValueChange={(value) => {
													field.onChange(value)
													onTokenChange(
														value as Address
													)
												}}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a token to send" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{selectedChainSupportedTokens.map(
														(supportedToken) => (
															<SelectItem
																key={
																	supportedToken.address
																}
																value={
																	supportedToken.address
																}
															>
																{
																	supportedToken.name
																}
															</SelectItem>
														)
													)}
												</SelectContent>
											</Select>
											<FormDescription>
												{selectedTokenBalance
													? `Balance: ${selectedTokenBalance} ${selectedToken?.symbol}`
													: ""}
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
							<Button
								type="submit"
								onClick={() => {
									console.log(form.getValues())
								}}
							>
								Submit
							</Button>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	)
}
