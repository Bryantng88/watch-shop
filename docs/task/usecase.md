# Task Domain - Use Cases

# Actors

* Admin
* Sale
* Technician

---

# Use Case 01 - Create Task

Actor:
Admin / Sale

Flow:

1. Chọn business object.
2. Chọn tạo task.
3. Nhập nội dung.
4. Chọn assignee.
5. Chọn due date.
6. Lưu.

Result:

Task được tạo.

---

# Use Case 02 - Open Task

Actor:
Assignee

Flow:

1. Mở Task List.
2. Click task.

Result:

Mở đúng business object.

Ví dụ:

WATCH_IMAGE
→ Watch Image Section

WATCH_CONTENT
→ Watch Content Section

TECHNICAL_ISSUE
→ Issue Board

---

# Use Case 03 - Complete Manual Task

Actor:
Assignee

Flow:

1. Xử lý nghiệp vụ.
2. Hệ thống phát hiện task liên quan.
3. Hiển thị modal xác nhận.
4. Người dùng chọn hoàn thành.

Result:

Task chuyển DONE.

---

# Use Case 04 - Complete Business Rule Task

Actor:
System

Flow:

1. Người dùng xử lý nghiệp vụ.
2. Business state thay đổi.
3. Rule được kiểm tra.
4. Điều kiện đạt.

Result:

Task tự chuyển DONE.

---

# Use Case 05 - Cancel Task

Actor:
Admin

Flow:

1. Mở task.
2. Chọn Cancel.
3. Nhập lý do.

Result:

Task chuyển CANCELLED.

---

# Use Case 06 - Reassign Task

Actor:
Admin

Flow:

1. Mở task.
2. Chọn assignee mới.

Result:

Task được chuyển người xử lý.
