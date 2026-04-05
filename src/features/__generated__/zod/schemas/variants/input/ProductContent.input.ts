import * as z from 'zod';

// prettier-ignore
export const ProductContentInputSchema = z.object({
    productId: z.string(),
    titleSnapshot: z.string().optional().nullable(),
    brandSnapshot: z.string().optional().nullable(),
    refSnapshot: z.string().optional().nullable(),
    sizeSnapshot: z.string().optional().nullable(),
    movementSnapshot: z.string().optional().nullable(),
    glassSnapshot: z.string().optional().nullable(),
    strapClaspSnapshot: z.string().optional().nullable(),
    modelSnapshot: z.string().optional().nullable(),
    yearSnapshot: z.string().optional().nullable(),
    generatedContent: z.string().optional().nullable(),
    promptNote: z.string().optional().nullable(),
    generatedAt: z.date().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    Product: z.unknown()
}).strict();

export type ProductContentInputType = z.infer<typeof ProductContentInputSchema>;
