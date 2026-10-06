/** 日本語の見出しを「、」「。」の区切りで折り返し、文節の途中で改行されないようにします。 */
export function Phrases({ text }: { text: string }) {
  return (
    <>
      {text.split(/(?<=[、。])/).map((p, i) => (
        <span key={i} className="inline-block">
          {p}
        </span>
      ))}
    </>
  );
}