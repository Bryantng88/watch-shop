import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableBigIntFieldUpdateOperationsInputObjectSchema as NullableBigIntFieldUpdateOperationsInputObjectSchema } from './NullableBigIntFieldUpdateOperationsInput.schema';
import { MediaObjectAvailabilitySchema } from '../enums/MediaObjectAvailability.schema';
import { EnumMediaObjectAvailabilityFieldUpdateOperationsInputObjectSchema as EnumMediaObjectAvailabilityFieldUpdateOperationsInputObjectSchema } from './EnumMediaObjectAvailabilityFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { MediaBindingUpdateManyWithoutMediaObjectNestedInputObjectSchema as MediaBindingUpdateManyWithoutMediaObjectNestedInputObjectSchema } from './MediaBindingUpdateManyWithoutMediaObjectNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  bucket: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  storageKey: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  originalFileName: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  mimeType: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  sizeBytes: z.union([z.bigint(), z.lazy(() => NullableBigIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  checksum: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  etag: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  availability: z.union([MediaObjectAvailabilitySchema, z.lazy(() => EnumMediaObjectAvailabilityFieldUpdateOperationsInputObjectSchema)]).optional(),
  verifiedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  missingAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  bindings: z.lazy(() => MediaBindingUpdateManyWithoutMediaObjectNestedInputObjectSchema).optional()
}).strict();
export const MediaObjectUpdateWithoutOperationsInputObjectSchema: z.ZodType<Prisma.MediaObjectUpdateWithoutOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectUpdateWithoutOperationsInput>;
export const MediaObjectUpdateWithoutOperationsInputObjectZodSchema = makeSchema();
