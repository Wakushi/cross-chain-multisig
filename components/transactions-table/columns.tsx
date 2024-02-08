"use client"

import { PayFeesIn, TokenContext } from "@/services/TokenContext"
import { Token } from "@/types/Token"
import { Transaction } from "@/types/Transaction"
import { ColumnDef } from "@tanstack/react-table"
import { useContext } from "react"
import { formatUnits } from "viem"
import Copy from "../ui/copy/copy"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getShortenedAddress } from "@/lib/utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import TooltipWrapper from "../ui/custom-tooltip"

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
    accessorKey: "amount",
    header: () => <div className="text-left">Amount</div>,
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
    header: () => <div className="text-center">Confirmations</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {Number(row.getValue("numberOfConfirmations"))}
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
    header: "Data",
  },
  {
    accessorKey: "executed",
    header: () => <div className="text-center">Executed</div>,
    cell: ({ row }) => {
      const executed = row.getValue("executed") ? "Yes" : "No"
      return <div className="text-center font-medium">{executed}</div>
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
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(transaction.destination)
              }
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

//
