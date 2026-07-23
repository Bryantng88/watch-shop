import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOwnerTypeSchema } from '../enums/MediaOwnerType.schema'

const nestedenummediaownertypefilterSchema = z.object({
  equals: MediaOwnerTypeSchema.optional(),
  in: MediaOwnerTypeSchema.array().optional(),
  notIn: MediaOwnerTypeSchema.array().optional(),
  not: z.union([MediaOwnerTypeSchema, z.lazy(() => NestedEnumMediaOwnerTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumMediaOwnerTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumMediaOwnerTypeFilter> = nestedenummediaownertypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumMediaOwnerTypeFilter>;
export const NestedEnumMediaOwnerTypeFilterObjectZodSchema = nestedenummediaownertypefilterSchema;
