export const PORTALSIG_FACTORY_CONTRACT_ADDRESS =
  "0xbbf5C4f32928D0903F15F7141A54324A0237E9e0"

export const SEPOLIA_CCIP_ROUTER_CONTRACT_ADDRESS =
  "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"
export const SEPOLIA_LINK_CONTRACT_ADDRESS =
  "0x779877A7B0D9E8603169DdbD7836e478b4624789"

export const CCIP_EXPLORER_URL = "https://ccip.chain.link/tx/"

export const PORTALSIG_FACTORY_CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address[]",
        name: "_owners",
        type: "address[]",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_requiredConfirmationsAmount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
    ],
    name: "PortalSigWalletDeployed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_owners",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "_requiredConfirmationsAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_ccipRouterAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_linkAddress",
        type: "address",
      },
    ],
    name: "deployPortalSigWallet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "getWalletsByOwner",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]

export const PORTALSIG_WALLET_CONTRACT_ABI = [
  {
    type: "constructor",
    inputs: [
      { name: "_owners", type: "address[]", internalType: "address[]" },
      {
        name: "_requiredConfirmationsAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_ccipRouterAddress",
        type: "address",
        internalType: "address",
      },
      { name: "_linkAddress", type: "address", internalType: "address" },
    ],
    stateMutability: "nonpayable",
  },
  { type: "fallback", stateMutability: "payable" },
  { type: "receive", stateMutability: "payable" },
  {
    type: "function",
    name: "confirmTransaction",
    inputs: [
      {
        name: "_transactionId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createTransaction",
    inputs: [
      {
        name: "_destination",
        type: "address",
        internalType: "address",
      },
      { name: "_token", type: "address", internalType: "address" },
      {
        name: "_destinationChainSelector",
        type: "uint64",
        internalType: "uint64",
      },
      { name: "_amount", type: "uint256", internalType: "uint256" },
      { name: "_data", type: "bytes", internalType: "bytes" },
      {
        name: "_executesOnRequirementMet",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "_payFeesIn",
        type: "uint8",
        internalType: "enum Portal.PayFeesIn",
      },
      { name: "_gasLimit", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "executeTransaction",
    inputs: [
      {
        name: "_transactionId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getOwners",
    inputs: [],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRequiredConfirmationsAmount",
    inputs: [],
    outputs: [
      {
        name: "requiredConfirmationsAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTransaction",
    inputs: [
      {
        name: "_transactionId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct PortalSig.Transaction",
        components: [
          {
            name: "destination",
            type: "address",
            internalType: "address",
          },
          { name: "token", type: "address", internalType: "address" },
          {
            name: "initiator",
            type: "address",
            internalType: "address",
          },
          {
            name: "destinationChainSelector",
            type: "uint64",
            internalType: "uint64",
          },
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "amount", type: "uint256", internalType: "uint256" },
          {
            name: "numberOfConfirmations",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "gasLimit",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "createdAt",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "executedAt",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "data", type: "bytes", internalType: "bytes" },
          { name: "executed", type: "bool", internalType: "bool" },
          {
            name: "executesOnRequirementMet",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "payFeesIn",
            type: "uint8",
            internalType: "enum Portal.PayFeesIn",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTransactionCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTransactions",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct PortalSig.Transaction[]",
        components: [
          {
            name: "destination",
            type: "address",
            internalType: "address",
          },
          { name: "token", type: "address", internalType: "address" },
          {
            name: "initiator",
            type: "address",
            internalType: "address",
          },
          {
            name: "destinationChainSelector",
            type: "uint64",
            internalType: "uint64",
          },
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "amount", type: "uint256", internalType: "uint256" },
          {
            name: "numberOfConfirmations",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "gasLimit",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "createdAt",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "executedAt",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "data", type: "bytes", internalType: "bytes" },
          { name: "executed", type: "bool", internalType: "bool" },
          {
            name: "executesOnRequirementMet",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "payFeesIn",
            type: "uint8",
            internalType: "enum Portal.PayFeesIn",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasEnoughConfirmations",
    inputs: [
      {
        name: "_transactionId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isConfirmedByAccount",
    inputs: [
      {
        name: "_transactionId",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "_account", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isOwner",
    inputs: [{ name: "_owner", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "revokeConfirmation",
    inputs: [
      {
        name: "_transactionId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "MessageSent",
    inputs: [
      {
        name: "messageId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "destinationChainSelector",
        type: "uint64",
        indexed: false,
        internalType: "uint64",
      },
      {
        name: "receiver",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "token",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "payFeesIn",
        type: "uint8",
        indexed: false,
        internalType: "enum Portal.PayFeesIn",
      },
      {
        name: "fees",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TransactionConfirmationRevoked",
    inputs: [
      {
        name: "transactionId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "account",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TransactionConfirmed",
    inputs: [
      {
        name: "transactionId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "account",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TransactionCreated",
    inputs: [
      {
        name: "destination",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "value",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "destinationChainSelector",
        type: "uint64",
        indexed: true,
        internalType: "uint64",
      },
      {
        name: "data",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TransactionExecuted",
    inputs: [
      {
        name: "transactionId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "PortalSig__AlreadyConfirmed",
    inputs: [
      {
        name: "transactionId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "PortalSig__AlreadyExecuted",
    inputs: [
      {
        name: "transactionId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "PortalSig__DestinationChainNotAllowlisted",
    inputs: [
      {
        name: "destinationChainSelector",
        type: "uint64",
        internalType: "uint64",
      },
    ],
  },
  {
    type: "error",
    name: "PortalSig__InvalidConfirmationAmount",
    inputs: [
      {
        name: "requiredConfirmations",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  { type: "error", name: "PortalSig__InvalidOwnerAddress", inputs: [] },
  {
    type: "error",
    name: "PortalSig__InvalidTransactionId",
    inputs: [
      {
        name: "transactionId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "PortalSig__NeedAtLeastTwoOwners",
    inputs: [
      { name: "ownersLength", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "PortalSig__NotConfirmed",
    inputs: [
      {
        name: "transactionId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "PortalSig__NotEnoughBalanceForFees",
    inputs: [
      {
        name: "currentBalance",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "calculatedFees",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "PortalSig__NotEnoughConfirmations",
    inputs: [
      {
        name: "transactionId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "PortalSig__NotOwner",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
  },
  { type: "error", name: "PortalSig__OwnerNotUnique", inputs: [] },
  {
    type: "error",
    name: "PortalSig__RequiredConfirmationsGreaterThanOwnersLength",
    inputs: [
      {
        name: "requiredConfirmations",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "ownersLength", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "PortalSig__TransactionExecutionFailed",
    inputs: [
      {
        name: "transactionId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
]
