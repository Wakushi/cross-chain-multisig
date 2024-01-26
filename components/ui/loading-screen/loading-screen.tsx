"use client"
import Image from "next/image"
import classes from "./loading-screen.module.scss"
import portalImage from "../../../assets/images/portal.gif"
import { Progress } from "../progress"
import { useEffect, useState } from "react"

export default function LoadingScreen() {
	const [progress, setProgress] = useState(10)

	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((prev) => prev + 10)
		}, 10)
		return () => clearTimeout(timer)
	}, [])
	return (
		<div
			className={`${classes.loading_screen} flex flex-col items-center justify-center gap-5`}
		>
			<div className={classes.portal_container}>
				<Image src={portalImage} alt="Portal image" />
			</div>
			<Progress
				value={progress}
				className={`${classes.progress_bar} w-[10%]`}
			/>
		</div>
	)
}
