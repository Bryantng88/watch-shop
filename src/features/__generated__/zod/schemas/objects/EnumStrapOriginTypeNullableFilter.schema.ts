import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapOriginTypeSchema } from '../enums/StrapOriginType.schema';
import { NestedEnumStrapOriginTypeNullableFilterObjectSchema as NestedEnumStrapOriginTypeNullableFilterObjectSchema } from './NestedEnumStrapOriginTypeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: StrapOriginTypeSchema.optional().nullable(),
  in: StrapOriginTypeSchema.array().optional().nullable(),
  notIn: StrapOriginTypeSchema.array().optional().nullable(),
  not: z.union([StrapOriginTypeSchema, z.lazy(() => NestedEnumStrapOriginTypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumStrapOriginTypeNullableFilterObjectSchema: z.ZodType<Prisma.EnumStrapOriginTypeNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapOriginTypeNullableFilter>;
export const EnumStrapOriginTypeNullableFilterObjectZodSchema = makeSchema();
