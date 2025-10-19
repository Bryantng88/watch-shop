import * as z from 'zod';

import { ImageRoleSchema } from '../../enums/ImageRole.schema';
// prettier-ignore
export const ProductImageInputSchema = z.object({
    id: z.string(),
    productId: z.string(),
    fileKey: z.string(),
    role: ImageRoleSchema,
    alt: z.string().optional().nullable(),
    width: z.number().int().optional().nullable(),
    height: z.number().int().optional().nullable(),
    mime: z.string().optional().nullable(),
    sizeBytes: z.number().int().optional().nullable(),
    sortOrder: z.number().int(),
    dominantHex: z.string().optional().nullable(),
    contentHash: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    product: z.unknown()
}).strict();

export type ProductImageInputType = z.infer<typeof ProductImageInputSchema>;
