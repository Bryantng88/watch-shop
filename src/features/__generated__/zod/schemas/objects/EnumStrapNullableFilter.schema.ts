import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapSchema } from '../enums/Strap.schema';
import { NestedEnumStrapNullableFilterObjectSchema as NestedEnumStrapNullableFilterObjectSchema } from './NestedEnumStrapNullableFilter.schema'

const makeSchema = () => z.object({
  equals: StrapSchema.optional().nullable(),
  in: StrapSchema.array().optional().nullable(),
  notIn: StrapSchema.array().optional().nullable(),
  not: z.union([StrapSchema, z.lazy(() => NestedEnumStrapNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumStrapNullableFilterObjectSchema: z.ZodType<Prisma.EnumStrapNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapNullableFilter>;
export const EnumStrapNullableFilterObjectZodSchema = makeSchema();
