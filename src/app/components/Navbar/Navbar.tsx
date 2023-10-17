"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useUIContext } from "@/app/context/Ui";
import { FaBarsStaggered, FaCircleUser, FaFileLines, FaBasketShopping, FaList, FaRuler, FaStore, FaDollarSign, FaGear, FaInfo, FaRightFromBracket } from "react-icons/fa6";

export default function Navbar(): JSX.Element {
  const { navbarOpen, setNavbarOpen } = useUIContext();
  const { data: session } = useSession();

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

  function NavbarUser({ session }: { session: any }): JSX.Element {
    return (
      <div className="navbar__user">
        <FaCircleUser/>

        {
          session 
          ? <div className="navbar__credentials">
              <div className="navbar__user__name">
                { session?.user?.name }
              </div>
            
              <div className="navbar__user__email">
                { session?.user?.email }
              </div>
            </div>

          : <div className="navbar__credentials">
              Login to continue
            </div>
        }

        <img 
          src="logo--circle.svg" 
          alt="logo"
          className="navbar__user__logo" 
        />
      </div>
    )
  }

  const style = navbarOpen
  ? { transform: 'translateX(0%)' }
  : { transform: 'translateX(100%)' }


  return (
    <div className="navbar">
      <NavbarHeader/>
      

      <div 
        className="navbar__content"
        style={ style }
      >
        <NavbarUser session={ session }/>

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

        <div className="navbar__signout">
          <NavbarLink 
            href="/login" 
            name="Signout" 
            icon={ <FaRightFromBracket/> }
          />
        </div>
      </div>
    </div>
  );
}