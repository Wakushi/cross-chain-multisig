import classes from "./hero.module.scss"
import { Button } from "../ui/button"
import { RiShieldKeyholeFill } from "react-icons/ri"
import { useRouter } from "next/navigation"

export const Hero = () => {
  const router = useRouter()

  return (
    <section
      className={`${classes.hero} flex flex-col items-center justify-center fade-in`}
    >
      <h1>The ultimate security solution for your assets</h1>
      <p className="mb-6">
        Securely transact across any EVM chain with consensus-based control.
        Fast, safe, unified — your gateway to decentralized finance is here.
      </p>

      <Button
        className={`${classes.action_button} flex items-center gap-3`}
        onClick={() => router.push("/create")}
      >
        <RiShieldKeyholeFill style={{ fontSize: "1.6rem" }} /> Create wallet
      </Button>
    </section>
  )
}
