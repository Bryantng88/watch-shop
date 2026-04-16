import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceItemIncludeObjectSchema as InvoiceItemIncludeObjectSchema } from './objects/InvoiceItemInclude.schema';
import { InvoiceItemOrderByWithRelationInputObjectSchema as InvoiceItemOrderByWithRelationInputObjectSchema } from './objects/InvoiceItemOrderByWithRelationInput.schema';
import { InvoiceItemWhereInputObjectSchema as InvoiceItemWhereInputObjectSchema } from './objects/InvoiceItemWhereInput.schema';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './objects/InvoiceItemWhereUniqueInput.schema';
import { InvoiceItemScalarFieldEnumSchema } from './enums/InvoiceItemScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const InvoiceItemFindManySelectSchema: z.ZodType<Prisma.InvoiceItemSelect> = z.object({
    id: z.boolean().optional(),
    invoiceId: z.boolean().optional(),
    productId: z.boolean().optional(),
    variantId: z.boolean().optional(),
    title: z.boolean().optional(),
    description: z.boolean().optional(),
    quantity: z.boolean().optional(),
    unitPrice: z.boolean().optional(),
    discount: z.boolean().optional(),
    taxRate: z.boolean().optional(),
    lineTotal: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    invoice: z.boolean().optional(),
    product: z.boolean().optional(),
    variant: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.InvoiceItemSelect>;

export const InvoiceItemFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    invoiceId: z.boolean().optional(),
    productId: z.boolean().optional(),
    variantId: z.boolean().optional(),
    title: z.boolean().optional(),
    description: z.boolean().optional(),
    quantity: z.boolean().optional(),
    unitPrice: z.boolean().optional(),
    discount: z.boolean().optional(),
    taxRate: z.boolean().optional(),
    lineTotal: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    invoice: z.boolean().optional(),
    product: z.boolean().optional(),
    variant: z.boolean().optional()
  }).strict();

export const InvoiceItemFindManySchema: z.ZodType<Prisma.InvoiceItemFindManyArgs> = z.object({ select: InvoiceItemFindManySelectSchema.optional(), include: InvoiceItemIncludeObjectSchema.optional(), orderBy: z.union([InvoiceItemOrderByWithRelationInputObjectSchema, InvoiceItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: InvoiceItemWhereInputObjectSchema.optional(), cursor: InvoiceItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([InvoiceItemScalarFieldEnumSchema, InvoiceItemScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.InvoiceItemFindManyArgs>;

export const InvoiceItemFindManyZodSchema = z.object({ select: InvoiceItemFindManySelectSchema.optional(), include: InvoiceItemIncludeObjectSchema.optional(), orderBy: z.union([InvoiceItemOrderByWithRelationInputObjectSchema, InvoiceItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: InvoiceItemWhereInputObjectSchema.optional(), cursor: InvoiceItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([InvoiceItemScalarFieldEnumSchema, InvoiceItemScalarFieldEnumSchema.array()]).optional() }).strict();