"use client"

// Components
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoaderHive from "@/components/ui/loader-hive/loader-hive"
import TokenList from "@/components/token-list"

// Services
import { PortalContext } from "@/services/PortalContext"
import { TokenContext } from "@/services/TokenContext"

// Types
import { Token } from "@/types/Token"

// React
import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"

export default function DashboardPage() {
  const { getAllAddressTokens } = useContext(TokenContext)
  const { currentPortal } = useContext(PortalContext)

  const { data: tokens, isLoading } = useQuery<Token[], Error>(
    ["tokens", currentPortal?.address],
    () => {
      if (!currentPortal?.address) {
        throw new Error("Portal address is undefined")
      }
      return getAllAddressTokens(currentPortal.address)
    },
    {
      enabled: !!currentPortal?.address,
    }
  )

  if (isLoading) {
    return (
      <div className="min-h-[800px] flex items-center justify-center fade-in">
        <LoaderHive />
      </div>
    )
  }

  if (!tokens || !tokens.length) {
    return (
      <div className="min-h-[800px] flex items-center justify-center fade-in">
        <div className="flex flex-col gap-5 justify-center items-center">
          <p className="text-3xl">No tokens found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Card className="flex-1 min-h-[200px]"></Card>
        <Card className="flex-1 min-h-[200px]"></Card>
      </div>
      <Card className="flex-1 min-h-[500px] p-2">
        <Tabs defaultValue="tokens" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="tokens">
              Tokens
            </TabsTrigger>
            <TabsTrigger className="w-full" value="collectibles">
              Collectibles
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tokens" className="p-4">
            <TokenList tokens={tokens} />
          </TabsContent>
          <TabsContent value="collectibles" className="p-4">
            Collectibles
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
