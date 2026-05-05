import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumCaseTypeNullableFilterObjectSchema as EnumCaseTypeNullableFilterObjectSchema } from './EnumCaseTypeNullableFilter.schema';
import { CaseTypeSchema } from '../enums/CaseType.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { EnumWatchMaterialProfileFilterObjectSchema as EnumWatchMaterialProfileFilterObjectSchema } from './EnumWatchMaterialProfileFilter.schema';
import { WatchMaterialProfileSchema } from '../enums/WatchMaterialProfile.schema';
import { EnumWatchCaseMaterialFamilyFilterObjectSchema as EnumWatchCaseMaterialFamilyFilterObjectSchema } from './EnumWatchCaseMaterialFamilyFilter.schema';
import { WatchCaseMaterialFamilySchema } from '../enums/WatchCaseMaterialFamily.schema';
import { EnumWatchCaseMaterialFamilyNullableFilterObjectSchema as EnumWatchCaseMaterialFamilyNullableFilterObjectSchema } from './EnumWatchCaseMaterialFamilyNullableFilter.schema';
import { EnumWatchGoldTreatmentNullableFilterObjectSchema as EnumWatchGoldTreatmentNullableFilterObjectSchema } from './EnumWatchGoldTreatmentNullableFilter.schema';
import { WatchGoldTreatmentSchema } from '../enums/WatchGoldTreatment.schema';
import { EnumWatchGoldColorV2NullableListFilterObjectSchema as EnumWatchGoldColorV2NullableListFilterObjectSchema } from './EnumWatchGoldColorV2NullableListFilter.schema';
import { IntNullableFilterObjectSchema as IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { EnumGlassNullableFilterObjectSchema as EnumGlassNullableFilterObjectSchema } from './EnumGlassNullableFilter.schema';
import { GlassSchema } from '../enums/Glass.schema';
import { EnumMovementTypeNullableFilterObjectSchema as EnumMovementTypeNullableFilterObjectSchema } from './EnumMovementTypeNullableFilter.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { EnumStrapNullableFilterObjectSchema as EnumStrapNullableFilterObjectSchema } from './EnumStrapNullableFilter.schema';
import { StrapSchema } from '../enums/Strap.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { EnumWatchStrapSetTypeNullableFilterObjectSchema as EnumWatchStrapSetTypeNullableFilterObjectSchema } from './EnumWatchStrapSetTypeNullableFilter.schema';
import { WatchStrapSetTypeSchema } from '../enums/WatchStrapSetType.schema';
import { EnumWatchStrapComponentSourceNullableFilterObjectSchema as EnumWatchStrapComponentSourceNullableFilterObjectSchema } from './EnumWatchStrapComponentSourceNullableFilter.schema';
import { WatchStrapComponentSourceSchema } from '../enums/WatchStrapComponentSource.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { WatchScalarRelationFilterObjectSchema as WatchScalarRelationFilterObjectSchema } from './WatchScalarRelationFilter.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema'

const watchspecv2whereinputSchema = z.object({
  AND: z.union([z.lazy(() => WatchSpecV2WhereInputObjectSchema), z.lazy(() => WatchSpecV2WhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WatchSpecV2WhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WatchSpecV2WhereInputObjectSchema), z.lazy(() => WatchSpecV2WhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  watchId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  brand: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  model: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  referenceNumber: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  nickname: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  caseShape: z.union([z.lazy(() => EnumCaseTypeNullableFilterObjectSchema), CaseTypeSchema]).optional().nullable(),
  caseSizeMM: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  lugToLugMM: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  lugWidthMM: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  thicknessMM: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  materialProfile: z.union([z.lazy(() => EnumWatchMaterialProfileFilterObjectSchema), WatchMaterialProfileSchema]).optional(),
  primaryCaseMaterial: z.union([z.lazy(() => EnumWatchCaseMaterialFamilyFilterObjectSchema), WatchCaseMaterialFamilySchema]).optional(),
  secondaryCaseMaterial: z.union([z.lazy(() => EnumWatchCaseMaterialFamilyNullableFilterObjectSchema), WatchCaseMaterialFamilySchema]).optional().nullable(),
  goldTreatment: z.union([z.lazy(() => EnumWatchGoldTreatmentNullableFilterObjectSchema), WatchGoldTreatmentSchema]).optional().nullable(),
  goldColors: z.lazy(() => EnumWatchGoldColorV2NullableListFilterObjectSchema).optional(),
  goldKarat: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  materialNote: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  dialColor: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  dialFinish: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  crystal: z.union([z.lazy(() => EnumGlassNullableFilterObjectSchema), GlassSchema]).optional().nullable(),
  movementType: z.union([z.lazy(() => EnumMovementTypeNullableFilterObjectSchema), MovementTypeSchema]).optional().nullable(),
  calibre: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  powerReserve: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  waterResistance: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  braceletType: z.union([z.lazy(() => EnumStrapNullableFilterObjectSchema), StrapSchema]).optional().nullable(),
  strapMaterialText: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  buckleType: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  bookletIncluded: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  cardIncluded: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  strapSetType: z.union([z.lazy(() => EnumWatchStrapSetTypeNullableFilterObjectSchema), WatchStrapSetTypeSchema]).optional().nullable(),
  strapComponentSource: z.union([z.lazy(() => EnumWatchStrapComponentSourceNullableFilterObjectSchema), WatchStrapComponentSourceSchema]).optional().nullable(),
  featuresJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  rawSpecJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  watch: z.union([z.lazy(() => WatchScalarRelationFilterObjectSchema), z.lazy(() => WatchWhereInputObjectSchema)]).optional()
}).strict();
export const WatchSpecV2WhereInputObjectSchema: z.ZodType<Prisma.WatchSpecV2WhereInput> = watchspecv2whereinputSchema as unknown as z.ZodType<Prisma.WatchSpecV2WhereInput>;
export const WatchSpecV2WhereInputObjectZodSchema = watchspecv2whereinputSchema;
