import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestActivitySelectObjectSchema as PurchaseRequestActivitySelectObjectSchema } from './objects/PurchaseRequestActivitySelect.schema';
import { PurchaseRequestActivityCreateManyInputObjectSchema as PurchaseRequestActivityCreateManyInputObjectSchema } from './objects/PurchaseRequestActivityCreateManyInput.schema';

export const PurchaseRequestActivityCreateManyAndReturnSchema: z.ZodType<Prisma.PurchaseRequestActivityCreateManyAndReturnArgs> = z.object({ select: PurchaseRequestActivitySelectObjectSchema.optional(), data: z.union([ PurchaseRequestActivityCreateManyInputObjectSchema, z.array(PurchaseRequestActivityCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestActivityCreateManyAndReturnArgs>;

export const PurchaseRequestActivityCreateManyAndReturnZodSchema = z.object({ select: PurchaseRequestActivitySelectObjectSchema.optional(), data: z.union([ PurchaseRequestActivityCreateManyInputObjectSchema, z.array(PurchaseRequestActivityCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();