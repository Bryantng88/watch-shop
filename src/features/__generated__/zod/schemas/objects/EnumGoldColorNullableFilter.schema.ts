import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { GoldColorSchema } from '../enums/GoldColor.schema';
import { NestedEnumGoldColorNullableFilterObjectSchema as NestedEnumGoldColorNullableFilterObjectSchema } from './NestedEnumGoldColorNullableFilter.schema'

const makeSchema = () => z.object({
  equals: GoldColorSchema.optional().nullable(),
  in: GoldColorSchema.array().optional().nullable(),
  notIn: GoldColorSchema.array().optional().nullable(),
  not: z.union([GoldColorSchema, z.lazy(() => NestedEnumGoldColorNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumGoldColorNullableFilterObjectSchema: z.ZodType<Prisma.EnumGoldColorNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumGoldColorNullableFilter>;
export const EnumGoldColorNullableFilterObjectZodSchema = makeSchema();
