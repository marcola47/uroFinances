"use client";
import { useState, useEffect, useContext, createContext, Dispatch, SetStateAction } from "react";
import * as iconComponents from 'react-icons/fa';

interface IconsContextProps {
  iconNames: string[];
  iconComponents: any;
  getIcon: (iconName: string) => React.ReactNode;
  filterIcons: (filterText: string) => string[];
  getIcons: (iconNames: string[]) => React.ReactNode[];
}

const IconsContext = createContext<IconsContextProps>({
  iconNames: [],
  iconComponents: null,
  getIcon: (iconName: string) => null,
  filterIcons: (filterText: string) => [],
  getIcons: (iconNames: string[]) => []
});

export const IconsContextProvider = ({ children }: { children: any }) => {
  const iconNames = Object.keys(iconComponents);

  function getIcon(iconName: string) {
    const Icon = iconComponents[iconName as keyof typeof iconComponents];
    return Icon ? <Icon key={ iconName }/> : null;
  }

  function filterIcons(filterText: string) {
    const filteredIcons = iconNames.filter(iconName => iconName.toLowerCase().includes(filterText.toLowerCase()));
    return filteredIcons;
  }

  function getIcons(iconNames: string[]) {
    return iconNames.map(iconName => getIcon(iconName));
  }

  return (
    <IconsContext.Provider value={{ 
      iconNames, 
      iconComponents,
      getIcon,
      filterIcons,
      getIcons
    }}
    > { children }
    </IconsContext.Provider>
  )
}

export const useIconsContext = () => useContext(IconsContext);