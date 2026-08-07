import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemWhereInputObjectSchema as PurchaseRequestItemWhereInputObjectSchema } from './PurchaseRequestItemWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => PurchaseRequestItemWhereInputObjectSchema).optional(),
  some: z.lazy(() => PurchaseRequestItemWhereInputObjectSchema).optional(),
  none: z.lazy(() => PurchaseRequestItemWhereInputObjectSchema).optional()
}).strict();
export const PurchaseRequestItemListRelationFilterObjectSchema: z.ZodType<Prisma.PurchaseRequestItemListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemListRelationFilter>;
export const PurchaseRequestItemListRelationFilterObjectZodSchema = makeSchema();
