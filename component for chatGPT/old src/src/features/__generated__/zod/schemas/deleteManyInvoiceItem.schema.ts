import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceItemWhereInputObjectSchema as InvoiceItemWhereInputObjectSchema } from './objects/InvoiceItemWhereInput.schema';

export const InvoiceItemDeleteManySchema: z.ZodType<Prisma.InvoiceItemDeleteManyArgs> = z.object({ where: InvoiceItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.InvoiceItemDeleteManyArgs>;

export const InvoiceItemDeleteManyZodSchema = z.object({ where: InvoiceItemWhereInputObjectSchema.optional() }).strict();