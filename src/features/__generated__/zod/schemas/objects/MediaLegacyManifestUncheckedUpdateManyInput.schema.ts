import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { MediaLegacyClassificationSchema } from '../enums/MediaLegacyClassification.schema';
import { EnumMediaLegacyClassificationFieldUpdateOperationsInputObjectSchema as EnumMediaLegacyClassificationFieldUpdateOperationsInputObjectSchema } from './EnumMediaLegacyClassificationFieldUpdateOperationsInput.schema';
import { MediaLegacyDecisionSchema } from '../enums/MediaLegacyDecision.schema';
import { EnumMediaLegacyDecisionFieldUpdateOperationsInputObjectSchema as EnumMediaLegacyDecisionFieldUpdateOperationsInputObjectSchema } from './EnumMediaLegacyDecisionFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  legacyMediaAssetId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  legacyKey: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  classification: z.union([MediaLegacyClassificationSchema, z.lazy(() => EnumMediaLegacyClassificationFieldUpdateOperationsInputObjectSchema)]).optional(),
  decision: z.union([MediaLegacyDecisionSchema, z.lazy(() => EnumMediaLegacyDecisionFieldUpdateOperationsInputObjectSchema)]).optional(),
  physicalExists: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  productImageId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  productId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  acquisitionId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  movedFromKey: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  mediaObjectId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  note: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  scannedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  migratedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const MediaLegacyManifestUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.MediaLegacyManifestUncheckedUpdateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaLegacyManifestUncheckedUpdateManyInput>;
export const MediaLegacyManifestUncheckedUpdateManyInputObjectZodSchema = makeSchema();
