/**
 * 導入事例（将来用）。実績を取得したらここに追加し、CASES_ENABLED=true にすると /cases が公開されます。
 * 現在は実績がないため空です（架空の事例は作成しません）。
 */
export type CaseStudy = {
  slug: string;
  title: string;
  facilityType: string;
  area: string;
  scale: string;
  challenge: string;
  method: string;
  duration: string;
  result: string;
  images?: { src: string; alt: string }[];
  publishedAt: string;
};

export const cases: CaseStudy[] = [];
