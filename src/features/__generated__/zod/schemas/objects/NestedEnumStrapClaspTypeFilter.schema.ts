import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapClaspTypeSchema } from '../enums/StrapClaspType.schema'

const nestedenumstrapclasptypefilterSchema = z.object({
  equals: StrapClaspTypeSchema.optional(),
  in: StrapClaspTypeSchema.array().optional(),
  notIn: StrapClaspTypeSchema.array().optional(),
  not: z.union([StrapClaspTypeSchema, z.lazy(() => NestedEnumStrapClaspTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumStrapClaspTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapClaspTypeFilter> = nestedenumstrapclasptypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapClaspTypeFilter>;
export const NestedEnumStrapClaspTypeFilterObjectZodSchema = nestedenumstrapclasptypefilterSchema;
