import Image from "next/image";
import { equipment } from "@/config/equipment";
import { features } from "@/config/features";
import { Section } from "./Section";

/** 使用機体。EQUIPMENT_SECTION_ENABLED=true かつ src/config/equipment.ts に実機の情報がある場合のみ表示されます。 */
export function EquipmentSection() {
  if (!features.equipmentSectionEnabled || equipment.length === 0) return null;
  return (
    <Section eyebrow="EQUIPMENT" title="使用機体" tone="white">
      <ul className="grid gap-5 md:grid-cols-2">
        {equipment.map((e) => (
          <li key={e.name} className="overflow-hidden rounded-xl border border-line bg-white">
            {e.image && <Image src={e.image} alt={e.imageAlt ?? e.name} width={800} height={500} className="h-auto w-full" />}
            <div className="p-5">
              <h3 className="text-lg">{e.name}</h3>
              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-muted">用途</dt>
                  <dd>{e.use}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-muted">カメラ</dt>
                  <dd>{e.camera}</dd>
                </div>
                {e.infrared && (
                  <div className="flex gap-2">
                    <dt className="w-24 shrink-0 text-muted">赤外線</dt>
                    <dd>{e.infrared}</dd>
                  </div>
                )}
                {e.flightTime && (
                  <div className="flex gap-2">
                    <dt className="w-24 shrink-0 text-muted">飛行時間</dt>
                    <dd>{e.flightTime}</dd>
                  </div>
                )}
                {e.windResistance && (
                  <div className="flex gap-2">
                    <dt className="w-24 shrink-0 text-muted">耐風性能</dt>
                    <dd>{e.windResistance}</dd>
                  </div>
                )}
              </dl>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
