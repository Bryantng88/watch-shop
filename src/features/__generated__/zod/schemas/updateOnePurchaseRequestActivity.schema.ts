import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestActivitySelectObjectSchema as PurchaseRequestActivitySelectObjectSchema } from './objects/PurchaseRequestActivitySelect.schema';
import { PurchaseRequestActivityIncludeObjectSchema as PurchaseRequestActivityIncludeObjectSchema } from './objects/PurchaseRequestActivityInclude.schema';
import { PurchaseRequestActivityUpdateInputObjectSchema as PurchaseRequestActivityUpdateInputObjectSchema } from './objects/PurchaseRequestActivityUpdateInput.schema';
import { PurchaseRequestActivityUncheckedUpdateInputObjectSchema as PurchaseRequestActivityUncheckedUpdateInputObjectSchema } from './objects/PurchaseRequestActivityUncheckedUpdateInput.schema';
import { PurchaseRequestActivityWhereUniqueInputObjectSchema as PurchaseRequestActivityWhereUniqueInputObjectSchema } from './objects/PurchaseRequestActivityWhereUniqueInput.schema';

export const PurchaseRequestActivityUpdateOneSchema: z.ZodType<Prisma.PurchaseRequestActivityUpdateArgs> = z.object({ select: PurchaseRequestActivitySelectObjectSchema.optional(), include: PurchaseRequestActivityIncludeObjectSchema.optional(), data: z.union([PurchaseRequestActivityUpdateInputObjectSchema, PurchaseRequestActivityUncheckedUpdateInputObjectSchema]), where: PurchaseRequestActivityWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestActivityUpdateArgs>;

export const PurchaseRequestActivityUpdateOneZodSchema = z.object({ select: PurchaseRequestActivitySelectObjectSchema.optional(), include: PurchaseRequestActivityIncludeObjectSchema.optional(), data: z.union([PurchaseRequestActivityUpdateInputObjectSchema, PurchaseRequestActivityUncheckedUpdateInputObjectSchema]), where: PurchaseRequestActivityWhereUniqueInputObjectSchema }).strict();