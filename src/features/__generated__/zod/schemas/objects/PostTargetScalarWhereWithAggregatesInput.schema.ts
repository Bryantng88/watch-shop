import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const posttargetscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => PostTargetScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PostTargetScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PostTargetScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PostTargetScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PostTargetScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  platform: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  isActive: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const PostTargetScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.PostTargetScalarWhereWithAggregatesInput> = posttargetscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.PostTargetScalarWhereWithAggregatesInput>;
export const PostTargetScalarWhereWithAggregatesInputObjectZodSchema = posttargetscalarwherewithaggregatesinputSchema;
