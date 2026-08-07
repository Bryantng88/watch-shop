import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestSelectObjectSchema as PurchaseRequestSelectObjectSchema } from './objects/PurchaseRequestSelect.schema';
import { PurchaseRequestUpdateManyMutationInputObjectSchema as PurchaseRequestUpdateManyMutationInputObjectSchema } from './objects/PurchaseRequestUpdateManyMutationInput.schema';
import { PurchaseRequestWhereInputObjectSchema as PurchaseRequestWhereInputObjectSchema } from './objects/PurchaseRequestWhereInput.schema';

export const PurchaseRequestUpdateManyAndReturnSchema: z.ZodType<Prisma.PurchaseRequestUpdateManyAndReturnArgs> = z.object({ select: PurchaseRequestSelectObjectSchema.optional(), data: PurchaseRequestUpdateManyMutationInputObjectSchema, where: PurchaseRequestWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestUpdateManyAndReturnArgs>;

export const PurchaseRequestUpdateManyAndReturnZodSchema = z.object({ select: PurchaseRequestSelectObjectSchema.optional(), data: PurchaseRequestUpdateManyMutationInputObjectSchema, where: PurchaseRequestWhereInputObjectSchema.optional() }).strict();