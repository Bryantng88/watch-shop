import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestSelectObjectSchema as PurchaseRequestSelectObjectSchema } from './objects/PurchaseRequestSelect.schema';
import { PurchaseRequestCreateManyInputObjectSchema as PurchaseRequestCreateManyInputObjectSchema } from './objects/PurchaseRequestCreateManyInput.schema';

export const PurchaseRequestCreateManyAndReturnSchema: z.ZodType<Prisma.PurchaseRequestCreateManyAndReturnArgs> = z.object({ select: PurchaseRequestSelectObjectSchema.optional(), data: z.union([ PurchaseRequestCreateManyInputObjectSchema, z.array(PurchaseRequestCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestCreateManyAndReturnArgs>;

export const PurchaseRequestCreateManyAndReturnZodSchema = z.object({ select: PurchaseRequestSelectObjectSchema.optional(), data: z.union([ PurchaseRequestCreateManyInputObjectSchema, z.array(PurchaseRequestCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();