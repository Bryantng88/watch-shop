import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceItemCreateManyInputObjectSchema as InvoiceItemCreateManyInputObjectSchema } from './objects/InvoiceItemCreateManyInput.schema';

export const InvoiceItemCreateManySchema: z.ZodType<Prisma.InvoiceItemCreateManyArgs> = z.object({ data: z.union([ InvoiceItemCreateManyInputObjectSchema, z.array(InvoiceItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.InvoiceItemCreateManyArgs>;

export const InvoiceItemCreateManyZodSchema = z.object({ data: z.union([ InvoiceItemCreateManyInputObjectSchema, z.array(InvoiceItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();