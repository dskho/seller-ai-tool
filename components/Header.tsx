import Link from "next/link";

const NAV = [
  { href: "/", label: "首页" },
  { href: "/tools/review-reply", label: "差评回复" },
  { href: "/tools/title-seo", label: "标题优化" },
  { href: "/#pricing", label: "定价" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-base font-bold text-stone-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-600 text-base text-white">
            小
          </span>
          电商小工
        </Link>
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto whitespace-nowrap text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/signup"
          className="shrink-0 rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700"
        >
          免费试用
        </Link>
      </div>
    </header>
  );
}
