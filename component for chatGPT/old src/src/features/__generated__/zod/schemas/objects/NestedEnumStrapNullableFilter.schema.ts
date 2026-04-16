import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapSchema } from '../enums/Strap.schema'

const nestedenumstrapnullablefilterSchema = z.object({
  equals: StrapSchema.optional().nullable(),
  in: StrapSchema.array().optional().nullable(),
  notIn: StrapSchema.array().optional().nullable(),
  not: z.union([StrapSchema, z.lazy(() => NestedEnumStrapNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumStrapNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapNullableFilter> = nestedenumstrapnullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapNullableFilter>;
export const NestedEnumStrapNullableFilterObjectZodSchema = nestedenumstrapnullablefilterSchema;
