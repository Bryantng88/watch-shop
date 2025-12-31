import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { orderitemkindSchema } from '../enums/orderitemkind.schema';
import { NestedEnumorderitemkindFilterObjectSchema as NestedEnumorderitemkindFilterObjectSchema } from './NestedEnumorderitemkindFilter.schema'

const makeSchema = () => z.object({
  equals: orderitemkindSchema.optional(),
  in: orderitemkindSchema.array().optional(),
  notIn: orderitemkindSchema.array().optional(),
  not: z.union([orderitemkindSchema, z.lazy(() => NestedEnumorderitemkindFilterObjectSchema)]).optional()
}).strict();
export const EnumorderitemkindFilterObjectSchema: z.ZodType<Prisma.EnumorderitemkindFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumorderitemkindFilter>;
export const EnumorderitemkindFilterObjectZodSchema = makeSchema();
