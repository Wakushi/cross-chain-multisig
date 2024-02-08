"use client"
// Components
import { Card, CardContent } from "@/components/ui/card"
import MenuLink from "@/components/portal-details-page/menu-link"
import LoaderHive from "@/components/ui/loader-hive/loader-hive"
// Services / Utils
import { PortalContext } from "@/services/PortalContext"
import { usePathname } from "next/navigation"
import { ReactNode, useContext, useEffect, useState } from "react"
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
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    async function fetchPortal() {
      setIsLoading(true)
      await setCurrentPortalByAddress(params.portalId)
      setIsLoading(false)
    }
    fetchPortal()
  }, [])

  function isActiveEndpoint(seekedPath: string): boolean {
    const path = pathname.split("/")
    if (path.length === 3) return seekedPath === "/"
    return path.includes(seekedPath)
  }

  if (isLoading) {
    return <LoaderHive />
  }

  return (
    <div className="flex flex-col items-center justify-center fade-in">
      <Card className="w-full min-h-screen rounded-none flex bg-transparent border-none">
        {/* MENU */}
        <div className="min-h-full flex flex-col gap-8 pt-6 bg-grey min-w-[250px] shadow-2xl border-r border-slate-50">
          {/* BALANCE */}
          <div className="flex flex-col gap-2 p-4 pt-20">
            <h2 className="text-xs font-light">BALANCE</h2>
            <p className="text-3xl">
              <span className="brand">$</span>{" "}
              <span className="font-light">0.00</span>
            </p>
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
            <MenuLink // -> Chain whitelisting feature
              href={`/portals/${params.portalId}/settings`}
              isActive={isActiveEndpoint("settings")}
              icon={faGear}
            >
              Manage Portal
            </MenuLink>
          </div>
        </div>
        <CardContent className="p-6 pt-20 w-full min-h-screen border-white">
          <Card className="w-full h-fit">{children} </Card>
        </CardContent>
      </Card>
    </div>
  )
}
