import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestItemWhereInputObjectSchema as PurchaseRequestItemWhereInputObjectSchema } from './objects/PurchaseRequestItemWhereInput.schema';

export const PurchaseRequestItemDeleteManySchema: z.ZodType<Prisma.PurchaseRequestItemDeleteManyArgs> = z.object({ where: PurchaseRequestItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestItemDeleteManyArgs>;

export const PurchaseRequestItemDeleteManyZodSchema = z.object({ where: PurchaseRequestItemWhereInputObjectSchema.optional() }).strict();