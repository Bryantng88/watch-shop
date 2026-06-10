import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskDomainSchema } from '../enums/TaskDomain.schema';
import { NestedEnumTaskDomainFilterObjectSchema as NestedEnumTaskDomainFilterObjectSchema } from './NestedEnumTaskDomainFilter.schema'

const makeSchema = () => z.object({
  equals: TaskDomainSchema.optional(),
  in: TaskDomainSchema.array().optional(),
  notIn: TaskDomainSchema.array().optional(),
  not: z.union([TaskDomainSchema, z.lazy(() => NestedEnumTaskDomainFilterObjectSchema)]).optional()
}).strict();
export const EnumTaskDomainFilterObjectSchema: z.ZodType<Prisma.EnumTaskDomainFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskDomainFilter>;
export const EnumTaskDomainFilterObjectZodSchema = makeSchema();
