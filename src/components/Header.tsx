import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Tab,
  Tabs,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import Image from "next/image";
import logo from "~/images/logo.png";
import { signIn, signOut, useSession } from "next-auth/react";
import MyAvatar from "./MyAvatar";
import SearchUser from "./SearchUser";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useRouter } from "next/router";

export default function Header() {
  const { data: session } = useSession();

  const router = useRouter()
  const isNavActive = router.pathname

  // console.log("Session", session);

  return (
    <Navbar isBordered>
      <NavbarBrand>
        <NextLink href="/">
          <Image src={logo} alt="Logo" width={50} />
        </NextLink>
      </NavbarBrand>
      <NavbarContent justify="center">
        {session ? (
          <>
            <NavbarItem isActive={isNavActive === '/'}>
              <Link as={NextLink} href="/">
                Home
              </Link>
            </NavbarItem>
            <NavbarItem isActive={isNavActive === '/explore'}>
              <Link as={NextLink} href="/explore">
                Explore
              </Link>
            </NavbarItem>
            <NavbarItem isActive={isNavActive === '/bookmarks'}>
              <Link as={NextLink} href="/bookmarks">
                Bookmarks
              </Link>
            </NavbarItem>
          </>
        ) : (
          <NavbarItem>
            <Link as={NextLink} isActive={isNavActive === '/about'} href="/about">
              About
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <SearchUser />
        </NavbarItem>
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <NavbarItem>
          {session ? (
            <MyAvatar />
          ) : (
            <Button
              color="primary"
              variant="flat"
              onClick={() => void signIn()}
            >
              Login
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <Button
        isIconOnly
        variant="light"
        className="text-gray-600"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <Sun /> : <Moon />}
      </Button>
    </div>
  );
}
