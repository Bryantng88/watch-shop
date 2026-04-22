import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecStatusSchema } from '../enums/WatchSpecStatus.schema';
import { NestedEnumWatchSpecStatusFilterObjectSchema as NestedEnumWatchSpecStatusFilterObjectSchema } from './NestedEnumWatchSpecStatusFilter.schema'

const makeSchema = () => z.object({
  equals: WatchSpecStatusSchema.optional(),
  in: WatchSpecStatusSchema.array().optional(),
  notIn: WatchSpecStatusSchema.array().optional(),
  not: z.union([WatchSpecStatusSchema, z.lazy(() => NestedEnumWatchSpecStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumWatchSpecStatusFilterObjectSchema: z.ZodType<Prisma.EnumWatchSpecStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchSpecStatusFilter>;
export const EnumWatchSpecStatusFilterObjectZodSchema = makeSchema();
