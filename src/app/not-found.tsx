import Link from "next/link";

export const metadata = { title: "ページが見つかりません", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <section className="section bg-white">
      <div className="container-x text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-2 text-2xl sm:text-3xl">ページが見つかりません</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">お探しのページは、移動または削除された可能性があります。</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-secondary">
            トップページへ
          </Link>
          <Link href="/estimate" className="btn btn-primary">
            60秒で料金を確認
          </Link>
        </div>
      </div>
    </section>
  );
}
