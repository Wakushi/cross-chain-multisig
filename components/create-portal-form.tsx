// Components
import { Input } from "@/components/ui/input"

// Wagmi / Viem
import { Address } from "viem"

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleMinus, faPlus } from "@fortawesome/free-solid-svg-icons"

interface CreatePortalFormProps {
  handleAddOwnerInputField: () => void
  handleRemoveOwnerInputField: (index: number) => void
  handleOnOwnerInputChange: (index: number, value: Address) => void
  handleOnConfirmationInputChange: (value: string) => void
  ownersAddresses: Address[]
}

export default function CreatePortalForm({
  handleAddOwnerInputField,
  handleRemoveOwnerInputField,
  handleOnOwnerInputChange,
  handleOnConfirmationInputChange,
  ownersAddresses,
}: CreatePortalFormProps) {
  return (
    <>
      <p className="text-lg">
        Please enter the number of confirmations required for every future
        transaction of this wallet.
      </p>
      <div className="flex items-center gap-4">
        <span className="font-light">Every transaction will require </span>
        <div className="max-w-14">
          <Input
            type="number"
            placeholder="2"
            min="2"
            onChange={(e) => handleOnConfirmationInputChange(e.target.value)}
          />
        </div>
        <span className="font-light">owner confirmations.</span>
      </div>
      <p className="text-sm	font-light text-muted-foreground mb-5">
        Note : there should be at least two owners minimum, and two confirmation
        required minimum.
      </p>
      <p className="text-lg mb-2">Please enter the owners address.</p>
      <div className="flex flex-wrap items-center gap-4">
        {ownersAddresses.map((address, index) => {
          return (
            <div key={index} className="relative dark-input w-[380px]">
              {index > 1 && (
                <FontAwesomeIcon
                  icon={faCircleMinus}
                  className="absolute right-[-5px] top-[-5px] cursor-pointer"
                  style={{ color: "red" }}
                  onClick={() => handleRemoveOwnerInputField(index)}
                ></FontAwesomeIcon>
              )}
              <Input
                value={address}
                type="text"
                placeholder="0x00..."
                onChange={(e) =>
                  handleOnOwnerInputChange(index, e.target.value as Address)
                }
              />
            </div>
          )
        })}
        <FontAwesomeIcon
          icon={faPlus}
          className="fas fa-plus"
          style={{ color: "#fff" }}
          onClick={handleAddOwnerInputField}
        ></FontAwesomeIcon>
      </div>
    </>
  )
}
