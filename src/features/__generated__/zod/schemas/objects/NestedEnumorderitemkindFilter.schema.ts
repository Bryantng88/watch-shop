import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemKindSchema } from '../enums/OrderItemKind.schema'

const nestedenumorderitemkindfilterSchema = z.object({
  equals: OrderItemKindSchema.optional(),
  in: OrderItemKindSchema.array().optional(),
  notIn: OrderItemKindSchema.array().optional(),
  not: z.union([OrderItemKindSchema, z.lazy(() => NestedEnumOrderItemKindFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumOrderItemKindFilterObjectSchema: z.ZodType<Prisma.NestedEnumOrderItemKindFilter> = nestedenumorderitemkindfilterSchema as unknown as z.ZodType<Prisma.NestedEnumOrderItemKindFilter>;
export const NestedEnumOrderItemKindFilterObjectZodSchema = nestedenumorderitemkindfilterSchema;
