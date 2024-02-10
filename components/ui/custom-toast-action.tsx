import { ToastAction } from "./toast"

export enum TransactionToastTitle {
  CONFIRMED = "Transaction confirmed !",
  REVOKED = "Transaction revoked !",
  EXECUTED = "Transaction executed !",
  ERROR = "Something went wrong !",
}

export interface ToastParams {
  title: TransactionToastTitle
  description: string
}

interface CustomToastActionProps {
  url: string
}

export default function CustomToastAction({ url }: CustomToastActionProps) {
  return (
    <ToastAction
      altText="See details"
      onClick={() => window.open(url, "_blank")}
    >
      See details
    </ToastAction>
  )
}
