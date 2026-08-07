import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestSelectObjectSchema as PurchaseRequestSelectObjectSchema } from './objects/PurchaseRequestSelect.schema';
import { PurchaseRequestIncludeObjectSchema as PurchaseRequestIncludeObjectSchema } from './objects/PurchaseRequestInclude.schema';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './objects/PurchaseRequestWhereUniqueInput.schema';
import { PurchaseRequestCreateInputObjectSchema as PurchaseRequestCreateInputObjectSchema } from './objects/PurchaseRequestCreateInput.schema';
import { PurchaseRequestUncheckedCreateInputObjectSchema as PurchaseRequestUncheckedCreateInputObjectSchema } from './objects/PurchaseRequestUncheckedCreateInput.schema';
import { PurchaseRequestUpdateInputObjectSchema as PurchaseRequestUpdateInputObjectSchema } from './objects/PurchaseRequestUpdateInput.schema';
import { PurchaseRequestUncheckedUpdateInputObjectSchema as PurchaseRequestUncheckedUpdateInputObjectSchema } from './objects/PurchaseRequestUncheckedUpdateInput.schema';

export const PurchaseRequestUpsertOneSchema: z.ZodType<Prisma.PurchaseRequestUpsertArgs> = z.object({ select: PurchaseRequestSelectObjectSchema.optional(), include: PurchaseRequestIncludeObjectSchema.optional(), where: PurchaseRequestWhereUniqueInputObjectSchema, create: z.union([ PurchaseRequestCreateInputObjectSchema, PurchaseRequestUncheckedCreateInputObjectSchema ]), update: z.union([ PurchaseRequestUpdateInputObjectSchema, PurchaseRequestUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestUpsertArgs>;

export const PurchaseRequestUpsertOneZodSchema = z.object({ select: PurchaseRequestSelectObjectSchema.optional(), include: PurchaseRequestIncludeObjectSchema.optional(), where: PurchaseRequestWhereUniqueInputObjectSchema, create: z.union([ PurchaseRequestCreateInputObjectSchema, PurchaseRequestUncheckedCreateInputObjectSchema ]), update: z.union([ PurchaseRequestUpdateInputObjectSchema, PurchaseRequestUncheckedUpdateInputObjectSchema ]) }).strict();