import Image from "next/image"
import portalLogo from "../../assets/logo/portalsig.png"
import classes from "./header.module.scss"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export const Header = () => {
	return (
		<header
			className={`${classes.header} flex items-center justify-between`}
		>
			<div className="flex items-center gap-1">
				<div className={classes.logo_container}>
					<Image src={portalLogo} alt="portal logo" />
				</div>
				<div className={classes.logo_text}>portalsig</div>
			</div>
			<ConnectButton />
		</header>
	)
}
