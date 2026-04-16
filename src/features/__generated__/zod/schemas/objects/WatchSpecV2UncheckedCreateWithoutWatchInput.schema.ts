import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CaseTypeSchema } from '../enums/CaseType.schema';
import { WatchMaterialProfileSchema } from '../enums/WatchMaterialProfile.schema';
import { WatchCaseMaterialFamilySchema } from '../enums/WatchCaseMaterialFamily.schema';
import { WatchGoldTreatmentSchema } from '../enums/WatchGoldTreatment.schema';
import { WatchSpecV2CreategoldColorsInputObjectSchema as WatchSpecV2CreategoldColorsInputObjectSchema } from './WatchSpecV2CreategoldColorsInput.schema';
import { WatchGoldColorV2Schema } from '../enums/WatchGoldColorV2.schema';
import { GlassSchema } from '../enums/Glass.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { StrapSchema } from '../enums/Strap.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  brand: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  referenceNumber: z.string().optional().nullable(),
  nickname: z.string().optional().nullable(),
  caseShape: CaseTypeSchema.optional().nullable(),
  caseSizeMM: z.number().optional().nullable(),
  lugToLugMM: z.number().optional().nullable(),
  lugWidthMM: z.number().optional().nullable(),
  thicknessMM: z.number().optional().nullable(),
  materialProfile: WatchMaterialProfileSchema.optional(),
  primaryCaseMaterial: WatchCaseMaterialFamilySchema.optional(),
  secondaryCaseMaterial: WatchCaseMaterialFamilySchema.optional().nullable(),
  goldTreatment: WatchGoldTreatmentSchema.optional().nullable(),
  goldColors: z.union([z.lazy(() => WatchSpecV2CreategoldColorsInputObjectSchema), WatchGoldColorV2Schema.array()]).optional(),
  goldKarat: z.number().int().optional().nullable(),
  materialNote: z.string().optional().nullable(),
  dialColor: z.string().optional().nullable(),
  dialFinish: z.string().optional().nullable(),
  crystal: GlassSchema.optional().nullable(),
  movementType: MovementTypeSchema.optional().nullable(),
  calibre: z.string().optional().nullable(),
  powerReserve: z.string().optional().nullable(),
  waterResistance: z.string().optional().nullable(),
  braceletType: StrapSchema.optional().nullable(),
  strapMaterialText: z.string().optional().nullable(),
  buckleType: z.string().optional().nullable(),
  boxIncluded: z.boolean().optional(),
  bookletIncluded: z.boolean().optional(),
  cardIncluded: z.boolean().optional(),
  featuresJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  rawSpecJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const WatchSpecV2UncheckedCreateWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchSpecV2UncheckedCreateWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecV2UncheckedCreateWithoutWatchInput>;
export const WatchSpecV2UncheckedCreateWithoutWatchInputObjectZodSchema = makeSchema();
