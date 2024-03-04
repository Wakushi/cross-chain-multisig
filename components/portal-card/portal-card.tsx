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
import CreateTransactionDialog from "../create-transaction-dialog/create-transaction-dialog"
import TooltipWrapper from "../ui/custom-tooltip"
// Utils
import { getShortenedAddress } from "@/lib/utils"
import { Address } from "viem"
// Styles / Assets
import classes from "./portal-card.module.scss"
// Types
import { PortalCardProps, PortalCardView } from "@/types/PortalCardProps"
// Next / React
import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWallet } from "@fortawesome/free-solid-svg-icons"
import vectorImg from "@/assets/images/vector.png"

export default function PortalCard({ portal, view }: PortalCardProps) {
  const { address, owners, balance, numberOfTransactions, chain } = portal
  const router = useRouter()

  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", (e) => {
        const rect = container.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const dx = x - rect.width / 2
        const dy = y - rect.height / 2
        const tiltX = dy / rect.height
        const tiltY = -dx / rect.width

        container.style.setProperty("--x", `${x}px`)
        container.style.setProperty("--y", `${y}px`)
        container.style.setProperty("--rotateX", `${tiltX * 20}deg`)
        container.style.setProperty("--rotateY", `${tiltY * 20}deg`)
      })
    }
  }, [])

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
      } mouse-cursor-gradient-tracking`}
      onClick={() => navigateToPortal(address)}
      ref={containerRef}
    >
      <div className="relative z-[2]">
        <CardHeader>
          <CardTitle
            className={`${classes.title} flex items-center justify-between`}
          >
            <div>
              {getShortenedAddress(address)}
              <Copy tooltipPosition="bottom" contentToCopy={address} />
            </div>
            <div className="flex items-center gap-1">
              <TooltipWrapper
                side="left"
                message={`Portal deployed on ${chain.name}`}
              >
                <Image
                  src={chain.icon}
                  alt={`${chain.name} icon`}
                  width={40}
                  height={40}
                />
              </TooltipWrapper>
              <FontAwesomeIcon
                icon={faWallet}
                className={classes.wallet_icon}
              />
            </div>
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
                {owner} <Copy contentToCopy={owner} tooltipPosition="left" />
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="flex items-center">
            <p>{Number(balance).toFixed(4)} </p>
            <Image
              src={chain.icon}
              alt={`${chain.name} icon`}
              width={30}
              height={30}
            />
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
