import { createContext, ReactNode, useState } from "react"

interface ErrorContextProviderProps {
	children: ReactNode
}

interface ErrorContextProps {
	errorMsg: string
	handleCreationFormError: (
		ownerAddresses: string[],
		numberOfConfirmation: number
	) => boolean
	setErrorMsg: (errorMsg: string) => void
	areAddressesValid: (ownerAddresses: string[]) => boolean
}

const ErrorContext = createContext<ErrorContextProps>({
	errorMsg: "",
	handleCreationFormError: (
		ownerAddresses: string[],
		numberOfConfirmation: number
	): boolean => {
		return false
	},
	setErrorMsg: (errorMsg: string): void => {},
	areAddressesValid: (ownerAddresses: string[]) => {
		return false
	}
})
export default function ErrorContextProvider(props: ErrorContextProviderProps) {
	const [errorMsg, setErrorMsg] = useState<string>("")

	function handleCreationFormError(
		ownerAddresses: string[],
		numberOfConfirmation: number
	): boolean {
		if (ownerAddresses.length < 2) {
			setErrorMsg("You must have at least 2 owners.")
			return false
		} else if (numberOfConfirmation < 2) {
			setErrorMsg("You must have at least 2 confirmations.")
			return false
		} else if (!areAddressesValid(ownerAddresses)) {
			setErrorMsg("Please verify the addresses format.")
			return false
		} else if (numberOfConfirmation > ownerAddresses.length) {
			setErrorMsg("There are more confirmations than owners.")
			return false
		} else if (new Set(ownerAddresses).size !== ownerAddresses.length) {
			setErrorMsg("There are duplicate addresses.")
			return false
		}
		setErrorMsg("")
		return true
	}

	function areAddressesValid(ownerAddresses: string[]): boolean {
		return ownerAddresses.every((address) => {
			return address.length === 42
		})
	}

	const context = {
		errorMsg: errorMsg,
		handleCreationFormError: handleCreationFormError,
		setErrorMsg: setErrorMsg,
		areAddressesValid: areAddressesValid
	}

	return (
		<ErrorContext.Provider value={context}>
			{props.children}
		</ErrorContext.Provider>
	)
}

export { ErrorContext }
