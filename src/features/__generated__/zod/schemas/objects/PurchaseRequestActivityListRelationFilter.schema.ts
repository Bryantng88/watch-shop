import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityWhereInputObjectSchema as PurchaseRequestActivityWhereInputObjectSchema } from './PurchaseRequestActivityWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => PurchaseRequestActivityWhereInputObjectSchema).optional(),
  some: z.lazy(() => PurchaseRequestActivityWhereInputObjectSchema).optional(),
  none: z.lazy(() => PurchaseRequestActivityWhereInputObjectSchema).optional()
}).strict();
export const PurchaseRequestActivityListRelationFilterObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityListRelationFilter>;
export const PurchaseRequestActivityListRelationFilterObjectZodSchema = makeSchema();
