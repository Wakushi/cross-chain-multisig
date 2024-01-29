"use client"
// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBackward } from "@fortawesome/free-solid-svg-icons"
// Styles
import classes from "./portal.module.scss"
// Next / React
import { useContext, useEffect, useState } from "react"
import Link from "next/link"
// Components
import TooltipWrapper from "@/components/ui/custom-tooltip"
import LoaderHive from "@/components/ui/loader-hive/loader-hive"
import PortalCard from "@/components/portal-card/portal-card"
// Services
import { PortalContext } from "@/services/PortalContext"
// Utils
import { Address } from "viem"
// Types
import { Portal } from "@/types/Portal"
import { PortalCardView } from "@/types/PortalCardProps"
import TransactionList from "@/components/transaction-list/transaction-list"

export default function PortalPage({
	params
}: {
	params: { portalId: Address }
}) {
	const [portal, setPortal] = useState<Portal>({} as Portal)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const { getPortalSig } = useContext(PortalContext)

	useEffect(() => {
		async function getPortal() {
			setIsLoading(true)
			const portal = await getPortalSig(params.portalId)
			setPortal(portal)
			setIsLoading(false)
		}
		getPortal()
	}, [])

	return (
		<div className={`${classes.portal_page} min-h-screen`}>
			<TooltipWrapper message="Back to portals">
				<Link href="/portals">
					<FontAwesomeIcon
						icon={faBackward}
						className={`${classes.fas} fas`}
						style={{ color: "#fff" }}
					></FontAwesomeIcon>
				</Link>
			</TooltipWrapper>

			{isLoading ? (
				<LoaderHive />
			) : (
				<div
					className={`${classes.portal_page_content} flex flex-col items-center justify-center fade-in`}
				>
					<PortalCard portal={portal} view={PortalCardView.DETAIL} />
					<TransactionList portal={portal} />
				</div>
			)}
		</div>
	)
}
