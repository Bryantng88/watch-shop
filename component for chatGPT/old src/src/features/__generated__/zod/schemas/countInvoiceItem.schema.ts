import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceItemOrderByWithRelationInputObjectSchema as InvoiceItemOrderByWithRelationInputObjectSchema } from './objects/InvoiceItemOrderByWithRelationInput.schema';
import { InvoiceItemWhereInputObjectSchema as InvoiceItemWhereInputObjectSchema } from './objects/InvoiceItemWhereInput.schema';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './objects/InvoiceItemWhereUniqueInput.schema';
import { InvoiceItemCountAggregateInputObjectSchema as InvoiceItemCountAggregateInputObjectSchema } from './objects/InvoiceItemCountAggregateInput.schema';

export const InvoiceItemCountSchema: z.ZodType<Prisma.InvoiceItemCountArgs> = z.object({ orderBy: z.union([InvoiceItemOrderByWithRelationInputObjectSchema, InvoiceItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: InvoiceItemWhereInputObjectSchema.optional(), cursor: InvoiceItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), InvoiceItemCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.InvoiceItemCountArgs>;

export const InvoiceItemCountZodSchema = z.object({ orderBy: z.union([InvoiceItemOrderByWithRelationInputObjectSchema, InvoiceItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: InvoiceItemWhereInputObjectSchema.optional(), cursor: InvoiceItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), InvoiceItemCountAggregateInputObjectSchema ]).optional() }).strict();