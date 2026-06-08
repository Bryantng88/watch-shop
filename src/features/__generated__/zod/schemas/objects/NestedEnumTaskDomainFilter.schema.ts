import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskDomainSchema } from '../enums/TaskDomain.schema'

const nestedenumtaskdomainfilterSchema = z.object({
  equals: TaskDomainSchema.optional(),
  in: TaskDomainSchema.array().optional(),
  notIn: TaskDomainSchema.array().optional(),
  not: z.union([TaskDomainSchema, z.lazy(() => NestedEnumTaskDomainFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumTaskDomainFilterObjectSchema: z.ZodType<Prisma.NestedEnumTaskDomainFilter> = nestedenumtaskdomainfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTaskDomainFilter>;
export const NestedEnumTaskDomainFilterObjectZodSchema = nestedenumtaskdomainfilterSchema;
