"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Menu } from "lucide-react";

interface MobileMenuProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

export function MobileMenu({ isLoggedIn, onLogout }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    onLogout();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="flex flex-col space-y-4">
          <Link href="/" onClick={() => setOpen(false)}>
            Главная
          </Link>
          {isLoggedIn && (
            <div>
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                Мои списки
              </Link>
            </div>
          )}
          {isLoggedIn && (
            <div>
              <Link href="/my-reserves" onClick={() => setOpen(false)}>
                Мои резервы
              </Link>
            </div>
          )}
          {isLoggedIn ? (
            <>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/placeholder.png" alt="User avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span>Профиль пользователя</span>
              </div>
              <Button onClick={handleLogout}>Выйти</Button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">
                  Войти
                </Button>
              </Link>
              <Link href="/register" onClick={() => setOpen(false)}>
                <Button className="w-full">Регистрация</Button>
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
