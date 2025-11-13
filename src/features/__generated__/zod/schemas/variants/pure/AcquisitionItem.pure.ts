import * as z from 'zod';

import { AcquisitionItemKindSchema } from '../../enums/AcquisitionItemKind.schema';
import { AcquisitionItemStatusSchema } from '../../enums/AcquisitionItemStatus.schema';
// prettier-ignore
export const AcquisitionItemModelSchema = z.object({
    id: z.string(),
    acquisitionId: z.string(),
    productId: z.string().nullable(),
    variantId: z.string().nullable(),
    quantity: z.number().int(),
    unitCost: z.number().nullable(),
    currency: z.string().nullable(),
    notes: z.string().nullable(),
    sourceOrderItemId: z.string().nullable(),
    createdAt: z.date(),
    kind: AcquisitionItemKindSchema.nullable(),
    status: AcquisitionItemStatusSchema.nullable(),
    description: z.string().nullable(),
    expectedReturnAt: z.date().nullable(),
    returnedAt: z.date().nullable(),
    vendorRmaNo: z.string().nullable(),
    warrantyMonths: z.number().int().nullable(),
    serviceRequestId: z.string().nullable(),
    capitalizeToProduct: z.boolean().nullable(),
    acquisition: z.unknown(),
    product: z.unknown().nullable(),
    sourceOrderItem: z.unknown().nullable(),
    variant: z.unknown().nullable()
}).strict();

export type AcquisitionItemPureType = z.infer<typeof AcquisitionItemModelSchema>;
