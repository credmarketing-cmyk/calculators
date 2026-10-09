import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Mail, MapPin, MoveRight, Phone, Star } from "lucide-react";
import { footerColumns, footerContact, type FooterLink } from "@/data/siteFooter";
import FooterNewsletter from "./FooterNewsletter";

function FooterAnchor({ link }: { link: FooterLink }) {
  const className =
    "group flex items-start gap-3.5 text-[15px] font-bold tracking-[0.06em] text-[#d4d1d3] transition-colors hover:text-white";
  const content = (
    <>
      <MoveRight
        className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand transition-transform duration-200 group-hover:translate-x-1"
        strokeWidth={2.4}
      />
      {link.label}
    </>
  );
  return link.href.startsWith("/") ? (
    <Link href={link.href} className={className}>
      {content}
    </Link>
  ) : (
    <a href={link.href} className={className}>
      {content}
    </a>
  );
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`Rated ${value} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className="relative h-4 w-4">
            <Star className="absolute inset-0 h-4 w-4 text-[#f5b552]/35" fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="h-4 w-4 text-[#f5b552]" fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        );
      })}
    </div>
  );
}

function ContactRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-[13px] leading-relaxed text-[#cfcbcd]">
      <span className="mt-0.5 shrink-0 text-brand">{icon}</span>
      <span>{children}</span>
    </li>
  );
}

/** Site-wide footer, mirroring the footer on zentrades.pro. */
export default function SiteFooter() {
  const { tagline, rating, addresses, phone, email } = footerContact;

  return (
    <footer className="relative overflow-hidden bg-[#121212] font-sans text-white">
      {/* Deep red glow in the bottom-right corner, as on zentrades.pro */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_100%_100%,rgba(150,22,38,0.75),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[1240px] px-6 pb-12 pt-14 lg:px-8 lg:pt-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_230px] lg:gap-8">
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.heading}>
                <h2 className="text-lg font-bold uppercase tracking-[0.04em] text-white">
                  {column.heading}
                </h2>
                <span aria-hidden="true" className="mt-2.5 block h-[3px] w-32 translate-x-7 rounded-full bg-brand" />
                <ul className="mt-8 space-y-4">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <FooterAnchor link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Brand / contact card */}
          <div className="self-start rounded-2xl border border-white/5 bg-[#121212] px-6 py-8 shadow-[0_0_34px_-6px_rgba(238,85,102,0.55)]">
            <div className="flex flex-col items-center text-center">
              <Image
                src="/zentrades-ai-logo.webp"
                alt="ZenTrades.AI - FSM Software"
                width={300}
                height={90}
                className="h-auto w-36"
              />
              <div className="mt-4">
                <StarRating value={rating} />
              </div>
              <p className="mt-4 text-[15px] italic leading-relaxed text-white">{tagline}</p>
              <div className="mt-6 flex items-center gap-3">
                <Image
                  src="/google-play-badge.png"
                  alt="Get it on Google Play"
                  width={216}
                  height={64}
                  className="h-9 w-auto"
                />
                <Image
                  src="/app-store-badge.svg"
                  alt="Download on the App Store"
                  width={120}
                  height={40}
                  className="h-9 w-auto"
                />
              </div>
            </div>

            <ul className="mt-8 space-y-4">
              {addresses.map((address) => (
                <ContactRow key={address} icon={<MapPin className="h-4 w-4" />}>
                  {address}
                </ContactRow>
              ))}
              <ContactRow icon={<Phone className="h-4 w-4" />}>
                <a href={`tel:+1${phone.replace(/\D/g, "")}`} className="hover:text-white">
                  {phone}
                </a>
              </ContactRow>
              <ContactRow icon={<Mail className="h-4 w-4" />}>
                <a href={`mailto:${email}`} className="break-all hover:text-white">
                  {email}
                </a>
              </ContactRow>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 md:flex-row md:items-center md:gap-10">
          <p className="max-w-sm text-[17px] font-semibold capitalize leading-snug tracking-[0.03em] text-white">
            Subscribe to our newsletter and get latest field service updates at all times.
          </p>
          <FooterNewsletter />
        </div>
      </div>
    </footer>
  );
}
