# Business Collaboration Platform - Product Bible

## Muc luc

1. [Vision](#1-vision)
2. [Dieu phoi (Coordination)](#2-dieu-phoi-coordination)
3. [Chu ky dieu phoi](#3-chu-ky-dieu-phoi)
4. [Phieu xu ly](#4-phieu-xu-ly)
5. [Business Binding](#5-business-binding)
6. [Activity](#6-activity)
7. [Workflow](#7-workflow)
8. [Work Type](#8-work-type)
9. [Dashboard Dieu phoi](#9-dashboard-dieu-phoi)
10. [Bao cao](#10-bao-cao)
11. [Nguyen tac bat bien](#11-nguyen-tac-bat-bien)
12. [Future Vision](#12-future-vision)
13. [Open Questions](#13-open-questions)

---

## 1. Vision

Business Collaboration Platform la nen tang giup doanh nghiep dieu phoi cong viec lap lai, cong tac giua cac vai tro, theo doi tien do, tu dong hoa cac buoc van hanh va tao bao cao dieu phoi.

Nen tang nay khong thay the cac nghiep vu chuyen mon nhu ban hang, san pham, kho, ky thuat, marketing hay cham soc khach hang. Cac nghiep vu do van co man hinh, quy tac va du lieu rieng. Business Collaboration Platform dong vai tro lop cong tac va dieu hanh nam phia tren cac nghiep vu, giup con nguoi nhin thay viec can lam, ai dang phu trach, viec nao dang tre, viec nao can phan hoi va luong cong viec dang nghen o dau.

Muc tieu cua san pham:

- Gom cac tin hieu nghiep vu thanh ngu canh lam viec ro rang.
- Bien cac cong viec lap lai thanh Phieu xu ly co the theo doi va cong tac.
- Giam that lac thong tin giua cac bo phan.
- Giam phu thuoc vao chat roi, file roi, ghi chu ca nhan va nho viec thu cong.
- Tao nen tang de tu dong hoa van hanh nhung van giu con nguoi o trung tam quyet dinh.
- Tao mot nguon su that duy nhat cho hoat dong dieu phoi.

Van de san pham giai quyet:

- Mot nghiep vu thay doi nhung nguoi lien quan khong biet.
- Nhieu viec lap lai xay ra moi tuan nhung khong co noi dieu hanh chung.
- Feedback nam rai rac trong nhieu kenh, kho truy vet.
- Quan ly khong biet phieu nao can xu ly truoc.
- Bao cao van hanh phai tong hop thu cong tu nhieu nguon.
- Workflow va notification phu thuoc vao tung domain, kho mo rong sang phong ban khac.

Triet ly san pham:

- Business Domain la noi su that nghiep vu duoc tao ra.
- Dieu phoi la noi con nguoi cong tac de xu ly su that do.
- He thong khong ep moi thu vao mot quy trinh cung; moi Work Type co workflow phu hop.
- Tu dong hoa chi co gia tri khi lam ro viec can lam, khong lam mo trach nhiem.
- Mot ngu canh lam viec tot phai tra loi duoc: viec gi, vi sao, ai lien quan, dang o dau, can lam gi tiep.

---

## 2. Dieu phoi (Coordination)

Dieu phoi la trung tam van hanh cua Business Collaboration Platform.

Dieu phoi khong phai noi nhap lieu. Dieu phoi khong thay the nghiep vu. Dieu phoi khong quyet dinh thay Business Domain.

Dieu phoi chi tap trung vao:

- dieu hanh
- theo doi
- cong tac
- bao cao
- tu dong hoa

Noi cach khac, Business Domain tra loi cau hoi "nghiep vu la gi va da thay doi nhu the nao". Dieu phoi tra loi cau hoi "ai can biet, ai can lam, lam den dau, dang nghen o dau".

### Vai tro cua Dieu phoi

Dieu phoi giup doi ngu:

- Nhin thay cac viec can xu ly trong mot chu ky van hanh.
- Gom nhieu Business Objects vao cung mot boi canh lam viec.
- Trao doi quanh tung su kien hoac van de cu the.
- Theo doi trang thai xu ly ma khong can mo tung man hinh nghiep vu.
- Kich hoat workflow, nhac viec va notification theo nhu cau van hanh.
- Tao bao cao dieu phoi dua tren du lieu cong tac.

### Dieu phoi khong lam gi

Dieu phoi khong:

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
Coordination
      |
      +--> Business Binding
      |
      +--> Activity
      |
      +--> Workflow
      |
      v
Dashboard / Report / Notification
```

---

## 3. Chu ky dieu phoi

Chu ky dieu phoi la khung thoi gian van hanh de gom, theo doi va ket thuc mot tap cong viec.

Vi du:

- Dieu phoi van hanh tuan 27
- Dieu phoi van hanh tuan 28
- Dieu phoi van hanh tuan 29

Mot chu ky co nhieu Phieu xu ly. Moi Phieu xu ly dai dien cho mot loai viec can duoc dieu hanh trong chu ky do.

### Vi du thuc te

Trong "Dieu phoi van hanh tuan 27", doi ngu co the co cac Phieu xu ly:

- Dang bai san pham
- Review Content
- Review Image
- Bao gia
- Marketing
- Ky thuat

Moi phieu co nhieu Business Objects lien quan. Vi du phieu "Dang bai san pham" co the gom Watch A, Watch B, Watch C.

### Y nghia san pham

Chu ky giup nguoi dung co mot "mat cat van hanh" ro rang:

- Tuan nay dang xu ly bao nhieu viec?
- Viec nao dang chua co nguoi phu trach?
- Phieu nao dang tre?
- Business Object nao bi giu lai qua nhieu buoc?
- Viec nao can day sang chu ky sau?

Chu ky khong phai bat buoc moi nghiep vu phai song trong do. Mot Business Domain van co the hoat dong doc lap. Chu ky chi xuat hien khi doi ngu can dieu phoi, cong tac hoac theo doi.

---

## 4. Phieu xu ly

Phieu xu ly la don vi lam viec chinh cua Business Collaboration Platform.

Nguoi dung lam viec tai Phieu xu ly. Phieu xu ly dai dien cho mot loai cong viec lap lai, co the xuat hien trong moi chu ky van hanh.

Vi du Work Type duoc the hien bang Phieu xu ly:

- Dang bai
- Review Content
- Review Image
- Bao gia
- Marketing
- Ky thuat
- CSKH
- Tuyen dung

Mot Phieu xu ly co the xu ly nhieu Business Objects.

### Vi du thuc te

```text
Chu ky: Dieu phoi van hanh tuan 27

Phieu xu ly: Review Content

Business Objects:
- Watch A can review mo ta san pham
- Watch B can review title SEO
- Watch C can review thong tin bao hanh

Nguoi lien quan:
- Content
- Marketing
- Quan ly san pham
```

Trong vi du tren, Phieu xu ly khong phai man hinh sua Watch. Phieu xu ly la noi doi ngu cung nhin thay danh sach Watch can review, trao doi, phan cong, theo doi tien do va dong viec khi hoan tat.

### Phieu xu ly nen tra loi

- Loai viec nay la gi?
- Viec nay thuoc chu ky nao?
- Business Objects nao dang nam trong pham vi xu ly?
- Ai dang phu trach?
- Dang o trang thai nao?
- Co feedback, activity, workflow nao lien quan?
- Viec nao can xu ly tiep?

---

## 5. Business Binding

Business Binding la cau noi giua Phieu xu ly va Business.

Business Binding cho biet mot Business Object dang duoc dua vao pham vi xu ly cua Phieu xu ly nao. No chi lien ket va tao ngu canh dieu phoi. No khong chua Business Logic.

### Hai nguon tao Business Binding

AUTO:

```text
Business Event
      |
      v
Router
      |
      v
Business Binding
```

MANUAL:

```text
User chu dong them nghiep vu
      |
      v
Business Binding
```

### AUTO

AUTO phu hop khi su kien nghiep vu phat sinh tu hoat dong that trong he thong va can duoc dua vao dieu phoi.

Vi du:

- Watch duoc chuyen sang trang thai can review content.
- Hinh anh san pham can duoc kiem tra.
- Bao gia can nguoi phu trach xac nhan.

### MANUAL

MANUAL phu hop khi nguoi dung chu dong dua mot nghiep vu vao Phieu xu ly de theo doi hoac cong tac.

Vi du:

- Quan ly thay Watch A can uu tien dang bai trong tuan nay.
- Marketing them mot san pham vao phieu campaign.
- Ky thuat them mot truong hop can kiem tra lai.

### Nguyen tac

Business Binding khong quyet dinh nghiep vu. Business Binding chi noi: "Business Object nay dang can duoc chu y trong Phieu xu ly nay".

---

## 6. Activity

Activity la Conversation Unit.

Activity la don vi gom cac trao doi, phan hoi, tin hieu va hanh dong lien quan den mot su kien hoac mot chu de trong Phieu xu ly.

Mot Business Event tao mot Activity. Discussion cung la Activity.

Mot Activity gom co:

- Business Event
- Business Feedback
- Replies
- Workflow
- Notification

Reply chi co mot cap. Khong reply long nhau.

### Vi du Activity tu Business Event

```text
Business Event:
Watch A can review image

Activity:
- Event: Watch A can review image
- Feedback: Anh mat so 3 bi lech mau
- Reply: Designer da cap nhat anh moi
- Workflow: Chuyen sang buoc cho review lai
- Notification: Bao cho nguoi review image
```

### Vi du Activity tu Discussion

```text
Discussion:
Co nen uu tien Watch B cho chien dich cuoi tuan?

Activity:
- Discussion topic
- Replies cua nhung nguoi lien quan
- Workflow neu can tao hanh dong tiep theo
- Notification cho nguoi duoc mention hoac duoc giao viec
```

### Y nghia san pham

Activity giup nguoi dung khong phai tim lai nguyen nhan trong nhieu kenh rieng le. Moi Activity la mot "cuoc hoi thoai co ngu canh", gan voi su kien, feedback, workflow va notification lien quan.

Reply mot cap giup hoi thoai de doc, de truy vet va phu hop voi moi truong van hanh. Neu mot chu de can tach rieng, no nen tro thanh Activity moi thay vi reply long nhau.

---

## 7. Workflow

Workflow thuoc Phieu xu ly. Workflow khong thuoc Business.

Workflow mo ta cach mot Phieu xu ly duoc dieu hanh qua cac buoc, trang thai, phan cong, nhac viec, kiem tra va dong viec.

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
Workflow cua Phieu xu ly
  |
  v
Buoc tiep theo / Phan cong / Nhac viec / Notification
```

### Vi du thuc te

Phieu xu ly: Review Image

Workflow co the gom:

- Can review
- Dang review
- Can chinh sua
- Cho review lai
- Hoan tat

Trigger co the la:

- EVENT: Watch co bo anh moi can review.
- MANUAL: Quan ly them Watch vao phieu review.
- TIME: Sau 24 gio chua co phan hoi thi nhac nguoi phu trach.

Workflow khong can biet chi tiet Business Logic cua Watch. Workflow chi can biet trong pham vi Phieu xu ly, viec dang o buoc nao va ai can hanh dong.

---

## 8. Work Type

Mot Phieu xu ly dai dien cho mot Work Type.

Work Type la loai cong viec lap lai trong van hanh. Moi Work Type co muc tieu, nguoi tham gia, workflow, cach do tien do va cach dong viec rieng.

Vi du:

- Dang bai
- Review Content
- Review Image
- Bao gia
- Marketing
- Ky thuat
- CSKH
- Nhan su

### Moi Work Type co Workflow rieng

Khong nen ep moi Work Type vao cung mot workflow tong quat.

Vi du:

- Review Content can cac buoc: can review, can sua, cho duyet lai, hoan tat.
- Bao gia can cac buoc: tao yeu cau, cho xac nhan, gui khach, theo doi phan hoi.
- Ky thuat can cac buoc: tiep nhan, chan doan, xu ly, kiem tra lai, hoan tat.

### Y nghia san pham

Work Type giup nen tang mo rong sang nhieu phong ban ma khong phu thuoc vao mot nganh cu the. Moi phong ban co the co cac loai viec lap lai rieng, nhung deu dung chung triết ly dieu phoi: phieu, binding, activity, workflow, dashboard, report.

---

## 9. Dashboard Dieu phoi

Dashboard Dieu phoi khong query truc tiep Business.

Dashboard chi query Coordination.

Dashboard tra loi cac cau hoi van hanh:

- Dang nghen o dau?
- Phieu nao can xu ly?
- Business nao dang cho?
- Workflow nao dang cham?
- Chu ky nao dang qua tai?
- Ai dang co nhieu viec can phan hoi?
- Activity nao dang tao nhieu feedback?

### Dashboard khong phai bao cao nghiep vu chuyen sau

Dashboard Dieu phoi khong thay the dashboard doanh thu, ton kho, san pham, marketing performance hay CSKH chuyen sau. Cac dashboard chuyen sau thuoc ve Business Domain tuong ung.

Dashboard Dieu phoi chi nhin cac tin hieu da di qua lop Coordination.

### Vi du man hinh dieu phoi mong muon

```text
Dieu phoi van hanh tuan 27

Tong quan:
- 6 Phieu xu ly dang mo
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

Tat ca bao cao dieu phoi duoc xay dung tu:

- Business Binding
- Activity
- Workflow

Khong lay truc tiep tu Business Domain.

### Bao cao dieu phoi nen tra loi

- Co bao nhieu Business Objects da duoc dua vao dieu phoi?
- Moi Work Type xu ly bao nhieu viec trong chu ky?
- Viec nao dang tre va tre o buoc nao?
- Activity nao co nhieu feedback nhat?
- Workflow nao thuong bi dung lai?
- Ti le hoan tat cua tung Phieu xu ly la bao nhieu?
- Nguoi dung hoac nhom nao dang co nhieu viec cho phan hoi?

### Vi du bao cao

```text
Bao cao dieu phoi tuan 27

Work Type        Tong viec   Hoan tat   Qua han   Dang cho
Review Content  18          12         2         4
Review Image    14          8          4         2
Bao gia         10          6          1         3
Dang bai        9           7          0         2
```

Bao cao dieu phoi phan anh chat luong van hanh va cong tac, khong ket luan thay bao cao nghiep vu.

---

## 11. Nguyen tac bat bien

Day la phan quan trong nhat cua Product Bible. Cac nguyen tac nay giup giu san pham dung huong khi mo rong sang nhieu domain, nhieu phong ban va nhieu workflow.

1. Business Domain khong biet Dieu phoi.

Business Domain co the tao ra su kien nghiep vu, nhung khong phu thuoc vao Dieu phoi de hoat dong.

2. Dieu phoi khong nhap lieu thay Business.

Moi hanh dong tao, sua, xoa, phe duyet hay thay doi su that nghiep vu phai thuoc ve Business Domain tuong ung.

3. Business Event la nguon su that cua thay doi nghiep vu.

Khi nghiep vu thay doi, Business Event la tin hieu chinh de lop Coordination nhan biet.

4. Phieu xu ly la noi con nguoi cong tac.

Nguoi dung vao Phieu xu ly de xem viec can lam, trao doi, phan cong, theo doi workflow va dong viec.

5. Business Binding chi lien ket.

Business Binding khong chua Business Logic, khong quyet dinh trang thai nghiep vu, khong thay doi du lieu goc.

6. Workflow khong phu thuoc Business Event.

Business Event chi la mot loai Trigger. Workflow co the duoc kich hoat bang EVENT, MANUAL, TIME hoac trigger khac.

7. Workflow thuoc Phieu xu ly, khong thuoc Business.

Moi Work Type co Workflow rieng vi moi loai viec co cach dieu phoi rieng.

8. Activity la Conversation Unit.

Moi su kien, discussion, feedback va trao doi can duoc gom vao Activity de giu ngu canh ro rang.

9. Reply chi co mot cap.

Khong reply long nhau. Khi can tach chu de, tao Activity moi.

10. Business Feedback khong phai comment thuong.

Business Feedback la phan hoi co y nghia voi nghiep vu va duoc dat trong ngu canh Activity.

11. Business co the hoat dong doc lap khong can Dieu phoi.

Coordination la lop cong tac va theo doi, khong phai dieu kien ton tai cua Business Domain.

12. Dieu phoi chi xuat hien khi can cong tac hoac theo doi.

Khong moi hanh dong nghiep vu deu can vao Dieu phoi.

13. Dashboard Dieu phoi chi doc Coordination.

Dashboard Dieu phoi khong lay tat ca du lieu truc tiep tu Business Domain de tranh bien thanh dashboard nghiep vu tong hop.

14. Bao cao Dieu phoi duoc xay dung tu Binding, Activity va Workflow.

Bao cao nay do chat luong dieu hanh, cong tac va xu ly, khong thay the bao cao chuyen mon.

15. Watch chi la mot plugin cua nen tang.

Nen tang phai duoc thiet ke de phuc vu nhieu nganh va phong ban, khong dong khung trong nganh dong ho.

### Ban do nguyen tac

```text
Business Domain
  - so huu su that nghiep vu
  - phat sinh Business Event
  - hoat dong doc lap

Coordination
  - nhan tin hieu
  - tao ngu canh cong tac
  - theo doi tien do
  - kich hoat workflow
  - bao cao dieu phoi

Nguoi dung
  - lam viec trong Phieu xu ly
  - thao luan trong Activity
  - phan hoi va dong viec
```

---

## 12. Future Vision

Trong tuong lai, Business Collaboration Platform phai dung duoc cho:

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
- Work Types rieng
- Workflow rieng
- Dashboard dieu phoi rieng theo nhu cau

Nhung tat ca van tuan theo cung mot ngon ngu san pham:

```text
Business Object
      |
      v
Business Event
      |
      v
Business Binding
      |
      v
Phieu xu ly
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

Doanh nghiep co the bat dau tu mot domain nho, sau do mo rong sang nhieu phong ban ma khong can viet lai triết ly dieu phoi.

---

## 13. Open Questions

Khong tu tra loi cac cau hoi sau. Day la danh sach van de can thao luan trong cac sprint tiep theo.

- Mot chu ky dieu phoi nen duoc tao thu cong, tu dong, hay ca hai?
- Chu ky mac dinh nen theo tuan, theo thang, theo campaign, hay tuy tung Work Type?
- Khi nao mot Phieu xu ly duoc xem la hoan tat?
- Mot Business Object co the nam trong bao nhieu Phieu xu ly cung luc?
- Khi Business Object bi xoa, huy hoac dong trong Business Domain, Coordination nen hien thi nhu the nao?
- Can nhung Work Type mac dinh nao cho giai doan dau?
- Moi Work Type co can owner rieng khong?
- Business Binding MANUAL co can ly do bat buoc khi them khong?
- Khi AUTO va MANUAL cung dua mot Business Object vao mot Phieu xu ly, nen hien thi nguon nhu the nao?
- Activity nao nen duoc tao tu Business Event, Activity nao chi nen la log an?
- Business Feedback nen co nhung loai nao trong giai doan dau?
- Notification nao la bat buoc, notification nao nen de nguoi dung cau hinh?
- Workflow co can SLA rieng cho tung buoc khong?
- Dashboard Dieu phoi giai doan dau can uu tien chi so nao?
- Bao cao dieu phoi nen theo chu ky, Work Type, nguoi phu trach, hay phong ban?
- Khi mo rong sang domain khac ngoai Watch, can quy uoc nao de giu trai nghiem nhat quan?
