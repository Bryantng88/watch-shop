import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestSelectObjectSchema as PurchaseRequestSelectObjectSchema } from './objects/PurchaseRequestSelect.schema';
import { PurchaseRequestIncludeObjectSchema as PurchaseRequestIncludeObjectSchema } from './objects/PurchaseRequestInclude.schema';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './objects/PurchaseRequestWhereUniqueInput.schema';

export const PurchaseRequestDeleteOneSchema: z.ZodType<Prisma.PurchaseRequestDeleteArgs> = z.object({ select: PurchaseRequestSelectObjectSchema.optional(), include: PurchaseRequestIncludeObjectSchema.optional(), where: PurchaseRequestWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestDeleteArgs>;

export const PurchaseRequestDeleteOneZodSchema = z.object({ select: PurchaseRequestSelectObjectSchema.optional(), include: PurchaseRequestIncludeObjectSchema.optional(), where: PurchaseRequestWhereUniqueInputObjectSchema }).strict();