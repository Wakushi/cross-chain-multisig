import { Portal } from "@/types/Portal"
import { createContext, ReactNode, useState } from "react"
import { fetchBalance } from "@wagmi/core"
import { Address } from "viem"
import {
	PORTALSIG_FACTORY_CONTRACT_ABI,
	PORTALSIG_FACTORY_CONTRACT_ADDRESS,
	PORTALSIG_WALLET_CONTRACT_ABI
} from "@/constants/constants"
import { readContract } from "@wagmi/core"
import { useAccount } from "wagmi"

interface PortalContextProviderProps {
	children: ReactNode
}

interface PortalContextProps {
	portals: Portal[]
	savePortals: (portals: Portal[]) => void
	getPortalSig: (portalAddress: Address) => Promise<Portal>
	getPortalAddresses: () => Promise<Address[]>
}

const PortalContext = createContext<PortalContextProps>({
	portals: [],
	savePortals: (portals: Portal[]) => {},
	getPortalSig: (portalAddress: Address) => Promise.resolve({} as Portal),
	getPortalAddresses: () => Promise.resolve([] as Address[])
})
export default function PortalContextProvider(
	props: PortalContextProviderProps
) {
	const [portals, setPortals] = useState<Portal[]>([])
	const { address, isConnected } = useAccount()

	async function getPortalSig(portalAddress: Address): Promise<Portal> {
		const savedPortal = findLocalPortal(portalAddress)
		if (savedPortal) {
			return savedPortal
		}
		const owners = await getPortalOwners(portalAddress)
		const balance = await getPortalBalance(portalAddress)
		const transactionsCount = await getTransactionsCount(portalAddress)
		return {
			address: portalAddress,
			owners: owners,
			balance: balance,
			numberOfTransactions: transactionsCount,
			lastTransaction: 0
		}
	}

	async function getPortalAddresses(): Promise<Address[]> {
		const portalsAddresses: any = await readContract({
			address: PORTALSIG_FACTORY_CONTRACT_ADDRESS,
			abi: PORTALSIG_FACTORY_CONTRACT_ABI,
			functionName: "getWalletsByOwner",
			args: [address]
		})
		return portalsAddresses
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

	function savePortals(portals: Portal[]): void {
		setPortals(portals)
	}

	function findLocalPortal(portalAddress: Address): Portal | undefined {
		return portals.find((portal) => portal.address === portalAddress)
	}

	const context = {
		portals,
		savePortals,
		getPortalSig,
		getPortalAddresses
	}

	return (
		<PortalContext.Provider value={context}>
			{props.children}
		</PortalContext.Provider>
	)
}

export { PortalContext }
