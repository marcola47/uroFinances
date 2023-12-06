import { useState } from "react"
import { useIconsContext } from "@/app/context/Icons"

export default function IconPicker(): JSX.Element {
  const { iconNames, getIcon, getIcons } = useIconsContext();
  const [filteredIcons, setFilteredIcons] = useState<React.ReactNode[]>(getIcons(iconNames));
  
  console.log(filteredIcons)

  return (
    <div className="icon-picker">
      
    </div>
  )
}