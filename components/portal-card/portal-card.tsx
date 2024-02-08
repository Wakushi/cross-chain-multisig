"use client"
// Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Copy from "../ui/copy/copy"
// Utils
import { getShortenedAddress } from "@/lib/utils"
import { Address } from "viem"
// Styles / Assets
import classes from "./portal-card.module.scss"
import ethIcon from "../../assets/icons/ethereum.svg"
// Types
import { PortalCardProps, PortalCardView } from "@/types/PortalCardProps"
// Next / React
import Image from "next/image"
import { useRouter } from "next/navigation"
import CreateTransactionDialog from "../create-transaction-dialog/create-transaction-dialog"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWallet } from "@fortawesome/free-solid-svg-icons"
import vectorImg from "@/assets/images/vector.png"

export default function PortalCard({ portal, view }: PortalCardProps) {
  const { address, owners, balance, numberOfTransactions } = portal
  const router = useRouter()

  function navigateToPortal(portalAddress: Address): void {
    router.push(`/portals/${portalAddress}`)
  }

  function isDetailedView(): boolean {
    return view === PortalCardView.DETAIL
  }

  return (
    <Card
      key={address}
      className={`${classes.portal_card} ${
        isDetailedView() ? classes.detail : classes.small
      }`}
      onClick={() => navigateToPortal(address)}
    >
      <div className="relative z-[2]">
        <CardHeader>
          <CardTitle className={`${classes.title} flex justify-between`}>
            <div>
              {getShortenedAddress(address)}
              <Copy contentToCopy={address} />
            </div>
            <FontAwesomeIcon icon={faWallet} className={classes.wallet_icon} />
          </CardTitle>
          <CardDescription>
            {numberOfTransactions} transaction
            {+numberOfTransactions > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h3>Owners</h3>
          <ul className={classes.owner_list}>
            {owners?.map((owner: Address) => (
              <li key={owner}>
                {owner} <Copy contentToCopy={owner} />
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="flex items-center">
            <p>{balance} </p>
            <Image src={ethIcon} alt="Ethereum logo" width={30} height={30} />
          </div>
          {isDetailedView() && <CreateTransactionDialog />}
        </CardFooter>
      </div>
      <div className={classes.background}>
        <Image src={vectorImg} alt="Background lines" />
      </div>
    </Card>
  )
}
