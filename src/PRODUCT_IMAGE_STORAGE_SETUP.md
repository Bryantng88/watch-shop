# Product image storage setup

## Env

```env
PRODUCT_INLINE_PREFIX=products/inline/active
PRODUCT_INLINE_CHOSEN_PREFIX=products/inline/chosen
PRODUCT_EDIT_PREFIX=products/edit/active
PRODUCT_SOLD_PREFIX=products/sold
PRODUCT_IMAGE_ARCHIVE_DELETE_SOURCE=false
```

## Flow

- Inline Image Picker browse + preview: `PRODUCT_INLINE_PREFIX`
- Khi chọn ảnh inline: file được move sang `PRODUCT_INLINE_CHOSEN_PREFIX`
- Nếu chọn lại ảnh inline khác: ảnh inline cũ của product được trả về `PRODUCT_INLINE_PREFIX`
- Edit Image Picker browse + preview: `PRODUCT_EDIT_PREFIX`
- Product DB stores edit keys while product is active
- Khi product chuyển sang `SOLD`, backend copy image keys sang `PRODUCT_SOLD_PREFIX/YYYY/MM/...`
- Sau khi sold, DB pointers được switch sang sold keys tự động
- Nếu `PRODUCT_IMAGE_ARCHIVE_DELETE_SOURCE=true`, source files trong edit folder sẽ bị delete sau khi copy thành công

## Manual test archive route

`POST /api/admin/products/:id/image-storage/archive`

Body:

```json
{
  "deleteSource": false
}
```
