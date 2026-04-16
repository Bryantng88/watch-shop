import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const nesteduuidnullablefilterSchema = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  not: z.union([z.string(), z.lazy(() => NestedUuidNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedUuidNullableFilterObjectSchema: z.ZodType<Prisma.NestedUuidNullableFilter> = nesteduuidnullablefilterSchema as unknown as z.ZodType<Prisma.NestedUuidNullableFilter>;
export const NestedUuidNullableFilterObjectZodSchema = nesteduuidnullablefilterSchema;
