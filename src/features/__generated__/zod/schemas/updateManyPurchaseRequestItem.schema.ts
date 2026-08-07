import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestItemUpdateManyMutationInputObjectSchema as PurchaseRequestItemUpdateManyMutationInputObjectSchema } from './objects/PurchaseRequestItemUpdateManyMutationInput.schema';
import { PurchaseRequestItemWhereInputObjectSchema as PurchaseRequestItemWhereInputObjectSchema } from './objects/PurchaseRequestItemWhereInput.schema';

export const PurchaseRequestItemUpdateManySchema: z.ZodType<Prisma.PurchaseRequestItemUpdateManyArgs> = z.object({ data: PurchaseRequestItemUpdateManyMutationInputObjectSchema, where: PurchaseRequestItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestItemUpdateManyArgs>;

export const PurchaseRequestItemUpdateManyZodSchema = z.object({ data: PurchaseRequestItemUpdateManyMutationInputObjectSchema, where: PurchaseRequestItemWhereInputObjectSchema.optional() }).strict();