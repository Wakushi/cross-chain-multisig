"use client"
// Components
import { ColumnDef } from "@tanstack/react-table"
import Copy from "../ui/copy/copy"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBan,
  faCheck,
  faCheckDouble,
  faCircleInfo,
  faClock,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons"
import TooltipWrapper from "../ui/custom-tooltip"
import CustomToastAction, {
  ToastParams,
  TransactionToastTitle,
} from "../ui/custom-toast-action"
import { useToast } from "@/components/ui/use-toast"
import LoaderSmall from "../ui/loader-small/loader-small"
// Types
import { Token } from "@/types/Token"
import { Transaction, TransactionStatus } from "@/types/Transaction"
// Services and utils
import { formatUnits } from "viem"
import { useQueryClient } from "@tanstack/react-query"
import { PayFeesIn, TokenContext } from "@/services/TokenContext"
import { ChainContext, ContractCallType } from "@/services/ChainContext"
import {
  PORTALGATE_CONTRACT_ABI,
  PORTALSIG_WALLET_CONTRACT_ABI,
} from "@/constants/constants"
import { TransactionContext } from "@/services/TransactionsContext"
import { getShortenedAddress } from "@/lib/utils"
// React
import { useContext, useState } from "react"
import { PortalContext } from "@/services/PortalContext"
import Image from "next/image"
import { Chain } from "@/services/data/chains"

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "initiator",
    header: () => <div className="text-left">Initiator</div>,
    cell: ({ row }) => {
      return (
        <div className="text-left font-medium flex items-center">
          {getShortenedAddress(row.getValue("initiator"))}{" "}
          <Copy contentToCopy={row.getValue("initiator")} />
        </div>
      )
    },
  },
  {
    accessorKey: "destination",
    header: () => <div className="text-left">Destinator</div>,
    cell: ({ row }) => {
      return (
        <div className="text-left font-medium flex items-center">
          {getShortenedAddress(row.getValue("destination"))}{" "}
          <Copy contentToCopy={row.getValue("destination")} />
        </div>
      )
    },
  },
  {
    accessorKey: "destinationChainSelector",
    header: () => <div className="text-left">Destination Chain</div>,
    cell: ({ row }) => {
      const { getChainBySelector } = useContext(ChainContext)
      const chainMetadata = getChainBySelector(
        String(row.getValue("destinationChainSelector"))
      )

      return (
        <div className="font-light text-left flex items-center gap-1">
          <Image
            src={chainMetadata!.icon}
            alt={`${chainMetadata?.name} logo`}
            width={25}
            height={25}
          />
          <p className="text-nowrap">{chainMetadata?.name}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Token Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const { getTokenByAddress } = useContext(TokenContext)
      const tokenMetadata: Token | null = getTokenByAddress(row.original.token)
      const amount = formatUnits(
        row.getValue("amount"),
        tokenMetadata?.decimals ?? 18
      )

      if (!tokenMetadata?.symbol) {
        return (
          <div className="scale-75">
            <LoaderSmall />
          </div>
        )
      }

      return (
        <div className="text-nowrap text-center">
          <span>{amount}</span>{" "}
          <span className="text-xs">{tokenMetadata?.symbol}</span>{" "}
          <span>
            (
            <span className="brand">
              $
              {tokenMetadata?.price
                ? (tokenMetadata.price * +amount).toFixed(2)
                : 0}
            </span>
            )
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "numberOfConfirmations",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Confirmations
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {Number(row.getValue("numberOfConfirmations"))} /{" "}
          {row.original.portal.requiredConfirmationsAmount}
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created at
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const date = new Date(Number(row.getValue("createdAt")) * 1000)
      let options: Intl.DateTimeFormatOptions = {
        year: "2-digit",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
      return (
        <div className="text-center font-medium">
          {date.toLocaleString("en-US", options)}
        </div>
      )
    },
  },
  {
    accessorKey: "executedAt",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Executed at
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const timestamp = Number(row.getValue("executedAt"))

      if (!timestamp) {
        return <div className="text-center font-medium">-</div>
      }

      const date = new Date(timestamp * 1000)
      let options: Intl.DateTimeFormatOptions = {
        year: "2-digit",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
      return (
        <div className="text-center font-medium">
          {date.toLocaleString("en-US", options)}
        </div>
      )
    },
  },
  {
    accessorKey: "data",
    header: () => <div className="text-center">Data</div>,
    cell: ({ row }) => {
      const data: string =
        row.getValue("data") === "0x" ? "" : row.getValue("data")
      return (
        <div className="text-center font-medium">
          {data ? (
            data
          ) : (
            <TooltipWrapper message="No data associated to this transaction.">
              <FontAwesomeIcon icon={faBan} />
            </TooltipWrapper>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "executesOnRequirementMet",
    header: () => (
      <div className="text-center">
        Auto-execute{" "}
        <TooltipWrapper message="Determines if this transaction will execute as soon as enough confirmations are reached.">
          <FontAwesomeIcon icon={faCircleInfo} />
        </TooltipWrapper>
      </div>
    ),
    cell: ({ row }) => {
      const autoExecutes = row.getValue("executesOnRequirementMet")
        ? "Yes"
        : "No"
      return <div className="text-center font-medium">{autoExecutes}</div>
    },
  },
  {
    accessorKey: "status",
    id: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = (row.original as Transaction).status
      const getStatusIcon = (status: TransactionStatus): JSX.Element => {
        switch (status) {
          case TransactionStatus.EXECUTED:
            return (
              <FontAwesomeIcon
                icon={faCheckDouble}
                style={{ color: "#4af770", fontSize: "1.3rem" }}
              />
            )
          case TransactionStatus.APPROVED:
            return (
              <FontAwesomeIcon
                icon={faThumbsUp}
                style={{ color: "#9d45f5", fontSize: "1.3rem" }}
              />
            )
          case TransactionStatus.CONFIRMED:
            return (
              <FontAwesomeIcon
                icon={faCheck}
                style={{ color: "#5ce9ff", fontSize: "1.3rem" }}
              />
            )
          default:
            return (
              <FontAwesomeIcon
                icon={faClock}
                style={{ color: "#fff", fontSize: "1.3rem" }}
              />
            )
        }
      }
      return (
        <div className="flex justify-center">
          <TooltipWrapper message={`Status: ${status}`}>
            {getStatusIcon(status)}
          </TooltipWrapper>
        </div>
      )
    },
  },
  {
    accessorKey: "gasLimit",
    header: () => <div className="text-center">Gas Limit</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {Number(row.getValue("gasLimit"))}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { toast } = useToast()
      const queryClient = useQueryClient()
      const transaction = row.original

      const { getPortalTransactions, getExplorerUrl } =
        useContext(TransactionContext)
      const { callContract, getActiveChainData } = useContext(ChainContext)
      const { currentPortal } = useContext(PortalContext)
      const chain: Chain | null = getActiveChainData()

      const [isLoading, setIsLoading] = useState<boolean>(false)

      function refreshTransactions(): void {
        queryClient.invalidateQueries(["transactions", currentPortal?.address])
        getPortalTransactions()
      }

      async function onConfirm() {
        if (!currentPortal) return
        setIsLoading(true)
        try {
          let result
          if (chain && chain.chainId !== currentPortal.chain.chainId) {
            result = await callContract({
              contractAddress: chain.portalGateAddress,
              abi: PORTALGATE_CONTRACT_ABI,
              method: "confirmTransaction",
              args: [
                currentPortal.address,
                currentPortal.chain.chainSelector,
                transaction.id,
                PayFeesIn.LINK,
              ],
              type: ContractCallType.WRITE,
            })
          } else {
            result = await callContract({
              contractAddress: transaction.portal.address,
              abi: PORTALSIG_WALLET_CONTRACT_ABI,
              method: "confirmTransaction",
              args: [transaction.id],
              type: ContractCallType.WRITE,
            })
          }
          onCallCompleted(
            {
              title: TransactionToastTitle.CONFIRMED,
              description: "See on block explorer",
            },
            result.transactionHash,
            true
          )
        } catch (error: any) {
          onCallCompleted({
            title: TransactionToastTitle.ERROR,
            description: error.message,
          })
        } finally {
          setIsLoading(false)
        }
      }

      async function onRevoke() {
        if (!currentPortal) return
        setIsLoading(true)
        try {
          let result
          if (chain && chain.chainId !== currentPortal.chain.chainId) {
            result = await callContract({
              contractAddress: chain.portalGateAddress,
              abi: PORTALGATE_CONTRACT_ABI,
              method: "revokeConfirmation",
              args: [
                currentPortal.address,
                currentPortal.chain.chainSelector,
                transaction.id,
                PayFeesIn.LINK,
              ],
              type: ContractCallType.WRITE,
            })
          } else {
            result = await callContract({
              contractAddress: transaction.portal.address,
              abi: PORTALSIG_WALLET_CONTRACT_ABI,
              method: "revokeConfirmation",
              args: [transaction.id],
              type: ContractCallType.WRITE,
            })
          }
          onCallCompleted(
            {
              title: TransactionToastTitle.REVOKED,
              description: "See on block explorer",
            },
            result.transactionHash,
            true
          )
        } catch (error: any) {
          onCallCompleted({
            title: TransactionToastTitle.ERROR,
            description: error.message,
          })
        } finally {
          setIsLoading(false)
        }
      }

      async function onExecute() {
        if (!currentPortal) return
        setIsLoading(true)
        try {
          let result
          if (chain && chain.chainId !== currentPortal.chain.chainId) {
            result = await callContract({
              contractAddress: chain.portalGateAddress,
              abi: PORTALGATE_CONTRACT_ABI,
              method: "executeTransaction",
              args: [
                currentPortal.address,
                currentPortal.chain.chainSelector,
                transaction.id,
                PayFeesIn.LINK,
              ],
              type: ContractCallType.WRITE,
            })
          } else {
            result = await callContract({
              contractAddress: transaction.portal.address,
              abi: PORTALSIG_WALLET_CONTRACT_ABI,
              method: "executeTransaction",
              args: [transaction.id],
              type: ContractCallType.WRITE,
            })
          }
          onCallCompleted(
            {
              title: TransactionToastTitle.EXECUTED,
              description: "See on block explorer",
            },
            result.transactionHash,
            true
          )
        } catch (error: any) {
          onCallCompleted({
            title: TransactionToastTitle.ERROR,
            description: error.message,
          })
        } finally {
          setIsLoading(false)
        }
      }

      function onCallCompleted(
        { title, description }: ToastParams,
        transactionHash?: string,
        shouldRefreshTransactions: boolean = false
      ): void {
        toast({
          title,
          description,
          action: (
            <CustomToastAction
              url={getExplorerUrl(transactionHash ?? "", transaction)}
            />
          ),
        })
        if (shouldRefreshTransactions) {
          refreshTransactions()
        }
      }

      if (isLoading) {
        return (
          <div className="max-w-[30px] scale-75">
            <LoaderSmall />
          </div>
        )
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {transaction.status === TransactionStatus.EXECUTED && (
              <DropdownMenuItem>No action available</DropdownMenuItem>
            )}
            {transaction.status === TransactionStatus.WAITING_FOR_APPROVAL && (
              <DropdownMenuItem onClick={onConfirm}>Confirm</DropdownMenuItem>
            )}
            {(transaction.status === TransactionStatus.CONFIRMED ||
              transaction.status === TransactionStatus.APPROVED) && (
              <DropdownMenuItem onClick={onRevoke}>Revoke</DropdownMenuItem>
            )}
            {transaction.status === TransactionStatus.APPROVED && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onExecute}>Execute</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
