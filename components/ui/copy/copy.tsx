import classes from "./copy.module.scss"
import { useToast } from "@/components/ui/use-toast"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy } from "@fortawesome/free-solid-svg-icons"
import TooltipWrapper from "../custom-tooltip"

interface CopyProps {
  contentToCopy: string
  tooltipPosition?: "top" | "bottom" | "left" | "right"
}

export default function Copy({ contentToCopy, tooltipPosition }: CopyProps) {
  const { toast } = useToast()

  function copyToClipboard(e: any) {
    e.stopPropagation()
    navigator.clipboard.writeText(contentToCopy)
    toast({
      title: "Copied to clipboard",
    })
  }

  return (
    <TooltipWrapper side={tooltipPosition} message="Copy to clipboard">
      <FontAwesomeIcon
        className={classes.copy_icon}
        icon={faCopy}
        onClick={(e) => copyToClipboard(e)}
      />
    </TooltipWrapper>
  )
}
