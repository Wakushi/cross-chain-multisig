"use client"
// Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import LoaderHive from "../ui/loader-hive/loader-hive"
import CreateTransactionForm from "./create-transaction-form"
import CustomToastAction from "../ui/custom-toast-action"

// React
import { useContext, useEffect, useState } from "react"

// Wagmi / Viem
import { Address, parseUnits } from "viem"
import { getNetwork } from "@wagmi/core"

// Services & Utils
import { TokenContext } from "@/services/TokenContext"
import { PORTALSIG_WALLET_CONTRACT_ABI } from "@/constants/constants"
import { PortalContext } from "@/services/PortalContext"
import { TransactionContext } from "@/services/TransactionsContext"
import { ChainContext, ContractCallType } from "@/services/ChainContext"

// Types
import { Token } from "@/types/Token"
import { Transaction } from "@/types/Transaction"

export default function CreateTransactionDialog() {
  const { chain } = getNetwork()
  const { toast } = useToast()

  const { allSupportedTokens, getAllAddressTokens, getTokenByAddress } =
    useContext(TokenContext)
  const { currentPortal, isExternalChain } = useContext(PortalContext)
  const { fetchPortalTransactions, getExplorerUrl } =
    useContext(TransactionContext)
  const { callContract } = useContext(ChainContext)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [open, setOpen] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (currentPortal?.address && allSupportedTokens.length) {
      getAllAddressTokens(currentPortal.address).then(
        (portalTokens: Token[]) => {
          allSupportedTokens.map((chainSupportedTokens) => {
            if (+chainSupportedTokens.chainId === chain?.id) {
              chainSupportedTokens.supportedTokens = [...portalTokens]
            }
          })
          setIsLoading(false)
        }
      )
    }
  }, [allSupportedTokens])

  async function createTransaction(
    destination: Address,
    destinationChainSelector: string,
    token: Address,
    amount: string,
    data: string,
    executesOnRequirementMet: boolean,
    payFeesIn: string
  ): Promise<void> {
    if (!currentPortal) return
    try {
      destinationChainSelector = isExternalChain(destinationChainSelector)
        ? destinationChainSelector
        : "0"
      const tokenSent = getTokenByAddress(token)
      const result = await callContract({
        contractAddress: currentPortal.address,
        abi: PORTALSIG_WALLET_CONTRACT_ABI,
        method: "createTransaction",
        args: [
          destination,
          token,
          destinationChainSelector,
          parseUnits(amount, tokenSent?.decimals ?? 18),
          data,
          executesOnRequirementMet,
          payFeesIn,
          0,
        ],
        type: ContractCallType.WRITE,
      })
      setIsSubmitting(false)
      setOpen(false)
      fetchPortalTransactions()
      toast({
        title: "Transaction created !",
        description: "See on block explorer",
        action: (
          <CustomToastAction
            url={getExplorerUrl(result.transactionHash ?? "")}
          />
        ),
      })
    } catch (error: any) {
      setIsSubmitting(false)
      setOpen(false)
      toast({
        title: "Something went wrong !",
        description: error.message,
      })
    }
  }

  if (!currentPortal) {
    return <LoaderHive />
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen: boolean) => setOpen(isOpen)}>
      <DialogTrigger asChild>
        <Button>Create transaction</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] h-[700px] overflow-auto custom-scrollbar">
        {isSubmitting ? (
          <div className="flex flex-col items-center justify-center">
            <h2 className="translate-y-[150px] text-3xl font-bold">
              creating transaction...
            </h2>
            <LoaderHive />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create transaction</DialogTitle>
              <DialogDescription>
                Enter the details of the transaction you want to create.
              </DialogDescription>
            </DialogHeader>
            <CreateTransactionForm
              createTransaction={createTransaction}
              isLoading={isLoading}
              portalSigAddress={currentPortal?.address}
              setIsSubmitting={setIsSubmitting}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
