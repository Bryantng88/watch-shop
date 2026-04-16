import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchMaterialProfileSchema } from '../enums/WatchMaterialProfile.schema'

const nestedenumwatchmaterialprofilefilterSchema = z.object({
  equals: WatchMaterialProfileSchema.optional(),
  in: WatchMaterialProfileSchema.array().optional(),
  notIn: WatchMaterialProfileSchema.array().optional(),
  not: z.union([WatchMaterialProfileSchema, z.lazy(() => NestedEnumWatchMaterialProfileFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumWatchMaterialProfileFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchMaterialProfileFilter> = nestedenumwatchmaterialprofilefilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchMaterialProfileFilter>;
export const NestedEnumWatchMaterialProfileFilterObjectZodSchema = nestedenumwatchmaterialprofilefilterSchema;
