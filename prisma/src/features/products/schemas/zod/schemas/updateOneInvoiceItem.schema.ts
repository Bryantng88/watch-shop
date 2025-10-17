import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceItemSelectObjectSchema as InvoiceItemSelectObjectSchema } from './objects/InvoiceItemSelect.schema';
import { InvoiceItemIncludeObjectSchema as InvoiceItemIncludeObjectSchema } from './objects/InvoiceItemInclude.schema';
import { InvoiceItemUpdateInputObjectSchema as InvoiceItemUpdateInputObjectSchema } from './objects/InvoiceItemUpdateInput.schema';
import { InvoiceItemUncheckedUpdateInputObjectSchema as InvoiceItemUncheckedUpdateInputObjectSchema } from './objects/InvoiceItemUncheckedUpdateInput.schema';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './objects/InvoiceItemWhereUniqueInput.schema';

export const InvoiceItemUpdateOneSchema: z.ZodType<Prisma.InvoiceItemUpdateArgs> = z.object({ select: InvoiceItemSelectObjectSchema.optional(), include: InvoiceItemIncludeObjectSchema.optional(), data: z.union([InvoiceItemUpdateInputObjectSchema, InvoiceItemUncheckedUpdateInputObjectSchema]), where: InvoiceItemWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.InvoiceItemUpdateArgs>;

export const InvoiceItemUpdateOneZodSchema = z.object({ select: InvoiceItemSelectObjectSchema.optional(), include: InvoiceItemIncludeObjectSchema.optional(), data: z.union([InvoiceItemUpdateInputObjectSchema, InvoiceItemUncheckedUpdateInputObjectSchema]), where: InvoiceItemWhereUniqueInputObjectSchema }).strict();