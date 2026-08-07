import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestItemSelectObjectSchema as PurchaseRequestItemSelectObjectSchema } from './objects/PurchaseRequestItemSelect.schema';
import { PurchaseRequestItemUpdateManyMutationInputObjectSchema as PurchaseRequestItemUpdateManyMutationInputObjectSchema } from './objects/PurchaseRequestItemUpdateManyMutationInput.schema';
import { PurchaseRequestItemWhereInputObjectSchema as PurchaseRequestItemWhereInputObjectSchema } from './objects/PurchaseRequestItemWhereInput.schema';

export const PurchaseRequestItemUpdateManyAndReturnSchema: z.ZodType<Prisma.PurchaseRequestItemUpdateManyAndReturnArgs> = z.object({ select: PurchaseRequestItemSelectObjectSchema.optional(), data: PurchaseRequestItemUpdateManyMutationInputObjectSchema, where: PurchaseRequestItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestItemUpdateManyAndReturnArgs>;

export const PurchaseRequestItemUpdateManyAndReturnZodSchema = z.object({ select: PurchaseRequestItemSelectObjectSchema.optional(), data: PurchaseRequestItemUpdateManyMutationInputObjectSchema, where: PurchaseRequestItemWhereInputObjectSchema.optional() }).strict();