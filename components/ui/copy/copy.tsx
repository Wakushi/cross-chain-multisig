import classes from "./copy.module.scss"
import { useToast } from "@/components/ui/use-toast"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy } from "@fortawesome/free-solid-svg-icons"

interface CopyProps {
	contentToCopy: string
}

export default function Copy({ contentToCopy }: CopyProps) {
	const { toast } = useToast()

	function copyToClipboard(e: any) {
		e.stopPropagation()
		navigator.clipboard.writeText(contentToCopy)
		toast({
			title: "Copied to clipboard"
		})
	}

	return (
		<FontAwesomeIcon
			className={classes.copy_icon}
			icon={faCopy}
			onClick={(e) => copyToClipboard(e)}
		/>
	)
}
