import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceSelectObjectSchema as InvoiceSelectObjectSchema } from './objects/InvoiceSelect.schema';
import { InvoiceIncludeObjectSchema as InvoiceIncludeObjectSchema } from './objects/InvoiceInclude.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './objects/InvoiceWhereUniqueInput.schema';

export const InvoiceDeleteOneSchema: z.ZodType<Prisma.InvoiceDeleteArgs> = z.object({ select: InvoiceSelectObjectSchema.optional(), include: InvoiceIncludeObjectSchema.optional(), where: InvoiceWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.InvoiceDeleteArgs>;

export const InvoiceDeleteOneZodSchema = z.object({ select: InvoiceSelectObjectSchema.optional(), include: InvoiceIncludeObjectSchema.optional(), where: InvoiceWhereUniqueInputObjectSchema }).strict();