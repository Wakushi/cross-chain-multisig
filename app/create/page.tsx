"use client"
import classes from "./create.module.scss"
// React
import { useContext, useState } from "react"
import { useRouter } from "next/navigation"

// Context
import { ErrorContext } from "@/services/ErrorContext" // <- TO REWORK (useless context)

// Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faCircleMinus } from "@fortawesome/free-solid-svg-icons"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import LoaderHive from "@/components/ui/loader-hive/loader-hive"

// Constants
import {
	PORTALSIG_FACTORY_CONTRACT_ADDRESS,
	PORTALSIG_FACTORY_CONTRACT_ABI,
	SEPOLIA_CCIP_ROUTER_CONTRACT_ADDRESS,
	SEPOLIA_LINK_CONTRACT_ADDRESS
} from "@/constants/constants"

// Wagmi
import {
	prepareWriteContract,
	writeContract,
	waitForTransaction
} from "@wagmi/core"

export default function CreatePage() {
	const [ownersAddresses, setOwnersAddresses] = useState<string[]>(["", ""])
	const [numberOfConfirmation, setNumberOfConfirmation] = useState<number>(2)
	const { handleCreationFormError, errorMsg } = useContext(ErrorContext)
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const router = useRouter()
	const { toast } = useToast()

	function handleAddOwnerInputField(): void {
		setOwnersAddresses((prevOwnersAddresses) => [
			...prevOwnersAddresses,
			""
		])
	}

	function handleRemoveOwnerInputField(index: number): void {
		setOwnersAddresses((prevOwnersAddresses) => {
			const newOwnersInput = [...prevOwnersAddresses]
			newOwnersInput.splice(index, 1)
			return newOwnersInput
		})
	}

	function handleOnOwnerInputChange(index: number, newAddress: string): void {
		setOwnersAddresses((prevOwnersAddresses) => {
			const newOwnersAddresses = [...prevOwnersAddresses]
			newOwnersAddresses[index] = newAddress
			return newOwnersAddresses
		})
	}

	function handleOnConfirmationInputChange(
		numberOfConfirmation: number
	): void {
		setNumberOfConfirmation(numberOfConfirmation)
	}

	function handleSubmit(): void {
		if (!handleCreationFormError(ownersAddresses, numberOfConfirmation)) {
			return
		} else {
			createPortalSig()
		}
	}

	async function createPortalSig(): Promise<void> {
		setIsLoading(true)
		try {
			const { request } = await prepareWriteContract({
				address: PORTALSIG_FACTORY_CONTRACT_ADDRESS,
				abi: PORTALSIG_FACTORY_CONTRACT_ABI,
				functionName: "deployPortalSigWallet",
				args: [
					ownersAddresses,
					parseInt(numberOfConfirmation.toString()),
					SEPOLIA_CCIP_ROUTER_CONTRACT_ADDRESS,
					SEPOLIA_LINK_CONTRACT_ADDRESS
				]
			})
			const { hash } = await writeContract(request)
			const data = await waitForTransaction({ hash })
			setIsLoading(false)
			toast({
				title: "Wallet created !",
				description: data.contractAddress
			})
			navigateToPortals()
		} catch (error: any) {
			toast({
				title: "Something went wrong !",
				description: error.message
			})
		}
	}

	function navigateToPortals(): void {
		router.push("/portals")
	}

	return (
		<div
			className={`${classes.create_page} flex items-center justify-center fade-in`}
		>
			{isLoading ? (
				<div className={`${classes.loader_container} fade-in`}>
					<h2>opening portal...</h2>
					<LoaderHive />
				</div>
			) : (
				<>
					<Card className={classes.create_card}>
						<CardHeader>
							<CardTitle>Create a new PortalSig</CardTitle>
							<CardDescription>
								Please configurate your new cross-chain multisig
								wallet.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p>
								Please enter the number of confirmations
								required for every future transaction of this
								wallet.
							</p>
							<div className="flex items-center gap-4">
								<span>Every transaction will require </span>
								<div className={classes.confirmation_input}>
									<Input
										type="number"
										placeholder="2"
										min="2"
										onChange={(e) =>
											handleOnConfirmationInputChange(
												+e.target.value
											)
										}
									/>
								</div>
								<div>owner confirmations.</div>
							</div>
							<p className={classes.small_text}>
								Note : there should be at least two owners
								minimum, and two confirmation required minimum.
							</p>
							<p>Please enter the owners address.</p>
							<div
								className={`${classes.owners_input_list} flex flex-wrap items-center gap-4`}
							>
								{ownersAddresses.map((address, index) => {
									return (
										<div
											key={index}
											className={`${classes.owner_input} dark_input`}
										>
											{index > 1 && (
												<FontAwesomeIcon
													icon={faCircleMinus}
													className={`${classes.fas} fas`}
													style={{ color: "red" }}
													onClick={() =>
														handleRemoveOwnerInputField(
															index
														)
													}
												></FontAwesomeIcon>
											)}
											<Input
												value={address}
												type="text"
												placeholder="0x00..."
												onChange={(e) =>
													handleOnOwnerInputChange(
														index,
														e.target.value
													)
												}
											/>
										</div>
									)
								})}
								<FontAwesomeIcon
									icon={faPlus}
									className="fas fa-plus"
									style={{ color: "#fff" }}
									onClick={handleAddOwnerInputField}
								></FontAwesomeIcon>
							</div>
							<div className="flex items-center justify-between">
								{errorMsg && (
									<span className="text-rose-600">
										{errorMsg}
									</span>
								)}
							</div>
						</CardContent>
						<CardFooter>
							<Button onClick={handleSubmit}>Submit</Button>
						</CardFooter>
					</Card>
				</>
			)}
		</div>
	)
}
