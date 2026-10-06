import type { IconName } from "@/content/types";

const paths: Record<IconName, React.ReactNode> = {
  solar: (
    <>
      <path d="M3 8h18l-2.5 9h-13z" />
      <path d="M9 8l-1 9M15 8l1 9M4.5 12.5h15" />
      <circle cx="18" cy="4" r="1.6" />
    </>
  ),
  construction: (
    <>
      <path d="M3 21h18" />
      <path d="M6 21V9l6-4v16M12 9h6v12" />
      <path d="M12 5V3M9 12h1M9 16h1M15 13h1M15 17h1" />
    </>
  ),
  roof: (
    <>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  factory: (
    <>
      <path d="M3 21V10l6 3V10l6 3V6h3v15z" />
      <path d="M3 21h18M8 17h1M12 17h1M16 17h1" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
      <path d="M8.5 12l2.5 2.5L15.5 10" />
    </>
  ),
  speed: (
    <>
      <path d="M4 16a8 8 0 1116 0" />
      <path d="M12 16l4-5" />
      <path d="M12 16h.01" />
    </>
  ),
  yen: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 7l3.5 5 3.5-5M12 12v6M9 13.5h6M9 16h6" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
      <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  area: (
    <>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0112 2.5a7 7 0 017 7C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  document: (
    <>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4M10 12h5M10 16h5" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  drone: (
    <>
      <circle cx="12" cy="12" r="2.2" />
      <path d="M9.8 10.2L6 6.5M14.2 10.2L18 6.5M9.8 13.8L6 17.5M14.2 13.8L18 17.5" />
      <circle cx="5" cy="5.5" r="2" />
      <circle cx="19" cy="5.5" r="2" />
      <circle cx="5" cy="18.5" r="2" />
      <circle cx="19" cy="18.5" r="2" />
    </>
  ),
};

export function Icon({ name, className = "h-6 w-6" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
