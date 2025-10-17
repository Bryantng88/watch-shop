import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceItemSelectObjectSchema as InvoiceItemSelectObjectSchema } from './objects/InvoiceItemSelect.schema';
import { InvoiceItemIncludeObjectSchema as InvoiceItemIncludeObjectSchema } from './objects/InvoiceItemInclude.schema';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './objects/InvoiceItemWhereUniqueInput.schema';

export const InvoiceItemFindUniqueOrThrowSchema: z.ZodType<Prisma.InvoiceItemFindUniqueOrThrowArgs> = z.object({ select: InvoiceItemSelectObjectSchema.optional(), include: InvoiceItemIncludeObjectSchema.optional(), where: InvoiceItemWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.InvoiceItemFindUniqueOrThrowArgs>;

export const InvoiceItemFindUniqueOrThrowZodSchema = z.object({ select: InvoiceItemSelectObjectSchema.optional(), include: InvoiceItemIncludeObjectSchema.optional(), where: InvoiceItemWhereUniqueInputObjectSchema }).strict();