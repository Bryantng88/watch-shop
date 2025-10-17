import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { WatchSpecListRelationFilterObjectSchema as WatchSpecListRelationFilterObjectSchema } from './WatchSpecListRelationFilter.schema'

const complicationwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ComplicationWhereInputObjectSchema), z.lazy(() => ComplicationWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ComplicationWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ComplicationWhereInputObjectSchema), z.lazy(() => ComplicationWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  watchSpecs: z.lazy(() => WatchSpecListRelationFilterObjectSchema).optional()
}).strict();
export const ComplicationWhereInputObjectSchema: z.ZodType<Prisma.ComplicationWhereInput> = complicationwhereinputSchema as unknown as z.ZodType<Prisma.ComplicationWhereInput>;
export const ComplicationWhereInputObjectZodSchema = complicationwhereinputSchema;
