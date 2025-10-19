import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { GoldColorSchema } from '../enums/GoldColor.schema'

const nestedenumgoldcolornullablefilterSchema = z.object({
  equals: GoldColorSchema.optional().nullable(),
  in: GoldColorSchema.array().optional().nullable(),
  notIn: GoldColorSchema.array().optional().nullable(),
  not: z.union([GoldColorSchema, z.lazy(() => NestedEnumGoldColorNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumGoldColorNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumGoldColorNullableFilter> = nestedenumgoldcolornullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumGoldColorNullableFilter>;
export const NestedEnumGoldColorNullableFilterObjectZodSchema = nestedenumgoldcolornullablefilterSchema;
