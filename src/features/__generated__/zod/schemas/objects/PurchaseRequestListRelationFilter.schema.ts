import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestWhereInputObjectSchema as PurchaseRequestWhereInputObjectSchema } from './PurchaseRequestWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => PurchaseRequestWhereInputObjectSchema).optional(),
  some: z.lazy(() => PurchaseRequestWhereInputObjectSchema).optional(),
  none: z.lazy(() => PurchaseRequestWhereInputObjectSchema).optional()
}).strict();
export const PurchaseRequestListRelationFilterObjectSchema: z.ZodType<Prisma.PurchaseRequestListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestListRelationFilter>;
export const PurchaseRequestListRelationFilterObjectZodSchema = makeSchema();
