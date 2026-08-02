export const WATCH_ACTIVITY_LABELS: Record<string, string> = {
  "watch.created": "Đã tạo watch",
  "watch.content.modified": "Đã cập nhật nội dung",
  "watch.content.submitted": "Đã gửi duyệt nội dung",
  "watch.content.approved": "Đã duyệt nội dung",
  "watch.content.rejected": "Đã từ chối nội dung",
  "watch.content.unapproved": "Đã thu hồi duyệt nội dung",
  "watch.image.submitted": "Đã gửi duyệt hình ảnh",
  "watch.image.approved": "Đã duyệt hình ảnh",
  "watch.image.rejected": "Đã từ chối hình ảnh",
  "watch.image.unapproved": "Đã thu hồi duyệt hình ảnh",
  "watch.spec.updated": "Đã cập nhật thông số",
  "watch.price.updated": "Đã cập nhật giá",
  "watch.bought_back": "Đã thu lại đồng hồ",
  "watch.media.photoshoot.requested": "Đã gửi sang chụp ảnh",
  "watch.media.photoshoot.completed": "Đã hoàn tất chụp ảnh",
  "watch.media.asset.attached": "Đã đưa vào xử lý Media",
  "watch.media.ready_for_publish": "Đã hoàn tất xử lý Media",
  "watch.media.recalled": "Đã thu hồi Media để xử lý lại",
  "watch.publish.assets.downloaded": "Đã tải tài nguyên đăng bán",
};

export function watchActivityLabel(eventKey: string) {
  return WATCH_ACTIVITY_LABELS[eventKey] ?? eventKey;
}
