import {
  ArrowUpDown,
  BadgeDollarSign,
  Boxes,
  CalendarClock,
  CalendarDays,
  ChefHat,
  CircleHelp,
  ClipboardCheck,
  CreditCard,
  Droplets,
  FileText,
  Flame,
  Gift,
  Info,
  KanbanSquare,
  Mail,
  Users,
  Waves,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Site header navigation, mirroring the main menu on zentrades.pro so the
 * two sites feel like one. Hrefs starting with "/" stay on this site and
 * are rendered with next/link; everything else points at zentrades.pro.
 */

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
}

export interface NavLinkGroup {
  heading: string;
  links: NavLink[];
}

export type NavMenu =
  | { kind: "link"; label: string; href: string }
  | { kind: "list"; label: string; links: NavLink[] }
  | {
      kind: "groups";
      label: string;
      groups: NavLinkGroup[];
      footer: NavLink;
    }
  | { kind: "cards"; label: string; links: NavLink[]; footer: NavLink }
  | {
      kind: "resources";
      label: string;
      links: NavLink[];
      footer: NavLink;
      promo: { title: string; accent: string; body: string; href: string };
    };

const ZT = "https://zentrades.pro";

export const LOGIN_HREF = "https://app.zentrades.pro/login";
export const BOOK_DEMO_HREF = `${ZT}/book-demo`;
export const HOME_HREF = ZT;

export const siteNav: NavMenu[] = [
  {
    kind: "list",
    label: "Company",
    links: [
      { label: "About Us", href: `${ZT}/about-us`, icon: Info },
      { label: "Contact Us", href: `${ZT}/contact-us`, icon: Mail },
      { label: "Referrals", href: `${ZT}/referral`, icon: Gift },
      { label: "Events", href: `${ZT}/events`, icon: CalendarDays },
      { label: "FAQs", href: `${ZT}/coming-soon`, icon: CircleHelp },
    ],
  },
  {
    kind: "groups",
    label: "Industry",
    groups: [
      {
        heading: "Compliance",
        links: [
          { label: "Fire", href: `${ZT}/zenfire`, icon: Flame },
          { label: "Electrical", href: `${ZT}/zenelectrical`, icon: Zap },
          { label: "Elevator", href: `${ZT}/elevator`, icon: ArrowUpDown },
        ],
      },
      {
        heading: "Trades",
        links: [
          { label: "HVAC", href: `${ZT}/zenhvac`, icon: Wind },
          { label: "Plumbing", href: `${ZT}/zenplumbing`, icon: Droplets },
          {
            label: "Kitchen",
            href: `${ZT}/trades/kitchen-equipment-software`,
            icon: ChefHat,
          },
          {
            label: "Water",
            href: `${ZT}/trades/water-restoration-software`,
            icon: Waves,
          },
        ],
      },
    ],
    footer: { label: "All Industries", href: `${ZT}/trades` },
  },
  {
    kind: "cards",
    label: "Solution",
    links: [
      {
        label: "Invoicing & Estimate",
        href: `${ZT}/feature/estimate-proposals`,
        description: "Easily generate professional estimates and invoices in seconds.",
        icon: FileText,
      },
      {
        label: "Project Management",
        href: `${ZT}/feature/project-management`,
        description: "Track job progress, deadlines, and team tasks with clarity.",
        icon: KanbanSquare,
      },
      {
        label: "Online Payments",
        href: `${ZT}/feature/quickbooks-integration`,
        description: "Get paid faster with secure, built-in online payment options.",
        icon: CreditCard,
      },
      {
        label: "Crew Management",
        href: `${ZT}/feature/crew-management`,
        description: "Assign, manage, and monitor crew tasks from a single dashboard.",
        icon: Users,
      },
      {
        label: "Schedule & Dispatch",
        href: `${ZT}/feature/scheduling-and-dispatching`,
        description: "Quickly schedule jobs and dispatch teams with real-time updates.",
        icon: CalendarClock,
      },
      {
        label: "Inventory Management",
        href: `${ZT}/features/inventory-management`,
        description: "Keep tabs on tools and materials to avoid stockouts or overstocking.",
        icon: Boxes,
      },
      {
        label: "Recurring Inspection",
        href: `${ZT}/feature/recurring-inspection`,
        description: "Automate repeat inspections and stay compliant without hassle.",
        icon: ClipboardCheck,
      },
      {
        label: "Job Costing",
        href: `${ZT}/feature/estimating-and-invoicing`,
        description: "Break down job costs and track profitability in real-time.",
        icon: BadgeDollarSign,
      },
    ],
    footer: { label: "All Features", href: `${ZT}/feature/all-feature` },
  },
  {
    kind: "resources",
    label: "Resources",
    links: [
      { label: "Calculators", href: "/calculators" },
      { label: "Templates", href: `${ZT}/templates` },
      { label: "NFPA Handbook", href: `${ZT}/nfpa` },
      { label: "Checklists", href: `${ZT}/zenfire/checklist` },
      { label: "Blog", href: `${ZT}/blog` },
      { label: "Forms", href: `${ZT}/zenfire/forms/free-digital-forms` },
      { label: "Podcast", href: `${ZT}/zenfire/podcast` },
      { label: "Guides", href: `${ZT}/guides` },
      { label: "News", href: "https://news.zentrades.pro/" },
      { label: "Whitepapers", href: `${ZT}/coming-soon` },
    ],
    footer: { label: "All Resources", href: "/" },
    promo: {
      title: "Tools For",
      accent: "Trades",
      body: "Use our free tools and calculators — curated specially for trade businesses.",
      href: "/calculators",
    },
  },
  { kind: "link", label: "Pricing", href: `${ZT}/pricing` },
  {
    kind: "list",
    label: "Why ZenTrades",
    links: [
      { label: "Comparison", href: `${ZT}/zentrades-vs-the-competitors` },
      { label: "Reviews", href: `${ZT}/coming-soon` },
      { label: "Case Studies", href: `${ZT}/case-study` },
      { label: "Integrations", href: `${ZT}/integrations` },
      { label: "Testimonials", href: `${ZT}/testimonials` },
    ],
  },
];
