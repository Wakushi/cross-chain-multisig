"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classes from "./portal.module.scss"
import { faBackward } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import TooltipWrapper from "@/components/ui/custom-tooltip"
import { PortalContext } from "@/services/PortalContext"
import { useContext, useEffect, useState } from "react"
import { Portal } from "@/types/Portal"
import { Address } from "viem"
import LoaderHive from "@/components/ui/loader-hive/loader-hive"
import PortalCard from "@/components/portal-card/portal-card"
import { PortalCardView } from "@/types/PortalCardProps"

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
					className={`${classes.portal_page_content} flex items-center justify-center fade-in`}
				>
					<PortalCard portal={portal} view={PortalCardView.DETAIL} />
				</div>
			)}
		</div>
	)
}
