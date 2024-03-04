// Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import LoaderSmall from "../ui/loader-small/loader-small"
import { Button } from "../ui/button"

// React Hook Forms
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

// React
import { useContext, useEffect, useState } from "react"

// Types
import { Token } from "@/types/Token"

// Services / Utils
import { PayFeesIn, TokenContext } from "@/services/TokenContext"
import { PortalContext } from "@/services/PortalContext"
import {
  Chain,
  DestinationChainsData,
  registeredChains,
} from "@/services/data/chains"
import { Address } from "viem"
import Image from "next/image"
import { ChainContext } from "@/services/ChainContext"

interface CreateTransactionFormProps {
  createTransaction: (
    destination: Address,
    destinationChainSelector: string,
    token: Address,
    amount: string,
    data: string,
    executesOnRequirementMet: boolean,
    payFeesIn: string
  ) => void
  supportedTokens: DestinationChainsData[] | undefined
  isLoading: boolean
  setIsSubmitting: (isSubmitting: boolean) => void
}

const formSchema = z.object({
  destination: z
    .string()
    .min(42, { message: "Invalid address length." })
    .max(42),
  token: z.string().min(42, { message: "Invalid address length." }).max(42),
  destinationChainSelector: z.string(),
  amount: z.string().min(0, { message: "Invalid amount." }),
  data: z.string(),
  executesOnRequirementMet: z.boolean(),
  payFeesIn: z.number(),
})

export default function CreateTransactionForm({
  createTransaction,
  supportedTokens,
  setIsSubmitting,
  isLoading,
}: CreateTransactionFormProps) {
  const { reset } = useForm()
  const { currentPortal } = useContext(PortalContext)
  const { getTokenByAddress } = useContext(TokenContext)

  const [selectedChain, setSelectedChain] = useState<string>("")
  const [selectedChainSupportedTokens, setSelectedChainSupportedTokens] =
    useState<Token[]>([])
  const [selectedToken, setSelectedToken] = useState<string>("")
  const [selectedTokenBalance, setSelectedTokenBalance] = useState<string>("")

  const supportedDestinationChains = registeredChains.filter((chain: Chain) => {
    return !!currentPortal?.chain.destinationChains.find(
      (destinationChain: DestinationChainsData) => {
        return destinationChain.destinationChainSelector === chain.chainSelector
      }
    )
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      token: "",
      destinationChainSelector: "",
      amount: "",
      data: "",
      executesOnRequirementMet: false,
      payFeesIn: 0,
    },
  })

  useEffect(() => {
    resetTokenField()
    onChainChange()
  }, [selectedChain])

  useEffect(() => {
    onTokenChange()
  }, [selectedToken])

  function onChainChange() {
    const chainSupportedTokens = supportedTokens?.find(
      (chain) => chain.destinationChainSelector === selectedChain
    )?.tokens
    setSelectedChainSupportedTokens(chainSupportedTokens || [])
  }

  function resetTokenField(): void {
    reset({ token: "" })
    setSelectedToken("")
    setSelectedTokenBalance("")
  }

  function onTokenChange(): void {
    const token = getTokenByAddress(selectedToken as Address)
    setSelectedTokenBalance(
      token?.balance ? Number(token.balance).toFixed(2) : "0"
    )
  }

  function isCrossChainTransaction(): boolean {
    return selectedChain !== currentPortal?.chain.chainSelector
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    const {
      destination,
      destinationChainSelector,
      token,
      amount,
      data,
      executesOnRequirementMet,
      payFeesIn,
    } = values

    createTransaction(
      destination as Address,
      destinationChainSelector,
      token as Address,
      amount,
      data,
      executesOnRequirementMet,
      payFeesIn.toString()
    )
  }

  return (
    <div className="grid gap-4 py-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-8"
        >
          {/* DESTINATION ADDRESS */}
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination</FormLabel>
                <FormControl>
                  <Input placeholder="0x00" {...field} />
                </FormControl>
                <FormDescription>
                  The address that will receive the transaction.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* DESTINATION BLOCKCHAIN */}
          {isLoading ? (
            <LoaderSmall />
          ) : (
            <FormField
              control={form.control}
              name="destinationChainSelector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination chain</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedChain(value)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a destination chain" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {supportedDestinationChains.map(
                        ({ name, chainSelector, icon }) => (
                          <SelectItem key={chainSelector} value={chainSelector}>
                            <div className="flex items-center gap-2">
                              <Image
                                src={icon}
                                alt={`${name} logo`}
                                width={25}
                                height={25}
                              />{" "}
                              <div>{name}</div>
                            </div>
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Blockchain where the transaction will be sent to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {/* TOKEN TO SEND */}
          {!!form.getValues().destinationChainSelector && (
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedToken(value)
                    }}
                    value={selectedToken}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a token to send" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedChainSupportedTokens.map((supportedToken) => (
                        <SelectItem
                          key={supportedToken.address + supportedToken.name}
                          value={supportedToken.address.toString()}
                        >
                          {supportedToken.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {selectedToken
                      ? `Balance: ${selectedTokenBalance} ${
                          getTokenByAddress(selectedToken as Address)?.symbol ||
                          ""
                        }`
                      : ""}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {/* DESTINATION ADDRESS */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input placeholder="0" {...field} />
                </FormControl>
                <FormDescription>Amount of tokens to send.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* DESTINATION ADDRESS */}
          <FormField
            control={form.control}
            name="data"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <Input placeholder="0x00" {...field} />
                </FormControl>
                <FormDescription>
                  The data to send with the transaction.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* EXECUTES ON REQUIREMENT */}
          <FormField
            control={form.control}
            name="executesOnRequirementMet"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Execute transaction automatically</FormLabel>
                  <FormDescription>
                    Transaction will be executed when enough signatures are
                    collected.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          {/* PAY XCHAIN FEES IN */}
          {isCrossChainTransaction() && (
            <FormField
              control={form.control}
              name="payFeesIn"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Pay cross-chain fees in</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={PayFeesIn.NATIVE.toString()} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Native token
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={PayFeesIn.LINK.toString()} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Link token
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}
