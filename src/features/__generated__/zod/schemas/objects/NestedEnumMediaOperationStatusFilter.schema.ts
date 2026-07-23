import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOperationStatusSchema } from '../enums/MediaOperationStatus.schema'

const nestedenummediaoperationstatusfilterSchema = z.object({
  equals: MediaOperationStatusSchema.optional(),
  in: MediaOperationStatusSchema.array().optional(),
  notIn: MediaOperationStatusSchema.array().optional(),
  not: z.union([MediaOperationStatusSchema, z.lazy(() => NestedEnumMediaOperationStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumMediaOperationStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumMediaOperationStatusFilter> = nestedenummediaoperationstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumMediaOperationStatusFilter>;
export const NestedEnumMediaOperationStatusFilterObjectZodSchema = nestedenummediaoperationstatusfilterSchema;
