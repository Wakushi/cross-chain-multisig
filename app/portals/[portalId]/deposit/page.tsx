"use client"

// Components
import Copy from "@/components/ui/copy/copy"
import LoaderHive from "@/components/ui/loader-hive/loader-hive"

// Service
import { PortalContext } from "@/services/PortalContext"
import { Chain, registeredChains } from "@/services/data/chains"

// React
import Image from "next/image"
import { useContext } from "react"

export default function DepositPage() {
  const { currentPortal } = useContext(PortalContext)

  if (!currentPortal) {
    return <LoaderHive />
  }

  return (
    <div className="p-8 h-full flex flex-col justify-center items-center gap-8">
      <div className="flex flex-col justify-center items-center gap-4">
        <h1 className="text-3xl">Deposit Tokens</h1>
        <p className="brand">
          Send ETH, tokens or collectibles (NFTs) to this address:{" "}
        </p>
        <div className="flex items-center gap-2 border rounded-sm p-2 bg-slate-900">
          <p className="font-light">{currentPortal?.address}</p>
          <Copy contentToCopy={currentPortal?.address} />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        <h2 className="text-xl mb-2">Supported chains</h2>
        <div className="flex flex-wrap justify-center items-center gap-4 max-w-[800px]">
          {registeredChains.map((chain: Chain) => {
            return (
              <div
                key={chain.chainId}
                className="flex flex-col min-w-[160px] min-h-[160px] justify-center items-center gap-2 border rounded-sm p-2 bg-slate-900"
              >
                <Image
                  src={chain.icon}
                  alt={`${chain.name} logo`}
                  width={50}
                  height={50}
                />
                <p>{chain.name}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
