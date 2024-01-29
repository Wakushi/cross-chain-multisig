"use client"
import { useAccount } from "wagmi"
import { useContext, useEffect, useState } from "react"
import { PortalContext } from "@/services/PortalContext"
import { Portal } from "@/types/Portal"
import LoaderHive from "@/components/ui/loader-hive/loader-hive"
import PortalList from "@/components/portal-list/portal-list"

export default function PortalsPage() {
	const { isConnected } = useAccount()
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const { portals, savePortals, getPortalSig, getPortalAddresses } =
		useContext(PortalContext)

	useEffect(() => {
		if (isConnected) {
			if (!portals.length) {
				getPortalSigs()
			}
		}
	}, [isConnected])

	async function getPortalSigs(): Promise<void> {
		setIsLoading(true)
		const portals: Portal[] = []
		for (let portalAddress of await getPortalAddresses()) {
			const portal = await getPortalSig(portalAddress)
			portals.push(portal)
		}
		savePortals(portals)
		setIsLoading(false)
	}

	return (
		<div className="min-h-screen flex items-center justify-center fade-in">
			{isLoading ? <LoaderHive /> : <PortalList portals={portals} />}
		</div>
	)
}
