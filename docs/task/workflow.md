# Task Domain - Workflow

# Task Lifecycle

CREATE
│
▼

OPEN
│
├──────────────┐
│              │
▼              ▼

IN_PROGRESS  CANCELLED
│
▼

DONE

---

# Watch Image Workflow

Admin
│
▼

Create WATCH_IMAGE Task
│
▼

Assign Sale
│
▼

Sale Open Task
│
▼

System Open Watch Image Section
│
▼

Upload / Update Image
│
▼

Save Image
│
▼

Check Open WATCH_IMAGE Task
│
│
├── No
│      ▼
│    Finish
│
└── Yes
▼

Show Complete Task Modal
│
├── Complete
│        ▼
│      DONE
│
└── Later
▼
OPEN

---

# Future Business Rule Workflow

Admin
│
▼

Create WATCH_PUBLISH Task
│
▼

Assign Sale
│
▼

Sale Update Content
│
▼

Sale Update Images
│
▼

Watch Ready
│
▼

Business Rule Triggered
│
▼

Task DONE

---

# Future System Task Workflow

Watch Missing Content
│
▼

System Create Task
│
▼

Assign Sale
│
▼

Sale Update Content
│
▼

Content Approved
│
▼

System Complete Task

---

# Important Rules

Rule 01

Task phải mở đúng business object.

Không xử lý trực tiếp trong Task.

---

Rule 02

Business Domain là nguồn sự thật.

Task chỉ phản ánh trạng thái công việc.

---

Rule 03

Manual Task là ưu tiên hiện tại.

System Task là giai đoạn sau.

---

Rule 04

Business Rule Completion chỉ được triển khai khi business workflow đã ổn định.
