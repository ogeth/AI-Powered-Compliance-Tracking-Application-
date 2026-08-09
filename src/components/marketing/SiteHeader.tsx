"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PRODUCT_NAME, track } from "@/lib/product";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Product", href: "#product" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "For Small Businesses", href: "#audience" },
  { label: "Security", href: "#trust" },
  { label: "Resources", href: "#faq" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent bg-background/85 backdrop-blur transition-all",
        scrolled && "border-border shadow-soft",
      )}
    >
      <div
        className={cn(
          "container-page flex items-center justify-between transition-all",
          scrolled ? "h-14" : "h-20",
        )}
      >
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
          <FileText className="size-6 text-primary" aria-hidden="true" />
          <span className="text-xl">{PRODUCT_NAME}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Log in</Link>
          </Button>
          <Button
            asChild
            size="sm"
            onClick={() => track("homepage_primary_cta_clicked", { location: "header" })}
          >
            <Link href="/signup?intent=record">Create your first record</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon" aria-label="Open navigation menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[86vw] max-w-sm">
            <SheetTitle className="px-4 pt-4 text-base">{PRODUCT_NAME}</SheetTitle>
            <nav aria-label="Mobile" className="mt-4 flex flex-col gap-1 px-2">
              {NAV.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-3 text-base font-medium text-foreground hover:bg-muted"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 flex flex-col gap-3 px-4">
              <Button asChild variant="outline">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup?intent=record">Create your first business record</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
