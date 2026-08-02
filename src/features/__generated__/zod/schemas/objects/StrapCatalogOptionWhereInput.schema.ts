import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumStrapCatalogOptionKindFilterObjectSchema as EnumStrapCatalogOptionKindFilterObjectSchema } from './EnumStrapCatalogOptionKindFilter.schema';
import { StrapCatalogOptionKindSchema } from '../enums/StrapCatalogOptionKind.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const strapcatalogoptionwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => StrapCatalogOptionWhereInputObjectSchema), z.lazy(() => StrapCatalogOptionWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => StrapCatalogOptionWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => StrapCatalogOptionWhereInputObjectSchema), z.lazy(() => StrapCatalogOptionWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  kind: z.union([z.lazy(() => EnumStrapCatalogOptionKindFilterObjectSchema), StrapCatalogOptionKindSchema]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  colorHex: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const StrapCatalogOptionWhereInputObjectSchema: z.ZodType<Prisma.StrapCatalogOptionWhereInput> = strapcatalogoptionwhereinputSchema as unknown as z.ZodType<Prisma.StrapCatalogOptionWhereInput>;
export const StrapCatalogOptionWhereInputObjectZodSchema = strapcatalogoptionwhereinputSchema;
