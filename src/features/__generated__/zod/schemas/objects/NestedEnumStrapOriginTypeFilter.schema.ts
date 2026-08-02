import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapOriginTypeSchema } from '../enums/StrapOriginType.schema'

const nestedenumstraporigintypefilterSchema = z.object({
  equals: StrapOriginTypeSchema.optional(),
  in: StrapOriginTypeSchema.array().optional(),
  notIn: StrapOriginTypeSchema.array().optional(),
  not: z.union([StrapOriginTypeSchema, z.lazy(() => NestedEnumStrapOriginTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumStrapOriginTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapOriginTypeFilter> = nestedenumstraporigintypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapOriginTypeFilter>;
export const NestedEnumStrapOriginTypeFilterObjectZodSchema = nestedenumstraporigintypefilterSchema;
