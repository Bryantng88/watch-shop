import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecStatusSchema } from '../enums/WatchSpecStatus.schema'

const nestedenumwatchspecstatusfilterSchema = z.object({
  equals: WatchSpecStatusSchema.optional(),
  in: WatchSpecStatusSchema.array().optional(),
  notIn: WatchSpecStatusSchema.array().optional(),
  not: z.union([WatchSpecStatusSchema, z.lazy(() => NestedEnumWatchSpecStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumWatchSpecStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchSpecStatusFilter> = nestedenumwatchspecstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchSpecStatusFilter>;
export const NestedEnumWatchSpecStatusFilterObjectZodSchema = nestedenumwatchspecstatusfilterSchema;
