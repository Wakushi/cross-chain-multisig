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
import CustomToastAction from "../ui/custom-toast-action"
import { useToast } from "@/components/ui/use-toast"
import LoaderSmall from "../ui/loader-small/loader-small"
// Types
import { Token } from "@/types/Token"
import { Transaction, TransactionStatus } from "@/types/Transaction"
// Services and utils
import { formatUnits } from "viem"
import { PayFeesIn, TokenContext } from "@/services/TokenContext"
import {
  ChainContext,
  ContractCallType,
  ToastParams,
} from "@/services/ChainContext"
import { PORTALSIG_WALLET_CONTRACT_ABI } from "@/constants/constants"
import { TransactionContext } from "@/services/TransactionsContext"
import { getShortenedAddress } from "@/lib/utils"
// React
import { useContext, useState } from "react"

export const columns: ColumnDef<Transaction>[] = [
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
        <div className="text-left font-medium flex items-center">
          {chainMetadata?.name}{" "}
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
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = formatUnits(row.getValue("amount"), 18)
      const { getTokenByAddress } = useContext(TokenContext)
      const tokenMetadata: Token | null = getTokenByAddress(row.original.token)
      return (
        <div className="text-left font-medium">
          {amount} {tokenMetadata?.symbol}
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
    accessorKey: "payFeesIn",
    header: () => <div className="text-center">Pay Fees In</div>,
    cell: ({ row }) => {
      const payFeesIn =
        row.getValue("payFeesIn") === PayFeesIn.LINK ? "LINK" : "ETH"
      return <div className="text-center font-medium">{payFeesIn}</div>
    },
  },
  {
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
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original
      const status = transaction.status
      const { toast } = useToast()
      const { fetchPortalTransactions } = useContext(TransactionContext)
      const { callContract } = useContext(ChainContext)

      const [isLoading, setIsLoading] = useState<boolean>(false)

      function refreshTransactions(): void {
        fetchPortalTransactions()
      }

      async function onConfirm() {
        setIsLoading(true)
        try {
          const result = await callContract({
            contractAddress: transaction.portal.address,
            abi: PORTALSIG_WALLET_CONTRACT_ABI,
            method: "confirmTransaction",
            args: [transaction.id],
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
            contractAddress: transaction.portal.address,
            abi: PORTALSIG_WALLET_CONTRACT_ABI,
            method: "revokeConfirmation",
            args: [transaction.id],
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
            contractAddress: transaction.portal.address,
            abi: PORTALSIG_WALLET_CONTRACT_ABI,
            method: "executeTransaction",
            args: [transaction.id],
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
            {status === TransactionStatus.EXECUTED && (
              <DropdownMenuItem>No action available</DropdownMenuItem>
            )}
            {status === TransactionStatus.WAITING_FOR_APPROVAL && (
              <DropdownMenuItem onClick={onConfirm}>Confirm</DropdownMenuItem>
            )}
            {(status === TransactionStatus.CONFIRMED ||
              status === TransactionStatus.APPROVED) && (
              <DropdownMenuItem onClick={onRevoke}>Revoke</DropdownMenuItem>
            )}
            {status === TransactionStatus.APPROVED && (
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
