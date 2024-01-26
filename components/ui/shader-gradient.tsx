import React from "react"
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient"
import * as reactSpring from "@react-spring/three"
import * as drei from "@react-three/drei"
import * as fiber from "@react-three/fiber"

export default function ShaderGradientBackground() {
	return (
		<ShaderGradientCanvas
			importedfiber={{ ...fiber, ...drei, ...reactSpring }}
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				zIndex: -1,
				scale: 1.4
			}}
		>
			<ShaderGradient
				control="query"
				urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=0.8&cAzimuthAngle=270&cDistance=0.5&cPolarAngle=180&cameraZoom=15.1&color1=%23262352&color2=%23262352&color3=%238da0ce&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=env&pixelDensity=1&positionX=-0.1&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.4&rotationX=0&rotationY=130&rotationZ=70&shader=defaults&type=sphere&uAmplitude=3.2&uDensity=0.8&uFrequency=5.5&uSpeed=0.3&uStrength=0.3&uTime=0&wireframe=false"
			/>
		</ShaderGradientCanvas>
	)
}
