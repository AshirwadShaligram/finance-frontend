"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { BellRing, Moon, Sun, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import DarkModeToggle from "../DarkModeToggle";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slice/authSlice";
import { useRouter } from "next/navigation";

export const Header = () => {
  const [theme, setTheme] = useState();
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    router.push("/signin");
  };

  if (!mounted) {
    return (
      <header className="border-b h-16 flex items-center justify-between px-4 md:px-6">
        <div className="w-8 h-8"></div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-muted"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-border h-16 flex items-center justify-between px-4 md:px-6 transition-all duration-200 bg-background">
      <div className="lg:hidden">
        {/* Mobile header title */}
        <h1 className="text-xl font-semibold text-foreground">
          Finance Tracker
        </h1>
      </div>

      <div className="flex-1 lg:flex justify-end hidden">
        <h1 className="text-xl font-semibold text-foreground">
          Finance Tracker
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <DarkModeToggle />

        <Button variant="ghost" size="icon" className="rounded-full">
          <BellRing className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full h-8 w-8 p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <a href="/my-profile">My Profile</a>
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
