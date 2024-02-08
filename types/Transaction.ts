import { PayFeesIn } from "@/services/TokenContext"
import { Address } from "viem"
import { Portal } from "./Portal"

export interface Transaction {
  id: string
  destination: Address
  token: Address
  destinationChainSelector: string
  amount: bigint
  numberOfConfirmations: string
  gasLimit: string
  data: string
  executed: boolean
  executesOnRequirementMet: boolean
  payFeesIn: PayFeesIn
  status: TransactionStatus
  portal: Portal
}

export enum TransactionStatus {
  WAITING_FOR_APPROVAL = "Pending",
  CONFIRMED = "Confirmed",
  APPROVED = "Approved",
  EXECUTED = "Executed",
}
