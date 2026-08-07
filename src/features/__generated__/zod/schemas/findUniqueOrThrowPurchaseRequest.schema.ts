import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestSelectObjectSchema as PurchaseRequestSelectObjectSchema } from './objects/PurchaseRequestSelect.schema';
import { PurchaseRequestIncludeObjectSchema as PurchaseRequestIncludeObjectSchema } from './objects/PurchaseRequestInclude.schema';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './objects/PurchaseRequestWhereUniqueInput.schema';

export const PurchaseRequestFindUniqueOrThrowSchema: z.ZodType<Prisma.PurchaseRequestFindUniqueOrThrowArgs> = z.object({ select: PurchaseRequestSelectObjectSchema.optional(), include: PurchaseRequestIncludeObjectSchema.optional(), where: PurchaseRequestWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestFindUniqueOrThrowArgs>;

export const PurchaseRequestFindUniqueOrThrowZodSchema = z.object({ select: PurchaseRequestSelectObjectSchema.optional(), include: PurchaseRequestIncludeObjectSchema.optional(), where: PurchaseRequestWhereUniqueInputObjectSchema }).strict();