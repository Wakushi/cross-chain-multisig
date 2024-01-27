import { Portal } from "./Portal"

export enum PortalCardView {
	SMALL = "SMALL",
	DETAIL = "DETAIL"
}

export interface PortalCardProps {
	portal: Portal
	view: PortalCardView
}
