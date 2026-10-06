import { merits } from "@/content/common";
import { Icon } from "./Icon";

/** ドローン点検のメリット（4つに限定） */
export function Merits() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {merits.map((m) => (
        <li key={m.title} className="rounded-xl border border-line bg-white p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-tint text-blue">
            <Icon name={m.icon} className="h-6 w-6" />
          </span>
          <h3 className="mt-3 text-lg">{m.title}</h3>
          <p className="mt-1 text-sm leading-7 text-muted">{m.text}</p>
        </li>
      ))}
    </ul>
  );
}
