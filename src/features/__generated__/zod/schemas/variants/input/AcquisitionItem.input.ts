import * as z from 'zod';

import { AcquisitionItemKindSchema } from '../../enums/AcquisitionItemKind.schema';
import { AcquisitionItemStatusSchema } from '../../enums/AcquisitionItemStatus.schema';
import { ProductTypeSchema } from '../../enums/ProductType.schema';
// prettier-ignore
export const AcquisitionItemInputSchema = z.object({
    id: z.string(),
    acquisitionId: z.string(),
    productId: z.string().optional().nullable(),
    variantId: z.string().optional().nullable(),
    quantity: z.number().int(),
    unitCost: z.number().optional().nullable(),
    currency: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    sourceOrderItemId: z.string().optional().nullable(),
    createdAt: z.date(),
    kind: AcquisitionItemKindSchema.optional().nullable(),
    status: AcquisitionItemStatusSchema.optional().nullable(),
    description: z.string().optional().nullable(),
    expectedReturnAt: z.date().optional().nullable(),
    returnedAt: z.date().optional().nullable(),
    vendorRmaNo: z.string().optional().nullable(),
    warrantyMonths: z.number().int().optional().nullable(),
    serviceRequestId: z.string().optional().nullable(),
    capitalizeToProduct: z.boolean().optional().nullable(),
    productType: ProductTypeSchema,
    productTitle: z.string(),
    acquisition: z.unknown(),
    product: z.unknown().optional().nullable(),
    sourceOrderItem: z.unknown().optional().nullable(),
    variant: z.unknown().optional().nullable()
}).strict();

export type AcquisitionItemInputType = z.infer<typeof AcquisitionItemInputSchema>;
