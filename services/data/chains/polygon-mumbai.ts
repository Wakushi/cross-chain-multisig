import { Network } from "alchemy-sdk"
import { Chain } from "../chains"
import { ZERO_ADDRESS } from "@/lib/utils"
import polygonIcon from "@/assets/icons/polygon.svg"

export const POLYGON_MUMBAI: Chain = {
  name: "Polygon Mumbai",
  alchemyNetwork: Network.MATIC_MUMBAI,
  chainId: "80001",
  chainSelector: "12532609583862916517",
  explorerUrl: "https://mumbai.polygonscan.com/tx/",
  portalFactoryAddress: "0x960F9bFcCeC2ca1271482E95512F456D3d9F9890",
  ccipRouterAddress: "0x1035CabC275068e0F4b745A29CEDf38E13aF41b1",
  linkTokenAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
  portalGateAddress: "0x60f7b9f6f83b38e98CCAB2b594F4bABd830307Ae",
  destinationChains: [
    {
      destinationChain: "Polygon Mumbai",
      destinationChainSelector: "12532609583862916517",
      tokens: [
        {
          address: ZERO_ADDRESS,
          name: "Matic",
          symbol: "MATIC",
          decimals: 18,
          logo: polygonIcon.src,
        },
      ],
    },
    {
      destinationChain: "Ethereum Sepolia",
      destinationChainSelector: "16015286601757825753",
      tokens: [
        {
          address: "0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40",
          name: "CCIP-BnM",
          symbol: "CCIP-BnM",
          decimals: 18,
        },
        {
          address: "0xc1c76a8c5bFDE1Be034bbcD930c668726E7C1987",
          name: "CCIP-LnM",
          symbol: "CCIP-LnM",
          decimals: 18,
        },
        {
          address: "0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97",
          name: "USDC",
          symbol: "USDC",
          decimals: 6,
        },
      ],
    },
    {
      destinationChain: "Optimism Sepolia",
      destinationChainSelector: "5224473277236331295",
      tokens: [
        {
          address: "0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40",
          name: "CCIP-BnM",
          symbol: "CCIP-BnM",
          decimals: 18,
        },
        {
          address: "0xc1c76a8c5bFDE1Be034bbcD930c668726E7C1987",
          name: "CCIP-LnM",
          symbol: "CCIP-LnM",
          decimals: 18,
        },
        {
          address: "0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97",
          name: "USDC",
          symbol: "USDC",
          decimals: 6,
        },
      ],
    },
  ],
  icon: polygonIcon.src,
}
