/** 構造化データ（JSON-LD）を出力します。"<" をエスケープして、スクリプトタグの途中終了を防ぎます。 */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

