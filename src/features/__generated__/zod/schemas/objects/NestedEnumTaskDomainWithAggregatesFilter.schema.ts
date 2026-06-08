import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskDomainSchema } from '../enums/TaskDomain.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTaskDomainFilterObjectSchema as NestedEnumTaskDomainFilterObjectSchema } from './NestedEnumTaskDomainFilter.schema'

const nestedenumtaskdomainwithaggregatesfilterSchema = z.object({
  equals: TaskDomainSchema.optional(),
  in: TaskDomainSchema.array().optional(),
  notIn: TaskDomainSchema.array().optional(),
  not: z.union([TaskDomainSchema, z.lazy(() => NestedEnumTaskDomainWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTaskDomainFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTaskDomainFilterObjectSchema).optional()
}).strict();
export const NestedEnumTaskDomainWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumTaskDomainWithAggregatesFilter> = nestedenumtaskdomainwithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTaskDomainWithAggregatesFilter>;
export const NestedEnumTaskDomainWithAggregatesFilterObjectZodSchema = nestedenumtaskdomainwithaggregatesfilterSchema;
