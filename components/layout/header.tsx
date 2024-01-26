import Image from "next/image"
import portalLogo from "../../assets/logo/portalsig.png"
import classes from "./header.module.scss"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Link from "next/link"

export const Header = () => {
	return (
		<header
			className={`${classes.header} flex items-center justify-between`}
		>
			<Link href="/">
				<div className="flex items-center gap-1">
					<div className={classes.logo_container}>
						<Image src={portalLogo} alt="portal logo" />
					</div>
					<div className={classes.logo_text}>portalsig</div>
				</div>
			</Link>
			<ConnectButton />
		</header>
	)
}
