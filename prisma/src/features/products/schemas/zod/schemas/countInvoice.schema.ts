import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceOrderByWithRelationInputObjectSchema as InvoiceOrderByWithRelationInputObjectSchema } from './objects/InvoiceOrderByWithRelationInput.schema';
import { InvoiceWhereInputObjectSchema as InvoiceWhereInputObjectSchema } from './objects/InvoiceWhereInput.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './objects/InvoiceWhereUniqueInput.schema';
import { InvoiceCountAggregateInputObjectSchema as InvoiceCountAggregateInputObjectSchema } from './objects/InvoiceCountAggregateInput.schema';

export const InvoiceCountSchema: z.ZodType<Prisma.InvoiceCountArgs> = z.object({ orderBy: z.union([InvoiceOrderByWithRelationInputObjectSchema, InvoiceOrderByWithRelationInputObjectSchema.array()]).optional(), where: InvoiceWhereInputObjectSchema.optional(), cursor: InvoiceWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), InvoiceCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.InvoiceCountArgs>;

export const InvoiceCountZodSchema = z.object({ orderBy: z.union([InvoiceOrderByWithRelationInputObjectSchema, InvoiceOrderByWithRelationInputObjectSchema.array()]).optional(), where: InvoiceWhereInputObjectSchema.optional(), cursor: InvoiceWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), InvoiceCountAggregateInputObjectSchema ]).optional() }).strict();