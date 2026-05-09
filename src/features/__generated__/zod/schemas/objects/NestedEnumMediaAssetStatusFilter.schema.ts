import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaAssetStatusSchema } from '../enums/MediaAssetStatus.schema'

const nestedenummediaassetstatusfilterSchema = z.object({
  equals: MediaAssetStatusSchema.optional(),
  in: MediaAssetStatusSchema.array().optional(),
  notIn: MediaAssetStatusSchema.array().optional(),
  not: z.union([MediaAssetStatusSchema, z.lazy(() => NestedEnumMediaAssetStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumMediaAssetStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumMediaAssetStatusFilter> = nestedenummediaassetstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumMediaAssetStatusFilter>;
export const NestedEnumMediaAssetStatusFilterObjectZodSchema = nestedenummediaassetstatusfilterSchema;
