import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { orderitemkindSchema } from '../enums/orderitemkind.schema'

const nestedenumorderitemkindfilterSchema = z.object({
  equals: orderitemkindSchema.optional(),
  in: orderitemkindSchema.array().optional(),
  notIn: orderitemkindSchema.array().optional(),
  not: z.union([orderitemkindSchema, z.lazy(() => NestedEnumorderitemkindFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumorderitemkindFilterObjectSchema: z.ZodType<Prisma.NestedEnumorderitemkindFilter> = nestedenumorderitemkindfilterSchema as unknown as z.ZodType<Prisma.NestedEnumorderitemkindFilter>;
export const NestedEnumorderitemkindFilterObjectZodSchema = nestedenumorderitemkindfilterSchema;
