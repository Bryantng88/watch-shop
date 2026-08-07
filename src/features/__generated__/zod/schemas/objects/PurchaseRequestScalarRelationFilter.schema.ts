import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestWhereInputObjectSchema as PurchaseRequestWhereInputObjectSchema } from './PurchaseRequestWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => PurchaseRequestWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => PurchaseRequestWhereInputObjectSchema).optional()
}).strict();
export const PurchaseRequestScalarRelationFilterObjectSchema: z.ZodType<Prisma.PurchaseRequestScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestScalarRelationFilter>;
export const PurchaseRequestScalarRelationFilterObjectZodSchema = makeSchema();
