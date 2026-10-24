import Link from "next/link";
import { readHome } from "../content/service";
import type { HomeContent } from "../content/contract";

export default async function PublicFooter() {
  const { general } = await readHome();
  return <PublicFooterContent general={general} />;
}

export function PublicFooterContent({ general }: { general: HomeContent["general"] }) {
  return (
    <footer
      id="contact"
      className="mt-20 bg-[#252525] px-4 py-14 text-[#f7f4ed] sm:px-6 lg:mt-28 lg:px-10 lg:py-20"
    >
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="storefront-display text-3xl">Vintic</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#c7c2b8]">{general.tagline}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#8f8a81]">Khám phá</p>
          <div className="mt-5 grid gap-3 text-sm">
            <Link href="/products">Đồng hồ đang có</Link>
            <Link href="/stories">Chuyện đồng hồ</Link>
            <Link href="/#collections">Bộ sưu tập</Link>
            {general.links.map((link, i) => (
              <a key={i} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#8f8a81]">Liên hệ</p>
          <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#c7c2b8]">
            {general.contact || "Gửi yêu cầu từ trang sản phẩm để được tư vấn trực tiếp."}
          </p>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-[1440px] border-t border-white/15 pt-6 text-xs text-[#8f8a81]">
        © 2026 Vintic. Giá và tình trạng được xác nhận lại khi tiếp nhận yêu cầu.
      </div>
    </footer>
  );
}
