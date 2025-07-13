'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Target, Landmark, PiggyBank } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import type { User } from '@supabase/supabase-js';

export function AppSidebar({ user }: { user: User | null }) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/budget', label: 'Budget', icon: PiggyBank },
    { href: '/goals', label: 'Goals', icon: Target },
    { href: '/net-worth', label: 'Net Worth', icon: Landmark },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r border-border/60"
    >
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={{ children: item.label }}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
