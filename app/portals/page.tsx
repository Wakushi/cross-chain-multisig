"use client"
// React
import { useContext } from "react"

// Services
import { PortalContext } from "@/services/PortalContext"

// Components
import LoaderHive from "@/components/ui/loader-hive/loader-hive"
import PortalList from "@/components/portal-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PortalsPage() {
  const { portals, isLoading } = useContext(PortalContext)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center fade-in">
        <LoaderHive />
      </div>
    )
  }

  if (!portals || !portals.length) {
    return (
      <div className="min-h-screen flex items-center justify-center fade-in">
        <div className="flex flex-col gap-5 justify-center items-center">
          <p className="text-3xl">No portal found</p>
          <Link href="create">
            <Button variant="outline">Create a portal</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center fade-in">
      <PortalList portals={portals} />
    </div>
  )
}
