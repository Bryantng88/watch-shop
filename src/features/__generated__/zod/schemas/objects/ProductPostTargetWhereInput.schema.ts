import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ProductScalarRelationFilterObjectSchema as ProductScalarRelationFilterObjectSchema } from './ProductScalarRelationFilter.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { PostTargetScalarRelationFilterObjectSchema as PostTargetScalarRelationFilterObjectSchema } from './PostTargetScalarRelationFilter.schema';
import { PostTargetWhereInputObjectSchema as PostTargetWhereInputObjectSchema } from './PostTargetWhereInput.schema'

const productposttargetwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ProductPostTargetWhereInputObjectSchema), z.lazy(() => ProductPostTargetWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ProductPostTargetWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ProductPostTargetWhereInputObjectSchema), z.lazy(() => ProductPostTargetWhereInputObjectSchema).array()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  postTargetId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  product: z.union([z.lazy(() => ProductScalarRelationFilterObjectSchema), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  postTarget: z.union([z.lazy(() => PostTargetScalarRelationFilterObjectSchema), z.lazy(() => PostTargetWhereInputObjectSchema)]).optional()
}).strict();
export const ProductPostTargetWhereInputObjectSchema: z.ZodType<Prisma.ProductPostTargetWhereInput> = productposttargetwhereinputSchema as unknown as z.ZodType<Prisma.ProductPostTargetWhereInput>;
export const ProductPostTargetWhereInputObjectZodSchema = productposttargetwhereinputSchema;
