import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestItemSelectObjectSchema as PurchaseRequestItemSelectObjectSchema } from './objects/PurchaseRequestItemSelect.schema';
import { PurchaseRequestItemIncludeObjectSchema as PurchaseRequestItemIncludeObjectSchema } from './objects/PurchaseRequestItemInclude.schema';
import { PurchaseRequestItemWhereUniqueInputObjectSchema as PurchaseRequestItemWhereUniqueInputObjectSchema } from './objects/PurchaseRequestItemWhereUniqueInput.schema';
import { PurchaseRequestItemCreateInputObjectSchema as PurchaseRequestItemCreateInputObjectSchema } from './objects/PurchaseRequestItemCreateInput.schema';
import { PurchaseRequestItemUncheckedCreateInputObjectSchema as PurchaseRequestItemUncheckedCreateInputObjectSchema } from './objects/PurchaseRequestItemUncheckedCreateInput.schema';
import { PurchaseRequestItemUpdateInputObjectSchema as PurchaseRequestItemUpdateInputObjectSchema } from './objects/PurchaseRequestItemUpdateInput.schema';
import { PurchaseRequestItemUncheckedUpdateInputObjectSchema as PurchaseRequestItemUncheckedUpdateInputObjectSchema } from './objects/PurchaseRequestItemUncheckedUpdateInput.schema';

export const PurchaseRequestItemUpsertOneSchema: z.ZodType<Prisma.PurchaseRequestItemUpsertArgs> = z.object({ select: PurchaseRequestItemSelectObjectSchema.optional(), include: PurchaseRequestItemIncludeObjectSchema.optional(), where: PurchaseRequestItemWhereUniqueInputObjectSchema, create: z.union([ PurchaseRequestItemCreateInputObjectSchema, PurchaseRequestItemUncheckedCreateInputObjectSchema ]), update: z.union([ PurchaseRequestItemUpdateInputObjectSchema, PurchaseRequestItemUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestItemUpsertArgs>;

export const PurchaseRequestItemUpsertOneZodSchema = z.object({ select: PurchaseRequestItemSelectObjectSchema.optional(), include: PurchaseRequestItemIncludeObjectSchema.optional(), where: PurchaseRequestItemWhereUniqueInputObjectSchema, create: z.union([ PurchaseRequestItemCreateInputObjectSchema, PurchaseRequestItemUncheckedCreateInputObjectSchema ]), update: z.union([ PurchaseRequestItemUpdateInputObjectSchema, PurchaseRequestItemUncheckedUpdateInputObjectSchema ]) }).strict();