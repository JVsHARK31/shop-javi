'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Category } from '@/lib/types';

interface HeaderProps {
  categories: Category[];
  onSearch?: (query: string) => void;
}

export function Header({ categories, onSearch }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-3 px-3 sm:h-16 sm:gap-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 active:opacity-60">
            <Image
              src="/Logo JV.jpg"
              alt="Javier_shark006 Shop Logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-md"
            />
            <span className="hidden text-sm font-bold sm:inline-block sm:text-base lg:text-lg">
              Javier_shark006 Shop
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  Kategori
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/">Semua Produk</Link>
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link href={`/?kategori=${encodeURIComponent(category.name)}`}>
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden w-full max-w-sm lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari produk..."
              className="pl-10 h-10"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <Button asChild variant="outline" size="sm" className="hidden sm:flex h-10">
            <Link href="/admin/login">Admin</Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10 flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="container space-y-4 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari produk..."
                className="pl-10 h-11"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <nav className="flex flex-col space-y-1">
              <Link
                href="/"
                className="rounded-md px-4 py-3 text-sm font-medium hover:bg-accent active:bg-accent/80 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Semua Produk
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/?kategori=${encodeURIComponent(category.name)}`}
                  className="rounded-md px-4 py-3 text-sm hover:bg-accent active:bg-accent/80 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <Link
                href="/admin/login"
                className="rounded-md border border-input px-4 py-3 text-sm font-medium hover:bg-accent active:bg-accent/80 transition-colors mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Login
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
