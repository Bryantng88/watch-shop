import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestSelectObjectSchema as PurchaseRequestSelectObjectSchema } from './objects/PurchaseRequestSelect.schema';
import { PurchaseRequestIncludeObjectSchema as PurchaseRequestIncludeObjectSchema } from './objects/PurchaseRequestInclude.schema';
import { PurchaseRequestUpdateInputObjectSchema as PurchaseRequestUpdateInputObjectSchema } from './objects/PurchaseRequestUpdateInput.schema';
import { PurchaseRequestUncheckedUpdateInputObjectSchema as PurchaseRequestUncheckedUpdateInputObjectSchema } from './objects/PurchaseRequestUncheckedUpdateInput.schema';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './objects/PurchaseRequestWhereUniqueInput.schema';

export const PurchaseRequestUpdateOneSchema: z.ZodType<Prisma.PurchaseRequestUpdateArgs> = z.object({ select: PurchaseRequestSelectObjectSchema.optional(), include: PurchaseRequestIncludeObjectSchema.optional(), data: z.union([PurchaseRequestUpdateInputObjectSchema, PurchaseRequestUncheckedUpdateInputObjectSchema]), where: PurchaseRequestWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestUpdateArgs>;

export const PurchaseRequestUpdateOneZodSchema = z.object({ select: PurchaseRequestSelectObjectSchema.optional(), include: PurchaseRequestIncludeObjectSchema.optional(), data: z.union([PurchaseRequestUpdateInputObjectSchema, PurchaseRequestUncheckedUpdateInputObjectSchema]), where: PurchaseRequestWhereUniqueInputObjectSchema }).strict();