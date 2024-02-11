import { Token } from "@/types/Token"
import { Card } from "./ui/card"
import Image from "next/image"
import tokenFallback from "@/assets/icons/token-fallback.svg"

interface TokenListProps {
  tokens: Token[]
}

export default function TokenList({ tokens }: TokenListProps) {
  return (
    <>
      <div className="flex items-center mb-2">
        <h2 className="text-lg font-light flex-1">Tokens</h2>
        <h2 className="text-lg font-light flex-1">Unit price (USD)</h2>
        <h2 className="text-lg font-light flex-1">Value in USD</h2>
      </div>
      <div className="flex flex-col gap-4">
        {tokens.map((token: Token) => (
          <Card
            key={token.address}
            className="border-none bg-slate-900 p-4 flex items-center shadow-xl"
          >
            <div className="flex gap-4 items-center flex-1">
              <div className="bg-slate-800 w-10 h-10 p-2 rounded">
                <Image
                  src={token.logo ? token.logo : tokenFallback.src}
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
            <div className="flex-1 brand">${token.price?.toFixed(4) ?? 0}</div>
            <div className="flex-1">${token.value?.toFixed(4) ?? 0}</div>
          </Card>
        ))}
      </div>
    </>
  )
}
