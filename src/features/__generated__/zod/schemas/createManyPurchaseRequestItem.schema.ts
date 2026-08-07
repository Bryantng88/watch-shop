import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestItemCreateManyInputObjectSchema as PurchaseRequestItemCreateManyInputObjectSchema } from './objects/PurchaseRequestItemCreateManyInput.schema';

export const PurchaseRequestItemCreateManySchema: z.ZodType<Prisma.PurchaseRequestItemCreateManyArgs> = z.object({ data: z.union([ PurchaseRequestItemCreateManyInputObjectSchema, z.array(PurchaseRequestItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestItemCreateManyArgs>;

export const PurchaseRequestItemCreateManyZodSchema = z.object({ data: z.union([ PurchaseRequestItemCreateManyInputObjectSchema, z.array(PurchaseRequestItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();