import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceSelectObjectSchema as InvoiceSelectObjectSchema } from './objects/InvoiceSelect.schema';
import { InvoiceIncludeObjectSchema as InvoiceIncludeObjectSchema } from './objects/InvoiceInclude.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './objects/InvoiceWhereUniqueInput.schema';

export const InvoiceFindUniqueOrThrowSchema: z.ZodType<Prisma.InvoiceFindUniqueOrThrowArgs> = z.object({ select: InvoiceSelectObjectSchema.optional(), include: InvoiceIncludeObjectSchema.optional(), where: InvoiceWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.InvoiceFindUniqueOrThrowArgs>;

export const InvoiceFindUniqueOrThrowZodSchema = z.object({ select: InvoiceSelectObjectSchema.optional(), include: InvoiceIncludeObjectSchema.optional(), where: InvoiceWhereUniqueInputObjectSchema }).strict();