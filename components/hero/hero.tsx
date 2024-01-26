import classes from "./hero.module.scss"
import { Button } from "../ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faKey } from "@fortawesome/free-solid-svg-icons"
import { useRouter } from "next/navigation"

export const Hero = () => {
	const router = useRouter()

	return (
		<section
			className={`${classes.hero} flex flex-col items-center justify-center fade-in`}
		>
			<h1>The ultimate security solution for your assets</h1>
			<p className="mb-6">
				Securely transact across any EVM chain with consensus-based
				control. Fast, safe, unified — your gateway to decentralized
				finance is here.
			</p>

			<Button
				className={`${classes.action_button} flex items-center gap-3`}
				onClick={() => router.push("/create")}
			>
				<FontAwesomeIcon
					icon={faKey}
					className="fas fa-check"
					style={{ color: "#2f2f2f" }}
				></FontAwesomeIcon>{" "}
				Create wallet
			</Button>
		</section>
	)
}
