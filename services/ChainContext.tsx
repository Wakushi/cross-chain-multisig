"use client"
import { createContext, ReactNode, useState } from "react"
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

interface ChainContextProps {
  callContract: (params: ContractCallParams) => Promise<any>
  getChainBySelector: (chainSelector: string) => Chain | null
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

export interface ToastParams {
  title: string
  description: string
  transactionHash?: string
}

const ChainContext = createContext<ChainContextProps>({
  callContract: async () => {},
  getChainBySelector: () => null,
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
      return {
        name: chain.name,
        chainSelector: "0",
        chainId: chain.id.toString(),
        supportedTokens: [],
      }
    }
    return (
      registeredChains.find((chain) => chain.chainSelector === chainSelector) ||
      null
    )
  }

  //   function whitelistChain(chainSelector: string) {
  //     callContract({
  //       contractAddress: portal.address,
  //       abi: PORTALSIG_WALLET_CONTRACT_ABI,
  //       method: "allowlistDestinationChain",
  //       args: [chainSelector, true],
  //       type: ContractCallType.WRITE,
  //     })
  //   }

  const context = {
    callContract,
    getChainBySelector,
  }

  return (
    <ChainContext.Provider value={context}>
      {props.children}
    </ChainContext.Provider>
  )
}

export { ChainContext }
