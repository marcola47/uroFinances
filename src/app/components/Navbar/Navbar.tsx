"use client";
import { useState, useEffect, useRef } from "react";
import { signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

import { useUIContext } from "@/app/context/Ui";
import { useUserContext } from "@/app/context/User";

import Link from "next/link";
import { 
  FaArrowRight, 
  FaTableColumns, 
  FaBuildingColumns, 
  FaMoneyBill,
  FaPercent,
  FaBullseye,
  FaGear, 
  FaInfo, 
  FaRightFromBracket,
} from "react-icons/fa6";

export default function Navbar(): JSX.Element {
  const { user } = useUserContext(); 
  const { navbarOpen, setNavbarOpen } = useUIContext();
  const navbarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (navbarOpen) {
      function handleClickOutside(event: MouseEvent) {
        const isDescendant = (parent: Node, child: Node | null): boolean => {
          if (!parent || !child) 
            return false;

          if (parent === child) 
            return true;

          return isDescendant(parent, child.parentNode as Node | null);
        };
  
        if (navbarRef.current && !isDescendant(navbarRef.current, event.target as Node)) 
          setNavbarOpen(false);
      }
  
      window.addEventListener("mousedown", handleClickOutside);
      return () => { window.removeEventListener("mousedown", handleClickOutside) };
    }
  }, [navbarOpen]);
  

  function NavbarLink({ 
    href, 
    name, 
    icon 
  }: { 
    href: string, 
    name: string, 
    icon: JSX.Element 
  }): JSX.Element {    
    return (
      <Link
        href={ href }
        className={`navbar__link ${pathname === href ? 'navbar__link--active' : ''}`}
      > 
        <div className="navbar__link__icon">
          { icon } 
        </div>

        <div className="navbar__link__name">
          { name }
        </div>
      </Link>
    )
  }

  function NavbarUser({ user }: { user: TUser | null }): JSX.Element {
    const [userImgSrc, setUserImgSrc] = useState(user?.image || '/user.svg')
 
    return (
      <Link 
        href="/settings"
        className="navbar__user"
      >
        {
          user
          ? <div className="navbar__credentials">
              <img 
                src={ userImgSrc } 
                alt="user-image"
                className="navbar__user__img" 
                referrerPolicy="no-referrer"
                onError={() => { setUserImgSrc('user.svg') }}
              />

              <div className="navbar__user__name">
                { user.name }
              </div>
            
              <div className="navbar__user__email">
                { user.email }
              </div>
            </div>

          : <div 
              className="navbar__login"
              onClick={ () => signIn() }
            >
              <img 
                src={ userImgSrc } 
                alt="user-image"
                className="navbar__user__img" 
                referrerPolicy="no-referrer"
                onError={() => { setUserImgSrc('user.svg') }}
              />
              <span>Login or Sign up</span>
            </div>
        }

        <img 
          src="/logos/logo--circle.svg" 
          alt="logo"
          className="navbar__user__logo" 
        />

        <div 
          className="navbar__user__burger"
          onClick={ () => setNavbarOpen(!navbarOpen) }
          style={{ transform: navbarOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        > <FaArrowRight/>
        </div>
      </Link>
    )
  }

  return (
    <div 
      className={`navbar ${navbarOpen ? '' : 'navbar--closed'}`}
      ref={ navbarRef }
      onMouseEnter={ () => { if (user?.settings?.open_navbar_on_hover) setNavbarOpen(true) } }
      onMouseLeave={ () => { if (user?.settings?.open_navbar_on_hover) setNavbarOpen(false) } }
    >
      <NavbarUser user={ user }/>
      {
        user 
        ? <>
            <div className="navbar__links">
              <NavbarLink href="/" name="Dashboard" icon={ <FaTableColumns/> }/>
              <NavbarLink href="/accounts" name="Accounts" icon={ <FaBuildingColumns/> }/>
              <NavbarLink href="/transactions" name="Transactions" icon={ <FaMoneyBill/> }/>
              <NavbarLink href="/budgets" name="Budgets" icon={ <FaPercent/> }/>
              <NavbarLink href="/goals" name="Goals" icon={ <FaBullseye/> }/>
            </div>

            <div className="navbar__options">
              <NavbarLink href="/settings" name="Settings" icon={ <FaGear/> }/>
              <NavbarLink href="/about" name="About uroFinances" icon={ <FaInfo/> }/>
            </div>

            <div 
              className="navbar__signout"
              onClick={ () => signOut() } 
            >
              <FaRightFromBracket/>
              <span>Log out</span>
            </div>
          </>

        : <div className="navbar__options">
            <NavbarLink 
              href="/about" 
              name="About uroGroceries" 
              icon={ <FaInfo/> }
            />
          </div>
      }
    </div>
  );
}