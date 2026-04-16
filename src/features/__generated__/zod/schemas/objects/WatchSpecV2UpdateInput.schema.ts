import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { CaseTypeSchema } from '../enums/CaseType.schema';
import { NullableEnumCaseTypeFieldUpdateOperationsInputObjectSchema as NullableEnumCaseTypeFieldUpdateOperationsInputObjectSchema } from './NullableEnumCaseTypeFieldUpdateOperationsInput.schema';
import { NullableDecimalFieldUpdateOperationsInputObjectSchema as NullableDecimalFieldUpdateOperationsInputObjectSchema } from './NullableDecimalFieldUpdateOperationsInput.schema';
import { WatchMaterialProfileSchema } from '../enums/WatchMaterialProfile.schema';
import { EnumWatchMaterialProfileFieldUpdateOperationsInputObjectSchema as EnumWatchMaterialProfileFieldUpdateOperationsInputObjectSchema } from './EnumWatchMaterialProfileFieldUpdateOperationsInput.schema';
import { WatchCaseMaterialFamilySchema } from '../enums/WatchCaseMaterialFamily.schema';
import { EnumWatchCaseMaterialFamilyFieldUpdateOperationsInputObjectSchema as EnumWatchCaseMaterialFamilyFieldUpdateOperationsInputObjectSchema } from './EnumWatchCaseMaterialFamilyFieldUpdateOperationsInput.schema';
import { NullableEnumWatchCaseMaterialFamilyFieldUpdateOperationsInputObjectSchema as NullableEnumWatchCaseMaterialFamilyFieldUpdateOperationsInputObjectSchema } from './NullableEnumWatchCaseMaterialFamilyFieldUpdateOperationsInput.schema';
import { WatchGoldTreatmentSchema } from '../enums/WatchGoldTreatment.schema';
import { NullableEnumWatchGoldTreatmentFieldUpdateOperationsInputObjectSchema as NullableEnumWatchGoldTreatmentFieldUpdateOperationsInputObjectSchema } from './NullableEnumWatchGoldTreatmentFieldUpdateOperationsInput.schema';
import { WatchSpecV2UpdategoldColorsInputObjectSchema as WatchSpecV2UpdategoldColorsInputObjectSchema } from './WatchSpecV2UpdategoldColorsInput.schema';
import { WatchGoldColorV2Schema } from '../enums/WatchGoldColorV2.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema as NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';
import { GlassSchema } from '../enums/Glass.schema';
import { NullableEnumGlassFieldUpdateOperationsInputObjectSchema as NullableEnumGlassFieldUpdateOperationsInputObjectSchema } from './NullableEnumGlassFieldUpdateOperationsInput.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { NullableEnumMovementTypeFieldUpdateOperationsInputObjectSchema as NullableEnumMovementTypeFieldUpdateOperationsInputObjectSchema } from './NullableEnumMovementTypeFieldUpdateOperationsInput.schema';
import { StrapSchema } from '../enums/Strap.schema';
import { NullableEnumStrapFieldUpdateOperationsInputObjectSchema as NullableEnumStrapFieldUpdateOperationsInputObjectSchema } from './NullableEnumStrapFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { WatchUpdateOneRequiredWithoutWatchSpecV2NestedInputObjectSchema as WatchUpdateOneRequiredWithoutWatchSpecV2NestedInputObjectSchema } from './WatchUpdateOneRequiredWithoutWatchSpecV2NestedInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  brand: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  model: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  referenceNumber: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  nickname: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  caseShape: z.union([CaseTypeSchema, z.lazy(() => NullableEnumCaseTypeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  caseSizeMM: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  lugToLugMM: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  lugWidthMM: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  thicknessMM: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  materialProfile: z.union([WatchMaterialProfileSchema, z.lazy(() => EnumWatchMaterialProfileFieldUpdateOperationsInputObjectSchema)]).optional(),
  primaryCaseMaterial: z.union([WatchCaseMaterialFamilySchema, z.lazy(() => EnumWatchCaseMaterialFamilyFieldUpdateOperationsInputObjectSchema)]).optional(),
  secondaryCaseMaterial: z.union([WatchCaseMaterialFamilySchema, z.lazy(() => NullableEnumWatchCaseMaterialFamilyFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  goldTreatment: z.union([WatchGoldTreatmentSchema, z.lazy(() => NullableEnumWatchGoldTreatmentFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  goldColors: z.union([z.lazy(() => WatchSpecV2UpdategoldColorsInputObjectSchema), WatchGoldColorV2Schema.array()]).optional(),
  goldKarat: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  materialNote: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  dialColor: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  dialFinish: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  crystal: z.union([GlassSchema, z.lazy(() => NullableEnumGlassFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  movementType: z.union([MovementTypeSchema, z.lazy(() => NullableEnumMovementTypeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  calibre: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  powerReserve: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  waterResistance: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  braceletType: z.union([StrapSchema, z.lazy(() => NullableEnumStrapFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  strapMaterialText: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  buckleType: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  boxIncluded: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  bookletIncluded: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  cardIncluded: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  featuresJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  rawSpecJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  watch: z.lazy(() => WatchUpdateOneRequiredWithoutWatchSpecV2NestedInputObjectSchema).optional()
}).strict();
export const WatchSpecV2UpdateInputObjectSchema: z.ZodType<Prisma.WatchSpecV2UpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecV2UpdateInput>;
export const WatchSpecV2UpdateInputObjectZodSchema = makeSchema();
