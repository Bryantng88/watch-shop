import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceItemSelectObjectSchema as InvoiceItemSelectObjectSchema } from './objects/InvoiceItemSelect.schema';
import { InvoiceItemCreateManyInputObjectSchema as InvoiceItemCreateManyInputObjectSchema } from './objects/InvoiceItemCreateManyInput.schema';

export const InvoiceItemCreateManyAndReturnSchema: z.ZodType<Prisma.InvoiceItemCreateManyAndReturnArgs> = z.object({ select: InvoiceItemSelectObjectSchema.optional(), data: z.union([ InvoiceItemCreateManyInputObjectSchema, z.array(InvoiceItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.InvoiceItemCreateManyAndReturnArgs>;

export const InvoiceItemCreateManyAndReturnZodSchema = z.object({ select: InvoiceItemSelectObjectSchema.optional(), data: z.union([ InvoiceItemCreateManyInputObjectSchema, z.array(InvoiceItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();