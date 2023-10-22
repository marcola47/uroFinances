"use client";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUIContext } from "@/app/context/Ui";
import { FaBarsStaggered, FaCircleUser, FaTableColumns, FaGear, FaInfo, FaRightFromBracket } from "react-icons/fa6";

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
    const [userImgSrc, setUserImgSrc] = useState(session?.user?.image || '/user.svg')

    const burgerStyle = navbarOpen
    ? { display: "block" }
    : { display: "none"  }
    
    return (
      <div className="navbar__user">
        {
          session?.user
          ? <div className="navbar__credentials">
              <img 
                src={ userImgSrc } 
                alt="user-image"
                className="navbar__user__img" 
                referrerPolicy="no-referrer"
                onError={() => { setUserImgSrc('user.svg') }}
              />

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
          src="/logos/logo--circle.svg" 
          alt="logo"
          className="navbar__user__logo" 
        />

        <div 
          className="navbar__user__burger"
          style={ burgerStyle }
          onClick={ () => setNavbarOpen(!navbarOpen) }
          children={ <FaBarsStaggered/> }
        />
      </div>
    )
  }

  const style = navbarOpen
  ? { transform: 'translateX(0%)'   }
  : { transform: 'translateX(-111%)' }

  return (
    <div className="navbar">
      <NavbarHeader/>

      <div 
        className="navbar__content"
        style={ style }
      >
        <NavbarUser session={ session }/>
        {
          session 
          ? <>
              <div className="navbar__links">
                <NavbarLink 
                  href="/" 
                  name="Dashboard" 
                  icon={ <FaTableColumns/> }
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
                  name="About uroFinances" 
                  icon={ <FaInfo/> }
                />
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
    </div>
  );
}