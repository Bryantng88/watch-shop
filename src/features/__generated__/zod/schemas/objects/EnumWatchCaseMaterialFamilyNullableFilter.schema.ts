import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCaseMaterialFamilySchema } from '../enums/WatchCaseMaterialFamily.schema';
import { NestedEnumWatchCaseMaterialFamilyNullableFilterObjectSchema as NestedEnumWatchCaseMaterialFamilyNullableFilterObjectSchema } from './NestedEnumWatchCaseMaterialFamilyNullableFilter.schema'

const makeSchema = () => z.object({
  equals: WatchCaseMaterialFamilySchema.optional().nullable(),
  in: WatchCaseMaterialFamilySchema.array().optional().nullable(),
  notIn: WatchCaseMaterialFamilySchema.array().optional().nullable(),
  not: z.union([WatchCaseMaterialFamilySchema, z.lazy(() => NestedEnumWatchCaseMaterialFamilyNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumWatchCaseMaterialFamilyNullableFilterObjectSchema: z.ZodType<Prisma.EnumWatchCaseMaterialFamilyNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchCaseMaterialFamilyNullableFilter>;
export const EnumWatchCaseMaterialFamilyNullableFilterObjectZodSchema = makeSchema();
