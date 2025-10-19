import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceItemUpdateManyMutationInputObjectSchema as InvoiceItemUpdateManyMutationInputObjectSchema } from './objects/InvoiceItemUpdateManyMutationInput.schema';
import { InvoiceItemWhereInputObjectSchema as InvoiceItemWhereInputObjectSchema } from './objects/InvoiceItemWhereInput.schema';

export const InvoiceItemUpdateManySchema: z.ZodType<Prisma.InvoiceItemUpdateManyArgs> = z.object({ data: InvoiceItemUpdateManyMutationInputObjectSchema, where: InvoiceItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.InvoiceItemUpdateManyArgs>;

export const InvoiceItemUpdateManyZodSchema = z.object({ data: InvoiceItemUpdateManyMutationInputObjectSchema, where: InvoiceItemWhereInputObjectSchema.optional() }).strict();