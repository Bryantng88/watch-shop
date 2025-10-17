import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceSelectObjectSchema as InvoiceSelectObjectSchema } from './objects/InvoiceSelect.schema';
import { InvoiceUpdateManyMutationInputObjectSchema as InvoiceUpdateManyMutationInputObjectSchema } from './objects/InvoiceUpdateManyMutationInput.schema';
import { InvoiceWhereInputObjectSchema as InvoiceWhereInputObjectSchema } from './objects/InvoiceWhereInput.schema';

export const InvoiceUpdateManyAndReturnSchema: z.ZodType<Prisma.InvoiceUpdateManyAndReturnArgs> = z.object({ select: InvoiceSelectObjectSchema.optional(), data: InvoiceUpdateManyMutationInputObjectSchema, where: InvoiceWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.InvoiceUpdateManyAndReturnArgs>;

export const InvoiceUpdateManyAndReturnZodSchema = z.object({ select: InvoiceSelectObjectSchema.optional(), data: InvoiceUpdateManyMutationInputObjectSchema, where: InvoiceWhereInputObjectSchema.optional() }).strict();