'use client';

import React, { useContext, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserContext } from '@/contexts/UserContext';
import { useMutation } from '@tanstack/react-query';
import apiCall from '@/helper/apiCall';
import { Button } from "@/components/ui/button"; // ShadCN UI Button
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // ShadCN UI Avatar
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // ShadCN UI Popover
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"; // ShadCN UI Sheet for drawer
import { LogOut } from 'lucide-react'; // Correct import for Logout icon

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await apiCall.post('/api/auth/logout');
      return data;
    },
    onSuccess: () => {
      localStorage.removeItem('token');
      setUser(null);
      router.replace('/login');
    },
    onError: (error) => {
      console.log('Logout failed:', error);
    },
  });

  const handleLogout = () => {
    mutation.mutate();
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all backdrop-blur-3xl border-b-[1px] border-white/60 justify-around  ${
        pathname === '/login' || pathname === '/register'
          ? 'bg-transparent'
          : 'bg-white/90'
      }`}
    >
      <div className="flex justify-between items-center px-20 py-2 lg:px-36">
        {/* Logo */}
        <div>
          <Link href="/" className="font-medium text-2xl lg:text-2xl border-black/30 border-2 px-2 text-black/80 bg-orange-100  xl:sm:w-40">
            Luno.event
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-3">
          <Link href="/eventSearch">
            <Button variant="link" className='text-sm font-sans'>Explore </Button>
          </Link>
          <Link href="/event">
            <Button variant="link" className='text-sm font-sans'>Dashboard </Button>
          </Link>
          <Link href="/event"> 
            <Button variant="link" className='text-sm font-sans'>Helper </Button>
          </Link>
        </div>

        {/* User Avatar or Login/Register */}
        {user?.email ? (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <button className="flex items-end justify-end space-x-2   xl:sm:w-36 ">
                <Avatar>
                  <AvatarImage
                    src={user.image ? `http://localhost:8000${user.image}` : '/pngegg.png'}
                  />
                  <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-38 bg-gray-50/60 backdrop-blur-3xl mt-3">
              <div className="flex flex-col space-y-2 p-2 ">
                <div className='pl-4'>Points: {user.points ?? 'N/A'}</div>
                <div className='pl-4'>Balance: {user.balance ?? 'N/A'}</div>
                <Button
                  variant="link"
                  className="justify-start h-7"
                  onClick={() => {
                    router.push(user.role === 'ADMIN' ? '/admin/profile' : '/user/profile');
                    setIsOpen(false);
                  }}
                >
                  Profile
                </Button>
                <Button
                  variant="link"
                  className="justify-start h-7"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover> 
        ) : (
          <div className="flex space-x-4 xl:sm:w-40">
            <Button className=' border-[1px] text-sm rounded-full bg-gray-300 hover:bg-gray-200 py-0 px-4 border-black/40 font-sans font-medium' onClick={() => router.replace('/login')}>
              Login
            </Button>
            <Button className='text-sm font-sans font-medium' onClick={() => router.replace('/register')}>
              Register
            </Button>
          </div>
        )}

        {/* Mobile Menu (Drawer) */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-4 p-4">
              <Link href="/eventSearch">
                <Button variant="link">Explore</Button>
              </Link>
              <Link href="/event">
                <Button variant="link">Dashboard</Button>
              </Link>
              <Link href="/event">
                <Button variant="link">Helper</Button>
              </Link>
              <div className="border-t pt-4">
                {user?.email && (
                  <>
                    <div>Points: {user.points ?? 'N/A'}</div>
                    <div>Balance: {user.balance ?? 'N/A'}</div>
                    <Button
                      variant="link"
                      onClick={() => {
                        router.push(user.role === 'ADMIN' ? '/admin/profile' : '/user/profile');
                      }}
                    >
                      Profile
                    </Button>
                    <Button variant="link" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
