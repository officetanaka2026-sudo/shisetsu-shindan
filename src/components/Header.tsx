"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { navItems, site } from "@/config/site";
import { contact } from "@/config/contact";
import { serviceList } from "@/content/services";
import { TrackedAnchor, TrackedLink } from "./TrackedLink";

export function Header() {
  const [open, setOpen] = useState(false); // モバイルメニュー
  const [sub, setSub] = useState(false); // サービスのドロップダウン
  const pathname = usePathname();
  const subRef = useRef<HTMLDivElement>(null);

  // ページ遷移でメニューを閉じる（レンダー中に前回のパスと比較する方式）
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(false);
    setSub(false);
  }

  // ドロップダウン外クリック・Escで閉じる
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (subRef.current && !subRef.current.contains(e.target as Node)) setSub(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSub(false);
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-navy" aria-label={`${site.name} トップページ`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-navy text-white" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="2" />
              <path d="M10 10L6 6M14 10l4-4M10 14l-4 4M14 14l4 4" />
              <circle cx="5" cy="5" r="1.6" />
              <circle cx="19" cy="5" r="1.6" />
              <circle cx="5" cy="19" r="1.6" />
              <circle cx="19" cy="19" r="1.6" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-wide">{site.name}</span>
        </Link>

        {/* PC ナビ */}
        <nav aria-label="メインナビゲーション" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) =>
            "children" in item ? (
              <div key={item.label} ref={subRef} className="relative">
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-ink hover:bg-light"
                  aria-expanded={sub}
                  aria-haspopup="true"
                  onClick={() => setSub((v) => !v)}
                >
                  {item.label}
                  <svg viewBox="0 0 12 12" className={`h-3 w-3 transition-transform ${sub ? "rotate-180" : ""}`} aria-hidden="true">
                    <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </button>
                {sub && (
                  <ul className="absolute left-0 top-full mt-1 w-56 rounded-lg border border-line bg-white p-1 shadow-lg">
                    {serviceList.map((s) => (
                      <li key={s.slug}>
                        <TrackedLink
                          href={`/services/${s.slug}`}
                          event="service_click"
                          eventParams={{ service: s.slug, location: "header" }}
                          className="block rounded-md px-3 py-2 text-sm hover:bg-light"
                        >
                          {s.name}
                        </TrackedLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <Link key={item.label} href={item.href} className="rounded-md px-3 py-2 text-sm font-medium text-ink hover:bg-light">
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          {contact.phone && contact.phoneHref && (
            <TrackedAnchor
              href={contact.phoneHref}
              event="phone_click"
              eventParams={{ location: "header", target: "estimate" }}
              className="hidden text-sm font-bold text-navy xl:block"
            >
              {contact.phone}
            </TrackedAnchor>
          )}
          <TrackedLink
            href="/estimate"
            event="contact_click"
            eventParams={{ location: "header", target: "estimate" }}
            className="btn btn-primary hidden !min-h-10 !px-4 !py-2 text-sm sm:inline-flex"
          >
            60秒見積
          </TrackedLink>
          <TrackedLink
            href="/estimate"
            event="contact_click"
            eventParams={{ location: "header", target: "estimate" }}
            className="btn btn-primary !min-h-10 !px-3 !py-2 text-sm sm:hidden"
          >
            無料見積
          </TrackedLink>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-line lg:hidden"
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* モバイルメニュー */}
      {open && (
        <nav id="mobile-menu" aria-label="モバイルメニュー" className="border-t border-line bg-white lg:hidden">
          <ul className="container-x py-2">
            <li className="px-1 pt-2 text-xs font-bold text-muted">サービス</li>
            {serviceList.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="block rounded-md px-3 py-3 text-base hover:bg-light">
                  {s.name}
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-line pt-2">
              {navItems
                .filter((i) => !("children" in i))
                .map((item) => (
                  <Link key={item.label} href={item.href} className="block rounded-md px-3 py-3 text-base hover:bg-light">
                    {item.label}
                  </Link>
                ))}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

