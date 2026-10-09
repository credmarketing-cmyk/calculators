"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import {
  BOOK_DEMO_HREF,
  HOME_HREF,
  LOGIN_HREF,
  siteNav,
  type NavLink,
  type NavMenu,
} from "@/data/siteNav";
import { cn } from "@/lib/utils";

/** Internal hrefs get client-side navigation; zentrades.pro links are plain anchors. */
function NavAnchor({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

function BookDemoButton({ compact, onClick }: { compact?: boolean; onClick?: () => void }) {
  return (
    <a
      href={BOOK_DEMO_HREF}
      onClick={onClick}
      className={cn(
        "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-[#121212] font-semibold tracking-[0.06em] text-[#f6bfc3] shadow-[7px_7px_15px_-2px_rgba(238,85,102,0.7)] transition-all duration-200 hover:text-white hover:shadow-[5px_5px_18px_-2px_rgba(238,85,102,0.85)] active:scale-[0.98]",
        compact ? "px-3.5 py-2.5 text-xs" : "px-[18px] py-3.5 text-[15px]"
      )}
    >
      Book a Demo
      <ArrowRight
        className={cn(
          "transition-transform duration-200 group-hover:translate-x-0.5",
          compact ? "h-3.5 w-3.5" : "h-4 w-4"
        )}
      />
    </a>
  );
}

function FooterLink({ link, onNavigate }: { link: NavLink; onNavigate: () => void }) {
  return (
    <div className="mt-6 border-t border-brand/40 pt-5">
      <NavAnchor
        href={link.href}
        onClick={onNavigate}
        className="group inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-[#050505] transition-colors hover:text-brand"
      >
        {link.label}
        <ArrowRight className="h-4 w-4 text-brand transition-transform duration-200 group-hover:translate-x-1" />
      </NavAnchor>
    </div>
  );
}

/** Desktop dropdown contents, one layout per menu kind (matches zentrades.pro). */
function MenuPanel({ menu, onNavigate }: { menu: NavMenu; onNavigate: () => void }) {
  const itemText =
    "text-[15px] font-semibold tracking-[0.04em] text-[#050505] transition-colors group-hover:text-brand";

  switch (menu.kind) {
    case "link":
      return null;

    case "list":
      return (
        <ul className="w-64 space-y-1 p-3">
          {menu.links.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <NavAnchor
                href={href}
                onClick={onNavigate}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[#fff6f7]"
              >
                {Icon ? (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand/40 text-brand">
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                  </span>
                ) : (
                  <ArrowRight className="h-4 w-4 shrink-0 text-brand" />
                )}
                <span className={itemText}>{label}</span>
              </NavAnchor>
            </li>
          ))}
        </ul>
      );

    case "groups":
      return (
        <div className="w-[480px] p-7">
          <div className="grid grid-cols-2 gap-8">
            {menu.groups.map((group) => (
              <div key={group.heading}>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                  {group.heading}
                </p>
                <ul className="mt-3 space-y-1">
                  {group.links.map(({ label, href, icon: Icon }) => (
                    <li key={label}>
                      <NavAnchor
                        href={href}
                        onClick={onNavigate}
                        className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-[#fff6f7]"
                      >
                        {Icon && (
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand/40 text-brand">
                            <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                          </span>
                        )}
                        <span className={itemText}>{label}</span>
                      </NavAnchor>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <FooterLink link={menu.footer} onNavigate={onNavigate} />
        </div>
      );

    case "cards":
      return (
        <div className="w-[min(1000px,calc(100vw-48px))] p-8">
          <ul className="grid grid-cols-4 gap-x-6 gap-y-8">
            {menu.links.map(({ label, href, description, icon: Icon }) => (
              <li key={label}>
                <NavAnchor
                  href={href}
                  onClick={onNavigate}
                  className="group flex flex-col items-center rounded-2xl px-2 py-1 text-center"
                >
                  {Icon && (
                    <span className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-brand/70 text-brand transition-all duration-200 group-hover:-translate-y-0.5 group-hover:bg-brand group-hover:text-white">
                      <Icon className="h-6 w-6" strokeWidth={1.7} />
                    </span>
                  )}
                  <span className={cn(itemText, "mt-3.5")}>{label}</span>
                  {description && (
                    <span className="mt-1 text-xs leading-relaxed tracking-wide text-[#3a3a3e]">
                      {description}
                    </span>
                  )}
                </NavAnchor>
              </li>
            ))}
          </ul>
          <FooterLink link={menu.footer} onNavigate={onNavigate} />
        </div>
      );

    case "resources":
      return (
        <div className="flex w-[min(860px,calc(100vw-48px))]">
          <div className="flex-1 p-8">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-1">
              {menu.links.map(({ label, href }) => (
                <li key={label}>
                  <NavAnchor
                    href={href}
                    onClick={onNavigate}
                    className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[#fff6f7]"
                  >
                    <ArrowRight className="h-4 w-4 shrink-0 text-brand transition-transform duration-200 group-hover:translate-x-0.5" />
                    <span className={itemText}>{label}</span>
                  </NavAnchor>
                </li>
              ))}
            </ul>
            <FooterLink link={menu.footer} onNavigate={onNavigate} />
          </div>
          <NavAnchor
            href={menu.promo.href}
            onClick={onNavigate}
            className="group flex w-[300px] flex-col justify-center border-l border-[#121212]/80 bg-gradient-to-br from-[#fff6f7] to-white p-8 text-center"
          >
            <span className="text-2xl font-extrabold tracking-tight text-[#050505]">
              {menu.promo.title} <span className="text-brand">{menu.promo.accent}</span>
            </span>
            <span className="mt-3 text-sm font-medium leading-relaxed text-[#3a3a3e]">
              {menu.promo.body}
            </span>
            <span className="mt-5 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-brand">
              Explore calculators
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </NavAnchor>
        </div>
      );
  }
}

/** Mobile drawer: each dropdown becomes an accordion of plain links. */
function MobileSection({
  menu,
  expanded,
  onToggle,
  onNavigate,
}: {
  menu: NavMenu;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const panelId = useId();

  if (menu.kind === "link") {
    return (
      <NavAnchor
        href={menu.href}
        onClick={onNavigate}
        className="block py-4 text-base font-semibold text-[#050505]"
      >
        {menu.label}
      </NavAnchor>
    );
  }

  const links: NavLink[] =
    menu.kind === "groups"
      ? [...menu.groups.flatMap((g) => g.links), menu.footer]
      : menu.kind === "list"
        ? menu.links
        : [...menu.links, menu.footer];

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
        className={cn(
          "flex w-full items-center justify-between py-4 text-left text-base font-semibold transition-colors",
          expanded ? "text-brand" : "text-[#050505]"
        )}
      >
        {menu.label}
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-200", expanded && "rotate-180")}
        />
      </button>
      {expanded && (
        <ul id={panelId} className="grid grid-cols-2 gap-x-4 gap-y-1 pb-4">
          {links.map(({ label, href }) => (
            <li key={label}>
              <NavAnchor
                href={href}
                onClick={onNavigate}
                className="flex items-center gap-2 rounded-lg py-2 text-sm font-medium text-[#3a3a3e] hover:text-brand"
              >
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-brand" />
                {label}
              </NavAnchor>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);

  const closeAll = useCallback(() => {
    cancelClose();
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  }, [cancelClose]);

  // Close everything when the route changes (e.g. after clicking a link).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  }

  // Escape and outside clicks close any open menu.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeAll();
    }
    function onPointerDown(e: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [closeAll]);

  // Lock page scroll behind the mobile drawer.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => cancelClose, [cancelClose]);

  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 160);
  }

  return (
    <header
      ref={headerRef}
      className="relative z-[70] border-b border-[#f0eeea] bg-white font-sans"
    >
      <div className="relative mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6 xl:h-[88px] xl:px-8">
        {/* Mobile: hamburger on the left, like zentrades.pro */}
        <button
          type="button"
          className="-ml-1 flex h-10 w-10 items-center justify-center rounded-lg text-[#050505] xl:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="site-mobile-menu"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <a href={HOME_HREF} className="shrink-0" aria-label="ZenTrades home">
          <Image
            src="/zentrades-logo.png"
            alt="ZenTrades"
            width={768}
            height={107}
            loading="eager"
            className="h-[19px] w-auto sm:h-[22px]"
          />
        </a>

        {/* Desktop navigation */}
        <nav
          aria-label="Main"
          className="hidden xl:block"
          onPointerEnter={(e) => e.pointerType === "mouse" && cancelClose()}
          onPointerLeave={(e) => e.pointerType === "mouse" && scheduleClose()}
        >
          <ul className="flex items-center gap-3">
            {siteNav.map((menu) => {
              if (menu.kind === "link") {
                return (
                  <li key={menu.label}>
                    <NavAnchor
                      href={menu.href}
                      className="block whitespace-nowrap rounded-lg px-2.5 py-2 text-base font-medium text-[#050505] transition-colors hover:text-brand"
                    >
                      {menu.label}
                    </NavAnchor>
                  </li>
                );
              }

              const isOpen = openMenu === menu.label;
              const panelId = `site-nav-${menu.label.toLowerCase().replace(/\s+/g, "-")}`;
              return (
                <li
                  key={menu.label}
                  // Short lists open under their own button; wide panels center on the header.
                  className={menu.kind === "list" ? "relative" : undefined}
                  onPointerEnter={(e) => {
                    if (e.pointerType !== "mouse") return;
                    cancelClose();
                    setOpenMenu(menu.label);
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenMenu(isOpen ? null : menu.label)}
                    className={cn(
                      "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-base font-medium transition-colors",
                      isOpen ? "text-brand" : "text-[#050505] hover:text-brand"
                    )}
                  >
                    {menu.label}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                      strokeWidth={2.4}
                    />
                  </button>

                  {isOpen && (
                    <div
                      id={panelId}
                      className={cn(
                        "absolute left-1/2 top-full -translate-x-1/2",
                        menu.kind === "list" ? "pt-7" : "pt-2"
                      )}
                    >
                      <div className="animate-fade-up overflow-hidden rounded-2xl border border-[#f0eeea] bg-white shadow-[0_30px_70px_-24px_rgba(238,85,102,0.45),0_10px_30px_-12px_rgba(18,18,18,0.12)]">
                        <MenuPanel menu={menu} onNavigate={closeAll} />
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-5">
          <a
            href={LOGIN_HREF}
            className="hidden text-base font-medium text-black transition-colors hover:text-brand xl:inline"
          >
            Login
          </a>
          <span className="hidden sm:inline-flex">
            <BookDemoButton />
          </span>
          <span className="sm:hidden">
            <BookDemoButton compact />
          </span>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          id="site-mobile-menu"
          className="absolute inset-x-0 top-full h-[calc(100dvh-72px)] overflow-y-auto border-t border-[#f0eeea] bg-white px-4 pb-10 sm:px-6 xl:hidden"
        >
          <nav aria-label="Main" className="divide-y divide-[#f0eeea]">
            {siteNav.map((menu) => (
              <MobileSection
                key={menu.label}
                menu={menu}
                expanded={mobileExpanded === menu.label}
                onToggle={() =>
                  setMobileExpanded((cur) => (cur === menu.label ? null : menu.label))
                }
                onNavigate={closeAll}
              />
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <BookDemoButton onClick={closeAll} />
            <a
              href={LOGIN_HREF}
              className="rounded-[10px] border border-[#121212]/15 py-3 text-center text-[15px] font-semibold text-[#050505]"
            >
              Login
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
