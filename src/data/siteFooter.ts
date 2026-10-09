/**
 * Site footer content, mirroring the footer on zentrades.pro. Hrefs
 * starting with "/" stay on this site; everything else points at
 * zentrades.pro.
 */

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

const ZT = "https://zentrades.pro";

export const footerColumns: FooterColumn[] = [
  {
    heading: "Modular Features",
    links: [
      { label: "Invoicing & Estimates", href: `${ZT}/coming-soon` },
      { label: "Online Payments", href: `${ZT}/invoicing-payments` },
      { label: "Schedule & Dispatch", href: `${ZT}/feature/scheduling-and-dispatching` },
      { label: "Recurring Inspection", href: `${ZT}/feature/recurring-inspection` },
      { label: "Project Management", href: `${ZT}/feature/project-management` },
      { label: "Crew Management", href: `${ZT}/feature/crew-management` },
      { label: "Inventory Management", href: `${ZT}/zt-inventory-management-feature-page-demo` },
      { label: "Job Costing", href: `${ZT}/features/estimating-and-invoicing` },
      { label: "See All Features", href: `${ZT}/feature/all-feature` },
    ],
  },
  {
    heading: "Verticals Served",
    links: [
      { label: "HVAC", href: `${ZT}/zenhvac` },
      { label: "Plumbing", href: `${ZT}/zenplumbing` },
      { label: "Water", href: `${ZT}/trades/water-restoration-software` },
      { label: "Fire", href: `${ZT}/zenfire` },
      { label: "Kitchen", href: `${ZT}/trades/kitchen-equipment-software` },
      { label: "Electrical", href: `${ZT}/zenelectrical` },
      { label: "Elevator", href: `${ZT}/elevator` },
      { label: "See All Verticals", href: `${ZT}/trades` },
    ],
  },
  {
    heading: "Free Resources",
    links: [
      { label: "Calculators", href: "/calculators" },
      { label: "Templates", href: `${ZT}/templates` },
      { label: "NFPA Handbook", href: `${ZT}/nfpa` },
      { label: "Checklists", href: `${ZT}/zenfire/checklist` },
      { label: "Blog", href: `${ZT}/blog` },
      { label: "Forms", href: `${ZT}/zenfire/forms/free-digital-forms` },
      { label: "Podcast", href: `${ZT}/zenfire/podcast` },
      { label: "News", href: "https://news.zentrades.pro/" },
      { label: "Guides", href: `${ZT}/guides` },
      { label: "Whitepapers", href: `${ZT}/coming-soon` },
      { label: "See All Resources", href: "/" },
    ],
  },
  {
    heading: "About ZenTrades",
    links: [
      { label: "Our Story", href: `${ZT}/about-us` },
      { label: "Contact Us", href: `${ZT}/contact-us` },
      { label: "Referrals", href: `${ZT}/referral` },
      { label: "Events", href: `${ZT}/events` },
      { label: "FAQs", href: `${ZT}/coming-soon` },
      { label: "Integrations", href: `${ZT}/integrations` },
    ],
  },
];

export const footerContact = {
  tagline: "Recognized and Praised by Field Service Businesses Nationwide",
  rating: 4.5,
  addresses: [
    "236 W 27th st Floor 12, New York, NY 10001, United States",
    "A-302, Nyati Tech Park, New Kalyani Nagar, Wadgaon Sheri, Pune-411014",
  ],
  phone: "(206) 456-8988",
  email: "hello@zentrades.pro",
};
