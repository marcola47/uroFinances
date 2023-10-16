"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useUIContext } from "@/app/context/ui";
import { FaBarsStaggered, FaCircleUser, FaFileLines, FaBasketShopping, FaList, FaRuler, FaStore, FaDollarSign, FaGear, FaInfo } from "react-icons/fa6";

export default function Navbar(): JSX.Element {
  const { navbarOpen, setNavbarOpen } = useUIContext();

  function NavbarHeader(): JSX.Element {
    return (
      <div className="navbar__header">
        <div 
          className="navbar__burger"
          onClick={ () => setNavbarOpen(!navbarOpen) }
          children={ <FaBarsStaggered/> }
        />
      </div>
    )
  }

  function NavbarContent(): JSX.Element {
    const style = navbarOpen
    ? { transform: 'translateX(0%)' }
    : { transform: 'translateX(100%)' }


    function NavbarLink(props: { href: string, name: string, icon: JSX.Element }): JSX.Element {
      const { href, name, icon } = props;
      
      return (
        <Link 
          href={ href }
          className="navbar__link"
        >
          { icon } 
          <span>{ name }</span>
        </Link>
      )
    }
    
    return (
      <div 
        className="navbar__content"
        style={ style }
      >
        <div className="navbar__user">
          <FaCircleUser/>
          <div className="navbar__user__name">
            User Name
          </div>
          
          <div className="navbar__user__email">
            useremail@gmail.com
          </div>

          <img 
            src="logo--circle.svg" 
            alt="logo"
            className="navbar__user__logo" 
          />
        </div>

        <div className="navbar__links">
          <NavbarLink 
            href="/lists" 
            name="Lists" 
            icon={ <FaFileLines/> }
          />

          <NavbarLink 
            href="/products" 
            name="Products" 
            icon={ <FaBasketShopping/> }
          />

          <NavbarLink 
            href="/categories" 
            name="Categories" 
            icon={ <FaList/> }
          />

          <NavbarLink 
            href="/units" 
            name="Measurement Units" 
            icon={ <FaRuler/> }
          />

          <NavbarLink 
            href="/stores" 
            name="Stores" 
            icon={ <FaStore/> }
          />

          <NavbarLink 
            href="/expenses" 
            name="My Expenses" 
            icon={ <FaDollarSign/> }
          />
        </div>

        <div className="navbar__options">
          <NavbarLink 
            href="/settings" 
            name="Settings" 
            icon={ <FaGear/> }
          />

          <NavbarLink 
            href="/about" 
            name="About uroGroceries" 
            icon={ <FaInfo/> }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="navbar">
      <NavbarHeader/>
      <NavbarContent/>
    </div>
  );
}