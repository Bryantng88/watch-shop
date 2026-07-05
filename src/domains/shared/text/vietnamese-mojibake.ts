const VIETNAMESE_MOJIBAKE_REPLACEMENTS: Array<[string, string]> = [
  ["XÃ¡Â»Â­ lÃƒÂ½", "Xử lý"],
  ["Xá»­ lÃ½", "Xử lý"],
  ["ÄÄƒng bÃ i", "Đăng bài"],
  ["Duyá»‡t ná»™i dung", "Duyệt nội dung"],
  ["Duyá»‡t xong", "Duyệt xong"],
  ["Duyá»‡t hÃ¬nh áº£nh", "Duyệt hình ảnh"],
  ["ÄÆ¡n hÃ ng", "Đơn hàng"],
  ["Giao hÃ ng", "Giao hàng"],
  ["Ká»¹ thuáº­t", "Kỹ thuật"],
  ["BÃ¡o giÃ¡", "Báo giá"],
  ["Äá»‹nh giÃ¡", "Định giá"],
  ["ThÆ°Æ¡ng lÆ°á»£ng", "Thương lượng"],
  ["Sá»­a chá»¯a", "Sửa chữa"],
  ["Kiá»ƒm tra", "Kiểm tra"],
  ["Báº£o hÃ nh", "Bảo hành"],
  ["Thanh toÃ¡n", "Thanh toán"],
  ["Tráº£ vá»", "Trả về"],
  ["Tá»•ng quÃ¡t", "Tổng quát"],
  ["Workspace Ä‘ang implicit", "Workspace đang implicit"],
  ["Workspace nháº­n auto-binding", "Workspace nhận auto-binding"],
  ["ChÆ°a chá»n receiver", "Chưa chọn receiver"],
  ["Nguá»“n Blueprint", "Nguồn Blueprint"],
  ["Loáº¡i Workspace", "Loại Workspace"],
  ["TÃªn gá»i Item", "Tên gọi Item"],
  ["View máº·c Ä‘á»‹nh", "View mặc định"],
  ["Äang báº­t", "Đang bật"],
];

export function repairVietnameseMojibake(value: string): string;
export function repairVietnameseMojibake(value: string | null): string | null;
export function repairVietnameseMojibake(value: string | undefined): string | undefined;
export function repairVietnameseMojibake(value: string | null | undefined) {
  if (value == null) return value;

  return VIETNAMESE_MOJIBAKE_REPLACEMENTS.reduce(
    (text, [broken, fixed]) => text.replaceAll(broken, fixed),
    value,
  );
}
