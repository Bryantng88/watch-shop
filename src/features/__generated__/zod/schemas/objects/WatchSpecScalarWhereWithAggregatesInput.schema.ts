import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumCaseTypeWithAggregatesFilterObjectSchema as EnumCaseTypeWithAggregatesFilterObjectSchema } from './EnumCaseTypeWithAggregatesFilter.schema';
import { CaseTypeSchema } from '../enums/CaseType.schema';
import { EnumCategoryNullableListFilterObjectSchema as EnumCategoryNullableListFilterObjectSchema } from './EnumCategoryNullableListFilter.schema';
import { EnumGenderWithAggregatesFilterObjectSchema as EnumGenderWithAggregatesFilterObjectSchema } from './EnumGenderWithAggregatesFilter.schema';
import { GenderSchema } from '../enums/Gender.schema';
import { DecimalWithAggregatesFilterObjectSchema as DecimalWithAggregatesFilterObjectSchema } from './DecimalWithAggregatesFilter.schema';
import { EnumMovementTypeWithAggregatesFilterObjectSchema as EnumMovementTypeWithAggregatesFilterObjectSchema } from './EnumMovementTypeWithAggregatesFilter.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { EnumCaseMaterialWithAggregatesFilterObjectSchema as EnumCaseMaterialWithAggregatesFilterObjectSchema } from './EnumCaseMaterialWithAggregatesFilter.schema';
import { CaseMaterialSchema } from '../enums/CaseMaterial.schema';
import { IntNullableWithAggregatesFilterObjectSchema as IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema';
import { EnumGoldColorNullableWithAggregatesFilterObjectSchema as EnumGoldColorNullableWithAggregatesFilterObjectSchema } from './EnumGoldColorNullableWithAggregatesFilter.schema';
import { GoldColorSchema } from '../enums/GoldColor.schema';
import { EnumStrapWithAggregatesFilterObjectSchema as EnumStrapWithAggregatesFilterObjectSchema } from './EnumStrapWithAggregatesFilter.schema';
import { StrapSchema } from '../enums/Strap.schema';
import { EnumGlassWithAggregatesFilterObjectSchema as EnumGlassWithAggregatesFilterObjectSchema } from './EnumGlassWithAggregatesFilter.schema';
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
  caseType: z.union([z.lazy(() => EnumCaseTypeWithAggregatesFilterObjectSchema), CaseTypeSchema]).optional(),
  category: z.lazy(() => EnumCategoryNullableListFilterObjectSchema).optional(),
  gender: z.union([z.lazy(() => EnumGenderWithAggregatesFilterObjectSchema), GenderSchema]).optional(),
  length: z.union([z.lazy(() => DecimalWithAggregatesFilterObjectSchema), z.number()]).optional(),
  width: z.union([z.lazy(() => DecimalWithAggregatesFilterObjectSchema), z.number()]).optional(),
  thickness: z.union([z.lazy(() => DecimalWithAggregatesFilterObjectSchema), z.number()]).optional(),
  movement: z.union([z.lazy(() => EnumMovementTypeWithAggregatesFilterObjectSchema), MovementTypeSchema]).optional(),
  caliber: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  caseMaterial: z.union([z.lazy(() => EnumCaseMaterialWithAggregatesFilterObjectSchema), CaseMaterialSchema]).optional(),
  goldKarat: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  goldColor: z.union([z.lazy(() => EnumGoldColorNullableWithAggregatesFilterObjectSchema), GoldColorSchema]).optional().nullable(),
  caseSize: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  dialColor: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  marketSegmentId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  strap: z.union([z.lazy(() => EnumStrapWithAggregatesFilterObjectSchema), StrapSchema]).optional(),
  glass: z.union([z.lazy(() => EnumGlassWithAggregatesFilterObjectSchema), GlassSchema]).optional(),
  boxIncluded: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  bookletIncluded: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  cardIncluded: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  sizeCategory: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const WatchSpecScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.WatchSpecScalarWhereWithAggregatesInput> = watchspecscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.WatchSpecScalarWhereWithAggregatesInput>;
export const WatchSpecScalarWhereWithAggregatesInputObjectZodSchema = watchspecscalarwherewithaggregatesinputSchema;
