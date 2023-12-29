"use client";
import Link from "next/link";
import React, { useState, useEffect, useContext } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import supabase from "@/lib/db";
import { UserContext } from "@/providers/UserProvider";

const Navbar = () => {
  const { user } = useContext(UserContext);

  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex px-8 py-4 items-center justify-between sticky">
      <div className="flex justify-center items-center space-x-2">
        <Link href="/dashboard">
          <h1 className="font-bold">RFScout</h1>
        </Link>
      </div>
      <div className="flex space-x-8 justify-center items-center">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex space-x-2 text-xs justify-center items-center hover:bg-gray-200 hover:rounded-lg ">
              <Avatar>
                <AvatarImage src={user.photo_url} alt={user.email} />
                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="hidden flex-col sm:flex">
                <span className="font-bold">{user.username}</span>
                <span className="text-xs">{user.email}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/settings/profile">
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer">
                  Profile
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                className="hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </div>
  );
};

export default Navbar;
