import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumCaseTypeNullableFilterObjectSchema as EnumCaseTypeNullableFilterObjectSchema } from './EnumCaseTypeNullableFilter.schema';
import { CaseTypeSchema } from '../enums/CaseType.schema';
import { EnumCategoryNullableListFilterObjectSchema as EnumCategoryNullableListFilterObjectSchema } from './EnumCategoryNullableListFilter.schema';
import { EnumGenderNullableFilterObjectSchema as EnumGenderNullableFilterObjectSchema } from './EnumGenderNullableFilter.schema';
import { GenderSchema } from '../enums/Gender.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { EnumMovementTypeNullableFilterObjectSchema as EnumMovementTypeNullableFilterObjectSchema } from './EnumMovementTypeNullableFilter.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { EnumCaseMaterialFilterObjectSchema as EnumCaseMaterialFilterObjectSchema } from './EnumCaseMaterialFilter.schema';
import { CaseMaterialSchema } from '../enums/CaseMaterial.schema';
import { IntNullableFilterObjectSchema as IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { EnumGoldColorNullableFilterObjectSchema as EnumGoldColorNullableFilterObjectSchema } from './EnumGoldColorNullableFilter.schema';
import { GoldColorSchema } from '../enums/GoldColor.schema';
import { EnumStrapNullableFilterObjectSchema as EnumStrapNullableFilterObjectSchema } from './EnumStrapNullableFilter.schema';
import { StrapSchema } from '../enums/Strap.schema';
import { EnumGlassNullableFilterObjectSchema as EnumGlassNullableFilterObjectSchema } from './EnumGlassNullableFilter.schema';
import { GlassSchema } from '../enums/Glass.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const watchspecscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WatchSpecScalarWhereInputObjectSchema), z.lazy(() => WatchSpecScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WatchSpecScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WatchSpecScalarWhereInputObjectSchema), z.lazy(() => WatchSpecScalarWhereInputObjectSchema).array()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  model: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  year: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  caseType: z.union([z.lazy(() => EnumCaseTypeNullableFilterObjectSchema), CaseTypeSchema]).optional().nullable(),
  category: z.lazy(() => EnumCategoryNullableListFilterObjectSchema).optional(),
  gender: z.union([z.lazy(() => EnumGenderNullableFilterObjectSchema), GenderSchema]).optional().nullable(),
  length: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  width: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  thickness: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  movement: z.union([z.lazy(() => EnumMovementTypeNullableFilterObjectSchema), MovementTypeSchema]).optional().nullable(),
  caliber: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  caseMaterial: z.union([z.lazy(() => EnumCaseMaterialFilterObjectSchema), CaseMaterialSchema]).optional(),
  goldKarat: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  goldColor: z.union([z.lazy(() => EnumGoldColorNullableFilterObjectSchema), GoldColorSchema]).optional().nullable(),
  caseSize: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  dialColor: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  marketSegmentId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  strap: z.union([z.lazy(() => EnumStrapNullableFilterObjectSchema), StrapSchema]).optional().nullable(),
  glass: z.union([z.lazy(() => EnumGlassNullableFilterObjectSchema), GlassSchema]).optional().nullable(),
  boxIncluded: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  bookletIncluded: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  cardIncluded: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  sizeCategory: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const WatchSpecScalarWhereInputObjectSchema: z.ZodType<Prisma.WatchSpecScalarWhereInput> = watchspecscalarwhereinputSchema as unknown as z.ZodType<Prisma.WatchSpecScalarWhereInput>;
export const WatchSpecScalarWhereInputObjectZodSchema = watchspecscalarwhereinputSchema;
