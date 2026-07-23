import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOperationTypeSchema } from '../enums/MediaOperationType.schema';
import { NestedEnumMediaOperationTypeFilterObjectSchema as NestedEnumMediaOperationTypeFilterObjectSchema } from './NestedEnumMediaOperationTypeFilter.schema'

const makeSchema = () => z.object({
  equals: MediaOperationTypeSchema.optional(),
  in: MediaOperationTypeSchema.array().optional(),
  notIn: MediaOperationTypeSchema.array().optional(),
  not: z.union([MediaOperationTypeSchema, z.lazy(() => NestedEnumMediaOperationTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumMediaOperationTypeFilterObjectSchema: z.ZodType<Prisma.EnumMediaOperationTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaOperationTypeFilter>;
export const EnumMediaOperationTypeFilterObjectZodSchema = makeSchema();
