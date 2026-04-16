import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCaseMaterialFamilySchema } from '../enums/WatchCaseMaterialFamily.schema'

const nestedenumwatchcasematerialfamilyfilterSchema = z.object({
  equals: WatchCaseMaterialFamilySchema.optional(),
  in: WatchCaseMaterialFamilySchema.array().optional(),
  notIn: WatchCaseMaterialFamilySchema.array().optional(),
  not: z.union([WatchCaseMaterialFamilySchema, z.lazy(() => NestedEnumWatchCaseMaterialFamilyFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumWatchCaseMaterialFamilyFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchCaseMaterialFamilyFilter> = nestedenumwatchcasematerialfamilyfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchCaseMaterialFamilyFilter>;
export const NestedEnumWatchCaseMaterialFamilyFilterObjectZodSchema = nestedenumwatchcasematerialfamilyfilterSchema;
