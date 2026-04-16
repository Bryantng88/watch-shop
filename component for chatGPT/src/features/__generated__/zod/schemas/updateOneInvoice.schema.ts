import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceSelectObjectSchema as InvoiceSelectObjectSchema } from './objects/InvoiceSelect.schema';
import { InvoiceIncludeObjectSchema as InvoiceIncludeObjectSchema } from './objects/InvoiceInclude.schema';
import { InvoiceUpdateInputObjectSchema as InvoiceUpdateInputObjectSchema } from './objects/InvoiceUpdateInput.schema';
import { InvoiceUncheckedUpdateInputObjectSchema as InvoiceUncheckedUpdateInputObjectSchema } from './objects/InvoiceUncheckedUpdateInput.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './objects/InvoiceWhereUniqueInput.schema';

export const InvoiceUpdateOneSchema: z.ZodType<Prisma.InvoiceUpdateArgs> = z.object({ select: InvoiceSelectObjectSchema.optional(), include: InvoiceIncludeObjectSchema.optional(), data: z.union([InvoiceUpdateInputObjectSchema, InvoiceUncheckedUpdateInputObjectSchema]), where: InvoiceWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.InvoiceUpdateArgs>;

export const InvoiceUpdateOneZodSchema = z.object({ select: InvoiceSelectObjectSchema.optional(), include: InvoiceIncludeObjectSchema.optional(), data: z.union([InvoiceUpdateInputObjectSchema, InvoiceUncheckedUpdateInputObjectSchema]), where: InvoiceWhereUniqueInputObjectSchema }).strict();