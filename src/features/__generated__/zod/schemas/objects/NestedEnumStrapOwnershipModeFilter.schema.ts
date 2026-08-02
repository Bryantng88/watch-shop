import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapOwnershipModeSchema } from '../enums/StrapOwnershipMode.schema'

const nestedenumstrapownershipmodefilterSchema = z.object({
  equals: StrapOwnershipModeSchema.optional(),
  in: StrapOwnershipModeSchema.array().optional(),
  notIn: StrapOwnershipModeSchema.array().optional(),
  not: z.union([StrapOwnershipModeSchema, z.lazy(() => NestedEnumStrapOwnershipModeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumStrapOwnershipModeFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapOwnershipModeFilter> = nestedenumstrapownershipmodefilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapOwnershipModeFilter>;
export const NestedEnumStrapOwnershipModeFilterObjectZodSchema = nestedenumstrapownershipmodefilterSchema;
