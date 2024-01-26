import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classes from "./portal.module.scss"
import { faBackward } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import TooltipWrapper from "@/components/ui/custom-tooltip"

export default function PortalPage({
	params
}: {
	params: { portalId: string }
}) {
	return (
		<div className={`${classes.portal_page}`}>
			<TooltipWrapper message="Back to portals">
				<Link href="/portals">
					<FontAwesomeIcon
						icon={faBackward}
						className={`${classes.fas} fas`}
						style={{ color: "#fff" }}
					></FontAwesomeIcon>
				</Link>
			</TooltipWrapper>

			<div
				className={`${classes.portal_page_content} flex items-center justify-center fade-in`}
			>
				{params.portalId}
			</div>
		</div>
	)
}
