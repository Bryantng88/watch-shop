import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOperationStatusSchema } from '../enums/MediaOperationStatus.schema';
import { NestedEnumMediaOperationStatusFilterObjectSchema as NestedEnumMediaOperationStatusFilterObjectSchema } from './NestedEnumMediaOperationStatusFilter.schema'

const makeSchema = () => z.object({
  equals: MediaOperationStatusSchema.optional(),
  in: MediaOperationStatusSchema.array().optional(),
  notIn: MediaOperationStatusSchema.array().optional(),
  not: z.union([MediaOperationStatusSchema, z.lazy(() => NestedEnumMediaOperationStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumMediaOperationStatusFilterObjectSchema: z.ZodType<Prisma.EnumMediaOperationStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaOperationStatusFilter>;
export const EnumMediaOperationStatusFilterObjectZodSchema = makeSchema();
