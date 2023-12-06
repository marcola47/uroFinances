"use client";
import { useState, useEffect, useRef } from "react"

import { useUserContext } from "./context/User";
import { useIconsContext } from "./context/Icons";

import Navbar from "@/app/components/Navbar/Navbar";
import MonthTab from "@/app/components/MonthTab/MonthTab";
import Balance from "@/app/components/_Home/Balance";
import Overview from "@/app/components/_Home/Overview";

import IconPicker from "./components/IconPicker/IconPicker";

export default function Home(): JSX.Element {
  const { user } = useUserContext();
  const { iconNames, filterIcons, getIcons } = useIconsContext();

  const filteredIcons = filterIcons('user');
  const icons = getIcons(filteredIcons);

  const [height, setHeight] = useState<number>(0);
  const columnsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function calculateDistances() {
      const element = columnsRef.current;
      
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementHeight = window.innerHeight - rect.bottom - 24;
        
        if (elementHeight > 0)
          setHeight(elementHeight);
      }
    };

    calculateDistances();
    window.addEventListener('scroll', calculateDistances);
    window.addEventListener('resize', calculateDistances);

    return () => {
      window.removeEventListener('scroll', calculateDistances);
      window.removeEventListener('resize', calculateDistances);
    };
  }, []);
  
  return (
    <div className="app">
      <Navbar/>
      <div className="page home">
        <div className="page__top">
          <MonthTab/>
          <Balance/>
        </div>

        <div 
          className="home__columns"
          ref={ columnsRef }
          style={{ height }}
        >
          <div className={`${user?.settings?.hide_scrollbars ? "hide-scrollbar" : ""} home__column home__column--left`}>
            { icons }
          </div>

          <div className={`${user?.settings?.hide_scrollbars ? "hide-scrollbar" : ""} home__column home__column--right`}>
            <IconPicker/>
          </div>
        </div>
      </div>
    </div>
  )
}