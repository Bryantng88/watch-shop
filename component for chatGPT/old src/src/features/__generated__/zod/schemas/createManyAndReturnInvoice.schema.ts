import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceSelectObjectSchema as InvoiceSelectObjectSchema } from './objects/InvoiceSelect.schema';
import { InvoiceCreateManyInputObjectSchema as InvoiceCreateManyInputObjectSchema } from './objects/InvoiceCreateManyInput.schema';

export const InvoiceCreateManyAndReturnSchema: z.ZodType<Prisma.InvoiceCreateManyAndReturnArgs> = z.object({ select: InvoiceSelectObjectSchema.optional(), data: z.union([ InvoiceCreateManyInputObjectSchema, z.array(InvoiceCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.InvoiceCreateManyAndReturnArgs>;

export const InvoiceCreateManyAndReturnZodSchema = z.object({ select: InvoiceSelectObjectSchema.optional(), data: z.union([ InvoiceCreateManyInputObjectSchema, z.array(InvoiceCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();