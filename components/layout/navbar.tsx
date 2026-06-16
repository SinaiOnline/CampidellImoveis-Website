/* eslint-disable @next/next/no-img-element */
import siteConfig from "@/config";
import Container from "@mui/material/Container";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const NavbarDrawer = dynamic(() => import("../navbar-drawer"), { ssr: false });

interface NavbarMenuItem {
  label: string;
  href?: string;
  target?: string;
  submenu?: {
    items: NavbarMenuItem[];
  };
}

export const navbarMenuItems: NavbarMenuItem[] = [
  {
    label: "A Imobiliária",
    href: "/sobre",
  },
  {
    label: "Anuncie seu Imóvel",
    href: "/anuncie-seu-imovel",
  },
  {
    label: "Favoritos",
    href: "/favoritos",
  },
  {
    label: "Serviços",
    href: "/servicos",
  },
  {
    label: "Contato",
    href: "/contato",
  },
];

if (siteConfig.showBlog) {
  navbarMenuItems.push({
    label: "Blog",
    href: "/blog",
  })
}

const Navbar = () => {
  const router = useRouter();

  // is current page index?
  const isIndex = router.pathname === "/";

  React.useEffect(() => {
    const body = document.querySelector("html") as HTMLHtmlElement;
    const navbarShadow = body.style.getPropertyValue("--navbar-shadow")
    const navbarTextColor = body.style.getPropertyValue("--navbar-text-color")
    const navbarTextShadow = body.style.getPropertyValue("--navbar-text-shadow")
    const logo = body.querySelector("#navbar img.company-logo") as HTMLHtmlElement
    logo.style.setProperty("transition", "all 0.3s ease");

    const opaqueNavbarStyle = () => {
      body.style.setProperty("--navbar-opacity", "0.75")
      body.style.setProperty("--navbar-blur", "blur(5px)")
      body.style.setProperty("--navbar-text-color", "black")
      body.style.setProperty("--navbar-text-shadow", "none")

      logo.style.scale = "1"
      logo.style.translate = "0px 0px"
    }

    const navbarTransparentStyle = () => {
      body.style.setProperty("--navbar-opacity", "0")
      body.style.setProperty("--navbar-blur", "none")
      body.style.setProperty("--navbar-text-color", "white")
      body.style.setProperty("--navbar-text-shadow", navbarTextShadow)

      logo.style.scale = "1.25"
      logo.style.translate = "3em 1.5em"
    }
    
    const applyNavbarShadow = () => {
      body.style.setProperty("--navbar-shadow", navbarShadow);
    }

    const removeShadow = () => {
      body.style.setProperty("--navbar-shadow", "none");
    }

    if (isIndex) {
      navbarTransparentStyle();
      removeShadow();
    } else {
      opaqueNavbarStyle();
      applyNavbarShadow();
    }

    const handleScroll = () => {
      if (window.scrollY > 0) {
        applyNavbarShadow();
        opaqueNavbarStyle();
      } else {
        removeShadow();
        if (isIndex) {
          navbarTransparentStyle();
        } else {
          opaqueNavbarStyle();
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isIndex, router.pathname]);

  return (
    <div id="navbar">
      <Container sx={{ display: "flex" }} className="container" maxWidth="xl">
        <Link href="/">
          {siteConfig.lightLogo && (
            <Image
              fetchPriority="high"
              width={190}
              height={120}
              className="company-logo"
              src={siteConfig.lightLogo}
              alt={siteConfig.name}
            />
          )}
        </Link>
        <div className="menu">
          <NavbarDrawer />
          <div className="menu-items">
            {navbarMenuItems.map((item, index) => (
              <MenuItem key={index} item={item} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

const MenuItem = ({ item }: { item: NavbarMenuItem }) => {
  const LinkOrLabel = ({ item }: { item: NavbarMenuItem }) => {
    if (item.href) {
      return (
        <Link className="label" href={item.href} target={item.target}>
          {item.label}
        </Link>
      );
    } else {
      return <p className="label">{item.label}</p>;
    }
  };

  return (
    <div className={`menu-item`}>
      <LinkOrLabel item={item} />
      {item.submenu && (
        <div className="submenu">
          {item.submenu.items.map((item, index) => (
            <LinkOrLabel key={index} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;
