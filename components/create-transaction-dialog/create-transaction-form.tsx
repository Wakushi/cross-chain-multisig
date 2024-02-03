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
import { registeredChains } from "@/services/data/chains"
import { ZERO_ADDRESS } from "@/lib/utils"
import { Address } from "viem"

interface CreateTransactionFormProps {
  createTransaction: (
    destination: string,
    destinationChainSelector: string,
    token: string,
    amount: string,
    data: string,
    executesOnRequirementMet: boolean,
    payFeesIn: string
  ) => void
  isLoading: boolean
  setIsSubmitting: (isSubmitting: boolean) => void
  portalSigAddress: Address
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
  isLoading,
  portalSigAddress,
  setIsSubmitting,
}: CreateTransactionFormProps) {
  // Context
  const { allSupportedTokens, getTokenByAddress, getTokenBalance } =
    useContext(TokenContext)
  const { isExternalChain, getPortalBalance } = useContext(PortalContext)

  // State
  const [selectedChain, setSelectedChain] = useState<string>("")
  const [selectedChainSupportedTokens, setSelectedChainSupportedTokens] =
    useState<Token[]>([])
  const [selectedToken, setSelectedToken] = useState<string>("")
  const [selectedTokenBalance, setSelectedTokenBalance] = useState<string>("")

  // React Hook Forms
  const { reset } = useForm()
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
    setSelectedChainSupportedTokens(getChainSupportedTokens(selectedChain))
  }, [selectedChain])

  useEffect(() => {
    if (selectedToken) {
      if (selectedToken === ZERO_ADDRESS) {
        updateDisplayedNativeBalance()
        return
      }
      const token = getTokenByAddress(selectedToken as Address)
      if (token) {
        updateDisplayedTokenBalance(token)
      }

      async function updateDisplayedNativeBalance() {
        const balance = await getPortalBalance(portalSigAddress)
        setSelectedTokenBalance(balance)
      }
    }
  }, [selectedToken])

  function getChainSupportedTokens(chainSelector: string): Token[] {
    const chain = allSupportedTokens.find(
      (chain) => chain.chainSelector === chainSelector
    )
    if (chain) {
      return chain.supportedTokens
    }
    return []
  }

  async function updateDisplayedTokenBalance(token: Token) {
    let balance = Number(
      (await getTokenBalance(portalSigAddress, token))?.value || 0
    )
    if (balance) {
      balance = balance / Math.pow(10, token.decimals || 18)
    }

    setSelectedTokenBalance(balance.toFixed(2))
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
      destination,
      destinationChainSelector,
      token,
      amount,
      data,
      executesOnRequirementMet,
      payFeesIn.toString()
    )
  }

  function resetTokenField(): void {
    reset({ token: "" })
    setSelectedToken("")
    setSelectedTokenBalance("")
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
                      {registeredChains.map(({ name, chainSelector }) => (
                        <SelectItem key={chainSelector} value={chainSelector}>
                          {name}
                        </SelectItem>
                      ))}
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
          {!!form.getValues().destinationChainSelector && !isLoading && (
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
                          key={supportedToken.address}
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
                          getTokenByAddress(selectedToken as Address)?.symbol
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
                  <Input type="number" placeholder="0" {...field} />
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
          {/* EXECUTES ON REQUIREMENT */}
          {isExternalChain(selectedChain) && (
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
