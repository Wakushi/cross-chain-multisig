"use client"
// Components
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoaderHive from "@/components/ui/loader-hive/loader-hive"
import TokenList from "@/components/token-list"
import TokenDoughnutChart from "@/components/doughnut-chart"

// Services
import { PortalContext } from "@/services/PortalContext"
import { TokenContext } from "@/services/TokenContext"

// React
import { useContext } from "react"

export default function DashboardPage() {
  const { portalTokens, isLoading } = useContext(TokenContext)

  function hasToken(): boolean {
    const hasToken = portalTokens?.find(
      (token) => token.balance && +token.balance > 0
    )
    return !!hasToken
  }

  if (isLoading) {
    return (
      <div className="min-h-[800px] flex items-center justify-center fade-in">
        <LoaderHive />
      </div>
    )
  }

  if (!portalTokens || !portalTokens.length) {
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
      {hasToken() && (
        <div className="flex items-center gap-4">
          <Card className=" h-[235px]">
            <TokenDoughnutChart tokens={portalTokens} />
          </Card>
        </div>
      )}
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
            <TokenList tokens={portalTokens} />
          </TabsContent>
          <TabsContent value="collectibles" className="p-4">
            <div className="flex items-center justify-center">
              <p>No collectible found.</p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
