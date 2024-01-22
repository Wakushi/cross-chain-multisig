import { Button } from "../ui/button"
import classes from "./hero.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faKey } from "@fortawesome/free-solid-svg-icons"

export const Hero = () => {
	return (
		<section
			className={`${classes.hero} flex flex-col items-center justify-center`}
		>
			<h1>The ultimate security solution for your assets</h1>
			<p className="mb-6">
				Securely transact across any EVM chain with consensus-based
				control. Fast, safe, unified — your gateway to decentralized
				finance is here.
			</p>

			<Button
				className={`${classes.action_button} flex items-center gap-3`}
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
