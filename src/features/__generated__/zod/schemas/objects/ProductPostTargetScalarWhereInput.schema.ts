import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const productposttargetscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ProductPostTargetScalarWhereInputObjectSchema), z.lazy(() => ProductPostTargetScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ProductPostTargetScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ProductPostTargetScalarWhereInputObjectSchema), z.lazy(() => ProductPostTargetScalarWhereInputObjectSchema).array()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  postTargetId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const ProductPostTargetScalarWhereInputObjectSchema: z.ZodType<Prisma.ProductPostTargetScalarWhereInput> = productposttargetscalarwhereinputSchema as unknown as z.ZodType<Prisma.ProductPostTargetScalarWhereInput>;
export const ProductPostTargetScalarWhereInputObjectZodSchema = productposttargetscalarwhereinputSchema;
