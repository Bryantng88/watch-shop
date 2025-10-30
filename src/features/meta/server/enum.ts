// features/meta/server/enums.ts (file server-only)
import 'server-only';
import { AvailabilityStatus, ProductType, CaseType, MovementType } from '@prisma/client';

export const AVAILABILITY_STATUS = Object.values(AvailabilityStatus);
export const PRODUCT_TYPES = Object.values(ProductType);
export const CASE_TYPES = Object.values(CaseType);
export const MOVEMENT_TYPES = Object.values(MovementType);
// (tuỳ) export type cho client dùng khi nhận props
//export type ProductStatusDTO = ProductStatus;
export type ProductTypeDTO = ProductType;
