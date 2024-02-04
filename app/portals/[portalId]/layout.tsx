"use client"
import { Card, CardContent } from "@/components/ui/card"
import LoaderHive from "@/components/ui/loader-hive/loader-hive"
import { PortalContext } from "@/services/PortalContext"
import { faChartLine, faRightLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode, useContext, useEffect, useState } from "react"
import { Address } from "viem"

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
            <Link
              href={`/portals/${params.portalId}`}
              className={`flex items-center gap-4 p-4 ${
                isActiveEndpoint("/") ? "link-active" : ""
              }`}
            >
              <FontAwesomeIcon
                className="icon text-slate-400"
                icon={faChartLine}
              />{" "}
              <span className="font-light text-sm text-slate-400">
                Dashboard
              </span>
            </Link>
            <Link
              href={`/portals/${params.portalId}/transactions`}
              className={`flex items-center gap-4 p-4 ${
                isActiveEndpoint("transactions") ? "link-active" : ""
              }`}
            >
              <FontAwesomeIcon
                className="icon text-slate-400"
                icon={faRightLeft}
              />{" "}
              <span className="font-light text-sm text-slate-400">
                Transactions
              </span>
            </Link>
          </div>
        </div>
        <CardContent className="p-6 pt-20 w-full min-h-screen border-white">
          <Card className="w-full h-full">{children} </Card>
        </CardContent>
      </Card>
    </div>
  )
}
