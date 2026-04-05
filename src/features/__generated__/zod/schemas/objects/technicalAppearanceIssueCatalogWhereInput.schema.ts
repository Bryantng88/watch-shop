import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const technicalappearanceissuecatalogwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => technicalAppearanceIssueCatalogWhereInputObjectSchema), z.lazy(() => technicalAppearanceIssueCatalogWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => technicalAppearanceIssueCatalogWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => technicalAppearanceIssueCatalogWhereInputObjectSchema), z.lazy(() => technicalAppearanceIssueCatalogWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  area: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  label: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  deductionScore: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const technicalAppearanceIssueCatalogWhereInputObjectSchema: z.ZodType<Prisma.technicalAppearanceIssueCatalogWhereInput> = technicalappearanceissuecatalogwhereinputSchema as unknown as z.ZodType<Prisma.technicalAppearanceIssueCatalogWhereInput>;
export const technicalAppearanceIssueCatalogWhereInputObjectZodSchema = technicalappearanceissuecatalogwhereinputSchema;
