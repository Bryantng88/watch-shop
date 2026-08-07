import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestSelectObjectSchema as PurchaseRequestSelectObjectSchema } from './objects/PurchaseRequestSelect.schema';
import { PurchaseRequestIncludeObjectSchema as PurchaseRequestIncludeObjectSchema } from './objects/PurchaseRequestInclude.schema';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './objects/PurchaseRequestWhereUniqueInput.schema';

export const PurchaseRequestFindUniqueSchema: z.ZodType<Prisma.PurchaseRequestFindUniqueArgs> = z.object({ select: PurchaseRequestSelectObjectSchema.optional(), include: PurchaseRequestIncludeObjectSchema.optional(), where: PurchaseRequestWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestFindUniqueArgs>;

export const PurchaseRequestFindUniqueZodSchema = z.object({ select: PurchaseRequestSelectObjectSchema.optional(), include: PurchaseRequestIncludeObjectSchema.optional(), where: PurchaseRequestWhereUniqueInputObjectSchema }).strict();