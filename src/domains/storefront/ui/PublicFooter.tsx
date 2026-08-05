import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer id="contact" className="mt-20 bg-[#252525] px-4 py-14 text-[#f7f4ed] sm:px-6 lg:mt-28 lg:px-10 lg:py-20">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="storefront-display text-3xl">Watch Shop</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#c7c2b8]">
            Bộ sưu tập đồng hồ vintage và pre-owned được tuyển chọn. Gửi yêu cầu để đội ngũ kiểm tra tình trạng và tư vấn trực tiếp.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#8f8a81]">Khám phá</p>
          <div className="mt-5 grid gap-3 text-sm">
            <Link href="/products">Đồng hồ đang có</Link>
            <Link href="/products?audience=MEN">Đồng hồ nam</Link>
            <Link href="/products?audience=WOMEN">Đồng hồ nữ</Link>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#8f8a81]">Liên hệ</p>
          <p className="mt-5 text-sm leading-7 text-[#c7c2b8]">
            Thông tin liên hệ và kênh Zalo sẽ được cấu hình trước khi storefront mở công khai.
          </p>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-[1440px] border-t border-white/15 pt-6 text-xs text-[#8f8a81]">
        © 2026 Watch Shop. Giá và tình trạng được xác nhận lại khi tiếp nhận yêu cầu.
      </div>
    </footer>
  );
}

