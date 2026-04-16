import * as z from 'zod';

import { ImageRoleSchema } from '../../enums/ImageRole.schema';
// prettier-ignore
export const ProductImageResultSchema = z.object({
    id: z.string(),
    productId: z.string(),
    fileKey: z.string(),
    role: ImageRoleSchema,
    alt: z.string().nullable(),
    width: z.number().int().nullable(),
    height: z.number().int().nullable(),
    mime: z.string().nullable(),
    sizeBytes: z.number().int().nullable(),
    sortOrder: z.number().int(),
    dominantHex: z.string().nullable(),
    contentHash: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    product: z.unknown()
}).strict();

export type ProductImageResultType = z.infer<typeof ProductImageResultSchema>;
