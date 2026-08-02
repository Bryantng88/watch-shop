import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapOwnershipModeSchema } from '../enums/StrapOwnershipMode.schema';
import { NestedEnumStrapOwnershipModeFilterObjectSchema as NestedEnumStrapOwnershipModeFilterObjectSchema } from './NestedEnumStrapOwnershipModeFilter.schema'

const makeSchema = () => z.object({
  equals: StrapOwnershipModeSchema.optional(),
  in: StrapOwnershipModeSchema.array().optional(),
  notIn: StrapOwnershipModeSchema.array().optional(),
  not: z.union([StrapOwnershipModeSchema, z.lazy(() => NestedEnumStrapOwnershipModeFilterObjectSchema)]).optional()
}).strict();
export const EnumStrapOwnershipModeFilterObjectSchema: z.ZodType<Prisma.EnumStrapOwnershipModeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapOwnershipModeFilter>;
export const EnumStrapOwnershipModeFilterObjectZodSchema = makeSchema();
