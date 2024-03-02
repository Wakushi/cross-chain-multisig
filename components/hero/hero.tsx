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
      <h1 className="font-bold text-4xl sm:text-6xl lg:text-8xl max-w-[1200px] tracking-tighter	">
        The ultimate{" "}
        <span className="inline bg-gradient-to-r from-indigo-500 dark:from-indigo-200 dark:via-sky-400 dark:to-indigo-200 via-sky-600 to-indigo-400 bg-clip-text font-display tracking-tight text-transparent ">
          security solution
        </span>{" "}
        for your assets
      </h1>
      <p className="mb-6 text-xl">
        Securely transact across any EVM chain with consensus-based control.
        Fast, safe, unified — your gateway to decentralized finance is here.
      </p>

      <Button
        className="action_button flex items-center gap-3"
        onClick={() => router.push("/create")}
      >
        <RiShieldKeyholeFill style={{ fontSize: "1.6rem" }} /> Create wallet
      </Button>
    </section>
  )
}
