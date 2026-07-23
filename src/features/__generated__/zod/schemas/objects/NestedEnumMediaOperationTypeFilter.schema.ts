import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOperationTypeSchema } from '../enums/MediaOperationType.schema'

const nestedenummediaoperationtypefilterSchema = z.object({
  equals: MediaOperationTypeSchema.optional(),
  in: MediaOperationTypeSchema.array().optional(),
  notIn: MediaOperationTypeSchema.array().optional(),
  not: z.union([MediaOperationTypeSchema, z.lazy(() => NestedEnumMediaOperationTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumMediaOperationTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumMediaOperationTypeFilter> = nestedenummediaoperationtypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumMediaOperationTypeFilter>;
export const NestedEnumMediaOperationTypeFilterObjectZodSchema = nestedenummediaoperationtypefilterSchema;
