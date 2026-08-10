import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestActivitySelectObjectSchema as PurchaseRequestActivitySelectObjectSchema } from './objects/PurchaseRequestActivitySelect.schema';
import { PurchaseRequestActivityIncludeObjectSchema as PurchaseRequestActivityIncludeObjectSchema } from './objects/PurchaseRequestActivityInclude.schema';
import { PurchaseRequestActivityWhereUniqueInputObjectSchema as PurchaseRequestActivityWhereUniqueInputObjectSchema } from './objects/PurchaseRequestActivityWhereUniqueInput.schema';

export const PurchaseRequestActivityFindUniqueSchema: z.ZodType<Prisma.PurchaseRequestActivityFindUniqueArgs> = z.object({ select: PurchaseRequestActivitySelectObjectSchema.optional(), include: PurchaseRequestActivityIncludeObjectSchema.optional(), where: PurchaseRequestActivityWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestActivityFindUniqueArgs>;

export const PurchaseRequestActivityFindUniqueZodSchema = z.object({ select: PurchaseRequestActivitySelectObjectSchema.optional(), include: PurchaseRequestActivityIncludeObjectSchema.optional(), where: PurchaseRequestActivityWhereUniqueInputObjectSchema }).strict();