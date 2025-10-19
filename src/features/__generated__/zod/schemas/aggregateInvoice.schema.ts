import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceOrderByWithRelationInputObjectSchema as InvoiceOrderByWithRelationInputObjectSchema } from './objects/InvoiceOrderByWithRelationInput.schema';
import { InvoiceWhereInputObjectSchema as InvoiceWhereInputObjectSchema } from './objects/InvoiceWhereInput.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './objects/InvoiceWhereUniqueInput.schema';
import { InvoiceCountAggregateInputObjectSchema as InvoiceCountAggregateInputObjectSchema } from './objects/InvoiceCountAggregateInput.schema';
import { InvoiceMinAggregateInputObjectSchema as InvoiceMinAggregateInputObjectSchema } from './objects/InvoiceMinAggregateInput.schema';
import { InvoiceMaxAggregateInputObjectSchema as InvoiceMaxAggregateInputObjectSchema } from './objects/InvoiceMaxAggregateInput.schema';
import { InvoiceAvgAggregateInputObjectSchema as InvoiceAvgAggregateInputObjectSchema } from './objects/InvoiceAvgAggregateInput.schema';
import { InvoiceSumAggregateInputObjectSchema as InvoiceSumAggregateInputObjectSchema } from './objects/InvoiceSumAggregateInput.schema';

export const InvoiceAggregateSchema: z.ZodType<Prisma.InvoiceAggregateArgs> = z.object({ orderBy: z.union([InvoiceOrderByWithRelationInputObjectSchema, InvoiceOrderByWithRelationInputObjectSchema.array()]).optional(), where: InvoiceWhereInputObjectSchema.optional(), cursor: InvoiceWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), InvoiceCountAggregateInputObjectSchema ]).optional(), _min: InvoiceMinAggregateInputObjectSchema.optional(), _max: InvoiceMaxAggregateInputObjectSchema.optional(), _avg: InvoiceAvgAggregateInputObjectSchema.optional(), _sum: InvoiceSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.InvoiceAggregateArgs>;

export const InvoiceAggregateZodSchema = z.object({ orderBy: z.union([InvoiceOrderByWithRelationInputObjectSchema, InvoiceOrderByWithRelationInputObjectSchema.array()]).optional(), where: InvoiceWhereInputObjectSchema.optional(), cursor: InvoiceWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), InvoiceCountAggregateInputObjectSchema ]).optional(), _min: InvoiceMinAggregateInputObjectSchema.optional(), _max: InvoiceMaxAggregateInputObjectSchema.optional(), _avg: InvoiceAvgAggregateInputObjectSchema.optional(), _sum: InvoiceSumAggregateInputObjectSchema.optional() }).strict();