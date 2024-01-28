interface Chain {
	name: string
	chainId: string
	chainSelector: string
}

export const registeredChains: Chain[] = [
	{
		name: "Sepolia",
		chainId: "11155111",
		chainSelector: "16015286601757825753"
	},
	{
		name: "Optimism Goerli",
		chainId: "420",
		chainSelector: "2664363617261496610"
	},
	{
		name: "Polygon Mumbai",
		chainId: "80001",
		chainSelector: "12532609583862916517"
	},
	{
		name: "Fuji",
		chainId: "43113",
		chainSelector: "14767482510784806043"
	},
	{
		name: "BNB chain",
		chainId: "97",
		chainSelector: "13264668187771770619"
	},
	{
		name: "Base Goerli",
		chainId: "84531",
		chainSelector: "5790810961207155433"
	},
	{
		name: "Arbitrum Sepolia",
		chainId: "421614",
		chainSelector: "3478487238524512106"
	}
]
