import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductContentIncludeObjectSchema as ProductContentIncludeObjectSchema } from './objects/ProductContentInclude.schema';
import { ProductContentOrderByWithRelationInputObjectSchema as ProductContentOrderByWithRelationInputObjectSchema } from './objects/ProductContentOrderByWithRelationInput.schema';
import { ProductContentWhereInputObjectSchema as ProductContentWhereInputObjectSchema } from './objects/ProductContentWhereInput.schema';
import { ProductContentWhereUniqueInputObjectSchema as ProductContentWhereUniqueInputObjectSchema } from './objects/ProductContentWhereUniqueInput.schema';
import { ProductContentScalarFieldEnumSchema } from './enums/ProductContentScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ProductContentFindManySelectSchema: z.ZodType<Prisma.ProductContentSelect> = z.object({
    productId: z.boolean().optional(),
    titleSnapshot: z.boolean().optional(),
    brandSnapshot: z.boolean().optional(),
    refSnapshot: z.boolean().optional(),
    sizeSnapshot: z.boolean().optional(),
    movementSnapshot: z.boolean().optional(),
    glassSnapshot: z.boolean().optional(),
    strapClaspSnapshot: z.boolean().optional(),
    modelSnapshot: z.boolean().optional(),
    yearSnapshot: z.boolean().optional(),
    generatedContent: z.boolean().optional(),
    promptNote: z.boolean().optional(),
    generatedAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    specBullets: z.boolean().optional(),
    hashtags: z.boolean().optional(),
    Product: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ProductContentSelect>;

export const ProductContentFindManySelectZodSchema = z.object({
    productId: z.boolean().optional(),
    titleSnapshot: z.boolean().optional(),
    brandSnapshot: z.boolean().optional(),
    refSnapshot: z.boolean().optional(),
    sizeSnapshot: z.boolean().optional(),
    movementSnapshot: z.boolean().optional(),
    glassSnapshot: z.boolean().optional(),
    strapClaspSnapshot: z.boolean().optional(),
    modelSnapshot: z.boolean().optional(),
    yearSnapshot: z.boolean().optional(),
    generatedContent: z.boolean().optional(),
    promptNote: z.boolean().optional(),
    generatedAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    specBullets: z.boolean().optional(),
    hashtags: z.boolean().optional(),
    Product: z.boolean().optional()
  }).strict();

export const ProductContentFindManySchema: z.ZodType<Prisma.ProductContentFindManyArgs> = z.object({ select: ProductContentFindManySelectSchema.optional(), include: ProductContentIncludeObjectSchema.optional(), orderBy: z.union([ProductContentOrderByWithRelationInputObjectSchema, ProductContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductContentWhereInputObjectSchema.optional(), cursor: ProductContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ProductContentScalarFieldEnumSchema, ProductContentScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ProductContentFindManyArgs>;

export const ProductContentFindManyZodSchema = z.object({ select: ProductContentFindManySelectSchema.optional(), include: ProductContentIncludeObjectSchema.optional(), orderBy: z.union([ProductContentOrderByWithRelationInputObjectSchema, ProductContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductContentWhereInputObjectSchema.optional(), cursor: ProductContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ProductContentScalarFieldEnumSchema, ProductContentScalarFieldEnumSchema.array()]).optional() }).strict();