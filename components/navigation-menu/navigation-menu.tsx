import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarShortcut,
	MenubarTrigger
} from "@/components/ui/menubar"
import Link from "next/link"

export default function NavigationMenu() {
	return (
		<Menubar style={{ color: "#000" }}>
			<MenubarMenu>
				<MenubarTrigger style={{ cursor: "pointer" }}>
					Portals
				</MenubarTrigger>
				<MenubarContent>
					<Link href="/create">
						<MenubarItem style={{ cursor: "pointer" }}>
							Create portal <MenubarShortcut>⌘T</MenubarShortcut>
						</MenubarItem>
					</Link>
					<Link href="/portals">
						<MenubarItem style={{ cursor: "pointer" }}>
							My portals
						</MenubarItem>
					</Link>
					<MenubarSeparator />
					<MenubarItem style={{ cursor: "pointer" }}>
						Share
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	)
}
