import { createContext, ReactNode, useEffect, useState } from "react"
import { Address } from "viem"
import { PORTALSIG_WALLET_CONTRACT_ABI } from "@/constants/constants"
import { readContract, fetchToken, getNetwork } from "@wagmi/core"
import { registeredChains } from "./data/chains"
import { Token } from "@/types/Token"

interface ChainSupportedTokens {
	chainId: string
	chainSelector: string
	supportedTokens: Token[]
}

interface TokenContextProviderProps {
	children: ReactNode
}

interface TokenContextProps {
	allSupportedTokens: ChainSupportedTokens[]
}

const TokenContext = createContext<TokenContextProps>({
	allSupportedTokens: []
})
export default function TokenContextProvider(props: TokenContextProviderProps) {
	const [allSupportedTokens, setAllSupportedTokens] = useState<
		ChainSupportedTokens[]
	>([])

	useEffect(() => {
		async function getChainsSupportedTokens() {
			const { chain } = getNetwork()
			const allSupportedTokens: ChainSupportedTokens[] = []
			for (let registeredChain of registeredChains) {
				const supportedTokens: Token[] = []
				if (+registeredChain.chainId !== chain?.id) {
					const supportedTokensAddresses = await getSupportedTokens(
						registeredChain.chainSelector
					)
					for (let tokenAddress of supportedTokensAddresses) {
						const token = await fetchToken({
							address: tokenAddress
						})
						supportedTokens.push(token)
					}
				}
				allSupportedTokens.push({
					chainId: registeredChain.chainId,
					chainSelector: registeredChain.chainSelector,
					supportedTokens: supportedTokens
				})
			}
			setAllSupportedTokens(allSupportedTokens)
			console.log("Fetched all tokens !", allSupportedTokens)
		}

		getChainsSupportedTokens()
	}, [])

	async function getSupportedTokens(
		chainSelector: string
	): Promise<Address[]> {
		const supportedTokens: any = await readContract({
			address: "0x7e41fED39d9fe7b52271c2866135cEE767DC780f",
			abi: PORTALSIG_WALLET_CONTRACT_ABI,
			functionName: "getSupportedTokens",
			args: [chainSelector]
		})
		return supportedTokens
	}

	const context = {
		allSupportedTokens
	}

	return (
		<TokenContext.Provider value={context}>
			{props.children}
		</TokenContext.Provider>
	)
}

export { TokenContext }
