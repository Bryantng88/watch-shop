# Product image storage setup

## Env

```env
PRODUCT_INLINE_PREFIX=products/inline/active
PRODUCT_EDIT_PREFIX=products/edit/active
PRODUCT_SOLD_PREFIX=products/sold
PRODUCT_IMAGE_ARCHIVE_DELETE_SOURCE=false
```

## Flow

- Inline image picker browse + preview: `PRODUCT_INLINE_PREFIX`
- Edit image picker browse + preview: `PRODUCT_EDIT_PREFIX`
- Product DB stores edit keys while product is active
- When product status changes to `SOLD`, backend copies image keys to `PRODUCT_SOLD_PREFIX/YYYY/MM/...`
- After sold, DB pointers are switched to sold keys automatically
- If `PRODUCT_IMAGE_ARCHIVE_DELETE_SOURCE=true`, source files in edit folder are deleted after copy succeeds

## Manual test archive route

`POST /api/admin/products/:id/image-storage/archive`

Body:

```json
{
  "deleteSource": false
}
```
