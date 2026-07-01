import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ActivityStatusSchema } from '../enums/ActivityStatus.schema'

const nestedenumactivitystatusfilterSchema = z.object({
  equals: ActivityStatusSchema.optional(),
  in: ActivityStatusSchema.array().optional(),
  notIn: ActivityStatusSchema.array().optional(),
  not: z.union([ActivityStatusSchema, z.lazy(() => NestedEnumActivityStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumActivityStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumActivityStatusFilter> = nestedenumactivitystatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumActivityStatusFilter>;
export const NestedEnumActivityStatusFilterObjectZodSchema = nestedenumactivitystatusfilterSchema;
