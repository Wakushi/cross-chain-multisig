"use client"
// React
import { useContext, useEffect, useState } from "react"
// Services
import { PortalContext } from "@/services/PortalContext"
// Components
import LoaderHive from "@/components/ui/loader-hive/loader-hive"
import PortalList from "@/components/portal-list"

export default function PortalsPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { portals, getAllPortals } = useContext(PortalContext)

  useEffect(() => {
    async function getPortalSigs(): Promise<void> {
      setIsLoading(true)
      await getAllPortals()
      setIsLoading(false)
    }

    getPortalSigs()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center fade-in">
      {isLoading ? <LoaderHive /> : <PortalList portals={portals} />}
    </div>
  )
}
