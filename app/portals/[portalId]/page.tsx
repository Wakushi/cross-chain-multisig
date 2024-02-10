"use client"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PortalContext } from "@/services/PortalContext"
import { TokenContext } from "@/services/TokenContext"
import { Token } from "@/types/Token"
import Image from "next/image"
import { useContext, useEffect, useState } from "react"

export default function DashboardPage() {
  const { getAllAddressTokens } = useContext(TokenContext)
  const { currentPortal } = useContext(PortalContext)

  const [tokens, setTokens] = useState<Token[]>([])

  useEffect(() => {
    if (currentPortal) {
      getAllAddressTokens(currentPortal?.address).then((tokens: Token[]) => {
        setTokens(tokens)
      })
    }
  }, [currentPortal])

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
            <div className="flex items-center p-4">
              <h2 className="text-xl font-light flex-1">Tokens</h2>
              <h2 className="text-xl font-light flex-1">Price</h2>
              <h2 className="text-xl font-light flex-1">Value</h2>
            </div>
            <div className="flex flex-col gap-4">
              {tokens.map((token: Token) => (
                <Card
                  key={token.address}
                  className="border-none bg-slate-900 p-4 flex items-center"
                >
                  <div className="flex gap-4 items-center flex-1">
                    <div className="bg-slate-800 w-10 h-10 p-2 rounded">
                      <Image
                        src={token.logo ? token.logo : ""}
                        alt={token.name}
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-md">{token.symbol}</div>
                      <div className="text-sm brand">{token.balance}</div>
                    </div>
                  </div>
                  <div className="flex-1">Price</div>
                  <div className="flex-1">Value</div>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="collectibles" className="p-4">
            Collectibles
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
