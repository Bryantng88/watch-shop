import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapClaspTypeSchema } from '../enums/StrapClaspType.schema';
import { NestedEnumStrapClaspTypeNullableFilterObjectSchema as NestedEnumStrapClaspTypeNullableFilterObjectSchema } from './NestedEnumStrapClaspTypeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: StrapClaspTypeSchema.optional().nullable(),
  in: StrapClaspTypeSchema.array().optional().nullable(),
  notIn: StrapClaspTypeSchema.array().optional().nullable(),
  not: z.union([StrapClaspTypeSchema, z.lazy(() => NestedEnumStrapClaspTypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumStrapClaspTypeNullableFilterObjectSchema: z.ZodType<Prisma.EnumStrapClaspTypeNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapClaspTypeNullableFilter>;
export const EnumStrapClaspTypeNullableFilterObjectZodSchema = makeSchema();
