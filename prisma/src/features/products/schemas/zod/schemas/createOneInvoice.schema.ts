import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceSelectObjectSchema as InvoiceSelectObjectSchema } from './objects/InvoiceSelect.schema';
import { InvoiceIncludeObjectSchema as InvoiceIncludeObjectSchema } from './objects/InvoiceInclude.schema';
import { InvoiceCreateInputObjectSchema as InvoiceCreateInputObjectSchema } from './objects/InvoiceCreateInput.schema';
import { InvoiceUncheckedCreateInputObjectSchema as InvoiceUncheckedCreateInputObjectSchema } from './objects/InvoiceUncheckedCreateInput.schema';

export const InvoiceCreateOneSchema: z.ZodType<Prisma.InvoiceCreateArgs> = z.object({ select: InvoiceSelectObjectSchema.optional(), include: InvoiceIncludeObjectSchema.optional(), data: z.union([InvoiceCreateInputObjectSchema, InvoiceUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.InvoiceCreateArgs>;

export const InvoiceCreateOneZodSchema = z.object({ select: InvoiceSelectObjectSchema.optional(), include: InvoiceIncludeObjectSchema.optional(), data: z.union([InvoiceCreateInputObjectSchema, InvoiceUncheckedCreateInputObjectSchema]) }).strict();