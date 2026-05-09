import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaAssetStatusSchema } from '../enums/MediaAssetStatus.schema';
import { NestedEnumMediaAssetStatusFilterObjectSchema as NestedEnumMediaAssetStatusFilterObjectSchema } from './NestedEnumMediaAssetStatusFilter.schema'

const makeSchema = () => z.object({
  equals: MediaAssetStatusSchema.optional(),
  in: MediaAssetStatusSchema.array().optional(),
  notIn: MediaAssetStatusSchema.array().optional(),
  not: z.union([MediaAssetStatusSchema, z.lazy(() => NestedEnumMediaAssetStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumMediaAssetStatusFilterObjectSchema: z.ZodType<Prisma.EnumMediaAssetStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaAssetStatusFilter>;
export const EnumMediaAssetStatusFilterObjectZodSchema = makeSchema();
