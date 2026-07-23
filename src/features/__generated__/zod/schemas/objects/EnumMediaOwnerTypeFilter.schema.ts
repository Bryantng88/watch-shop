import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOwnerTypeSchema } from '../enums/MediaOwnerType.schema';
import { NestedEnumMediaOwnerTypeFilterObjectSchema as NestedEnumMediaOwnerTypeFilterObjectSchema } from './NestedEnumMediaOwnerTypeFilter.schema'

const makeSchema = () => z.object({
  equals: MediaOwnerTypeSchema.optional(),
  in: MediaOwnerTypeSchema.array().optional(),
  notIn: MediaOwnerTypeSchema.array().optional(),
  not: z.union([MediaOwnerTypeSchema, z.lazy(() => NestedEnumMediaOwnerTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumMediaOwnerTypeFilterObjectSchema: z.ZodType<Prisma.EnumMediaOwnerTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaOwnerTypeFilter>;
export const EnumMediaOwnerTypeFilterObjectZodSchema = makeSchema();
