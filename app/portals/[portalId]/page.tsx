"use client"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PortalPage() {
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
            Tokens
          </TabsContent>
          <TabsContent value="collectibles" className="p-4">
            Collectibles
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
