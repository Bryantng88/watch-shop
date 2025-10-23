import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumCaseTypeFilterObjectSchema as EnumCaseTypeFilterObjectSchema } from './EnumCaseTypeFilter.schema';
import { CaseTypeSchema } from '../enums/CaseType.schema';
import { EnumCategoryNullableListFilterObjectSchema as EnumCategoryNullableListFilterObjectSchema } from './EnumCategoryNullableListFilter.schema';
import { EnumGenderFilterObjectSchema as EnumGenderFilterObjectSchema } from './EnumGenderFilter.schema';
import { GenderSchema } from '../enums/Gender.schema';
import { DecimalFilterObjectSchema as DecimalFilterObjectSchema } from './DecimalFilter.schema';
import { EnumMovementTypeFilterObjectSchema as EnumMovementTypeFilterObjectSchema } from './EnumMovementTypeFilter.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { EnumCaseMaterialFilterObjectSchema as EnumCaseMaterialFilterObjectSchema } from './EnumCaseMaterialFilter.schema';
import { CaseMaterialSchema } from '../enums/CaseMaterial.schema';
import { IntNullableFilterObjectSchema as IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { EnumGoldColorNullableFilterObjectSchema as EnumGoldColorNullableFilterObjectSchema } from './EnumGoldColorNullableFilter.schema';
import { GoldColorSchema } from '../enums/GoldColor.schema';
import { EnumStrapFilterObjectSchema as EnumStrapFilterObjectSchema } from './EnumStrapFilter.schema';
import { StrapSchema } from '../enums/Strap.schema';
import { EnumGlassFilterObjectSchema as EnumGlassFilterObjectSchema } from './EnumGlassFilter.schema';
import { GlassSchema } from '../enums/Glass.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ProductScalarRelationFilterObjectSchema as ProductScalarRelationFilterObjectSchema } from './ProductScalarRelationFilter.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ComplicationListRelationFilterObjectSchema as ComplicationListRelationFilterObjectSchema } from './ComplicationListRelationFilter.schema';
import { MarketSegmentListRelationFilterObjectSchema as MarketSegmentListRelationFilterObjectSchema } from './MarketSegmentListRelationFilter.schema'

const watchspecwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WatchSpecWhereInputObjectSchema), z.lazy(() => WatchSpecWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WatchSpecWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WatchSpecWhereInputObjectSchema), z.lazy(() => WatchSpecWhereInputObjectSchema).array()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  model: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  year: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  caseType: z.union([z.lazy(() => EnumCaseTypeFilterObjectSchema), CaseTypeSchema]).optional(),
  category: z.lazy(() => EnumCategoryNullableListFilterObjectSchema).optional(),
  gender: z.union([z.lazy(() => EnumGenderFilterObjectSchema), GenderSchema]).optional(),
  length: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  width: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  thickness: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  movement: z.union([z.lazy(() => EnumMovementTypeFilterObjectSchema), MovementTypeSchema]).optional(),
  caliber: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  caseMaterial: z.union([z.lazy(() => EnumCaseMaterialFilterObjectSchema), CaseMaterialSchema]).optional(),
  goldKarat: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  goldColor: z.union([z.lazy(() => EnumGoldColorNullableFilterObjectSchema), GoldColorSchema]).optional().nullable(),
  caseSize: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  dialColor: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  marketSegmentId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  strap: z.union([z.lazy(() => EnumStrapFilterObjectSchema), StrapSchema]).optional(),
  glass: z.union([z.lazy(() => EnumGlassFilterObjectSchema), GlassSchema]).optional(),
  boxIncluded: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  bookletIncluded: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  cardIncluded: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  sizeCategory: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  product: z.union([z.lazy(() => ProductScalarRelationFilterObjectSchema), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  complication: z.lazy(() => ComplicationListRelationFilterObjectSchema).optional(),
  marketSegment: z.lazy(() => MarketSegmentListRelationFilterObjectSchema).optional()
}).strict();
export const WatchSpecWhereInputObjectSchema: z.ZodType<Prisma.WatchSpecWhereInput> = watchspecwhereinputSchema as unknown as z.ZodType<Prisma.WatchSpecWhereInput>;
export const WatchSpecWhereInputObjectZodSchema = watchspecwhereinputSchema;
