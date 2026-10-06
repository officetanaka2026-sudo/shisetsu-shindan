/**
 * 使用機体。現在は未確定のため空です（架空の機体は掲載しません）。
 * 機体が確定したら配列に追加し、環境変数 EQUIPMENT_SECTION_ENABLED=true にしてください。
 */
export type Equipment = {
  name: string;
  image?: string;
  imageAlt?: string;
  camera: string;
  infrared?: string;
  flightTime?: string;
  windResistance?: string;
  use: string;
};

export const equipment: Equipment[] = [];
