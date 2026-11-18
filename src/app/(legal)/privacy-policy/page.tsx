import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chính sách quyền riêng tư | Vintic",
  description: "Cách Vintic và Vintic Watch Admin sử dụng, bảo vệ dữ liệu cá nhân và dữ liệu Google Calendar.",
  alternates: { canonical: "https://vinticwatches.vn/privacy-policy" },
  robots: { index: true, follow: true },
};

// This public document deliberately has no account, cart, analytics or database dependency.
export default function PrivacyPolicyPage() {
  const heading = "mb-3 text-lg font-semibold text-slate-950";
  const link = "text-blue-700 underline underline-offset-4 hover:text-blue-900";
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <header className="border-b border-slate-100 px-5 py-5 sm:px-8">
        <nav aria-label="Điều hướng chính sách" className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <Link href="/" className="text-lg font-semibold text-slate-950">Vintic</Link>
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-950">Về trang chủ</Link>
        </nav>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <article className="space-y-8 text-sm leading-7">
          <header>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Vintic · Vintic Watch Admin</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Chính sách quyền riêng tư</h1>
            <p className="mt-3 text-slate-500">Cập nhật ngày <time dateTime="2026-11-18">18/11/2026</time></p>
            <p className="mt-5">Chính sách này áp dụng cho website Vintic tại vinticwatches.vn và ứng dụng quản trị Vintic Watch Admin (WatchShop), bao gồm tính năng lịch công việc và kết nối Google Calendar.</p>
          </header>

          <section aria-labelledby="privacy-contact">
            <h2 id="privacy-contact" className={heading}>1. Đơn vị quản lý và liên hệ</h2>
            <p>Vintic quản lý dữ liệu phục vụ website và các tính năng quản trị của mình. Để hỏi về quyền riêng tư, yêu cầu truy cập, sửa hoặc xóa dữ liệu, liên hệ <a className={link} href="mailto:bryantng88@gmail.com">bryantng88@gmail.com</a>. Vui lòng nêu tài khoản liên quan và yêu cầu của bạn; không gửi mật khẩu hay mã xác thực.</p>
          </section>

          <section aria-labelledby="privacy-data">
            <h2 id="privacy-data" className={heading}>2. Dữ liệu được xử lý</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Thông tin bạn cung cấp: tên, email, số điện thoại, thông tin liên hệ, nội dung yêu cầu tư vấn, giao dịch hoặc công việc.</li>
              <li>Thông tin sử dụng và kỹ thuật cần thiết để vận hành, bảo mật và đo lường website, như trang đã xem, sự kiện tương tác, thông tin trình duyệt, phiên truy cập và nguồn truy cập. Website có thể dùng cookie hoặc bộ nhớ trình duyệt cho đăng nhập, giỏ yêu cầu, ngôn ngữ và đo lường.</li>
              <li>Khi bạn chủ động kết nối Google Calendar: email tài khoản Google, thông tin quyền được cấp, mã truy cập và mã làm mới; dữ liệu sự kiện cần thiết như tiêu đề, mô tả, thời gian, địa điểm, mã sự kiện và liên kết sự kiện.</li>
            </ul>
          </section>

          <section aria-labelledby="privacy-purpose">
            <h2 id="privacy-purpose" className={heading}>3. Mục đích sử dụng</h2>
            <p>Dữ liệu được dùng để tiếp nhận và xử lý yêu cầu, liên hệ với bạn, quản lý giao dịch, công việc và các chia sẻ do người dùng thực hiện, duy trì tài khoản, bảo vệ hệ thống và cải thiện trải nghiệm website. Thông tin công việc được chia sẻ có thể hiển thị cho người dùng được cấp quyền trong ứng dụng.</p>
          </section>

          <section aria-labelledby="privacy-google">
            <h2 id="privacy-google" className={heading}>4. Dữ liệu Google Calendar</h2>
            <p>Kết nối Google Calendar là tùy chọn. Chỉ sau khi bạn cấp quyền, ứng dụng mới sử dụng quyền sự kiện Calendar để hiển thị lịch, tạo và đồng bộ sự kiện từ công việc, cập nhật hoặc xóa sự kiện theo thao tác được cho phép. Thay đổi lịch của công việc đã liên kết có thể được đồng bộ giữa Google và ứng dụng. Việc cấp quyền Calendar không cấp quyền đọc Gmail hay danh bạ.</p>
            <p className="mt-3">Ứng dụng lưu thông tin liên kết tài khoản và sự kiện để duy trì đồng bộ. Access token và refresh token được mã hóa khi lưu trong cơ sở dữ liệu; dữ liệu lịch và công việc chỉ được truy cập theo quyền ứng dụng và các chia sẻ liên quan.</p>
            <p className="mt-3">Việc sử dụng và chuyển giao thông tin nhận từ Google APIs tuân thủ <a className={link} href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer">Google API Services User Data Policy</a>, bao gồm các yêu cầu Limited Use. Dữ liệu Google không được bán, dùng để nhắm mục tiêu quảng cáo hoặc huấn luyện mô hình AI tổng quát. Quyền tiếp cận của con người đối với dữ liệu Google được giới hạn theo các trường hợp được chính sách này cho phép, như khi có sự đồng ý của bạn để hỗ trợ, phục vụ an ninh hoặc theo yêu cầu pháp luật.</p>
          </section>

          <section aria-labelledby="privacy-sharing">
            <h2 id="privacy-sharing" className={heading}>5. Chia sẻ và bảo vệ dữ liệu</h2>
            <p>Chúng tôi không bán dữ liệu cá nhân. Dữ liệu có thể được xử lý bởi nhà cung cấp hạ tầng, bảo mật và dịch vụ tích hợp cần thiết để cung cấp tính năng, hoặc được cung cấp khi pháp luật yêu cầu. Dữ liệu Google chỉ được chia sẻ trong phạm vi tính năng bạn cho phép và các yêu cầu Limited Use. Chúng tôi áp dụng mã hóa token, xác thực và kiểm soát truy cập để hạn chế việc sử dụng dữ liệu trái phép.</p>
          </section>

          <section aria-labelledby="privacy-retention">
            <h2 id="privacy-retention" className={heading}>6. Lưu trữ và yêu cầu xóa</h2>
            <p>Dữ liệu được giữ trong thời gian cần thiết để cung cấp dịch vụ, duy trì liên kết lịch, xử lý giao dịch, bảo mật và đáp ứng nghĩa vụ pháp lý. Bạn có thể yêu cầu truy cập, chỉnh sửa hoặc xóa dữ liệu qua email liên hệ ở trên. Chúng tôi sẽ xác minh quyền đối với tài khoản trước khi xử lý, đồng thời thông báo nếu có phần dữ liệu phải tiếp tục lưu vì nghĩa vụ pháp lý hoặc bảo vệ quyền lợi hợp pháp.</p>
          </section>

          <section aria-labelledby="privacy-revoke">
            <h2 id="privacy-revoke" className={heading}>7. Ngắt quyền Google Calendar</h2>
            <p>Bạn có thể thu hồi quyền bất kỳ lúc nào tại <a className={link} href="https://myaccount.google.com/connections" target="_blank" rel="noreferrer">Tài khoản Google → Kết nối với ứng dụng và dịch vụ bên thứ ba</a>, chọn Vintic Watch Admin và xóa quyền truy cập. Sau khi thu hồi quyền, ứng dụng không thể tiếp tục truy cập lịch bằng quyền đó.</p>
            <p className="mt-3">Thu hồi quyền không tự động xóa công việc trong WatchShop, dữ liệu đã lưu hoặc sự kiện đã tạo trong Google Calendar. Để yêu cầu xóa dữ liệu liên kết đã lưu tại Vintic, gửi email đến <a className={link} href="mailto:bryantng88@gmail.com">bryantng88@gmail.com</a>; bạn cũng có thể quản lý và xóa sự kiện trực tiếp trong Google Calendar.</p>
          </section>

          <section aria-labelledby="privacy-updates">
            <h2 id="privacy-updates" className={heading}>8. Thay đổi chính sách</h2>
            <p>Chúng tôi cập nhật chính sách khi tính năng hoặc cách xử lý dữ liệu thay đổi. Phiên bản hiện hành và ngày cập nhật được công bố tại trang này. Những thay đổi cần sự đồng ý mới sẽ được xử lý theo yêu cầu áp dụng.</p>
          </section>
        </article>
      </main>
      <footer className="border-t border-slate-100 px-5 py-6 text-center text-xs text-slate-500">© 2026 Vintic · <a className="underline underline-offset-4" href="mailto:bryantng88@gmail.com">Liên hệ về quyền riêng tư</a></footer>
    </div>
  );
}
