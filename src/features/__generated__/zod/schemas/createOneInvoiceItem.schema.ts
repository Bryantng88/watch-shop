import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceItemSelectObjectSchema as InvoiceItemSelectObjectSchema } from './objects/InvoiceItemSelect.schema';
import { InvoiceItemIncludeObjectSchema as InvoiceItemIncludeObjectSchema } from './objects/InvoiceItemInclude.schema';
import { InvoiceItemCreateInputObjectSchema as InvoiceItemCreateInputObjectSchema } from './objects/InvoiceItemCreateInput.schema';
import { InvoiceItemUncheckedCreateInputObjectSchema as InvoiceItemUncheckedCreateInputObjectSchema } from './objects/InvoiceItemUncheckedCreateInput.schema';

export const InvoiceItemCreateOneSchema: z.ZodType<Prisma.InvoiceItemCreateArgs> = z.object({ select: InvoiceItemSelectObjectSchema.optional(), include: InvoiceItemIncludeObjectSchema.optional(), data: z.union([InvoiceItemCreateInputObjectSchema, InvoiceItemUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.InvoiceItemCreateArgs>;

export const InvoiceItemCreateOneZodSchema = z.object({ select: InvoiceItemSelectObjectSchema.optional(), include: InvoiceItemIncludeObjectSchema.optional(), data: z.union([InvoiceItemCreateInputObjectSchema, InvoiceItemUncheckedCreateInputObjectSchema]) }).strict();