"use client"
// Components
import { Card, CardContent } from "@/components/ui/card"
import MenuLink from "@/components/portal-details-page/menu-link"
import Copy from "@/components/ui/copy/copy"

// Services / Utils
import { PortalContext } from "@/services/PortalContext"
import { usePathname } from "next/navigation"
import { getShortenedAddress } from "@/lib/utils"
import { ReactNode, useContext, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Address } from "viem"

// Assets
import {
  faChartLine,
  faCircleChevronLeft,
  faGear,
  faMoneyBillTransfer,
  faPiggyBank,
  faRightLeft,
} from "@fortawesome/free-solid-svg-icons"
import { TokenContext } from "@/services/TokenContext"
import LoaderSmall from "@/components/ui/loader-small/loader-small"

interface PortalPageLayoutProps {
  children: ReactNode
  params: { portalId: Address }
}

export default function PortalPageLayout({
  params,
  children,
}: PortalPageLayoutProps) {
  const pathname = usePathname()
  const { setCurrentPortalByAddress } = useContext(PortalContext)
  const { getAddressTotalBalanceInUSD } = useContext(TokenContext)

  useEffect(() => {
    setCurrentPortalByAddress(params.portalId)
  }, [params.portalId])

  const { data: balance, isLoading } = useQuery<number, Error>(
    ["balance", params.portalId],
    () => {
      if (!params.portalId) {
        throw new Error("Portal address is undefined")
      }
      return getAddressTotalBalanceInUSD(params.portalId)
    },
    {
      enabled: !!params.portalId,
    }
  )

  function isActiveEndpoint(seekedPath: string): boolean {
    const path = pathname.split("/")
    if (path.length === 3) return seekedPath === "/"
    return path.includes(seekedPath)
  }

  function PortalBalance() {
    if (isLoading) {
      return (
        <div className="scale-75">
          <LoaderSmall />
        </div>
      )
    }
    if (balance !== undefined) {
      return (
        <span className="font-light text-3xl">
          {balance.toFixed(2) || "0.00"}
        </span>
      )
    }
  }

  return (
    <div className="flex flex-col items-center justify-center fade-in">
      <Card className="w-full min-h-screen rounded-none flex bg-transparent border-none">
        {/* MENU */}
        <div className="min-h-full flex flex-col gap-8 pt-6 bg-grey min-w-[250px] shadow-2xl border-r border-slate-50">
          {/* BALANCE */}
          <div className="flex flex-col gap-2 p-4 pt-20">
            <h2 className="text-xs font-light">BALANCE</h2>
            <div className="flex items-center gap-5">
              <span className="brand text-3xl">$</span> <PortalBalance />
            </div>
            <div className="flex items-center">
              <p className="font-extralight">
                {getShortenedAddress(params.portalId)}
              </p>
              <Copy contentToCopy={params.portalId} />
            </div>
          </div>
          {/* NAVIGATION */}
          <div className="flex flex-col">
            <MenuLink
              href="/portals"
              isActive={false}
              icon={faCircleChevronLeft}
            >
              Back to Portal list
            </MenuLink>
            <MenuLink
              href={`/portals/${params.portalId}`}
              isActive={isActiveEndpoint("/")}
              icon={faChartLine}
            >
              Dashboard
            </MenuLink>
            <MenuLink
              href={`/portals/${params.portalId}/transactions`}
              isActive={isActiveEndpoint("transactions")}
              icon={faRightLeft}
            >
              Transactions
            </MenuLink>
            <MenuLink
              href={`/portals/${params.portalId}/deposit`}
              isActive={isActiveEndpoint("deposit")}
              icon={faPiggyBank}
            >
              Deposit
            </MenuLink>
            <MenuLink
              href={`/portals/${params.portalId}/swap`}
              isActive={isActiveEndpoint("swap")}
              icon={faMoneyBillTransfer}
            >
              Swap
            </MenuLink>
            <MenuLink
              href={`/portals/${params.portalId}/settings`}
              isActive={isActiveEndpoint("settings")}
              icon={faGear}
            >
              Manage Portal
            </MenuLink>
          </div>
        </div>
        <CardContent className="p-6 pt-20 w-full overflow-scroll min-h-screen">
          <Card className="w-full h-fit">{children} </Card>
        </CardContent>
      </Card>
    </div>
  )
}
