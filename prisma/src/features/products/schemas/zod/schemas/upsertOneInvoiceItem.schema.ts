import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceItemSelectObjectSchema as InvoiceItemSelectObjectSchema } from './objects/InvoiceItemSelect.schema';
import { InvoiceItemIncludeObjectSchema as InvoiceItemIncludeObjectSchema } from './objects/InvoiceItemInclude.schema';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './objects/InvoiceItemWhereUniqueInput.schema';
import { InvoiceItemCreateInputObjectSchema as InvoiceItemCreateInputObjectSchema } from './objects/InvoiceItemCreateInput.schema';
import { InvoiceItemUncheckedCreateInputObjectSchema as InvoiceItemUncheckedCreateInputObjectSchema } from './objects/InvoiceItemUncheckedCreateInput.schema';
import { InvoiceItemUpdateInputObjectSchema as InvoiceItemUpdateInputObjectSchema } from './objects/InvoiceItemUpdateInput.schema';
import { InvoiceItemUncheckedUpdateInputObjectSchema as InvoiceItemUncheckedUpdateInputObjectSchema } from './objects/InvoiceItemUncheckedUpdateInput.schema';

export const InvoiceItemUpsertOneSchema: z.ZodType<Prisma.InvoiceItemUpsertArgs> = z.object({ select: InvoiceItemSelectObjectSchema.optional(), include: InvoiceItemIncludeObjectSchema.optional(), where: InvoiceItemWhereUniqueInputObjectSchema, create: z.union([ InvoiceItemCreateInputObjectSchema, InvoiceItemUncheckedCreateInputObjectSchema ]), update: z.union([ InvoiceItemUpdateInputObjectSchema, InvoiceItemUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.InvoiceItemUpsertArgs>;

export const InvoiceItemUpsertOneZodSchema = z.object({ select: InvoiceItemSelectObjectSchema.optional(), include: InvoiceItemIncludeObjectSchema.optional(), where: InvoiceItemWhereUniqueInputObjectSchema, create: z.union([ InvoiceItemCreateInputObjectSchema, InvoiceItemUncheckedCreateInputObjectSchema ]), update: z.union([ InvoiceItemUpdateInputObjectSchema, InvoiceItemUncheckedUpdateInputObjectSchema ]) }).strict();