import React, { useState, useEffect } from "react"
import { useIconsContext } from "@/app/context/Icons"

import List from "@/app/components/List/List";
import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6";

export default function IconPicker(): JSX.Element {
  const { iconNames, getIcon, getIcons, filterIcons } = useIconsContext();
  
  const [filteredIcons, setFilteredIcons] = useState<React.ReactNode[]>(getIcons(iconNames));
  const [selectedIcon, setSelectedIcon] = useState<string>(""); //get state as props
  const [search, setSearch] = useState<string>('');

  useEffect(() => { 
     const filteredNames = filterIcons(search);
     setFilteredIcons(getIcons(filteredNames));
  }, [search]);
  
  function Icon({ itemData: icon }: { itemData: React.ReactNode }): JSX.Element {
    const key = React.isValidElement(icon) ? icon.key : null;
    
    return (
      <div 
        className="icon-picker__icon"
        onClick={ () => {setSelectedIcon(key ?? "")} }
      > { icon }
      </div>
    )
  }

  return (
    <div className="icon-picker">
      <div className="icon-picker__search">

        <input 
          className="icon-picker__search__input"
          type="text" 
          placeholder="Search for an icon" 
          value={ search }
          onChange={ e => {setSearch(e.target.value)} }
        />

        <FaMagnifyingGlass className="icon-picker__search__icon"/>

        {
          search.length > 0 && 
          <FaXmark 
            className="icon-picker__search__icon icon-picker__search__icon--clear"
            onClick={ () => {setSearch("")} }
          />
        }
      </div>
      
      <List
        className="icon-picker__icons"
        elements={ filteredIcons }
        ListItem={ Icon }
      />
    </div>
  )
}