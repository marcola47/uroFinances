"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUIContext } from "@/app/context/Uisdasdsd";
import { FaBarsStaggered, FaCircleUser, FaFileLines, FaBasketShopping, FaList, FaRuler, FaStore, FaDollarSign, FaGear, FaInfo, FaRightFromBracket } from "react-icons/fa6";

export default function Navbar(): JSX.Element {
  const { navbarOpen, setNavbarOpen } = useUIContext();
  const { data: session } = useSession();
  const pathname = usePathname();

  type NavbarLinkProps = {
    href: string,
    name: string,
    icon: JSX.Element
  }

  function NavbarLink(props: NavbarLinkProps): JSX.Element {
    const { href, name, icon } = props;
    
    return (
      <div onClick={ () => {setNavbarOpen(false)} }>
        <Link 
          href={ href }
          className={`navbar__link ${pathname === href ? 'navbar__link--active' : ''}`}
        >
          { icon }
          { name }
        </Link>
      </div>
    )
  }
  
  function NavbarHeader(): JSX.Element {
    const style = navbarOpen
    ? { color: "#323b43" }
    : { color: "#fff"    }

    return (
      <div className="navbar__header">
        <div 
          className="navbar__burger"
          style={ style }
          onClick={ () => setNavbarOpen(!navbarOpen) }
          children={ <FaBarsStaggered/> }
        />
      </div>
    )
  }

  function NavbarUser({ session }: { session: any }): JSX.Element {
    return (
      <div className="navbar__user">
        {
          session 
          ? <div className="navbar__credentials">
              {
                session?.user?.image
                ? <img 
                    src={ session?.user?.image } 
                    alt="user-image"
                    className="navbar__user__img" 
                  />
                
                : <FaCircleUser/>
              }

              <div className="navbar__user__name">
                { session?.user?.name }
              </div>
            
              <div className="navbar__user__email">
                { session?.user?.email }
              </div>
            </div>

          : <div 
              className="navbar__login"
              onClick={ () => signIn() }
            >
              <FaCircleUser/>
              <span>Login or Sign up</span>
            </div>
        }

        <img 
          src="logos/logo--circle.svg" 
          alt="logo"
          className="navbar__user__logo" 
        />
      </div>
    )
  }

  const style = navbarOpen
  ? { transform: 'translateX(0%)'   }
  : { transform: 'translateX(111%)' }

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

        {
          session &&
          <div 
            className="navbar__signout"
            onClick={ () => signOut() } 
          >
            <FaRightFromBracket/>
            <span>Log out</span>
          </div>
        }
      </div>
    </div>
  );
}