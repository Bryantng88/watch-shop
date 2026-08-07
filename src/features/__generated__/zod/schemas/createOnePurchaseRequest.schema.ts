import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestSelectObjectSchema as PurchaseRequestSelectObjectSchema } from './objects/PurchaseRequestSelect.schema';
import { PurchaseRequestIncludeObjectSchema as PurchaseRequestIncludeObjectSchema } from './objects/PurchaseRequestInclude.schema';
import { PurchaseRequestCreateInputObjectSchema as PurchaseRequestCreateInputObjectSchema } from './objects/PurchaseRequestCreateInput.schema';
import { PurchaseRequestUncheckedCreateInputObjectSchema as PurchaseRequestUncheckedCreateInputObjectSchema } from './objects/PurchaseRequestUncheckedCreateInput.schema';

export const PurchaseRequestCreateOneSchema: z.ZodType<Prisma.PurchaseRequestCreateArgs> = z.object({ select: PurchaseRequestSelectObjectSchema.optional(), include: PurchaseRequestIncludeObjectSchema.optional(), data: z.union([PurchaseRequestCreateInputObjectSchema, PurchaseRequestUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestCreateArgs>;

export const PurchaseRequestCreateOneZodSchema = z.object({ select: PurchaseRequestSelectObjectSchema.optional(), include: PurchaseRequestIncludeObjectSchema.optional(), data: z.union([PurchaseRequestCreateInputObjectSchema, PurchaseRequestUncheckedCreateInputObjectSchema]) }).strict();