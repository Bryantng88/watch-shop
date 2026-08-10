import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestActivityUpdateManyMutationInputObjectSchema as PurchaseRequestActivityUpdateManyMutationInputObjectSchema } from './objects/PurchaseRequestActivityUpdateManyMutationInput.schema';
import { PurchaseRequestActivityWhereInputObjectSchema as PurchaseRequestActivityWhereInputObjectSchema } from './objects/PurchaseRequestActivityWhereInput.schema';

export const PurchaseRequestActivityUpdateManySchema: z.ZodType<Prisma.PurchaseRequestActivityUpdateManyArgs> = z.object({ data: PurchaseRequestActivityUpdateManyMutationInputObjectSchema, where: PurchaseRequestActivityWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestActivityUpdateManyArgs>;

export const PurchaseRequestActivityUpdateManyZodSchema = z.object({ data: PurchaseRequestActivityUpdateManyMutationInputObjectSchema, where: PurchaseRequestActivityWhereInputObjectSchema.optional() }).strict();