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
import { PORTALSIG_FACTORIES, PortalSigFactory } from "@/constants/constants"

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
  getActiveChainFactoryData: () => PortalSigFactory | null
}

const ChainContext = createContext<ChainContextProps>({
  callContract: async () => {},
  getChainBySelector: () => null,
  getActiveChainFactoryData: () => null,
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
    if (chainSelector === "0" && chain) {
      return (
        registeredChains.find(
          (registeredChain) => +registeredChain.chainId === chain.id
        ) || null
      )
    }
    return (
      registeredChains.find((chain) => chain.chainSelector === chainSelector) ||
      null
    )
  }

  function getActiveChainFactoryData(): PortalSigFactory | null {
    if (!chain) return null
    const factory = PORTALSIG_FACTORIES.find(
      (factory) => factory.chainId === chain.id
    )
    return factory || null
  }

  const context = {
    callContract,
    getChainBySelector,
    getActiveChainFactoryData,
  }

  return (
    <ChainContext.Provider value={context}>
      {props.children}
    </ChainContext.Provider>
  )
}

export { ChainContext }
