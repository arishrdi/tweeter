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
import React from "react";
import NextLink from "next/link";
import Image from "next/image";
import logo from "~/images/logo.png";
import { signIn, signOut, useSession } from "next-auth/react";
import MyAvatar from "./MyAvatar";
import SearchUser from "./SearchUser";

export default function Header() {
  const { data: session } = useSession();

  // console.log("Session", session);

  return (
    <Navbar className="border border-b-1">
      <NavbarBrand>
        <NextLink href="/">
          <Image src={logo} alt="Logo" width={50} />
        </NextLink>
      </NavbarBrand>
      <NavbarContent justify="center">
        {session ? (
          <>
            <NavbarItem isActive>
              <Link as={NextLink} href="/">
                Home
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link as={NextLink} href="/explore">
                Explore
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link as={NextLink} href="/bookmarks">
                Bookmarks
              </Link>
            </NavbarItem>
          </>
        ) : (
          <NavbarItem>
            <Link as={NextLink} href="/about">
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

function MenuHeader() {
  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        color="primary"
        variant="underlined"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-[#22d3ee]",
          tab: "max-w-fit px-0 h-16",
          tabContent: "group-data-[selected=true]:text-[#06b6d4]",
        }}
      >
        <Tab
          key="photos"
          title={
            <div className="flex items-center space-x-2">
              {/* <GalleryIcon/> */}
              <span>Home</span>
              {/* <Chip size="sm" variant="faded">9</Chip> */}
            </div>
          }
        />

        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              {/* <MusicIcon/> */}
              <span>Explore</span>
              {/* <Chip size="sm" variant="faded">3</Chip> */}
            </div>
          }
        />
        <Tab
          key="videos"
          title={
            <div className="flex items-center space-x-2">
              {/* <VideoIcon/> */}
              <span>Bookmarks</span>
              {/* <Chip size="sm" variant="faded">1</Chip> */}
            </div>
          }
        />
      </Tabs>
    </div>
  );
}
