import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumCaseTypeNullableWithAggregatesFilterObjectSchema as EnumCaseTypeNullableWithAggregatesFilterObjectSchema } from './EnumCaseTypeNullableWithAggregatesFilter.schema';
import { CaseTypeSchema } from '../enums/CaseType.schema';
import { EnumCategoryNullableListFilterObjectSchema as EnumCategoryNullableListFilterObjectSchema } from './EnumCategoryNullableListFilter.schema';
import { EnumGenderNullableWithAggregatesFilterObjectSchema as EnumGenderNullableWithAggregatesFilterObjectSchema } from './EnumGenderNullableWithAggregatesFilter.schema';
import { GenderSchema } from '../enums/Gender.schema';
import { DecimalNullableWithAggregatesFilterObjectSchema as DecimalNullableWithAggregatesFilterObjectSchema } from './DecimalNullableWithAggregatesFilter.schema';
import { EnumMovementTypeNullableWithAggregatesFilterObjectSchema as EnumMovementTypeNullableWithAggregatesFilterObjectSchema } from './EnumMovementTypeNullableWithAggregatesFilter.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { EnumCaseMaterialWithAggregatesFilterObjectSchema as EnumCaseMaterialWithAggregatesFilterObjectSchema } from './EnumCaseMaterialWithAggregatesFilter.schema';
import { CaseMaterialSchema } from '../enums/CaseMaterial.schema';
import { IntNullableWithAggregatesFilterObjectSchema as IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema';
import { EnumGoldColorNullableWithAggregatesFilterObjectSchema as EnumGoldColorNullableWithAggregatesFilterObjectSchema } from './EnumGoldColorNullableWithAggregatesFilter.schema';
import { GoldColorSchema } from '../enums/GoldColor.schema';
import { EnumStrapNullableWithAggregatesFilterObjectSchema as EnumStrapNullableWithAggregatesFilterObjectSchema } from './EnumStrapNullableWithAggregatesFilter.schema';
import { StrapSchema } from '../enums/Strap.schema';
import { EnumGlassNullableWithAggregatesFilterObjectSchema as EnumGlassNullableWithAggregatesFilterObjectSchema } from './EnumGlassNullableWithAggregatesFilter.schema';
import { GlassSchema } from '../enums/Glass.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const watchspecscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => WatchSpecScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WatchSpecScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WatchSpecScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WatchSpecScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WatchSpecScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  productId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  model: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  year: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  caseType: z.union([z.lazy(() => EnumCaseTypeNullableWithAggregatesFilterObjectSchema), CaseTypeSchema]).optional().nullable(),
  category: z.lazy(() => EnumCategoryNullableListFilterObjectSchema).optional(),
  gender: z.union([z.lazy(() => EnumGenderNullableWithAggregatesFilterObjectSchema), GenderSchema]).optional().nullable(),
  length: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  width: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  thickness: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  movement: z.union([z.lazy(() => EnumMovementTypeNullableWithAggregatesFilterObjectSchema), MovementTypeSchema]).optional().nullable(),
  caliber: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  caseMaterial: z.union([z.lazy(() => EnumCaseMaterialWithAggregatesFilterObjectSchema), CaseMaterialSchema]).optional(),
  goldKarat: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  goldColor: z.union([z.lazy(() => EnumGoldColorNullableWithAggregatesFilterObjectSchema), GoldColorSchema]).optional().nullable(),
  caseSize: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  dialColor: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  marketSegmentId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  strap: z.union([z.lazy(() => EnumStrapNullableWithAggregatesFilterObjectSchema), StrapSchema]).optional().nullable(),
  glass: z.union([z.lazy(() => EnumGlassNullableWithAggregatesFilterObjectSchema), GlassSchema]).optional().nullable(),
  boxIncluded: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  bookletIncluded: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  cardIncluded: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  sizeCategory: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  ref: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const WatchSpecScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.WatchSpecScalarWhereWithAggregatesInput> = watchspecscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.WatchSpecScalarWhereWithAggregatesInput>;
export const WatchSpecScalarWhereWithAggregatesInputObjectZodSchema = watchspecscalarwherewithaggregatesinputSchema;
