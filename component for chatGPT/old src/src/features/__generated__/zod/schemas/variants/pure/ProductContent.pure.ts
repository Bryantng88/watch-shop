import * as z from 'zod';

// prettier-ignore
export const ProductContentModelSchema = z.object({
    productId: z.string(),
    titleSnapshot: z.string().nullable(),
    brandSnapshot: z.string().nullable(),
    refSnapshot: z.string().nullable(),
    sizeSnapshot: z.string().nullable(),
    movementSnapshot: z.string().nullable(),
    glassSnapshot: z.string().nullable(),
    strapClaspSnapshot: z.string().nullable(),
    modelSnapshot: z.string().nullable(),
    yearSnapshot: z.string().nullable(),
    generatedContent: z.string().nullable(),
    promptNote: z.string().nullable(),
    generatedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    specBullets: z.array(z.string()),
    hashtags: z.array(z.string()),
    Product: z.unknown()
}).strict();

export type ProductContentPureType = z.infer<typeof ProductContentModelSchema>;
