// Styles / Assets
import portalLogo from "../../assets/logo/portalsig.png"
import classes from "./header.module.scss"
// Components
import Link from "next/link"
import Image from "next/image"
import NavigationMenu from "../navigation-menu"
import CustomConnectButton from "../ui/custom-connect-button"

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
			<div className="flex items-center gap-4">
				<CustomConnectButton />
				<NavigationMenu />
			</div>
		</header>
	)
}
