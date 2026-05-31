import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ProductPostTargetListRelationFilterObjectSchema as ProductPostTargetListRelationFilterObjectSchema } from './ProductPostTargetListRelationFilter.schema'

const posttargetwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => PostTargetWhereInputObjectSchema), z.lazy(() => PostTargetWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PostTargetWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PostTargetWhereInputObjectSchema), z.lazy(() => PostTargetWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  platform: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  products: z.lazy(() => ProductPostTargetListRelationFilterObjectSchema).optional()
}).strict();
export const PostTargetWhereInputObjectSchema: z.ZodType<Prisma.PostTargetWhereInput> = posttargetwhereinputSchema as unknown as z.ZodType<Prisma.PostTargetWhereInput>;
export const PostTargetWhereInputObjectZodSchema = posttargetwhereinputSchema;
