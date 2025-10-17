import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TagSchema } from '../enums/Tag.schema';
import { NestedEnumTagFilterObjectSchema as NestedEnumTagFilterObjectSchema } from './NestedEnumTagFilter.schema'

const makeSchema = () => z.object({
  equals: TagSchema.optional(),
  in: TagSchema.array().optional(),
  notIn: TagSchema.array().optional(),
  not: z.union([TagSchema, z.lazy(() => NestedEnumTagFilterObjectSchema)]).optional()
}).strict();
export const EnumTagFilterObjectSchema: z.ZodType<Prisma.EnumTagFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTagFilter>;
export const EnumTagFilterObjectZodSchema = makeSchema();
