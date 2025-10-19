import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceWhereInputObjectSchema as InvoiceWhereInputObjectSchema } from './objects/InvoiceWhereInput.schema';

export const InvoiceDeleteManySchema: z.ZodType<Prisma.InvoiceDeleteManyArgs> = z.object({ where: InvoiceWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.InvoiceDeleteManyArgs>;

export const InvoiceDeleteManyZodSchema = z.object({ where: InvoiceWhereInputObjectSchema.optional() }).strict();