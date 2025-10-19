import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TagSchema } from '../enums/Tag.schema'

const nestedenumtagfilterSchema = z.object({
  equals: TagSchema.optional(),
  in: TagSchema.array().optional(),
  notIn: TagSchema.array().optional(),
  not: z.union([TagSchema, z.lazy(() => NestedEnumTagFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumTagFilterObjectSchema: z.ZodType<Prisma.NestedEnumTagFilter> = nestedenumtagfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTagFilter>;
export const NestedEnumTagFilterObjectZodSchema = nestedenumtagfilterSchema;
