import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestUpdateManyMutationInputObjectSchema as PurchaseRequestUpdateManyMutationInputObjectSchema } from './objects/PurchaseRequestUpdateManyMutationInput.schema';
import { PurchaseRequestWhereInputObjectSchema as PurchaseRequestWhereInputObjectSchema } from './objects/PurchaseRequestWhereInput.schema';

export const PurchaseRequestUpdateManySchema: z.ZodType<Prisma.PurchaseRequestUpdateManyArgs> = z.object({ data: PurchaseRequestUpdateManyMutationInputObjectSchema, where: PurchaseRequestWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestUpdateManyArgs>;

export const PurchaseRequestUpdateManyZodSchema = z.object({ data: PurchaseRequestUpdateManyMutationInputObjectSchema, where: PurchaseRequestWhereInputObjectSchema.optional() }).strict();