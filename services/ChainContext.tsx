"use client"
import { createContext, ReactNode } from "react"
import { Address } from "viem"
import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
  readContract,
  getNetwork,
} from "@wagmi/core"
import { Chain, registeredChains } from "@/services/data/chains"

interface ChainContextProviderProps {
  children: ReactNode
}

export enum ContractCallType {
  READ = "READ",
  WRITE = "WRITE",
}

export interface ContractCallParams {
  contractAddress: Address
  abi: any
  method: string
  args: any[]
  type: ContractCallType
}

interface ChainContextProps {
  callContract: (params: ContractCallParams) => Promise<any>
  getChainBySelector: (chainSelector: string) => Chain | null
  getActiveChainData: () => Chain | null
}

const ChainContext = createContext<ChainContextProps>({
  callContract: async () => {},
  getChainBySelector: () => null,
  getActiveChainData: () => null,
})

export default function ChainContextProvider(props: ChainContextProviderProps) {
  const { chain } = getNetwork()

  async function callContract({
    contractAddress,
    abi,
    method,
    args,
    type,
  }: ContractCallParams): Promise<any> {
    const payload = {
      address: contractAddress,
      abi,
      functionName: method,
      args,
    }

    if (type === ContractCallType.READ) {
      const result: any = await readContract(payload)
      return result
    }

    if (type === ContractCallType.WRITE) {
      const { request } = await prepareWriteContract(payload)
      const { hash } = await writeContract(request)
      const result = await waitForTransaction({ hash })
      return result
    }
  }

  function getChainBySelector(chainSelector: string): Chain | null {
    return (
      registeredChains.find((chain) => chain.chainSelector === chainSelector) ||
      null
    )
  }

  function getActiveChainData(): Chain | null {
    if (!chain) return null
    const factory = registeredChains.find(
      (registeredChain) => +registeredChain.chainId === chain.id
    )
    return factory || null
  }

  const context = {
    callContract,
    getChainBySelector,
    getActiveChainData,
  }

  return (
    <ChainContext.Provider value={context}>
      {props.children}
    </ChainContext.Provider>
  )
}

export { ChainContext }
