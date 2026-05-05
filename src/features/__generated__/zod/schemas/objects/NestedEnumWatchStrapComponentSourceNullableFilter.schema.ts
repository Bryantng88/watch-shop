import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapComponentSourceSchema } from '../enums/WatchStrapComponentSource.schema'

const nestedenumwatchstrapcomponentsourcenullablefilterSchema = z.object({
  equals: WatchStrapComponentSourceSchema.optional().nullable(),
  in: WatchStrapComponentSourceSchema.array().optional().nullable(),
  notIn: WatchStrapComponentSourceSchema.array().optional().nullable(),
  not: z.union([WatchStrapComponentSourceSchema, z.lazy(() => NestedEnumWatchStrapComponentSourceNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumWatchStrapComponentSourceNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchStrapComponentSourceNullableFilter> = nestedenumwatchstrapcomponentsourcenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchStrapComponentSourceNullableFilter>;
export const NestedEnumWatchStrapComponentSourceNullableFilterObjectZodSchema = nestedenumwatchstrapcomponentsourcenullablefilterSchema;
