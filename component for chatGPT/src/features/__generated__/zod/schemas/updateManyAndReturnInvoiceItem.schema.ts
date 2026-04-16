import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceItemSelectObjectSchema as InvoiceItemSelectObjectSchema } from './objects/InvoiceItemSelect.schema';
import { InvoiceItemUpdateManyMutationInputObjectSchema as InvoiceItemUpdateManyMutationInputObjectSchema } from './objects/InvoiceItemUpdateManyMutationInput.schema';
import { InvoiceItemWhereInputObjectSchema as InvoiceItemWhereInputObjectSchema } from './objects/InvoiceItemWhereInput.schema';

export const InvoiceItemUpdateManyAndReturnSchema: z.ZodType<Prisma.InvoiceItemUpdateManyAndReturnArgs> = z.object({ select: InvoiceItemSelectObjectSchema.optional(), data: InvoiceItemUpdateManyMutationInputObjectSchema, where: InvoiceItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.InvoiceItemUpdateManyAndReturnArgs>;

export const InvoiceItemUpdateManyAndReturnZodSchema = z.object({ select: InvoiceItemSelectObjectSchema.optional(), data: InvoiceItemUpdateManyMutationInputObjectSchema, where: InvoiceItemWhereInputObjectSchema.optional() }).strict();