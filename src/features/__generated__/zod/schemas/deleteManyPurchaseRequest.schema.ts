import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestWhereInputObjectSchema as PurchaseRequestWhereInputObjectSchema } from './objects/PurchaseRequestWhereInput.schema';

export const PurchaseRequestDeleteManySchema: z.ZodType<Prisma.PurchaseRequestDeleteManyArgs> = z.object({ where: PurchaseRequestWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestDeleteManyArgs>;

export const PurchaseRequestDeleteManyZodSchema = z.object({ where: PurchaseRequestWhereInputObjectSchema.optional() }).strict();