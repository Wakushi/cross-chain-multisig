import { IconDefinition, faChartLine } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { ReactNode } from "react"

interface MenuLinkProps {
  href: string
  isActive: boolean
  children: ReactNode
  icon: IconDefinition
  onClick?: () => void
}

export default function MenuLink({
  href,
  isActive,
  children,
  icon,
  onClick,
}: MenuLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-6 p-4 hover:bg-sky-900 ${
        isActive ? "link-active" : ""
      }`}
      onClick={onClick}
    >
      <FontAwesomeIcon className="icon text-slate-400" icon={icon} />{" "}
      <span className="font-light text-sm text-slate-400">{children}</span>
    </Link>
  )
}
