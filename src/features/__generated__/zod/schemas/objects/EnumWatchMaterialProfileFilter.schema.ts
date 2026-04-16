import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchMaterialProfileSchema } from '../enums/WatchMaterialProfile.schema';
import { NestedEnumWatchMaterialProfileFilterObjectSchema as NestedEnumWatchMaterialProfileFilterObjectSchema } from './NestedEnumWatchMaterialProfileFilter.schema'

const makeSchema = () => z.object({
  equals: WatchMaterialProfileSchema.optional(),
  in: WatchMaterialProfileSchema.array().optional(),
  notIn: WatchMaterialProfileSchema.array().optional(),
  not: z.union([WatchMaterialProfileSchema, z.lazy(() => NestedEnumWatchMaterialProfileFilterObjectSchema)]).optional()
}).strict();
export const EnumWatchMaterialProfileFilterObjectSchema: z.ZodType<Prisma.EnumWatchMaterialProfileFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchMaterialProfileFilter>;
export const EnumWatchMaterialProfileFilterObjectZodSchema = makeSchema();
