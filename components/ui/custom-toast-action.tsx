import { registeredChains } from "@/services/data/chains"
import { ToastAction } from "./toast"
import { getNetwork } from "@wagmi/core"

interface CustomToastActionProps {
  transactionHash: string
}

export default function CustomToastAction({
  transactionHash,
}: CustomToastActionProps) {
  const { chain } = getNetwork()

  function getExplorerUrl(transactionHash: string) {
    const chainData = registeredChains.find(
      (registeredChain) => +registeredChain.chainId === chain?.id
    )
    if (!chainData) {
      return ""
    }
    return chainData.explorerUrl + transactionHash
  }

  return (
    <ToastAction
      altText="See details"
      onClick={() => window.open(getExplorerUrl(transactionHash), "_blank")}
    >
      See details
    </ToastAction>
  )
}
