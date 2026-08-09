"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  Building2,
  CalendarClock,
  ChevronDown,
  FileText,
  Files,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Menu,
  Search,
  Settings,
  Sparkles,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PRODUCT_NAME } from "@/lib/product";
import { cn } from "@/lib/utils";

const NAV: { to: string; label: string; icon: typeof FileText; badge?: string }[] = [
  { to: "/app", label: "Overview", icon: LayoutDashboard },
  { to: "/app/records/new", label: "Create Record", icon: Sparkles, badge: "Beta" },
  { to: "/app/records", label: "Business Records", icon: FileText },
  { to: "/app/documents", label: "Documents", icon: Files },
  { to: "/app/compliance", label: "Compliance Map", icon: MapPinned, badge: "Coming soon" },
  { to: "/app/calendar", label: "Calendar", icon: CalendarClock, badge: "Coming soon" },
  { to: "/app/business-profile", label: "Business Profile", icon: Building2 },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Workspace" className="flex flex-col gap-1 p-3">
      {NAV.map((item) => {
        const active = item.to === "/app" ? pathname === "/app" : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            href={item.to}
            {...(onNavigate ? { onClick: onNavigate } : {})}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0" aria-hidden="true" />
            <span className="flex-1">{item.label}</span>
            {item.badge ? (
              <Badge variant="secondary" className="text-[0.65rem]">
                {item.badge}
              </Badge>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { firstName, lastName, user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const initials = `${firstName?.[0] ?? "U"}${lastName?.[0] ?? ""}`.toUpperCase();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
          <Link href="/app" className="flex h-16 items-center gap-2 px-5 font-semibold">
            {PRODUCT_NAME}
          </Link>
          <NavList />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur no-print">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon" aria-label="Open workspace navigation">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="px-5 pt-5 text-base">{PRODUCT_NAME}</SheetTitle>
                <NavList onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>

            <Button
              variant="ghost"
              size="sm"
              className="hidden gap-2 sm:flex"
              aria-label="Business switcher"
            >
              <Building2 className="size-4" />
              My business
              <ChevronDown className="size-3.5" />
            </Button>

            <div className="relative ml-auto hidden max-w-xs flex-1 md:block">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                className="pl-9"
                placeholder="Search records"
                aria-label="Global search"
                onKeyDown={(e) => {
                  if (e.key === "Enter") router.push("/app/records");
                }}
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="ml-auto md:ml-0"
            >
              <Bell className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Help" asChild>
              <Link href="/disclaimer">
                <HelpCircle className="size-4" />
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account menu">
                  <span className="flex size-8 items-center justify-center rounded-full bg-navy text-xs font-semibold text-navy-foreground">
                    {initials}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-xs text-muted-foreground">{user?.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/app/settings">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/app/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="size-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
