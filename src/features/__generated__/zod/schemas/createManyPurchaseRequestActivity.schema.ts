import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestActivityCreateManyInputObjectSchema as PurchaseRequestActivityCreateManyInputObjectSchema } from './objects/PurchaseRequestActivityCreateManyInput.schema';

export const PurchaseRequestActivityCreateManySchema: z.ZodType<Prisma.PurchaseRequestActivityCreateManyArgs> = z.object({ data: z.union([ PurchaseRequestActivityCreateManyInputObjectSchema, z.array(PurchaseRequestActivityCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestActivityCreateManyArgs>;

export const PurchaseRequestActivityCreateManyZodSchema = z.object({ data: z.union([ PurchaseRequestActivityCreateManyInputObjectSchema, z.array(PurchaseRequestActivityCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();