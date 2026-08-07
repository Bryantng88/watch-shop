import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestCreateManyInputObjectSchema as PurchaseRequestCreateManyInputObjectSchema } from './objects/PurchaseRequestCreateManyInput.schema';

export const PurchaseRequestCreateManySchema: z.ZodType<Prisma.PurchaseRequestCreateManyArgs> = z.object({ data: z.union([ PurchaseRequestCreateManyInputObjectSchema, z.array(PurchaseRequestCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestCreateManyArgs>;

export const PurchaseRequestCreateManyZodSchema = z.object({ data: z.union([ PurchaseRequestCreateManyInputObjectSchema, z.array(PurchaseRequestCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();