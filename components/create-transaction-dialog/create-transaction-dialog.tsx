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

// React
import { useContext, useEffect, useState } from "react"

// Wagmi / Viem
import { Address, parseEther } from "viem"
import {
  getNetwork,
  prepareWriteContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core"

import { TokenContext } from "@/services/TokenContext"
import { Token } from "@/types/Token"
import { PORTALSIG_WALLET_CONTRACT_ABI } from "@/constants/constants"
import LoaderHive from "../ui/loader-hive/loader-hive"
import { PortalContext } from "@/services/PortalContext"
import { ZERO_ADDRESS } from "@/lib/utils"
import CreateTransactionForm from "./create-transaction-form"
import { TransactionContext } from "@/services/TransactionsContext"

interface CreateTransactionDialogProps {
  portalSigAddress: Address
}

export default function CreateTransactionDialog({
  portalSigAddress,
}: CreateTransactionDialogProps) {
  // Context & Utils
  const { chain } = getNetwork()
  const { toast } = useToast()
  const { allSupportedTokens, getAllAddressTokens } = useContext(TokenContext)
  const { isExternalChain } = useContext(PortalContext)
  const { fetchPortalTransactions } = useContext(TransactionContext)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [open, setOpen] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (portalSigAddress && allSupportedTokens.length) {
      getAllAddressTokens(portalSigAddress).then((portalTokens: Token[]) => {
        allSupportedTokens.map((chainSupportedTokens) => {
          if (+chainSupportedTokens.chainId === chain?.id) {
            chainSupportedTokens.supportedTokens = [...portalTokens]
            chainSupportedTokens.supportedTokens.unshift({
              address: ZERO_ADDRESS,
              name: "Ethereum",
              symbol: "ETH",
              decimals: 18,
            })
          }
        })
        setIsLoading(false)
      })
    }
  }, [allSupportedTokens])

  async function createTransaction(
    destination: string,
    destinationChainSelector: string,
    token: string,
    amount: string,
    data: string,
    executesOnRequirementMet: boolean,
    payFeesIn: string
  ): Promise<void> {
    try {
      destinationChainSelector = isExternalChain(destinationChainSelector)
        ? destinationChainSelector
        : "0"
      const { request } = await prepareWriteContract({
        address: portalSigAddress,
        abi: PORTALSIG_WALLET_CONTRACT_ABI,
        functionName: "createTransaction",
        args: [
          destination,
          token,
          destinationChainSelector,
          parseEther(amount),
          data,
          executesOnRequirementMet,
          payFeesIn,
          0,
        ],
      })
      const { hash } = await writeContract(request)
      const result = await waitForTransaction({ hash })
      setIsSubmitting(false)
      setOpen(false)
      fetchPortalTransactions(portalSigAddress)
      toast({
        title: "Transaction created !",
        description: result.transactionHash,
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

  return (
    <Dialog open={open} onOpenChange={(isOpen: boolean) => setOpen(isOpen)}>
      <DialogTrigger asChild>
        <Button>Create transaction</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] h-[700px] overflow-auto custom-scrollbar">
        {isSubmitting ? (
          <div className="flex flex-col items-center justify-center">
            <p className="mb-[22rem] text-center font-light text-2xl">
              Creating transaction...
            </p>
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
              portalSigAddress={portalSigAddress}
              setIsSubmitting={setIsSubmitting}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
