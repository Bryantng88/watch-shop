import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumCaseTypeNullableWithAggregatesFilterObjectSchema as EnumCaseTypeNullableWithAggregatesFilterObjectSchema } from './EnumCaseTypeNullableWithAggregatesFilter.schema';
import { CaseTypeSchema } from '../enums/CaseType.schema';
import { DecimalNullableWithAggregatesFilterObjectSchema as DecimalNullableWithAggregatesFilterObjectSchema } from './DecimalNullableWithAggregatesFilter.schema';
import { EnumWatchMaterialProfileWithAggregatesFilterObjectSchema as EnumWatchMaterialProfileWithAggregatesFilterObjectSchema } from './EnumWatchMaterialProfileWithAggregatesFilter.schema';
import { WatchMaterialProfileSchema } from '../enums/WatchMaterialProfile.schema';
import { EnumWatchCaseMaterialFamilyWithAggregatesFilterObjectSchema as EnumWatchCaseMaterialFamilyWithAggregatesFilterObjectSchema } from './EnumWatchCaseMaterialFamilyWithAggregatesFilter.schema';
import { WatchCaseMaterialFamilySchema } from '../enums/WatchCaseMaterialFamily.schema';
import { EnumWatchCaseMaterialFamilyNullableWithAggregatesFilterObjectSchema as EnumWatchCaseMaterialFamilyNullableWithAggregatesFilterObjectSchema } from './EnumWatchCaseMaterialFamilyNullableWithAggregatesFilter.schema';
import { EnumWatchGoldTreatmentNullableWithAggregatesFilterObjectSchema as EnumWatchGoldTreatmentNullableWithAggregatesFilterObjectSchema } from './EnumWatchGoldTreatmentNullableWithAggregatesFilter.schema';
import { WatchGoldTreatmentSchema } from '../enums/WatchGoldTreatment.schema';
import { EnumWatchGoldColorV2NullableListFilterObjectSchema as EnumWatchGoldColorV2NullableListFilterObjectSchema } from './EnumWatchGoldColorV2NullableListFilter.schema';
import { IntNullableWithAggregatesFilterObjectSchema as IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema';
import { EnumGlassNullableWithAggregatesFilterObjectSchema as EnumGlassNullableWithAggregatesFilterObjectSchema } from './EnumGlassNullableWithAggregatesFilter.schema';
import { GlassSchema } from '../enums/Glass.schema';
import { EnumMovementTypeNullableWithAggregatesFilterObjectSchema as EnumMovementTypeNullableWithAggregatesFilterObjectSchema } from './EnumMovementTypeNullableWithAggregatesFilter.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { EnumStrapNullableWithAggregatesFilterObjectSchema as EnumStrapNullableWithAggregatesFilterObjectSchema } from './EnumStrapNullableWithAggregatesFilter.schema';
import { StrapSchema } from '../enums/Strap.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const watchspecv2scalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => WatchSpecV2ScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WatchSpecV2ScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WatchSpecV2ScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WatchSpecV2ScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WatchSpecV2ScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  watchId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  brand: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  model: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  referenceNumber: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  nickname: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  caseShape: z.union([z.lazy(() => EnumCaseTypeNullableWithAggregatesFilterObjectSchema), CaseTypeSchema]).optional().nullable(),
  caseSizeMM: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  lugToLugMM: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  lugWidthMM: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  thicknessMM: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  materialProfile: z.union([z.lazy(() => EnumWatchMaterialProfileWithAggregatesFilterObjectSchema), WatchMaterialProfileSchema]).optional(),
  primaryCaseMaterial: z.union([z.lazy(() => EnumWatchCaseMaterialFamilyWithAggregatesFilterObjectSchema), WatchCaseMaterialFamilySchema]).optional(),
  secondaryCaseMaterial: z.union([z.lazy(() => EnumWatchCaseMaterialFamilyNullableWithAggregatesFilterObjectSchema), WatchCaseMaterialFamilySchema]).optional().nullable(),
  goldTreatment: z.union([z.lazy(() => EnumWatchGoldTreatmentNullableWithAggregatesFilterObjectSchema), WatchGoldTreatmentSchema]).optional().nullable(),
  goldColors: z.lazy(() => EnumWatchGoldColorV2NullableListFilterObjectSchema).optional(),
  goldKarat: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  materialNote: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  dialColor: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  dialFinish: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  crystal: z.union([z.lazy(() => EnumGlassNullableWithAggregatesFilterObjectSchema), GlassSchema]).optional().nullable(),
  movementType: z.union([z.lazy(() => EnumMovementTypeNullableWithAggregatesFilterObjectSchema), MovementTypeSchema]).optional().nullable(),
  calibre: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  powerReserve: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  waterResistance: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  braceletType: z.union([z.lazy(() => EnumStrapNullableWithAggregatesFilterObjectSchema), StrapSchema]).optional().nullable(),
  strapMaterialText: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  buckleType: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  bookletIncluded: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  cardIncluded: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  featuresJson: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  rawSpecJson: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const WatchSpecV2ScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.WatchSpecV2ScalarWhereWithAggregatesInput> = watchspecv2scalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.WatchSpecV2ScalarWhereWithAggregatesInput>;
export const WatchSpecV2ScalarWhereWithAggregatesInputObjectZodSchema = watchspecv2scalarwherewithaggregatesinputSchema;
