import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCaseMaterialFamilySchema } from '../enums/WatchCaseMaterialFamily.schema';
import { NestedEnumWatchCaseMaterialFamilyFilterObjectSchema as NestedEnumWatchCaseMaterialFamilyFilterObjectSchema } from './NestedEnumWatchCaseMaterialFamilyFilter.schema'

const makeSchema = () => z.object({
  equals: WatchCaseMaterialFamilySchema.optional(),
  in: WatchCaseMaterialFamilySchema.array().optional(),
  notIn: WatchCaseMaterialFamilySchema.array().optional(),
  not: z.union([WatchCaseMaterialFamilySchema, z.lazy(() => NestedEnumWatchCaseMaterialFamilyFilterObjectSchema)]).optional()
}).strict();
export const EnumWatchCaseMaterialFamilyFilterObjectSchema: z.ZodType<Prisma.EnumWatchCaseMaterialFamilyFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchCaseMaterialFamilyFilter>;
export const EnumWatchCaseMaterialFamilyFilterObjectZodSchema = makeSchema();
