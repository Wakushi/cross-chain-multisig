import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@/components/ui/tooltip"
import { ReactNode } from "react"

interface CustomTooltipProps {
	children: ReactNode
	message: string
}

export default function TooltipWrapper({
	children,
	message
}: CustomTooltipProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>{children}</TooltipTrigger>
				<TooltipContent>
					<p>{message}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
