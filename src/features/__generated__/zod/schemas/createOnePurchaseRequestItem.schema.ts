import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestItemSelectObjectSchema as PurchaseRequestItemSelectObjectSchema } from './objects/PurchaseRequestItemSelect.schema';
import { PurchaseRequestItemIncludeObjectSchema as PurchaseRequestItemIncludeObjectSchema } from './objects/PurchaseRequestItemInclude.schema';
import { PurchaseRequestItemCreateInputObjectSchema as PurchaseRequestItemCreateInputObjectSchema } from './objects/PurchaseRequestItemCreateInput.schema';
import { PurchaseRequestItemUncheckedCreateInputObjectSchema as PurchaseRequestItemUncheckedCreateInputObjectSchema } from './objects/PurchaseRequestItemUncheckedCreateInput.schema';

export const PurchaseRequestItemCreateOneSchema: z.ZodType<Prisma.PurchaseRequestItemCreateArgs> = z.object({ select: PurchaseRequestItemSelectObjectSchema.optional(), include: PurchaseRequestItemIncludeObjectSchema.optional(), data: z.union([PurchaseRequestItemCreateInputObjectSchema, PurchaseRequestItemUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestItemCreateArgs>;

export const PurchaseRequestItemCreateOneZodSchema = z.object({ select: PurchaseRequestItemSelectObjectSchema.optional(), include: PurchaseRequestItemIncludeObjectSchema.optional(), data: z.union([PurchaseRequestItemCreateInputObjectSchema, PurchaseRequestItemUncheckedCreateInputObjectSchema]) }).strict();