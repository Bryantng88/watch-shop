# Admin UI language contract — v2

Trạng thái: chuẩn đích cho UI admin mới và các phần được hiện đại hóa.
Cập nhật: 2026-11-19. Phạm vi: toàn bộ admin, gồm danh sách, báo cáo,
trang chi tiết, form, modal, popover và drawer. Không áp dụng hình thức admin
cho storefront. Contract này không thay đổi quyền, dữ liệu hoặc nghiệp vụ.

## 1. Cách sử dụng và nguồn chuẩn

Hai mẫu tham chiếu về tinh thần và thứ bậc thông tin:

- **Công việc** `/admin/personal-work`: thao tác nhanh, hàng phẳng, metadata
  gọn, lịch và danh sách phối hợp, sửa chi tiết mà không mất ngữ cảnh.
- **Trung tâm điều hành** `/admin`: tổng quan có thể hành động, cảnh báo gọn,
  nội dung làm việc trên nền trắng, biểu đồ trọng tâm trên nền xanh nhạt.

Không sao chép nguyên mọi class từ hai trang: chúng vẫn có phần legacy.
Các giá trị chuẩn hóa dưới đây là quyết định thiết kế để xử lý những chỗ lệch.

| Nguồn | Trách nhiệm |
| --- | --- |
| Tài liệu này | Concept, ý nghĩa, thứ tự nội dung, recipe, hành vi và tiêu chí nghiệm thu |
| [`ADMIN_UI_FOUNDATION`](../../src/domains/shared/ui/admin-design-contract/admin-ui.foundation.ts) | Một nguồn giá trị số, font stack, màu semantic, khoảng cách, kích thước và lớp nổi |
| [`admin-ui.tokens.ts`](../../src/domains/shared/ui/admin-design-contract/admin-ui.tokens.ts) | Adapter class `ADMIN_UI`, `ADMIN_DOMAIN_TONE`, selector `ADMIN_VIEW_TABS` |
| [`AdminPage.tsx`](../../src/domains/shared/ui/admin-design-contract/AdminPage.tsx) | `AdminPageCanvas`, `AdminPageHeader`, `AdminFlatToolbar` |
| [`AdminViewTabs.tsx`](../../src/domains/shared/ui/admin-design-contract/AdminViewTabs.tsx) | View switch, keyboard, indicator, fallback select |
| [`AdminUserAvatar.tsx`](../../src/domains/shared/ui/admin-design-contract/AdminUserAvatar.tsx) | Avatar, avatar stack và danh sách tên người |
| [`33-ui-interaction-feedback-contract.md`](../architecture/33-ui-interaction-feedback-contract.md) | Kết quả thao tác, pending và phản hồi nghiệp vụ |
| [`ai-assistant-interaction-contract.md`](ai-assistant-interaction-contract.md) | Chat, làm rõ thông tin và duyệt hành động của assistant |

**Quy tắc một nguồn:** domain cung cấp dữ liệu và callback; shared UI quyết định
cách trình bày. Dùng export từ `@/domains/shared/ui/admin-design-contract`.
Không khai báo lại palette domain, font, bộ spacing hay biến thể nút trong từng trang.
Khi một giá trị cần đổi, sửa foundation, adapter/component liên quan và tài liệu
trong cùng PR. Tìm các consumer trước khi đổi default dùng chung.

**Phân biệt chuẩn và mức áp dụng:** foundation là specification có thể import,
không phải stylesheet tự động áp lên mọi trang. Các adapter cũ chưa được chuyển
hết sang foundation. Mục 23 ghi rõ phần đã có và phần cần thực hiện; không coi
việc có tài liệu là đã hoàn tất migration. Khi chưa có primitive phù hợp, bổ sung
ở shared UI trước khi tạo thêm nhiều bản cục bộ.

## 2. Concept tổng thể

UI là một **không gian làm việc tập trung**, thông tin dày vừa đủ nhưng yên tĩnh.
Thứ bậc được tạo bằng vị trí, khoảng cách, cỡ chữ và độ đậm trước khi dùng màu.
Người dùng phải trả lời được: đang ở đâu, mục nào cần chú ý, và làm gì tiếp theo.

1. Nền trắng là mặt làm việc mặc định; phần nội dung chính không nằm trong card lớn.
2. Một màn hình có một vùng làm việc chính; thông tin phụ không tranh ưu tiên.
3. Nền xanh nhạt là điểm dừng thị giác có mục đích; không phải màu trang trí chung.
4. Hàng dữ liệu phẳng; không biến từng dòng thành một thẻ bo góc có bóng.
5. Màu domain nhận diện khu vực; màu trạng thái giải thích tình trạng.
6. Dữ liệu và thao tác giống nhau phải giữ ý nghĩa khi chuyển trang, modal hay drawer.
7. Gọn bằng cách bỏ lặp, thu gọn công cụ ít dùng và căn thẳng hàng; không bằng chữ nhỏ.
8. Màn hình nhỏ ưu tiên đọc và hoàn thành công việc theo luồng tự nhiên.

Không có hero trang trí, gradient mặc định, icon phóng to, đường accent trang trí
trên heading, hover nâng card, hoặc KPI không dẫn đến quyết định.

## 3. Foundation: đơn vị, font và typography

Giá trị trong foundation dùng CSS px ở mức zoom 100%; không phụ thuộc độ phân giải
ảnh chụp. Code có thể dùng rem tương đương. Luôn kiểm tra browser zoom 200%.

Font duy nhất cho admin: `var(--font-geist-sans), Arial, Helvetica, sans-serif`.
Heading, nút, input, select, bảng và dialog đều kế thừa font này. Không dùng serif
hay một font heading riêng. Mã tham chiếu vẫn dùng sans; chỉ đoạn code kỹ thuật
thực sự mới dùng monospace. Giữ chữ tiếng Việt có dấu đầy đủ.

| Vai trò | Size / line-height | Weight | Màu / cách dùng |
| --- | --- | --- | --- |
| Tiêu đề trang desktop | 24 / 32 | 700 | slate-950; một h1, mô tả workspace hoặc record |
| Tiêu đề trang mobile | 20 / 28 | 700 | Không ép một dòng làm mất tên |
| Tiêu đề modal/drawer | 18 / 28 | 700 | Tên đối tượng hoặc hành động |
| Tiêu đề trong card trọng tâm | 16 / 24 | 600 | Tóm tắt record; biểu đồ dùng section title |
| Tiêu đề section | 14 / 20 | 700 | slate-950 |
| Tiêu đề hàng | 14 / 20 | 600 | slate-900/950 |
| Nội dung, giá trị field | 14 / 20 | 400 | slate-700; giá trị quan trọng slate-950 |
| Label field | 12 / 16 | 500 | slate-600; sentence case |
| Metadata, mô tả section | 12 / 16 | 400 | slate-500 |
| Eyebrow | 12 / 16 | 600 | blue-600; tracking 0.08em, uppercase ngắn |
| Badge chuẩn | 12 / 16 | 600 | Màu theo ý nghĩa |
| Micro badge | 10 / 14 | 600 | Chỉ tag phân loại ngắn, không chứa cảnh báo quan trọng |
| Chú thích biểu đồ | 11 / 16 | 400 | Không áp cho body hoặc control |
| Metric header | 20 / 28 | 600 | tabular-nums, đơn vị ở metadata 12px |

Nút mặc định: 14px/20px, weight 600; compact 12px/16px, weight 600.
Không in hoa toàn bộ label/form/body. Không dùng tracking cho đoạn văn.
Tiêu đề dài được xuống dòng trong header/chi tiết. Ở danh sách có thể truncate
một dòng nếu có cách mở tên đầy đủ bằng keyboard và touch.

Số đếm, tiền, ngày giờ, tiến độ dùng `tabular-nums`. Dùng formatter `vi-VN`.
Tiền phải có đơn vị tiền tệ. Ngày `dd/MM/yyyy`, giờ 24h `HH:mm`; mốc ngắn `dd/MM`
chỉ khi ngữ cảnh đã rõ năm. Dùng formatter/timezone sản phẩm tập trung; không lấy
timezone máy người dùng. Với sản phẩm hiện tại là UTC+07 (`Asia/Ho_Chi_Minh`);
không đổi ý nghĩa date-only khi định dạng. Relative time có cách xem mốc đầy đủ.

## 4. Spacing, kích thước và đường line

Thang chuẩn: **2, 4, 6, 8, 12, 16, 20, 24, 28, 32px**.
2/4 cho căn chỉnh nhỏ; 6/8 trong một control; 12 giữa thành phần liên quan;
16 giữa block nhỏ; 20 padding panel; 24 giữa section; 28 giữa hai pane;
32 khi đổi nhóm nội dung lớn. Không chọn 13/17/23px để sửa cảm giác từng trang.

| Quan hệ | Khoảng cách chuẩn |
| --- | --- |
| Eyebrow → title; title → description | 4px |
| Header → toolbar/nội dung đầu | 16px |
| Label → input | 6px |
| Input → helper/error | 4px |
| Các field cùng nhóm | 16px cả hai chiều |
| Section heading → nội dung | 12px |
| Hai section ngang cấp | 24px; nhóm lớn khác mục đích 32px |
| Icon → text trong nút | 8px |
| Metadata cùng dòng | 6px; nhóm metadata khác nghĩa 12px |
| Hai nút cùng action group | 8px |
| Hai pane độc lập | 28px desktop, 24px khi stack |

Mỗi khoảng cách có một chủ sở hữu: dùng gap của cha **hoặc** margin của con;
không cộng cả hai. Empty content không để lại padding/card rỗng.

**Line:** 1px solid, không gradient/dashed để phân vùng thông thường.

| Loại | Màu | Vị trí |
| --- | --- | --- |
| Divider nội dung/hàng | slate-100 `#f1f5f9` | Giữa vùng, không đóng hộp cả vùng |
| Viền control/popover | slate-200 `#e2e8f0` | Bao input/nhóm điều khiển hoặc lớp nổi |
| Line bên trong vùng xanh | blue-100 `#dbeafe` | Chỉ khi cần tách thông tin phụ |
| Gạch tab đang chọn | 2px, màu text active | Dưới toàn hit area của tab |
| Focus | 2px blue-400 `#60a5fa` | Focus-visible, offset 2px; inset khi có overflow |

Nếu dùng divider tách hai section, khoảng cách từ nội dung đến line là 24px
mỗi phía; không cộng thêm một section gap 24px vào cùng biên. Hàng danh sách
dùng padding riêng, line không thêm margin. Không có line đậm màu navy,
double border, hoặc bóng để thay line phân vùng.

Bo góc: 2px mark/bar; 6px badge chữ nhật; 8px input/nút/icon tile/thumbnail;
12px panel; 16px floating dialog; pill 9999px chỉ cho chip/avatar/badge phù hợp.
Biểu đồ xanh là một vùng phẳng radius 0; card tóm tắt record radius 12px.

## 5. Màu và semantic

| Vai trò | Màu chuẩn |
| --- | --- |
| Canvas / layer nổi | white `#ffffff` |
| Text chính | slate-950 `#020617` |
| Body | slate-700 `#334155` |
| Metadata | slate-500 `#64748b` |
| Tertiary | slate-400 `#94a3b8`; không dùng cho nội dung thiết yếu |
| Primary action | slate-950; hover slate-800 |
| Link | blue-700 `#1d4ed8`, underline khi hover/focus |
| Neutral grouped surface | slate-50 `#f8fafc` |
| Focus surface | blue-50 `#eff6ff` |
| Success | emerald-700, nền emerald-50, dot emerald-500 |
| Cần chú ý | orange-700, nền orange-50; marker amber-500 |
| Critical/destructive | rose-700, nền rose-50, dot rose-500 |
| Trạng thái chưa xác nhận | amber-700, nền amber-50; có text rõ |

`ADMIN_DOMAIN_TONE` là nguồn domain duy nhất:

| Key | Ý nghĩa | Soft / dot |
| --- | --- | --- |
| GENERAL | Tổng quát, công việc cá nhân | slate-100/slate-700; slate-500 |
| WORK | Nhóm Work đã dùng key riêng | indigo-50/indigo-700; indigo-500 |
| MEDIA | Media | violet-50/violet-700; violet-500 |
| TECHNICAL | Kỹ thuật | blue-50/blue-700; blue-500 |
| SALES | Bán hàng/thanh toán theo mapping nghiệp vụ hiện tại | emerald-50/emerald-700; emerald-500 |
| ORDER | Đơn hàng | amber-50/amber-700; amber-500 |
| ACQUISITION | Yêu cầu mua hàng | rose-50/rose-700; rose-500 |

Không phân loại lại nghiệp vụ chỉ vì muốn một màu. Category do người dùng chọn
có thể dùng màu category hiện hữu nhưng không thay palette domain. Warning nằm
cạnh identity bằng text/icon nhỏ; không đổi cả hàng Media từ violet thành đỏ.
Đồng bộ hoặc nguồn dữ liệu là marker phụ, không thay identity.

Admin dùng light canvas có chủ đích; không tự đảo màu theo OS khi chưa có bộ token
dark và kiểm thử đầy đủ. Không thêm dark mode riêng cho một modal.

## 6. Các loại surface và card xanh tập trung

| Surface | Dùng khi | Không dùng khi |
| --- | --- | --- |
| White flat | Danh sách, section, nội dung chi tiết | Không bọc thêm card trắng quanh cả trang |
| Neutral toolbar | Input/filter có liên hệ | Không làm nền từng row |
| Focus blue | Tóm tắt quyết định, kết quả tổng hợp, biểu đồ trọng tâm | Không tô mọi section hoặc dùng thay cảnh báo |
| Soft neutral | Nhóm input/helper thực sự cần phân biệt | Không lồng nhiều tầng card |
| Raised white | Popover/modal hoặc metric summary cần tách nền | Không tạo bóng cho từng task |

### 6.1. Ý nghĩa của nền xanh

`ADMIN_UI.insightSurface` là adapter cho `foundation.colors.focusSurface`.
Màu xanh có nghĩa **hãy tập trung vào kết quả/tổng hợp này**, không có nghĩa
Technical, đã lưu, đã xong, đang chọn, hay an toàn. Domain của dữ liệu bên trong
vẫn giữ màu domain. Nền xanh không đồng nghĩa toàn vùng có thể click.

Mặc định chỉ một vùng xanh nổi bật trong một working context đang nhìn thấy.
Một trang dài có thể có vùng thứ hai ở section độc lập khi có lý do cụ thể;
không trải nhiều card xanh ngang hàng để tất cả cùng tranh sự chú ý.

Không gradient, outline xanh quanh card, shadow, hover-lift hoặc accent stripe.
Text chính slate-950, metadata slate-500/600; chỉ eyebrow ngắn dùng blue-600.

### 6.2. Recipe A — card tóm tắt record / realtime summary

```text
padding 20 (mobile 16), radius 12, nền blue-50
eyebrow 12/16 semibold
  4px
title 16/24 semibold, wrap tên đầy đủ
  8px
chip row: wrap, gap 6px, chip nền trắng
  8px
metadata/spec line 12/16
  16px
action row: căn trái, gap 8px, wrap trên mobile
```

Chip là thuộc tính/từ khóa, không phải nút: padding 4px 10px, radius pill,
12px, weight 500, không shadow/outline. Không sinh chip rỗng/trùng nghĩa.
Spec line xuống dòng khi cần; dùng dấu `·` hoặc formatter thống nhất.
Actions mặc định là secondary trắng viền slate-200, cao 40px; coarse pointer
ít nhất 44px. Không dùng mọi action thành primary. AI chỉ là công cụ phụ.

Ưu tiên actions dưới nội dung như mẫu đã duyệt; không đẩy chúng lên một cột làm
title/chips bị bóp hẹp. Nếu một tác vụ bắt buộc bố cục khác, tạo variant shared
có tên và mô tả lý do. Không tự đổi mỗi trang.

Thông báo nguồn/kết quả AI nằm sau actions, cách 12px, có thể dùng line blue-100
và padding-top 12px; không lồng thêm card xanh. Summary cập nhật theo field không
được tự lưu hoặc xác nhận hoàn tất. Trạng thái lưu hiển thị ở section action bar.

### 6.3. Recipe B — vùng biểu đồ cần chú ý

Nền blue-50, padding 20px, radius 0, không border/shadow. Thứ tự:
section title 14px bold → mô tả/đơn vị 12px cách 4px → filter tabs cách 12px
→ plot cách 16px. Chart tick/đơn vị trung tính; thanh giữ màu domain.
Chừa chỗ cho nhãn dài và giá trị cuối bar. Grid 1px blue-100, axis blue-200;
không phủ lưới lên text. Label domain 12px, tick tối thiểu 11px, value 12px
tabular. Không cắt dataset để vừa hộp; stack/reflow hoặc cung cấp drill-down.

Đây là trường hợp chuẩn của “Khối lượng đang mở”. “Điểm tập trung” bên dưới
vẫn nằm trên nền trắng. Không bắt cả cột insight thành một card xanh lớn.

### 6.4. Phân biệt với warning và số liệu

Warning ngắn ưu tiên inline marker + text; critical dùng rose. Không đổi warning
thành card xanh. Metric trong header không cần một card riêng. Summary tile dashboard
có thể dùng một ambient shadow rất nhẹ, không đồng thời có outline và hover-lift.
Card nhịp hoàn tất 7 ngày có thể dùng white + slate-200 outline, radius 12,
padding 16, không shadow; đây là container dữ liệu độc lập có lý do rõ ràng.

## 7. Page shell và các template trang

Canvas full available width sau sidebar. Padding desktop 24px ngang/20px dọc;
mobile dưới 640px là 16px ngang/12px dọc. Shell không thêm padding lần hai.
Giữ `min-width: 0` cho pane/grid child. Không dùng một max-width chung cho dashboard.

Header: breadcrumb nếu cần → eyebrow nếu có ích → title → mô tả một dòng ngắn.
Title không chứa số record. Metrics/actions đặt cạnh phải khi đủ rộng và stack
dưới identity trên mobile. Header đến nội dung 16px. Có thể bỏ mô tả khi title
đã rõ như trang Công việc; không tạo text chỉ để lấp chỗ.

| Template | Thứ tự vùng | Layout |
| --- | --- | --- |
| Danh sách | Header → tổng quan/cần chú ý → toolbar → list/table → pagination | Trắng phẳng, filter gần kết quả |
| Công việc | Header/count → tạo nhanh + lịch → view/filter → rows | Pane theo nội dung, không đổi task thành KPI |
| Điều hành | Header → reminder links → work + insight → updated time | Wide từ 1280px: 2fr:1fr, gap 28px; hẹp stack |
| Chi tiết | Breadcrumb/back → record identity/actions → section tabs → nội dung → activity | Main linh hoạt + sidebar 320px khi đủ rộng |
| Form dài | Header → nhóm field → action footer | Nội dung form tối đa 960px; không bọc page card |
| Báo cáo | Header/time scope → filter → kết quả/biểu đồ → chi tiết | Metric giúp quyết định; drill-down giữ filter |

Trong điều hành, danh sách can thiệp nằm ngay dưới danh sách khu vực ở cột trái,
không đợi hết chiều cao cột insight. Khi pane khu vực đủ 640px, dùng cột
identity / Cần chú ý / Đang mở; hẹp hơn thì warning xuống dưới identity, count
giữ bên phải. Nhắc nhở là các link domain riêng, không cộng thành một KPI severity.

Danh sách và lịch có thể scroll độc lập trên desktop nếu cạnh tranh chiều cao;
mobile dùng document scroll. Không đặt min-height trang trí khiến phần làm việc
bị đẩy dưới fold. Sticky chỉ giữ thứ cần thao tác; ghi rõ top offset theo shell,
không để sticky tab và summary cùng top 0 che nhau.

## 8. Tab và view switch: thứ tự, dot, khoảng cách

Mọi view filter dùng `AdminViewTabs`. Không copy HTML tab cục bộ.
Hai density được định nghĩa ở foundation; **comfortable là chuẩn đích cho
tab section chính**, compact cho filter phụ/biểu đồ/tạo Work–Event.
PR #120 đang đề xuất adapter comfortable; không mặc định coi đã có trên main.

| Thuộc tính | Compact | Comfortable |
| --- | --- | --- |
| Text | 12px, weight 400; active 600 | 14px, weight 400; active 600 |
| Chiều cao tối thiểu | 36px; coarse pointer 44px | 44px |
| Padding top / bottom / ngang | 8 / 10 / 0px | 12 / 14 / 12px |
| Gap giữa các hit area | 16px | 12px |
| Active | text slate-900 và underline 2px | Cùng quy tắc |
| Inactive | slate-500; hover slate-900 | Cùng quy tắc |

Chiều cao là **min-height**, không cố định: comfortable với line-height 20px
và padding trên/dưới sẽ cao hơn 44px. Không ép text bị cắt để giữ chiều cao.

**Thứ tự trong một tab:** `[icon tùy chọn] → label → [count tùy chọn] →
[completion dot tùy chọn]`. Không có số thứ tự nằm trong ô màu.

- Dot completion **sau text**, sau count nếu có; đường kính 6px, gap 6px,
  căn giữa theo hàng, `flex-shrink: 0`; không ring bao quanh.
- Complete emerald-500; incomplete slate-300; unknown amber-500 và text
  “Chưa xác nhận trạng thái” trong accessible label.
- Dot không biểu thị tab đang active và không thay cho bước xác nhận hoàn tất.
- Count cách label 6px, font-size kế thừa tab, tabular; không luôn bọc pill.
- Icon nếu giúp nhận biết: 16px trước label, gap 8px. Bốn tab media dùng text
  ngắn và dot, không cần icon lặp ý nghĩa. Không trộn icon-only với text tab.
- Không có dot trên filter đơn giản “Tất cả / Chờ xử lý / Đang xử lý”.

**Khác biệt có chủ đích:** warning marker trong “Cần chú ý trước” nằm **trước**
text, 4px, gap 6px. Đây là tín hiệu cảnh báo mở đầu một link, không phải completion.
Badge có status dot đặt dot trước label. Không đổi quy tắc theo sở thích từng trang.

Active underline theo chiều ngang hit area, bottom 0, radius 2px; không background
filled/pill, domain selection, shadow, border-box hoặc bold cả dãy tab.
Strip có divider slate-100 1px. Không thêm line thứ hai phía dưới từ wrapper.

Nhóm tối đa bốn option giữ một hàng, cuộn ngang nội bộ khi cần; không wrap,
không giảm font. Hơn bốn option và **container** dưới 520px dùng native select
cùng label/value/options. Không dùng viewport width để quyết định thay container.
Select coarse pointer dùng chữ 16px. Giữ selected item trong vùng nhìn thấy mà
không scroll cả trang. Đổi tab không làm mất draft, filter hoặc completion baseline.

View filter dùng labeled group và `aria-pressed`; không gắn tablist giả.
Nếu thực sự là panel tabs thì dùng tablist/tab/tabpanel đầy đủ. Giữ Tab/Enter/Space,
Arrow Left/Right, Home/End, skip disabled, focus visible và disabled state.
Tên truy cập phải gồm label và trạng thái dot; chấm màu `aria-hidden`.

## 9. Icon, avatar, ảnh nhận diện và badge

### 9.1. Icon

Lucide là nguồn icon admin; dùng wrapper/shared presentation khi đã có.
Stroke chuẩn đích 1.75, không pha icon filled, emoji hoặc nét dày khác bộ.
Size: metadata 14px; icon inline/nút 16px; section heading 20px.
Icon tile domain 32×32px, radius 8, icon 16px, soft tone domain, không shadow.
Không bọc mọi icon bằng một ô màu; chỉ bọc khi đại diện domain/đối tượng.

Icon dẫn nghĩa trước text, chevron điều hướng sau text. Gap 8px trong nút,
6px metadata. Icon trang trí `aria-hidden`; icon-only action có accessible name
mô tả động từ và đối tượng. Hit area tối thiểu 32px desktop, 44px coarse pointer;
icon nhìn thấy vẫn 14–16px. Không dùng chevron có nền tròn navy riêng.

### 9.2. Avatar và thumbnail

`AdminUserAvatar`: xs 20px, sm 28px, md 32px; stored avatar → initials,
label đầy đủ và tooltip. Không dùng ảnh giả hoặc tự sinh người dùng để lấp UI.
`AdminUserAvatarStack`: tối đa ba người, overlap 4px, phần dư `+n`.
`AdminUserInlineList`: tối đa hai tên, avatar → tên gap 4px, giữa người gap 8px;
dùng khi người xem phải biết ai chịu trách nhiệm/được chia sẻ.
Initial chữ 8px chỉ trong avatar xs đã có accessible name, không áp cho text.

Thumbnail đối tượng dùng `WorkObjectThumbnail` nếu phù hợp: ảnh thật gắn đúng
record, fallback icon domain. Chuẩn đích row 36px, detail 64px, radius 8px;
photo gallery riêng theo tỷ lệ ảnh. Không kéo méo ảnh. Thumbnail không thay title.
Ảnh lỗi có fallback; xem ảnh lớn là action có tên và focus riêng.

### 9.3. Badge và chip

Badge báo identity/state, không là nút. Chuẩn 12/16px weight 600,
padding 4px 8px, min-height 24px, radius 6px; pill chỉ cho chip/tag ngắn.
Dense badge phân loại có thể 10/14px, cao tối thiểu 20px. Warning, quyền truy cập
và trạng thái chưa biết không thu xuống 10px để ép vừa.

Trong badge: `[dot/icon tùy chọn] → label`, gap 4px, dot 6px trước label.
Không dùng cả icon và dot cùng một nghĩa. State phải có text; icon đơn độc không đủ.
Domain dùng `ADMIN_DOMAIN_TONE`; trạng thái dùng success/attention/danger/neutral.
Không có shadow, viền đậm hoặc pulse vô hạn.

Record chia sẻ hiển thị một badge `Chỉ xem` / `Có thể sửa` cạnh title; không thêm
card quyền hay lặp tên owner ở mọi metadata. Tag bấm được là filter button,
phải có states/button semantics; không giả badge tĩnh có onClick.

## 10. Hàng dữ liệu, table và filter

Row mặc định: padding 12px dọc, 0 ngang, gap 12px; min-height 56px;
row có thumbnail/2 tầng metadata min-height 64px. Dense work row cho phép padding
10px như Công việc. Min-height không giới hạn chiều cao khi text cần wrap.

Thứ tự đọc: identity/title → domain/status → trạng thái cần xử lý/hạn → reference,
source và metadata. Title→metadata 4px, metadata cùng nhóm 6px.
Count/amount ở cột cuối căn phải; title không bị count đẩy mất khả năng đọc.
Hover/focus-within nền slate-50, không dịch vị trí. Phần có link/button riêng không
kích hoạt action row hai lần; không lồng button trong button hoặc link trong link.
Action hiếm có thể hiện khi hover **và** keyboard focus; trên touch có menu rõ.

Table: header 36px tối thiểu, 12px/16px weight 500 slate-500; cell padding
12px cả hai chiều; row ít nhất 44px. Cột checkbox 40px; số căn phải, ngày không
đổi format theo hàng. Dùng divider ngang slate-100, không mặc định kẻ dọc/zebra.
Nội dung thiếu là `—`, zero là `0`, lỗi tải là lỗi; ba trường hợp không thay nhau.

Toolbar nhóm control dùng surface slate-50/60, outline slate-200/80,
radius 12px, padding 8px, gap 8px. Chỉ thanh filter text đơn giản có thể phẳng,
cao tối thiểu 48px như Công việc. Search có accessible label và nút xóa khi có giá trị.
Thứ tự: view/scope → search → filter → secondary actions → create nếu thuộc ngữ cảnh.
Không tạo một primary Create lặp cả header và toolbar.

Scope theo thứ tự `Của tôi / Được chia sẻ / Tất cả`; Tất cả chỉ gồm record
được phép truy cập. Kết quả/count phải theo filter hiện tại. Pagination giữ search,
filter và return URL; thay search/filter đưa về trang đầu có chủ đích.
Table quá rộng có scroll ngang riêng; không làm cả body tràn ngang.

## 11. Nút, link và action bar

Một primary action trong một **ngữ cảnh thao tác**, không phải bắt mọi section
độc lập trên trang dùng chung một nút. Default cao 40px, padding ngang 16px,
radius 8px; compact cao 32px padding 12px. Coarse pointer mọi target ít nhất 44px.

| Loại | Hình thức | Ví dụ |
| --- | --- | --- |
| Primary | slate-950/white; hover slate-800 | Lưu thay đổi, xác nhận bước chính |
| Secondary | White + slate-200 outline, slate-700 | Apply title, chọn ảnh |
| Tertiary | Không viền/nền; hover slate-100 | Hủy, công cụ ít dùng |
| Success auxiliary | Quiet emerald tint | Đồng bộ đã có semantics phù hợp |
| Destructive | Rose text/soft; confirmation cuối có thể solid rose | Xóa, hủy có tác động |
| Link | blue-700, hover/focus underline | Mở đối tượng/nguồn, không submit |

Nút icon+text không tạo icon tile bên trong. Nhãn động từ cụ thể; không dùng “OK”
cho thao tác có hậu quả. Nút route là link; nút mutation là button.

Pending dùng spinner + nhãn `Đang lưu…`, giữ chiều rộng hợp lý và chặn submit lặp.
Disabled opacity 0.5, không hover, nguyên nhân cần biết có text ngoài tooltip.
Không tắt cả UI lâu vô cớ; chỉ khóa các action có thể xung đột.
Save, save draft, mark complete và approve là các hành động khác nhau; không nhập
chúng vì muốn ít nút. Không thay label “Lưu” thành “Hoàn tất” nếu backend không làm vậy.

Action footer: destructive ở trái, Hủy/Đóng và primary bên phải, gap 8px.
Mobile wrap theo thứ tự đọc, primary rộng khi cần; không đè body/keyboard.
Sticky footer nền trắng và line slate-100, dành chiều cao trong content và safe-area.

## 12. Form và nội dung chỉ đọc

Form chia theo mục đích với heading 14px, mô tả 12px; section gap 24px.
Desktop hai cột mặc định, ba cột chỉ cho thông số ngắn độc lập; mobile một cột.
Không chuyển thứ tự DOM để đặt label/control khác nhau trên mobile.

Control mặc định cao 40px, padding ngang 12px, chữ 14px, border slate-200,
radius 8px, nền trắng. Touch cao ít nhất 44px; editable input trên mobile có thể
16px để tránh browser zoom, không kéo theo heading/table phóng to.
Textarea tối thiểu 112px, padding 12px, resize/auto-grow có giới hạn phù hợp.
Checkbox/radio mark 16px trong hit area 32/44px; label bấm được.

Label luôn hiện, không dùng placeholder làm label. Dấu bắt buộc theo một convention
chung, giải thích một lần; required/error có semantics thật. Helper cách 4px;
lỗi ở ngay field, rose-700, `aria-invalid`/`aria-describedby`, focus field lỗi đầu
sau submit. Form error tổng hợp không xóa giá trị đã nhập.

Read-only là giá trị văn bản có label, không input disabled giả form. Nếu cần giữ
control để so sánh, dùng readonly đúng semantics. Dữ liệu nhạy cảm/không đủ quyền
không được đưa vào DOM rồi che bằng CSS. Computed field ghi rõ nguồn/tự tính.

Không đóng hộp từng field group bằng card. Không dùng underline-only input tùy
hứng: chỉ read-only key-value dùng divider. Input chỉnh sửa dùng viền chuẩn.
Chi tiết quyền chia sẻ nằm trong modal/detail đang mở, không tạo modal lồng ngắn.

## 13. Trang chi tiết

Header giữ ảnh nhận diện, tên đầy đủ, mã/SKU, badge trạng thái/quyền, actions.
Ảnh detail 64px, gap identity 12px. ID kỹ thuật thứ cấp có thể thu vào disclosure;
không lấy ID làm title nếu đã có tên. Breadcrumb/back giữ bộ lọc và scroll trước đó.

Trình tự: identity header → section navigation nếu có nhiều phần → focus summary
nếu giúp đối chiếu → các section nghiệp vụ → lịch sử/ghi chú. Không lặp cùng một
summary ở header, sidebar và từng section. Main:sidebar khoảng 2:1 khi đủ rộng;
sidebar target 320px, xuống dưới main khi không đủ chỗ.

Key-value: label 12px, value 14px, cách 6px; item gap 16px; list quan hệ dùng row.
Activity: actor/avatar + hành động + thời gian 12px; nội dung 14px; line nhẹ chỉ
nối chuỗi nếu có ích. Ghi chú có preserve line breaks, không tạo card cho mọi note.

Section action bar tách title/description khỏi saved state + actions, gap 12px;
mobile stack. Đang chỉnh/saved/completed/unknown phải được phân biệt bằng text.
Full page và bản mở trong modal/drawer dùng cùng body/section primitive,
không copy một UI chi tiết khác; wrapper chỉ đổi kích thước và điều hướng.

## 14. Chọn đúng popup, modal, drawer và inline card

“Popup” phải được gọi đúng loại khi triển khai, tránh mọi lớp nổi dùng cùng hành vi.
“Drawcard” trong trao đổi được chuẩn hóa thành **drawer/side sheet** nếu trượt từ
cạnh phải; nếu nằm trong luồng trang thì là inline expansion.

| Loại | Dùng khi | Kích thước đích | Focus/đóng |
| --- | --- | --- | --- |
| Tooltip | Mô tả bổ sung rất ngắn | Theo text, không form | Hover + focus; Escape; không giữ nội dung thiết yếu |
| Popover | Lịch, context, filter nhỏ cạnh trigger | 288px, max available width | Non-modal, Escape/outside, trả focus |
| Small modal | Xác nhận một việc | Max 400px | Modal semantics, focus trap |
| Edit/detail modal | Tác vụ tập trung ngắn | Max 560px; rộng 800px khi có lý do | Modal semantics, focus trap |
| Workspace modal | Editor thật sự nhiều phần | Max 1200px | Có Full page nếu route tồn tại |
| Drawer | Xem/sửa record trong khi giữ ngữ cảnh danh sách | 480px; rộng 640px có lý do | Modal side sheet mặc định |
| Inline expansion | Thông tin liên quan ngay row | Theo pane | Không overlay/trap; giữ trigger |

Không dùng popover cho form dài hay thao tác cần scroll nhiều. Không dùng modal
lớn để tránh tạo route cho workspace dài. Drawer modal giữ ngữ cảnh bằng phần nền
nhìn thấy; nền không tương tác. Nếu cần vừa sửa vừa chọn nền, phải thiết kế variant
non-modal riêng với focus/selection rõ ràng.

### 14.1. Khung floating thống nhất

Overlay slate-950 opacity 25%, blur tối đa 1px, không làm nền tối đen.
Surface trắng, radius 16px, một `shadow-2xl shadow-slate-950/15` từ adapter modal;
không thêm shadow lồng hoặc outline màu. Popover radius 8px, slate-200 1px,
bóng nhẹ như mẫu Công việc; padding 12px; cách trigger 8px, collision flip/shift.

Modal margin desktop 16px mỗi phía, max-height `calc(100dvh - 32px)`.
Header/body/footer padding 20px; các section body gap 20px. Không cộng padding
20px outer wrapper và 20px body vào cùng một cạnh. Header gồm optional eyebrow,
title, description trái; close 32/44px phải. Footer theo mục 11.

Header/footer giữ ổn định khi body dài; chỉ một vùng scroll body. Trên mobile dùng
gutter 8px, padding 16px; modal lớn/drawer có thể full-screen với safe-area,
close và save vẫn truy cập được khi keyboard mở. Không dùng 100vh cố định bỏ qua
browser chrome; ưu tiên dvh và max-height.

Drawer mở bên phải, cao viewport, góc 16px phía trái desktop, cạnh phải sát màn
hình; mobile full-width, không bo góc khi full-screen. Chỉ một divider bên cạnh
nếu cần, không shadow thứ hai. Header 20px, body 20px, footer 20px như modal.
Full page action là secondary cạnh close, chỉ xuất hiện khi có route thật;
chuyển route phải xử lý draft trước, không âm thầm mất dữ liệu.

### 14.2. Hành vi bắt buộc

Modal/drawer modal dùng `role=dialog`, `aria-modal=true`, title liên kết,
focus trap, khóa scroll nền, restore focus về trigger. Focus đầu vào title hoặc
field thích hợp; destructive confirmation ưu tiên action an toàn.
Popover không tự dùng aria-modal/focus trap; trigger có expanded/controls.

Đóng bằng nút, Escape hoặc backdrop click theo cùng một `requestClose` path.
Form có thay đổi chưa lưu phải được bảo vệ trên **mọi** đường đóng/Full page/
đổi record; click backdrop không được bypass. Pending mutation có thể chặn đóng
trong lúc commit, phải hiển thị lý do và không khóa người dùng vĩnh viễn.
Lỗi chưa biết giữ input, không lặp mutation để “thử lại” nếu có thể đã commit.
Đọc lại/reconcile và trình bày trạng thái theo feedback contract.

Mặc định một modal/drawer chính. Menu/datepicker của nó được portal ở layer cao
hơn, nằm trong phạm vi quản lý focus. Destructive confirmation dùng app dialog
có quản lý stack nếu cần, không tự tạo nhiều overlay z-index 99999.
Sharing ít người là subsection trong dialog hiện tại.

## 15. Cảnh báo, phản hồi và trạng thái UI

Warning không nhất thiết là card. “Cần chú ý trước” gồm label 12px slate-500,
link domain + count + lý do, marker trước text 4px/gap 6px; gap giữa link 20px
ngang, 4px dọc. Mobile label chiếm dòng riêng, link wrap. Link có hover/focus và
44px touch target. Không gắn số tổng mơ hồ cho các loại lỗi khác nhau.

| State | Hành vi và trình bày |
| --- | --- |
| Initial loading | Skeleton cùng cấu trúc vùng sắp tải, không giả số liệu thật |
| Refresh | Giữ dữ liệu cũ nếu hợp lệ, chỉ rõ đang cập nhật; không nháy cả trang |
| Empty | Câu ngắn nói thiếu gì và action phù hợp; không minh họa lớn |
| No search results | Hiện filter hiện tại và cách xóa; khác empty dataset |
| Error | Text có thể hành động + retry an toàn; không giả empty/0 |
| Read-only | Badge quyền, giá trị đọc rõ, action write không được phép |
| Dirty | “Có thay đổi chưa lưu”, giữ draft khi đổi section |
| Saved | Chỉ báo sau receipt xác nhận; không đồng nghĩa completed |
| Unknown | Text amber và đường kiểm tra lại, không dot xanh giả thành công |
| Success | Inline khi liên quan field/section, toast ngắn cho thao tác chung |

Lỗi field không chỉ toast. Success toast không che nút, không là nơi duy nhất có
kết quả cần đọc lại. Error cần xử lý không tự biến mất trước khi người dùng đọc.
`aria-live=polite` cho kết quả; `role=alert` cho lỗi cần chú ý. Không announce
mọi keypress, hover hoặc summary cập nhật từng ký tự.

## 16. Chart, metric, lịch và progress

Metric value mạnh hơn đơn vị; aggregate đặt trong header/section header trước khi
thêm tile. Chỉ vẽ biểu đồ khi giúp so sánh/quyết định. Domain mapping giữ ổn định
trên legend, bar và link; không tự đổi palette giữa chart và list.
Nhãn/tooltip gồm value, unit, time scope và accessible alternative. Không lấy
0 thay dữ liệu unavailable; chart empty có thông báo. Axis không dùng màu domain.

Với bar “Khối lượng đang mở”, mẫu hiện tại có row 44px, bar cao 10px radius 2,
label width 96px/gap 10px; đây là geometry **riêng chart**, không spacing chung
cho form. Khi pane quá hẹp, reflow label/value thay vì scale cả chart làm chữ nhỏ.
Geometry loại chart khác thuộc shared chart primitive, không rải vào page CSS.

Nhịp hoàn tất đơn 7 ngày luôn thấy, có nhãn ngày và count thật; không cần disclosure.
Progress có current/max/label thật, track neutral, fill blue/success, số tabular.
Không dùng progress ngẫu nhiên hoặc status suy ra từ màu ảnh.

Lịch giữ hôm nay, selected và event/domain là các tín hiệu riêng. Month grid cần
day label đọc được, keyboard access cho event và “+n” mở đầy đủ. Event không có
checkbox hoàn thành; không ép group/priority của task vào event. Khi layout chật,
dùng agenda/list có cùng dữ liệu thay vì co text dưới ngưỡng đọc được.

## 17. Media, website editor và grouped navigation

Media dùng bốn label `Thông tin / Content / Hình ảnh / Cover`, comfortable density,
completion dot sau label và accessible text. State phần việc do domain cung cấp;
dot không xác nhận, tab không save. Tên và SKU đọc đủ; công cụ phụ vào disclosure.
Section header stack identity/actions trên mobile; Save và Complete là target riêng.
Summary blue dùng recipe A khi hiển thị. Việc thu gọn/ẩn bản summary trùng trên
mobile phải giữ trường chỉnh và actions cần thiết ở vị trí truy cập được.

Website editor: ordered section list + một editor đang focus; đổi section giữ draft.
Visibility/order ở list, drag có nút keyboard thay thế. Mobile stack task order.
Focal/link settings ít dùng có thể collapse; trường bắt buộc luôn thấy.
Giải thích ảnh optional thiếu sẽ render ra sao ngay cạnh section. Ảnh optional
About/collection không chặn publish phần không liên quan. Hero tự động cần source
catalog đủ điều kiện và kiểm tra tồn tại asset. Phân biệt saved draft/published,
giữ revision conflict handling, preview không được ngụ ý đã xuất bản.

Reports là một navigation group chứa các destination Overview/Finance/Sales được
phép. Cả rail collapsed, expanded và mobile đều không biến thành ba icon không nhãn.
Menu có keyboard/Escape/focus; sidebar không phủ control editor. Grouping không
mở rộng quyền hoặc đổi route. Admin navigation dùng một bộ icon và active state
riêng shared shell, không dùng active tab style để giả navigation link.

## 18. Responsive và accessibility

Breakpoint nền tảng: mobile dưới 640px, tablet 640–1023px, desktop từ 1024px,
wide từ 1280px. Component dùng available container width khi nó nằm trong pane.
Split dashboard chỉ ở wide khi đủ chỗ; không suy ra mọi desktop đều đủ 2:1.

Kiểm tra 320, 390, 768, 1280 và 1440px; kiểm tra lại narrow drawer/container,
200% zoom và keyboard-only. Không body overflow ngang. Tên dài, tiếng Việt,
số lớn, empty/error và role read-only đều phải fit. Control 44px với pointer coarse,
vùng nhỏ cạnh nhau không được overlap để “đủ target”.

Normal text contrast ít nhất 4.5:1; large text và non-text UI theo WCAG AA 3:1.
Tertiary/disabled không chứa thông tin thiết yếu độc nhất. Không dùng màu riêng
để truyền nghĩa. Focus visible không bị sticky footer hoặc overflow clip che.
Trật tự DOM theo thứ tự đọc, semantic headings không nhảy cấp tùy cỡ chữ.
Touch/keyboard có cách xem metadata mà desktop chỉ hover mới thấy.

## 19. Motion, layer và scroll

Transition color/opacity 150ms; mở/đóng floating tối đa 200ms. Không animate layout
row/tab khiến mục tiêu bấm dịch chuyển. Tôn trọng prefers-reduced-motion, không
pulse/loop trang trí hoặc kéo chậm thao tác để phô animation.

Layer chuẩn: base 0; sticky nội dung 10; navigation 20; page popover 30;
overlay 40; modal/drawer 50; popover trong modal 60; toast 70; tooltip 80.
Các số là thứ bậc shared, không tự dùng 999/9999. Lớp con của dialog không được
portal phía dưới overlay. Tooltip không che dialog đang mở.
Tránh nhiều nested scroll; body modal là vùng cuộn chính. List/return navigation
giữ scroll có chủ đích, không scroll tới đầu do cập nhật một badge.

## 20. Recipe triển khai và trách nhiệm component

```text
Domain query / permissions / mutation
  → domain component cung cấp data, state, callback
    → shared primitive chọn variant được đặt tên
      → ADMIN_UI / semantic adapter + ADMIN_UI_FOUNDATION
```

Shared primitive không fetch domain data, xác nhận quyền, tự đánh dấu hoàn tất
hay sửa semantics workflow. Domain không sở hữu một bản màu/spacing tương tự shared.
Chọn variant theo mục đích (`compact`, `comfortable`, `record summary`, `chart`),
không thêm prop chỉnh từng pixel ở mọi call site. Không biến token module thành
business framework. Variant mới phải có ví dụ và state matrix.

Đối với component chưa có: đầu tiên xác định dữ liệu/semantics, đối chiếu một
recipe trong contract, tạo adapter nhỏ tại shared UI, dùng ở vùng đang sửa.
Không copy cả page Công việc để tạo màn hình mới. Không tự tạo tên export rồi
ghi tài liệu rằng nó đã tồn tại.

## 21. Quy trình thiết kế và thay đổi contract

1. Chọn template trang và task chính của người dùng; mô tả một câu.
2. Xác định thứ tự thông tin và một primary action cho mỗi context độc lập.
3. Chọn surface: flat trước; blue chỉ khi có quyết định/tổng hợp cần tập trung.
4. Chọn shared primitive/density, điền đủ loading/empty/error/dirty/readonly.
5. Kiểm tra spacing/typography/focus bằng bảng foundation, không chỉnh cảm tính.
6. Kiểm tra các viewport, container, keyboard, long labels và draft preservation.
7. PR ghi rõ consumer bị ảnh hưởng, verification, sai lệch legacy và ngoại lệ.

Nếu khác contract, nêu rule bị khác, lý do vận hành, ảnh hưởng, phạm vi và kế hoạch
đưa về chuẩn. Không dùng “trang cũ đã thế” làm quyết định mới. User instruction cụ
thể trong task vẫn được ưu tiên; ghi lại ngoại lệ để lần sau không hiểu nhầm.
Đổi default shared cần xem cả Công việc, Điều hành, media và floating consumer;
variant opt-in không được âm thầm đổi mọi view filter.

## 22. Checklist nghiệm thu

- [ ] Dùng đúng template, nền trắng, một page title, header không lặp dữ liệu.
- [ ] Font kế thừa stack chung; size/weight/line-height theo vai trò.
- [ ] Padding trang và gap có chủ sở hữu; không bị wrapper cộng đôi.
- [ ] Blue focus surface có mục đích rõ, recipe đúng, không nested card/shadow.
- [ ] Domain palette từ mapping shared; warning/state không thay domain identity.
- [ ] Row phẳng, line 1px đúng semantic; số/date/money format thống nhất.
- [ ] Tab dùng primitive; đúng density, underline; completion dot sau text,
      warning marker trước text; có state text và narrow-container behavior.
- [ ] Icon đúng bộ/size; icon-only có label và target; badge không giả action.
- [ ] Avatar/thumbnail là đối tượng thật, fallback đúng, không prototype filler.
- [ ] Form có label/helper/error; readonly khác disabled; permission không chỉ CSS.
- [ ] Pending chặn mutation lặp; dirty/saved/complete/unknown phân biệt rõ.
- [ ] Detail/modal/drawer cùng nội dung và action semantics, không copy lệch.
- [ ] Floating có focus/scroll/close/draft guard, không z-index cục bộ tùy ý.
- [ ] Mobile/320px, narrow pane, 200% zoom, keyboard và touch thao tác được.
- [ ] Loading/empty/search-empty/error/read-only/long text được kiểm chứng.
- [ ] Diff không đổi permission/workflow/backend data để phục vụ styling.
- [ ] Chỉ ghi check thực sự đã chạy; phân biệt mockup và browser app thật.

## 23. Mức áp dụng hiện tại và thứ tự chuyển đổi

Đối chiếu code tại main `b01285e0` ngày 2026-11-19; PR đang mở không tự coi là main.

| Hạng mục | Đã có | Khoảng cách tới v2 / việc cần làm |
| --- | --- | --- |
| Foundation v2 | Thêm `ADMIN_UI_FOUNDATION` trong PR contract này | Spec export; chưa tự áp CSS vào trang |
| Page/header/toolbar | `AdminPage.tsx`, `ADMIN_UI` | Adapter còn class cũ; cần responsive padding và line-height/spacing explicit |
| Font | Body dùng Geist; dashboard override Arial | Gỡ override cục bộ khi chuyển cả hai về stack foundation |
| Typography | Có role tokens cơ bản | Eyebrow tracking 0.18em cũ khác chuẩn 0.08em; microBadge đang dùng rộng hơn chuẩn |
| Focus surface | `ADMIN_UI.insightSurface = bg-blue-50`, volume chart | Recipe record summary ở PR #120; chưa có primitive FocusPanel dùng chung |
| Tabs | Shared component, compact CSS, keyboard và completion indicator | Comfortable adapter ở PR #120; dot hiện margin 6px nhưng cần layout căn giữa rõ |
| Domain tone | `ADMIN_DOMAIN_TONE` và signal presentation | Giữ mapping, bỏ palette cục bộ khi chạm vùng |
| Avatar/identity | Avatar/Stack/InlineList | Giữ export; thêm broken-image fallback nếu consumer cần |
| Buttons/input | Class tokens, nhiều domain control riêng | Chuẩn hóa variants/targets; không để height hoặc radius bị global override |
| Form legacy CSS | `.admin-ui form` trong globals.css | Có `!important` ép radius 0, input 42px và đổi gap; phải scope/migrate trước khi nhận v2 compliant |
| Card global CSS | `.card:hover` có lift/shadow phục vụ vùng khác | Admin primitive không dùng generic `.card`; không xóa rule storefront bừa bãi |
| Dialog/popover | App dialog và các floating implementation trong domain | Chưa có wrapper thống nhất đầy đủ cho mọi recipe; cần tái sử dụng focus/draft handling |
| Drawer | Recipe v2 trong tài liệu này | Không tuyên bố đã có shared Drawer API; triển khai wrapper khi migrate consumer |
| Tests | Theo từng domain/consumer hiện có | Cần acceptance cho primitives và reference pages khi migrate runtime |

Thứ tự chuyển đổi: (1) typography/padding adapter và scope CSS legacy;
(2) FocusPanel, tab density và status marker; (3) actions/field/badge;
(4) detail/modal/drawer shell; (5) các page khác khi được sửa.
Mỗi bước có PR giới hạn, kiểm thử consumer đang dùng, không rewrite toàn admin
trong một lượt và không gắn nhãn “đồng nhất” khi mới cập nhật tài liệu.

## 24. Bản đồ reference để triển khai/review

| Cần tham chiếu | File |
| --- | --- |
| Work page, quick create, detail flow | [`PersonalWorkClient.tsx`](../../src/domains/personal-work/ui/PersonalWorkClient.tsx) |
| Work row, metadata, popup trigger | [`PersonalWorkListRow.tsx`](../../src/domains/personal-work/ui/PersonalWorkListRow.tsx) |
| Work spacing và container queries | [`PersonalWorkList.module.css`](../../src/domains/personal-work/ui/PersonalWorkList.module.css) |
| Operations hierarchy, reminders, panes | [`OperationsDashboard.tsx`](../../src/domains/admin-home/ui/OperationsDashboard.tsx) |
| Operations grid, row và chart geometry | [`OperationsDashboard.module.css`](../../src/domains/admin-home/ui/OperationsDashboard.module.css) |
| Volume chart và labels | [`OperationsVolumeChart.tsx`](../../src/domains/admin-home/ui/OperationsVolumeChart.tsx) |
| Media editor tab consumer | [`WatchFormClient.tsx`](../../src/domains/watch/client/WatchFormClient.tsx) |
| Record summary consumer | [`WatchBasicSection.tsx`](../../src/domains/watch/ui/edit/WatchBasicSection.tsx) |
| CSS tab adapter và legacy conflicts | [`globals.css`](../../src/app/globals.css) |

Reference là bằng chứng bố cục và hành vi; foundation/recipe là chuẩn khi reference
còn sai lệch. Không lấy ảnh chụp làm nguồn pixel hoặc status dữ liệu runtime.


## Reports navigation group

Reports is a peer group alongside Business, Storefront and System. Expanded and mobile headings share typography, alignment, dividers and disclosure behavior. In the collapsed rail, one Reports icon opens permitted Overview/Finance/Sales links. Keep rail flyout and expanded disclosure state independent, shortcuts visible, keyboard access, Escape dismissal and focus return.

## Ben media workspace

- The Media entry sits beside Work and Technical in full-page Ben, gated by
  the existing `TASK_VIEW` permission. The list follows the technician workspace:
  white canvas, compact header, one search/stage toolbar and flat thumbnail rows.
- Default to Media Processing. Stages mean Photography, Media Processing, Publish
  and Done; do not relabel a stage as an execution status. Filter/search before
  pagination; show actual result counts, including the full explicit Done archive.
- Watch completion is a count of four independently confirmed sections, not
  approval of the workflow. Do not apply that denominator to Media Post records.
- Open the existing authorized editor with its exact binding and return URL.
  Returning restores the query, stage, page and list scroll. Media from Ben uses
  a full-page shell; its form stays outside assistant chat and retains unsaved
  change guards, per-section completion, and existing transition permissions.
- Keep native 44px search/filter controls, clear empty/loading/error states, and
  an icon fallback for missing or failed images. No decorative metric cards.


## Danh bạ workspace

Sidebar chính có một destination Danh bạ. Trong workspace, menu trái liệt kê
Người dùng / Khách hàng / Nhà cung cấp (Vendor) theo quyền đọc hiện hữu; không
đưa Users vào System lần thứ hai. Các URL danh sách cũ giữ nguyên để không phá
bookmark, search, pagination và form hiện hữu. `/admin/directory` đi tới mục đầu
được phép; active state sidebar theo cả workspace và các route danh sách.

Dùng geometry `ADMIN_UI_FOUNDATION.splitWorkspace` và `AdminSplitWorkspace`
đang được áp dụng cho Vận hành / Home ở PR #124: menu 280px gồm inset phải
16px, gap 28px, line slate-100. Đo available width bằng hook chung; dưới 960px,
menu thành native selector cùng các destination. Selector kích hoạt cùng route
link để giữ kiểm tra dirty draft. Không containment hoặc padding page lồng nhau.

Một h1 Danh bạ; heading vùng phải là tên danh sách, action tạo ở cạnh heading,
toolbar tìm kiếm ngay dưới. Danh sách phẳng, count/filter/pagination theo domain;
không thêm card hoặc KPI. Mỗi mục chỉ xuất hiện khi đủ quyền đọc, không suy ra
quyền sửa từ khả năng mở workspace. Không đổi API, role grant hoặc access policy.

Runtime dùng AdminManagementSection và AdminWorkspaceNavigation. Header dùng
variant workspace như Home; menu chọn nền focusSurface như Vận hành. Toolbar
tìm kiếm đơn giản dùng variant phẳng, kết quả/count và Làm mới hiện trực tiếp.
Danh sách có heading cột, nhận diện người dùng bằng AdminUserAvatar, thiếu dữ
liệu dùng dấu —; trên mobile bỏ heading cột và giữ thứ tự đọc từng liên hệ.

Form người dùng dùng inline editor cùng vùng nội dung như khách hàng/nhà cung
cấp để đối chiếu danh sách; không mở drawer legacy. Field/button lấy từ shared
AdminManagement, vai trò dùng checkbox native, không card màu cho từng vai trò.
PageEditingState ở heading form; lỗi lưu ở trong form và giữ dữ liệu, thành công
chỉ toast một lần. Hủy/chuyển route/chọn bản ghi khác kiểm tra dirty draft trước.
API, role grant và semantics lưu không thay đổi. Trang quản lý vai trò riêng
không thuộc phạm vi chuẩn hóa này.
001b7b43 (Align directory workspace and editors with admin UI contract)
