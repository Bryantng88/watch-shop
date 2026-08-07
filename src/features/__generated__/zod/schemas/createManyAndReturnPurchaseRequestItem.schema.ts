import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestItemSelectObjectSchema as PurchaseRequestItemSelectObjectSchema } from './objects/PurchaseRequestItemSelect.schema';
import { PurchaseRequestItemCreateManyInputObjectSchema as PurchaseRequestItemCreateManyInputObjectSchema } from './objects/PurchaseRequestItemCreateManyInput.schema';

export const PurchaseRequestItemCreateManyAndReturnSchema: z.ZodType<Prisma.PurchaseRequestItemCreateManyAndReturnArgs> = z.object({ select: PurchaseRequestItemSelectObjectSchema.optional(), data: z.union([ PurchaseRequestItemCreateManyInputObjectSchema, z.array(PurchaseRequestItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestItemCreateManyAndReturnArgs>;

export const PurchaseRequestItemCreateManyAndReturnZodSchema = z.object({ select: PurchaseRequestItemSelectObjectSchema.optional(), data: z.union([ PurchaseRequestItemCreateManyInputObjectSchema, z.array(PurchaseRequestItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();