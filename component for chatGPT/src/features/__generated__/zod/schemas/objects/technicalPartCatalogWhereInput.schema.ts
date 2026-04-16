import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const technicalpartcatalogwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => technicalPartCatalogWhereInputObjectSchema), z.lazy(() => technicalPartCatalogWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => technicalPartCatalogWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => technicalPartCatalogWhereInputObjectSchema), z.lazy(() => technicalPartCatalogWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  appliesTo: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  partGroup: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const technicalPartCatalogWhereInputObjectSchema: z.ZodType<Prisma.technicalPartCatalogWhereInput> = technicalpartcatalogwhereinputSchema as unknown as z.ZodType<Prisma.technicalPartCatalogWhereInput>;
export const technicalPartCatalogWhereInputObjectZodSchema = technicalpartcatalogwhereinputSchema;
