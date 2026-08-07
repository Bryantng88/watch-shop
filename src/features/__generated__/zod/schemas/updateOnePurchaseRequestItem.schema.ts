import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestItemSelectObjectSchema as PurchaseRequestItemSelectObjectSchema } from './objects/PurchaseRequestItemSelect.schema';
import { PurchaseRequestItemIncludeObjectSchema as PurchaseRequestItemIncludeObjectSchema } from './objects/PurchaseRequestItemInclude.schema';
import { PurchaseRequestItemUpdateInputObjectSchema as PurchaseRequestItemUpdateInputObjectSchema } from './objects/PurchaseRequestItemUpdateInput.schema';
import { PurchaseRequestItemUncheckedUpdateInputObjectSchema as PurchaseRequestItemUncheckedUpdateInputObjectSchema } from './objects/PurchaseRequestItemUncheckedUpdateInput.schema';
import { PurchaseRequestItemWhereUniqueInputObjectSchema as PurchaseRequestItemWhereUniqueInputObjectSchema } from './objects/PurchaseRequestItemWhereUniqueInput.schema';

export const PurchaseRequestItemUpdateOneSchema: z.ZodType<Prisma.PurchaseRequestItemUpdateArgs> = z.object({ select: PurchaseRequestItemSelectObjectSchema.optional(), include: PurchaseRequestItemIncludeObjectSchema.optional(), data: z.union([PurchaseRequestItemUpdateInputObjectSchema, PurchaseRequestItemUncheckedUpdateInputObjectSchema]), where: PurchaseRequestItemWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestItemUpdateArgs>;

export const PurchaseRequestItemUpdateOneZodSchema = z.object({ select: PurchaseRequestItemSelectObjectSchema.optional(), include: PurchaseRequestItemIncludeObjectSchema.optional(), data: z.union([PurchaseRequestItemUpdateInputObjectSchema, PurchaseRequestItemUncheckedUpdateInputObjectSchema]), where: PurchaseRequestItemWhereUniqueInputObjectSchema }).strict();