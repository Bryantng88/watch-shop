import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestItemSelectObjectSchema as PurchaseRequestItemSelectObjectSchema } from './objects/PurchaseRequestItemSelect.schema';
import { PurchaseRequestItemIncludeObjectSchema as PurchaseRequestItemIncludeObjectSchema } from './objects/PurchaseRequestItemInclude.schema';
import { PurchaseRequestItemWhereUniqueInputObjectSchema as PurchaseRequestItemWhereUniqueInputObjectSchema } from './objects/PurchaseRequestItemWhereUniqueInput.schema';

export const PurchaseRequestItemFindUniqueOrThrowSchema: z.ZodType<Prisma.PurchaseRequestItemFindUniqueOrThrowArgs> = z.object({ select: PurchaseRequestItemSelectObjectSchema.optional(), include: PurchaseRequestItemIncludeObjectSchema.optional(), where: PurchaseRequestItemWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestItemFindUniqueOrThrowArgs>;

export const PurchaseRequestItemFindUniqueOrThrowZodSchema = z.object({ select: PurchaseRequestItemSelectObjectSchema.optional(), include: PurchaseRequestItemIncludeObjectSchema.optional(), where: PurchaseRequestItemWhereUniqueInputObjectSchema }).strict();