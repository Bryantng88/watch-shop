import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestActivitySelectObjectSchema as PurchaseRequestActivitySelectObjectSchema } from './objects/PurchaseRequestActivitySelect.schema';
import { PurchaseRequestActivityIncludeObjectSchema as PurchaseRequestActivityIncludeObjectSchema } from './objects/PurchaseRequestActivityInclude.schema';
import { PurchaseRequestActivityCreateInputObjectSchema as PurchaseRequestActivityCreateInputObjectSchema } from './objects/PurchaseRequestActivityCreateInput.schema';
import { PurchaseRequestActivityUncheckedCreateInputObjectSchema as PurchaseRequestActivityUncheckedCreateInputObjectSchema } from './objects/PurchaseRequestActivityUncheckedCreateInput.schema';

export const PurchaseRequestActivityCreateOneSchema: z.ZodType<Prisma.PurchaseRequestActivityCreateArgs> = z.object({ select: PurchaseRequestActivitySelectObjectSchema.optional(), include: PurchaseRequestActivityIncludeObjectSchema.optional(), data: z.union([PurchaseRequestActivityCreateInputObjectSchema, PurchaseRequestActivityUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestActivityCreateArgs>;

export const PurchaseRequestActivityCreateOneZodSchema = z.object({ select: PurchaseRequestActivitySelectObjectSchema.optional(), include: PurchaseRequestActivityIncludeObjectSchema.optional(), data: z.union([PurchaseRequestActivityCreateInputObjectSchema, PurchaseRequestActivityUncheckedCreateInputObjectSchema]) }).strict();