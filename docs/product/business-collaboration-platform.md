# Space Management Platform - Product Bible

## Muc luc

1. [Vision](#1-vision)
2. [Space Management](#2-space-management)
3. [Space Cycle](#3-space-cycle)
4. [Workspace](#4-workspace)
5. [Item](#5-item)
6. [Activity](#6-activity)
7. [Workflow](#7-workflow)
8. [Workspace Template](#8-workspace-template)
9. [Space Dashboard](#9-space-dashboard)
10. [Bao cao](#10-bao-cao)
11. [Nguyen tac bat bien](#11-nguyen-tac-bat-bien)
12. [Future Vision](#12-future-vision)
13. [Open Questions](#13-open-questions)

---

## 1. Vision

Space Management Platform la nen tang giup doanh nghiep quan ly Spaces, Workspaces, Items, Activity va Discussion tren cac luong van hanh lap lai.

Nen tang nay khong thay the cac nghiep vu chuyen mon nhu ban hang, san pham, kho, ky thuat, marketing hay cham soc khach hang. Cac nghiep vu do van co man hinh, quy tac va du lieu rieng. Space Management Platform dong vai tro lop cong tac va dieu hanh nam phia tren cac nghiep vu, giup con nguoi nhin thay viec can lam, ai dang phu trach, viec nao dang tre, viec nao can phan hoi va luong cong viec dang nghen o dau.

Muc tieu cua san pham:

- Gom cac tin hieu nghiep vu thanh ngu canh lam viec ro rang.
- Bien cac cong viec lap lai thanh Workspace co the theo doi va cong tac.
- Giam that lac thong tin giua cac bo phan.
- Giam phu thuoc vao chat roi, file roi, ghi chu ca nhan va nho viec thu cong.
- Tao nen tang de tu dong hoa van hanh nhung van giu con nguoi o trung tam quyet dinh.
- Tao mot nguon su that duy nhat cho hoat dong Space Management.

Van de san pham giai quyet:

- Mot nghiep vu thay doi nhung nguoi lien quan khong biet.
- Nhieu viec lap lai xay ra moi tuan nhung khong co noi dieu hanh chung.
- Feedback nam rai rac trong nhieu kenh, kho truy vet.
- Quan ly khong biet Workspace nao can xu ly truoc.
- Bao cao van hanh phai tong hop thu cong tu nhieu nguon.
- Workflow va notification phu thuoc vao tung domain, kho mo rong sang phong ban khac.

Triet ly san pham:

- Business Domain la noi su that nghiep vu duoc tao ra.
- Space Management la noi con nguoi cong tac de xu ly su that do.
- He thong khong ep moi thu vao mot quy trinh cung; moi Workspace Template co workflow phu hop.
- Tu dong hoa chi co gia tri khi lam ro viec can lam, khong lam mo trach nhiem.
- Mot ngu canh lam viec tot phai tra loi duoc: viec gi, vi sao, ai lien quan, dang o dau, can lam gi tiep.

---

## 2. Space Management

Space Management la trung tam van hanh cua Space Management Platform.

Space Management khong phai noi nhap lieu. Space Management khong thay the nghiep vu. Space Management khong quyet dinh thay Business Domain.

Space Management chi tap trung vao:

- dieu hanh
- theo doi
- cong tac
- bao cao
- tu dong hoa

Noi cach khac, Business Domain tra loi cau hoi "nghiep vu la gi va da thay doi nhu the nao". Space Management tra loi cau hoi "ai can biet, ai can lam, lam den dau, dang nghen o dau".

### Vai tro cua Space Management

Space Management giup doi ngu:

- Nhin thay cac viec can xu ly trong mot Space cycle van hanh.
- Gom nhieu Business Objects vao cung mot boi canh lam viec.
- Trao doi quanh tung su kien hoac van de cu the.
- Theo doi trang thai xu ly ma khong can mo tung man hinh nghiep vu.
- Kich hoat workflow, nhac viec va notification theo nhu cau van hanh.
- Tao bao cao Space Management dua tren du lieu cong tac.

### Space Management khong lam gi

Space Management khong:

- Nhap lieu thay man hinh nghiep vu.
- Chua quy tac nghiep vu chuyen mon.
- Thay doi su that nghiep vu goc.
- Tro thanh mot Business Domain moi.
- Tao bao cao truc tiep tu du lieu chuyen mon cua tung domain.

### Flow tong quan

```text
Business Domain
      |
      v
Business Event
      |
      v
Space Management
      |
      +--> Item
      |
      +--> Activity
      |
      +--> Workflow
      |
      v
Dashboard / Report / Notification
```

---

## 3. Space cycle

Space cycle la khung thoi gian van hanh de gom, theo doi va ket thuc mot tap cong viec.

Vi du:

- Space Management van hanh tuan 27
- Space Management van hanh tuan 28
- Space Management van hanh tuan 29

Mot Space cycle co nhieu Workspace. Moi Workspace dai dien cho mot loai viec can duoc dieu hanh trong Space cycle do.

### Vi du thuc te

Trong "Space Management van hanh tuan 27", doi ngu co the co cac Workspace:

- Dang bai san pham
- Review Content
- Review Image
- Bao gia
- Marketing
- Ky thuat

Moi Workspace co nhieu Business Objects lien quan. Vi du Workspace "Dang bai san pham" co the gom Watch A, Watch B, Watch C.

### Y nghia san pham

Space cycle giup nguoi dung co mot "mat cat van hanh" ro rang:

- Tuan nay dang xu ly bao nhieu viec?
- Viec nao dang chua co nguoi phu trach?
- Workspace nao dang tre?
- Business Object nao bi giu lai qua nhieu buoc?
- Viec nao can day sang Space cycle sau?

Space cycle khong phai bat buoc moi nghiep vu phai song trong do. Mot Business Domain van co the hoat dong doc lap. Space cycle chi xuat hien khi doi ngu can Space Management, cong tac hoac theo doi.

---

## 4. Workspace

Workspace la don vi lam viec chinh cua Space Management Platform.

Nguoi dung lam viec tai Workspace. Workspace dai dien cho mot loai cong viec lap lai, co the xuat hien trong moi Space cycle van hanh.

Vi du Workspace Template duoc the hien bang Workspace:

- Dang bai
- Review Content
- Review Image
- Bao gia
- Marketing
- Ky thuat
- CSKH
- Tuyen dung

Mot Workspace co the xu ly nhieu Business Objects.

### Vi du thuc te

```text
Space cycle: Space Management van hanh tuan 27

Workspace: Review Content

Business Objects:
- Watch A can review mo ta san pham
- Watch B can review title SEO
- Watch C can review thong tin bao hanh

Nguoi lien quan:
- Content
- Marketing
- Quan ly san pham
```

Trong vi du tren, Workspace khong phai man hinh sua Watch. Workspace la noi doi ngu cung nhin thay danh sach Watch can review, trao doi, phan cong, theo doi tien do va dong viec khi hoan tat.

### Workspace nen tra loi

- Loai viec nay la gi?
- Viec nay thuoc Space cycle nao?
- Business Objects nao dang nam trong pham vi xu ly?
- Ai dang phu trach?
- Dang o trang thai nao?
- Co feedback, activity, workflow nao lien quan?
- Viec nao can xu ly tiep?

---

## 5. Item

Item la cau noi giua Workspace va Business.

Item cho biet mot Business Object dang duoc dua vao pham vi xu ly cua Workspace nao. No chi lien ket va tao ngu canh Space Management. No khong chua Business Logic.

### Hai nguon tao Item

AUTO:

```text
Business Event
      |
      v
Router
      |
      v
Item
```

MANUAL:

```text
User chu dong them nghiep vu
      |
      v
Item
```

### AUTO

AUTO phu hop khi su kien nghiep vu phat sinh tu hoat dong that trong he thong va can duoc dua vao Space Management.

Vi du:

- Watch duoc chuyen sang trang thai can review content.
- Hinh anh san pham can duoc kiem tra.
- Bao gia can nguoi phu trach xac nhan.

### MANUAL

MANUAL phu hop khi nguoi dung chu dong dua mot nghiep vu vao Workspace de theo doi hoac cong tac.

Vi du:

- Quan ly thay Watch A can uu tien dang bai trong tuan nay.
- Marketing them mot san pham vao Workspace campaign.
- Ky thuat them mot truong hop can kiem tra lai.

### Nguyen tac

Item khong quyet dinh nghiep vu. Item chi noi: "Business Object nay dang can duoc chu y trong Workspace nay".

---

## 6. Activity

Activity la Conversation Unit.

Activity la don vi gom cac trao doi, phan hoi, tin hieu va hanh dong lien quan den mot su kien hoac mot chu de trong Workspace.

Mot Business Event tao mot Activity. Discussion cung la Activity.

Mot Activity gom co:

- Business Event
- Business Feedback
- Discussion
- Workflow
- Notification

Discussion chi co mot cap. Khong Discussion long nhau.

### Vi du Activity tu Business Event

```text
Business Event:
Watch A can review image

Activity:
- Event: Watch A can review image
- Feedback: Anh mat so 3 bi lech mau
- Discussion: Designer da cap nhat anh moi
- Workflow: Chuyen sang buoc cho review lai
- Notification: Bao cho nguoi review image
```

### Vi du Activity tu Discussion

```text
Discussion:
Co nen uu tien Watch B cho chien dich cuoi tuan?

Activity:
- Discussion topic
- Discussion cua nhung nguoi lien quan
- Workflow neu can tao hanh dong tiep theo
- Notification cho nguoi duoc mention hoac duoc giao viec
```

### Y nghia san pham

Activity giup nguoi dung khong phai tim lai nguyen nhan trong nhieu kenh rieng le. Moi Activity la mot "cuoc hoi thoai co ngu canh", gan voi su kien, feedback, workflow va notification lien quan.

Discussion mot cap giup hoi thoai de doc, de truy vet va phu hop voi moi truong van hanh. Neu mot chu de can tach rieng, no nen tro thanh Activity moi thay vi Discussion long nhau.

---

## 7. Workflow

Workflow thuoc Workspace. Workflow khong thuoc Business.

Workflow mo ta cach mot Workspace duoc dieu hanh qua cac buoc, trang thai, phan cong, nhac viec, kiem tra va dong viec.

Workflow duoc kich hoat boi Trigger.

Trigger gom:

- EVENT
- MANUAL
- TIME
- cac trigger khac neu san pham can mo rong

Business Event chi la mot Trigger. No khong phai toan bo Workflow.

### Flow minh hoa

```text
Trigger
  |
  +-- EVENT: Business Event phat sinh
  |
  +-- MANUAL: User bam kich hoat
  |
  +-- TIME: Den moc thoi gian
  |
  v
Workflow cua Workspace
  |
  v
Buoc tiep theo / Phan cong / Nhac viec / Notification
```

### Vi du thuc te

Workspace: Review Image

Workflow co the gom:

- Can review
- Dang review
- Can chinh sua
- Cho review lai
- Hoan tat

Trigger co the la:

- EVENT: Watch co bo anh moi can review.
- MANUAL: Quan ly them Watch vao Workspace review.
- TIME: Sau 24 gio chua co phan hoi thi nhac nguoi phu trach.

Workflow khong can biet chi tiet Business Logic cua Watch. Workflow chi can biet trong pham vi Workspace, viec dang o buoc nao va ai can hanh dong.

---

## 8. Workspace Template

Mot Workspace dai dien cho mot Workspace Template.

Workspace Template la loai cong viec lap lai trong van hanh. Moi Workspace Template co muc tieu, nguoi tham gia, workflow, cach do tien do va cach dong viec rieng.

Vi du:

- Dang bai
- Review Content
- Review Image
- Bao gia
- Marketing
- Ky thuat
- CSKH
- Nhan su

### Moi Workspace Template co Workflow rieng

Khong nen ep moi Workspace Template vao cung mot workflow tong quat.

Vi du:

- Review Content can cac buoc: can review, can sua, cho duyet lai, hoan tat.
- Bao gia can cac buoc: tao yeu cau, cho xac nhan, gui khach, theo doi phan hoi.
- Ky thuat can cac buoc: tiep nhan, chan doan, xu ly, kiem tra lai, hoan tat.

### Y nghia san pham

Workspace Template giup nen tang mo rong sang nhieu phong ban ma khong phu thuoc vao mot nganh cu the. Moi phong ban co the co cac loai viec lap lai rieng, nhung deu dung chung triết ly Space Management: Workspace, Item, Activity, Workflow, Dashboard, Report.

---

## 9. Space Dashboard

Space Dashboard khong query truc tiep Business.

Dashboard chi query Space Management.

Dashboard tra loi cac cau hoi van hanh:

- Dang nghen o dau?
- Workspace nao can xu ly?
- Business nao dang cho?
- Workflow nao dang cham?
- Space cycle nao dang qua tai?
- Ai dang co nhieu viec can phan hoi?
- Activity nao dang tao nhieu feedback?

### Dashboard khong phai bao cao nghiep vu chuyen sau

Space Dashboard khong thay the dashboard doanh thu, ton kho, san pham, marketing performance hay CSKH chuyen sau. Cac dashboard chuyen sau thuoc ve Business Domain tuong ung.

Space Dashboard chi nhin cac tin hieu da di qua lop Space Management.

### Vi du man hinh Space Management mong muon

```text
Space Management van hanh tuan 27

Tong quan:
- 6 Workspace dang mo
- 42 Business Objects dang duoc theo doi
- 9 viec dang qua han
- 5 Activity can phan hoi

Diem nghen:
- Review Image: 7 viec cho hon 24 gio
- Bao gia: 3 viec cho xac nhan
- Dang bai: 4 viec cho content update
```

---

## 10. Bao cao

Tat ca bao cao Space Management duoc xay dung tu:

- Item
- Activity
- Workflow

Khong lay truc tiep tu Business Domain.

### Bao cao Space Management nen tra loi

- Co bao nhieu Business Objects da duoc dua vao Space Management?
- Moi Workspace Template xu ly bao nhieu viec trong Space cycle?
- Viec nao dang tre va tre o buoc nao?
- Activity nao co nhieu feedback nhat?
- Workflow nao thuong bi dung lai?
- Ti le hoan tat cua tung Workspace la bao nhieu?
- Nguoi dung hoac nhom nao dang co nhieu viec cho phan hoi?

### Vi du bao cao

```text
Bao cao Space Management tuan 27

Workspace Template        Tong viec   Hoan tat   Qua han   Dang cho
Review Content  18          12         2         4
Review Image    14          8          4         2
Bao gia         10          6          1         3
Dang bai        9           7          0         2
```

Bao cao Space Management phan anh chat luong van hanh va cong tac, khong ket luan thay bao cao nghiep vu.

---

## 11. Nguyen tac bat bien

Day la phan quan trong nhat cua Product Bible. Cac nguyen tac nay giup giu san pham dung huong khi mo rong sang nhieu domain, nhieu phong ban va nhieu workflow.

1. Business Domain khong biet Space Management.

Business Domain co the tao ra su kien nghiep vu, nhung khong phu thuoc vao Space Management de hoat dong.

2. Space Management khong nhap lieu thay Business.

Moi hanh dong tao, sua, xoa, phe duyet hay thay doi su that nghiep vu phai thuoc ve Business Domain tuong ung.

3. Business Event la nguon su that cua thay doi nghiep vu.

Khi nghiep vu thay doi, Business Event la tin hieu chinh de lop Space Management nhan biet.

4. Workspace la noi con nguoi cong tac.

Nguoi dung vao Workspace de xem viec can lam, trao doi, phan cong, theo doi workflow va dong viec.

5. Item chi lien ket.

Item khong chua Business Logic, khong quyet dinh trang thai nghiep vu, khong thay doi du lieu goc.

6. Workflow khong phu thuoc Business Event.

Business Event chi la mot loai Trigger. Workflow co the duoc kich hoat bang EVENT, MANUAL, TIME hoac trigger khac.

7. Workflow thuoc Workspace, khong thuoc Business.

Moi Workspace Template co Workflow rieng vi moi loai viec co cach Space Management rieng.

8. Activity la Conversation Unit.

Moi su kien, discussion, feedback va trao doi can duoc gom vao Activity de giu ngu canh ro rang.

9. Discussion chi co mot cap.

Khong Discussion long nhau. Khi can tach chu de, tao Activity moi.

10. Business Feedback khong phai comment thuong.

Business Feedback la phan hoi co y nghia voi nghiep vu va duoc dat trong ngu canh Activity.

11. Business co the hoat dong doc lap khong can Space Management.

Space Management la lop cong tac va theo doi, khong phai dieu kien ton tai cua Business Domain.

12. Space Management chi xuat hien khi can cong tac hoac theo doi.

Khong moi hanh dong nghiep vu deu can vao Space Management.

13. Space Dashboard chi doc Space Management.

Space Dashboard khong lay tat ca du lieu truc tiep tu Business Domain de tranh bien thanh dashboard nghiep vu tong hop.

14. Bao cao Space Management duoc xay dung tu Binding, Activity va Workflow.

Bao cao nay do chat luong dieu hanh, cong tac va xu ly, khong thay the bao cao chuyen mon.

15. Watch chi la mot plugin cua nen tang.

Nen tang phai duoc thiet ke de phuc vu nhieu nganh va phong ban, khong dong khung trong nganh dong ho.

### Ban do nguyen tac

```text
Business Domain
  - so huu su that nghiep vu
  - phat sinh Business Event
  - hoat dong doc lap

Space Management
  - nhan tin hieu
  - tao ngu canh cong tac
  - theo doi tien do
  - kich hoat workflow
  - bao cao Space Management

Nguoi dung
  - lam viec trong Workspace
  - thao luan trong Activity
  - phan hoi va dong viec
```

---

## 12. Future Vision

Trong tuong lai, Space Management Platform phai dung duoc cho:

- Van hanh
- Ban hang
- Ky thuat
- Marketing
- CSKH
- Nhan su

Nen tang khong phu thuoc nganh dong ho. Watch chi la mot plugin cua nen tang.

### Huong mo rong

Moi domain moi co the dong gop:

- Business Objects rieng
- Business Events rieng
- Workspace Templates rieng
- Workflow rieng
- Space Dashboard rieng theo nhu cau

Nhung tat ca van tuan theo cung mot ngon ngu san pham:

```text
Business Object
      |
      v
Business Event
      |
      v
Item
      |
      v
Workspace
      |
      +--> Activity
      |
      +--> Workflow
      |
      v
Dashboard / Report / Notification
```

### Trai nghiem san pham mong muon

Nguoi dung khong can hieu cau truc ky thuat cua tung domain. Ho chi can thay:

- Tuan nay co nhung viec gi?
- Viec nao lien quan den minh?
- Can xu ly Business Object nao?
- Co feedback nao moi?
- Workflow dang o dau?
- Khi nao co the dong viec?

Doanh nghiep co the bat dau tu mot domain nho, sau do mo rong sang nhieu phong ban ma khong can viet lai triết ly Space Management.

---

## 13. Open Questions

Khong tu tra loi cac cau hoi sau. Day la danh sach van de can thao luan trong cac sprint tiep theo.

- Mot Space cycle nen duoc tao thu cong, tu dong, hay ca hai?
- Space cycle mac dinh nen theo tuan, theo thang, theo campaign, hay tuy tung Workspace Template?
- Khi nao mot Workspace duoc xem la hoan tat?
- Mot Business Object co the nam trong bao nhieu Workspace cung luc?
- Khi Business Object bi xoa, huy hoac dong trong Business Domain, Space Management nen hien thi nhu the nao?
- Can nhung Workspace Template mac dinh nao cho giai doan dau?
- Moi Workspace Template co can owner rieng khong?
- Item MANUAL co can ly do bat buoc khi them khong?
- Khi AUTO va MANUAL cung dua mot Business Object vao mot Workspace, nen hien thi nguon nhu the nao?
- Activity nao nen duoc tao tu Business Event, Activity nao chi nen la log an?
- Business Feedback nen co nhung loai nao trong giai doan dau?
- Notification nao la bat buoc, notification nao nen de nguoi dung cau hinh?
- Workflow co can SLA rieng cho tung buoc khong?
- Space Dashboard giai doan dau can uu tien chi so nao?
- Bao cao Space Management nen theo Space cycle, Workspace Template, nguoi phu trach, hay phong ban?
- Khi mo rong sang domain khac ngoai Watch, can quy uoc nao de giu trai nghiem nhat quan?
