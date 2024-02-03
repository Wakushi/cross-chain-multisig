"use client"
// Types
import { Transaction, TransactionStatus } from "@/types/Transaction"
import { Token } from "@/types/Token"
// Components
import { Card, CardFooter } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import Copy from "../ui/copy/copy"
import LoaderHive from "../ui/loader-hive/loader-hive"
import { useToast } from "@/components/ui/use-toast"
// Utils
import { getShortenedAddress } from "@/lib/utils"
// Services
import { PayFeesIn, TokenContext } from "@/services/TokenContext"
// React
import { useContext, useEffect, useState } from "react"
import { PORTALSIG_WALLET_CONTRACT_ABI } from "@/constants/constants"
// Wagmi / Viem
import { Address, formatUnits } from "viem"
import { useAccount } from "wagmi"
// Styles
import classes from "./transaction-card.module.scss"
import { Portal } from "@/types/Portal"
import {
  ChainContext,
  ContractCallType,
  ToastParams,
} from "@/services/ChainContext"
import CustomToastAction from "../ui/custom-toast-action"

interface TransactionCardProps {
  transactionId: number
  transaction: Transaction
  portalSig: Portal
  fetchPortalTransactions: (portalAddress: Address) => Promise<void>
}

export default function TransactionCard({
  transactionId,
  transaction,
  portalSig,
  fetchPortalTransactions,
}: TransactionCardProps) {
  const { address } = useAccount()
  const { toast } = useToast()

  const { callContract, getChainBySelector } = useContext(ChainContext)
  const { getTokenByAddress } = useContext(TokenContext)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isConfirmedByAccount, setIsConfirmedByAccount] =
    useState<boolean>(false)

  const {
    destination,
    token,
    destinationChainSelector,
    amount,
    numberOfConfirmations,
    gasLimit,
    data,
    executed,
    executesOnRequirementMet,
    payFeesIn,
  } = transaction

  const tokenMetadata: Token | null = getTokenByAddress(token)

  useEffect(() => {
    if (address) {
      checkConfirmedByAccount(address)
    }
  }, [address, transaction])

  async function onConfirm() {
    setIsLoading(true)
    try {
      const result = await callContract({
        contractAddress: portalSig.address,
        abi: PORTALSIG_WALLET_CONTRACT_ABI,
        method: "confirmTransaction",
        args: [transactionId],
        type: ContractCallType.WRITE,
      })
      onCallCompleted(
        {
          title: "Transaction confirmed !",
          transactionHash: result.transactionHash,
          description: "See on block explorer",
        },
        true
      )
    } catch (error: any) {
      onCallCompleted({
        title: "Something went wrong !",
        description: error.message,
      })
    }
  }

  async function onRevoke() {
    setIsLoading(true)
    try {
      const result = await callContract({
        contractAddress: portalSig.address,
        abi: PORTALSIG_WALLET_CONTRACT_ABI,
        method: "revokeConfirmation",
        args: [transactionId],
        type: ContractCallType.WRITE,
      })
      onCallCompleted(
        {
          title: "Transaction revoked !",
          transactionHash: result.transactionHash,
          description: "See on block explorer",
        },
        true
      )
    } catch (error: any) {
      onCallCompleted({
        title: "Something went wrong !",
        description: error.message,
      })
    }
  }

  async function onExecute() {
    setIsLoading(true)
    try {
      const result = await callContract({
        contractAddress: portalSig.address,
        abi: PORTALSIG_WALLET_CONTRACT_ABI,
        method: "executeTransaction",
        args: [transactionId],
        type: ContractCallType.WRITE,
      })
      onCallCompleted(
        {
          title: "Transaction executed !",
          transactionHash: result.transactionHash,
          description: "See on block explorer",
        },
        true
      )
    } catch (error: any) {
      onCallCompleted({
        title: "Something went wrong !",
        description: error.message,
      })
    }
  }

  async function checkConfirmedByAccount(
    accountAddress: Address
  ): Promise<void> {
    if (!accountAddress) return
    const isConfirmed: any = await callContract({
      contractAddress: portalSig.address,
      abi: PORTALSIG_WALLET_CONTRACT_ABI,
      method: "isConfirmedByAccount",
      args: [transactionId, accountAddress],
      type: ContractCallType.READ,
    })
    setIsLoading(false)
    setIsConfirmedByAccount(isConfirmed)
  }

  function refreshTransactions(): void {
    fetchPortalTransactions(portalSig.address)
  }

  function onCallCompleted(
    { title, description, transactionHash }: ToastParams,
    shouldRefreshTransactions: boolean = false
  ): void {
    toast({
      title,
      description,
      action: <CustomToastAction transactionHash={transactionHash ?? ""} />,
    })
    setIsLoading(false)
    if (shouldRefreshTransactions) {
      refreshTransactions()
    }
  }

  function getTransactionStatus(): TransactionStatus {
    if (executed) {
      return TransactionStatus.EXECUTED
    } else if (hasEnoughConfirmations()) {
      return TransactionStatus.APPROVED
    } else if (isConfirmedByAccount) {
      return TransactionStatus.CONFIRMED
    }
    return TransactionStatus.WAITING_FOR_APPROVAL
  }

  function hasEnoughConfirmations(): boolean {
    return (
      numberOfConfirmations.toString() ===
      portalSig?.requiredConfirmationsAmount
    )
  }

  function getCardClassName(): string {
    if (executed) {
      return classes.executed
    }
    if (hasEnoughConfirmations()) {
      return classes.approved
    }
    if (isConfirmedByAccount) {
      return classes.confirmed
    }
    return ""
  }

  return (
    <Card
      className={`${
        classes.transaction_card
      } ${getCardClassName()} w-[375px] min-h-[380px] h-fit relative shadow-xl bg-blue-950/50 rounded-lg p-6 text-white fade-in`}
    >
      {isLoading ? (
        <LoaderHive />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-nowrap">
              Transaction n°{transactionId}
            </h3>
            <div className="flex items-center">
              <p>Status:</p>
              <Badge className="ml-2">{getTransactionStatus()}</Badge>
            </div>
          </div>
          <Separator className="mb-4" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p>
                Destinator:{" "}
                <span className="text-gray-300 font-light">
                  {getShortenedAddress(destination)}
                </span>
              </p>
              <Copy contentToCopy={destination} />
            </div>
            <Separator className="mb-1" />
            <div className="flex h-5 items-center justify-between space-x-4">
              <p>
                Chain:{" "}
                <span className="text-gray-300 font-light">
                  {getChainBySelector(destinationChainSelector.toString())
                    ?.name ?? destinationChainSelector}
                </span>
              </p>
              <Separator orientation="vertical" />
              <p>
                Amount:{" "}
                <span className="text-gray-300 font-light">
                  {formatUnits(amount, 18)} {tokenMetadata?.symbol}
                </span>
              </p>
            </div>
            <Separator className="mb-1" />
            <p>
              Confirmations:{" "}
              <span className="text-gray-300 font-light">
                {numberOfConfirmations.toString()} /{" "}
                {portalSig?.requiredConfirmationsAmount}
              </span>
            </p>
            <Separator className="mb-1" />
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Details</AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <p className="flex justify-between">
                    Data{" "}
                    <span className="text-gray-300 font-light">
                      {data === "0x" ? "none" : data}
                    </span>
                  </p>
                  <Separator className="mb-1" />
                  <p className="flex justify-between">
                    Gas Limit{" "}
                    <span className="text-gray-300 font-light">
                      {gasLimit.toString()}
                    </span>
                  </p>

                  <Separator className="mb-1" />
                  <p className="flex justify-between">
                    Executes automatically{" "}
                    <span className="text-gray-300 font-light">
                      {executesOnRequirementMet ? "Yes" : "No"}
                    </span>
                  </p>
                  <Separator className="mb-1" />
                  <p className="flex justify-between">
                    Pay Fees In{" "}
                    <span className="text-gray-300 font-light">
                      {payFeesIn === PayFeesIn.NATIVE ? "Native token" : "Link"}
                    </span>
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          {!executed && (
            <CardFooter className="flex p-0 mt-[24px] justify-end gap-4">
              {isConfirmedByAccount ? (
                <Button onClick={onRevoke}>Revoke</Button>
              ) : (
                <Button onClick={onConfirm}>Confirm</Button>
              )}
              {hasEnoughConfirmations() && (
                <Button onClick={onExecute}>Execute</Button>
              )}
            </CardFooter>
          )}
        </>
      )}
    </Card>
  )
}
