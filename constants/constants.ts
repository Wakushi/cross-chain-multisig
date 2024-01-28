export const PORTALSIG_FACTORY_CONTRACT_ADDRESS =
	"0x834e8C4293EEa77A742F6E8657FeD3DF8d80BDc7"

export const SEPOLIA_CCIP_ROUTER_CONTRACT_ADDRESS =
	"0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"
export const SEPOLIA_LINK_CONTRACT_ADDRESS =
	"0x779877A7B0D9E8603169DdbD7836e478b4624789"

export const PORTALSIG_FACTORY_CONTRACT_ABI = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address[]",
				name: "_owners",
				type: "address[]"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "_requiredConfirmationsAmount",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "address",
				name: "contractAddress",
				type: "address"
			}
		],
		name: "PortalSigWalletDeployed",
		type: "event"
	},
	{
		inputs: [
			{
				internalType: "address[]",
				name: "_owners",
				type: "address[]"
			},
			{
				internalType: "uint256",
				name: "_requiredConfirmationsAmount",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "_ccipRouterAddress",
				type: "address"
			},
			{
				internalType: "address",
				name: "_linkAddress",
				type: "address"
			}
		],
		name: "deployPortalSigWallet",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_owner",
				type: "address"
			}
		],
		name: "getWalletsByOwner",
		outputs: [
			{
				internalType: "address[]",
				name: "",
				type: "address[]"
			}
		],
		stateMutability: "view",
		type: "function"
	}
]

export const PORTALSIG_WALLET_CONTRACT_ABI = [
	{
		inputs: [
			{
				internalType: "address[]",
				name: "_owners",
				type: "address[]"
			},
			{
				internalType: "uint256",
				name: "_requiredConfirmationsAmount",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "_ccipRouterAddress",
				type: "address"
			},
			{
				internalType: "address",
				name: "_linkAddress",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "transactionId",
				type: "uint256"
			}
		],
		name: "PortalSig__AlreadyConfirmed",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "transactionId",
				type: "uint256"
			}
		],
		name: "PortalSig__AlreadyExecuted",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "uint64",
				name: "destinationChainSelector",
				type: "uint64"
			}
		],
		name: "PortalSig__DestinationChainNotAllowlisted",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "requiredConfirmations",
				type: "uint256"
			}
		],
		name: "PortalSig__InvalidConfirmationAmount",
		type: "error"
	},
	{
		inputs: [],
		name: "PortalSig__InvalidOwnerAddress",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "transactionId",
				type: "uint256"
			}
		],
		name: "PortalSig__InvalidTransactionId",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "ownersLength",
				type: "uint256"
			}
		],
		name: "PortalSig__NeedAtLeastTwoOwners",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "transactionId",
				type: "uint256"
			}
		],
		name: "PortalSig__NotConfirmed",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "currentBalance",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "calculatedFees",
				type: "uint256"
			}
		],
		name: "PortalSig__NotEnoughBalanceForFees",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "transactionId",
				type: "uint256"
			}
		],
		name: "PortalSig__NotEnoughConfirmations",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "PortalSig__NotOwner",
		type: "error"
	},
	{
		inputs: [],
		name: "PortalSig__OwnerNotUnique",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "requiredConfirmations",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "ownersLength",
				type: "uint256"
			}
		],
		name: "PortalSig__RequiredConfirmationsGreaterThanOwnersLength",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "transactionId",
				type: "uint256"
			}
		],
		name: "PortalSig__TransactionExecutionFailed",
		type: "error"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "messageId",
				type: "bytes32"
			},
			{
				indexed: false,
				internalType: "uint64",
				name: "destinationChainSelector",
				type: "uint64"
			},
			{
				indexed: false,
				internalType: "address",
				name: "receiver",
				type: "address"
			},
			{
				indexed: false,
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "enum Portal.PayFeesIn",
				name: "payFeesIn",
				type: "uint8"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "fees",
				type: "uint256"
			}
		],
		name: "MessageSent",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "transactionId",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "TransactionConfirmationRevoked",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "transactionId",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "TransactionConfirmed",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "destination",
				type: "address"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "uint64",
				name: "destinationChainSelector",
				type: "uint64"
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "TransactionCreated",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "transactionId",
				type: "uint256"
			}
		],
		name: "TransactionExecuted",
		type: "event"
	},
	{
		stateMutability: "payable",
		type: "fallback"
	},
	{
		inputs: [
			{
				internalType: "uint64",
				name: "_destinationChainSelector",
				type: "uint64"
			},
			{
				internalType: "bool",
				name: "allowed",
				type: "bool"
			}
		],
		name: "allowlistDestinationChain",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_transactionId",
				type: "uint256"
			}
		],
		name: "confirmTransaction",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_destination",
				type: "address"
			},
			{
				internalType: "address",
				name: "_token",
				type: "address"
			},
			{
				internalType: "uint64",
				name: "_destinationChainSelector",
				type: "uint64"
			},
			{
				internalType: "uint256",
				name: "_amount",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "_data",
				type: "bytes"
			},
			{
				internalType: "bool",
				name: "_executesOnRequirementMet",
				type: "bool"
			},
			{
				internalType: "enum Portal.PayFeesIn",
				name: "_payFeesIn",
				type: "uint8"
			},
			{
				internalType: "uint256",
				name: "_gasLimit",
				type: "uint256"
			}
		],
		name: "createTransaction",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_transactionId",
				type: "uint256"
			}
		],
		name: "executeTransaction",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_receiver",
				type: "address"
			},
			{
				internalType: "address",
				name: "_token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "_amount",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "_data",
				type: "bytes"
			},
			{
				internalType: "enum Portal.PayFeesIn",
				name: "_payFeesIn",
				type: "uint8"
			},
			{
				internalType: "uint256",
				name: "_gasLimit",
				type: "uint256"
			},
			{
				internalType: "uint64",
				name: "_destinationChainSelector",
				type: "uint64"
			}
		],
		name: "getMessageFee",
		outputs: [
			{
				internalType: "uint256",
				name: "fees",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "getOwners",
		outputs: [
			{
				internalType: "address[]",
				name: "",
				type: "address[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "getRequiredConfirmationsAmount",
		outputs: [
			{
				internalType: "uint256",
				name: "requiredConfirmationsAmount",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint64",
				name: "_chainSelector",
				type: "uint64"
			}
		],
		name: "getSupportedTokens",
		outputs: [
			{
				internalType: "address[]",
				name: "tokens",
				type: "address[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_transactionId",
				type: "uint256"
			}
		],
		name: "getTransaction",
		outputs: [
			{
				components: [
					{
						internalType: "address",
						name: "destination",
						type: "address"
					},
					{
						internalType: "address",
						name: "token",
						type: "address"
					},
					{
						internalType: "uint64",
						name: "destinationChainSelector",
						type: "uint64"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "numberOfConfirmations",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "gasLimit",
						type: "uint256"
					},
					{
						internalType: "bytes",
						name: "data",
						type: "bytes"
					},
					{
						internalType: "bool",
						name: "executed",
						type: "bool"
					},
					{
						internalType: "bool",
						name: "executesOnRequirementMet",
						type: "bool"
					},
					{
						internalType: "enum Portal.PayFeesIn",
						name: "payFeesIn",
						type: "uint8"
					}
				],
				internalType: "struct PortalSig.Transaction",
				name: "",
				type: "tuple"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "getTransactionCount",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "getTransactions",
		outputs: [
			{
				components: [
					{
						internalType: "address",
						name: "destination",
						type: "address"
					},
					{
						internalType: "address",
						name: "token",
						type: "address"
					},
					{
						internalType: "uint64",
						name: "destinationChainSelector",
						type: "uint64"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "numberOfConfirmations",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "gasLimit",
						type: "uint256"
					},
					{
						internalType: "bytes",
						name: "data",
						type: "bytes"
					},
					{
						internalType: "bool",
						name: "executed",
						type: "bool"
					},
					{
						internalType: "bool",
						name: "executesOnRequirementMet",
						type: "bool"
					},
					{
						internalType: "enum Portal.PayFeesIn",
						name: "payFeesIn",
						type: "uint8"
					}
				],
				internalType: "struct PortalSig.Transaction[]",
				name: "",
				type: "tuple[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_transactionId",
				type: "uint256"
			}
		],
		name: "hasEnoughConfirmations",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint64",
				name: "_chainSelector",
				type: "uint64"
			}
		],
		name: "isChainSupported",
		outputs: [
			{
				internalType: "bool",
				name: "isSupported",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_transactionId",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "_account",
				type: "address"
			}
		],
		name: "isConfirmedByAccount",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_owner",
				type: "address"
			}
		],
		name: "isOwner",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_transactionId",
				type: "uint256"
			}
		],
		name: "revokeConfirmation",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		stateMutability: "payable",
		type: "receive"
	}
]
