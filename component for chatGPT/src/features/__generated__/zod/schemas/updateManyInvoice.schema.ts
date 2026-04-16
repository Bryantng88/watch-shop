import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceUpdateManyMutationInputObjectSchema as InvoiceUpdateManyMutationInputObjectSchema } from './objects/InvoiceUpdateManyMutationInput.schema';
import { InvoiceWhereInputObjectSchema as InvoiceWhereInputObjectSchema } from './objects/InvoiceWhereInput.schema';

export const InvoiceUpdateManySchema: z.ZodType<Prisma.InvoiceUpdateManyArgs> = z.object({ data: InvoiceUpdateManyMutationInputObjectSchema, where: InvoiceWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.InvoiceUpdateManyArgs>;

export const InvoiceUpdateManyZodSchema = z.object({ data: InvoiceUpdateManyMutationInputObjectSchema, where: InvoiceWhereInputObjectSchema.optional() }).strict();