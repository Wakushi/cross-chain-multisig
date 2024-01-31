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
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

// React
import { useContext, useEffect, useState } from "react"

// Wagmi / Viem
import { Address, parseEther } from "viem"
import {
	fetchBalance,
	getNetwork,
	prepareWriteContract,
	writeContract,
	waitForTransaction
} from "@wagmi/core"

// React Hook Forms
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Chain, registeredChains } from "@/services/data/chains"
import { PayFeesIn, TokenContext } from "@/services/TokenContext"
import { Token } from "@/types/Token"
import LoaderSmall from "../ui/loader-small/loader-small"
import { PORTALSIG_WALLET_CONTRACT_ABI } from "@/constants/constants"
import LoaderHive from "../ui/loader-hive/loader-hive"

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
	amount: z.string(),
	data: z.string(),
	executesOnRequirementMet: z.boolean(),
	payFeesIn: z.number()
})

export default function CreateTransactionDialog({
	portalSigAddress
}: CreateTransactionDialogProps) {
	// Context & Utils
	const { chain } = getNetwork()
	const { toast } = useToast()
	const { allSupportedTokens, getAllAddressTokens, getTokenByAddress } =
		useContext(TokenContext)

	// State
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [open, setOpen] = useState<boolean>(false)
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
	const [selectedChain, setSelectedChain] = useState<string>("")
	const [selectedChainSupportedTokens, setSelectedChainSupportedTokens] =
		useState<Token[]>([])
	const [selectedToken, setSelectedToken] = useState<string>("")
	const [selectedTokenBalance, setSelectedTokenBalance] = useState<string>("")

	// React Hook Forms
	const { reset } = useForm()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			destination: "",
			token: "",
			destinationChainSelector: "",
			amount: "",
			data: "",
			executesOnRequirementMet: false,
			payFeesIn: 0
		}
	})

	useEffect(() => {
		if (portalSigAddress && allSupportedTokens.length) {
			getAllAddressTokens(portalSigAddress).then(
				(portalTokens: Token[]) => {
					allSupportedTokens.map((chainSupportedTokens) => {
						if (+chainSupportedTokens.chainId === chain?.id) {
							chainSupportedTokens.supportedTokens = [
								...portalTokens
							]
						}
					})
					setIsLoading(false)
				}
			)
		}
	}, [allSupportedTokens])

	useEffect(() => {
		resetTokenField()
		setSelectedChainSupportedTokens(getChainSupportedTokens(selectedChain))
	}, [selectedChain])

	useEffect(() => {
		if (selectedToken) {
			const token = getTokenByAddress(selectedToken as Address)
			if (token) {
				updateDisplayedTokenBalance(token)
			}
		}
	}, [selectedToken])

	function onSubmit(values: z.infer<typeof formSchema>) {
		setIsSubmitting(true)
		const {
			destination,
			destinationChainSelector,
			token,
			amount,
			data,
			executesOnRequirementMet,
			payFeesIn
		} = values

		createTransaction(
			destination,
			destinationChainSelector,
			token,
			amount,
			data,
			executesOnRequirementMet,
			payFeesIn.toString()
		)
	}

	async function createTransaction(
		destination: string,
		destinationChainSelector: string,
		token: string,
		amount: string,
		data: string,
		executesOnRequirementMet: boolean,
		payFeesIn: string
	): Promise<void> {
		try {
			destinationChainSelector = isExternalChain(destinationChainSelector)
				? destinationChainSelector
				: "0"
			const { request } = await prepareWriteContract({
				address: portalSigAddress,
				abi: PORTALSIG_WALLET_CONTRACT_ABI,
				functionName: "createTransaction",
				args: [
					destination,
					token,
					destinationChainSelector,
					parseEther(amount),
					data,
					executesOnRequirementMet,
					payFeesIn,
					0
				]
			})
			const { hash } = await writeContract(request)
			const result = await waitForTransaction({ hash })
			setIsSubmitting(false)
			setOpen(false)
			toast({
				title: "Transaction created !",
				description: result.contractAddress
			})
		} catch (error: any) {
			setIsSubmitting(false)
			setOpen(false)

			toast({
				title: "Something went wrong !",
				description: error.message
			})
		}
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

	async function updateDisplayedTokenBalance(token: Token) {
		let balance = Number((await fetchTokenBalance(token))?.value || 0)
		if (balance) {
			balance = balance / Math.pow(10, token.decimals || 18)
		}

		setSelectedTokenBalance(balance.toFixed(2))
	}

	function getPortalChain(): Chain | undefined {
		return registeredChains.find(
			(registeredChain) => +registeredChain.chainId === chain?.id
		)
	}

	async function fetchTokenBalance(token: Token) {
		return await fetchBalance({
			address: portalSigAddress,
			token: token.address
		})
	}

	function resetTokenField(): void {
		reset({ token: "" })
		setSelectedToken("")
		setSelectedTokenBalance("")
	}

	function isExternalChain(chainSelector: string): boolean {
		return (
			chainSelector !== "" &&
			chainSelector !== getPortalChain()?.chainSelector
		)
	}

	return (
		<Dialog open={open} onOpenChange={(isOpen: boolean) => setOpen(isOpen)}>
			<DialogTrigger asChild>
				<Button>Create transaction</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[525px] h-[700px] overflow-auto custom-scrollbar">
				{isSubmitting ? (
					<div className="flex flex-col items-center justify-center">
						<p className="mb-[22rem] text-center font-light text-2xl">
							Please wait while we create your transaction
							proposal...
						</p>
						<LoaderHive />
					</div>
				) : (
					<>
						<DialogHeader>
							<DialogTitle>Create transaction</DialogTitle>
							<DialogDescription>
								Enter the details of the transaction you want to
								create.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="flex flex-col space-y-8"
								>
									{/* DESTINATION ADDRESS */}
									<FormField
										control={form.control}
										name="destination"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Destination
												</FormLabel>
												<FormControl>
													<Input
														placeholder="0x00"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													The address that will
													receive the transaction.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									{/* DESTINATION BLOCKCHAIN */}
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
														onValueChange={(
															value
														) => {
															field.onChange(
																value
															)
															setSelectedChain(
																value
															)
														}}
														defaultValue={
															field.value
														}
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
														Blockchain where the
														transaction will be sent
														to.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									)}
									{/* TOKEN TO SEND */}
									{!!form.getValues()
										.destinationChainSelector &&
										!isLoading && (
											<FormField
												control={form.control}
												name="token"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Token
														</FormLabel>
														<Select
															onValueChange={(
																value
															) => {
																field.onChange(
																	value
																)
																setSelectedToken(
																	value
																)
															}}
															value={
																selectedToken
															}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select a token to send" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{selectedChainSupportedTokens.map(
																	(
																		supportedToken
																	) => (
																		<SelectItem
																			key={
																				supportedToken.address
																			}
																			value={supportedToken.address.toString()}
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
															{selectedToken
																? `Balance: ${selectedTokenBalance} ${
																		getTokenByAddress(
																			selectedToken as Address
																		)
																			?.symbol
																  }`
																: ""}
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>
										)}
									{/* DESTINATION ADDRESS */}
									<FormField
										control={form.control}
										name="amount"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Amount</FormLabel>
												<FormControl>
													<Input
														type="number"
														placeholder="0"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													Amount of tokens to send.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									{/* DESTINATION ADDRESS */}
									<FormField
										control={form.control}
										name="data"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Data</FormLabel>
												<FormControl>
													<Input
														placeholder="0x00"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													The data to send with the
													transaction.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									{/* EXECUTES ON REQUIREMENT */}
									<FormField
										control={form.control}
										name="executesOnRequirementMet"
										render={({ field }) => (
											<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={
															field.onChange
														}
													/>
												</FormControl>
												<div className="space-y-1 leading-none">
													<FormLabel>
														Execute transaction
														automatically
													</FormLabel>
													<FormDescription>
														Transaction will be
														executed when enough
														signatures are
														collected.
													</FormDescription>
												</div>
											</FormItem>
										)}
									/>
									{/* EXECUTES ON REQUIREMENT */}
									{isExternalChain(selectedChain) && (
										<FormField
											control={form.control}
											name="payFeesIn"
											render={({ field }) => (
												<FormItem className="space-y-3">
													<FormLabel>
														Pay cross-chain fees in
													</FormLabel>
													<FormControl>
														<RadioGroup
															onValueChange={
																field.onChange
															}
															defaultValue={field.value.toString()}
															className="flex flex-col space-y-1"
														>
															<FormItem className="flex items-center space-x-3 space-y-0">
																<FormControl>
																	<RadioGroupItem
																		value={PayFeesIn.NATIVE.toString()}
																	/>
																</FormControl>
																<FormLabel className="font-normal">
																	Native token
																</FormLabel>
															</FormItem>
															<FormItem className="flex items-center space-x-3 space-y-0">
																<FormControl>
																	<RadioGroupItem
																		value={PayFeesIn.LINK.toString()}
																	/>
																</FormControl>
																<FormLabel className="font-normal">
																	Link token
																</FormLabel>
															</FormItem>
														</RadioGroup>
													</FormControl>
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
					</>
				)}
			</DialogContent>
		</Dialog>
	)
}
