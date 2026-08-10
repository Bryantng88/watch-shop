import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestActivityWhereInputObjectSchema as PurchaseRequestActivityWhereInputObjectSchema } from './objects/PurchaseRequestActivityWhereInput.schema';

export const PurchaseRequestActivityDeleteManySchema: z.ZodType<Prisma.PurchaseRequestActivityDeleteManyArgs> = z.object({ where: PurchaseRequestActivityWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestActivityDeleteManyArgs>;

export const PurchaseRequestActivityDeleteManyZodSchema = z.object({ where: PurchaseRequestActivityWhereInputObjectSchema.optional() }).strict();