import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { MediaOperationTypeSchema } from '../enums/MediaOperationType.schema';
import { EnumMediaOperationTypeFieldUpdateOperationsInputObjectSchema as EnumMediaOperationTypeFieldUpdateOperationsInputObjectSchema } from './EnumMediaOperationTypeFieldUpdateOperationsInput.schema';
import { MediaOperationStatusSchema } from '../enums/MediaOperationStatus.schema';
import { EnumMediaOperationStatusFieldUpdateOperationsInputObjectSchema as EnumMediaOperationStatusFieldUpdateOperationsInputObjectSchema } from './EnumMediaOperationStatusFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  idempotencyKey: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([MediaOperationTypeSchema, z.lazy(() => EnumMediaOperationTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([MediaOperationStatusSchema, z.lazy(() => EnumMediaOperationStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  sourceKey: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  destinationKey: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  attempts: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  lastError: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  requestedByUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  startedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  completedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const MediaOperationUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.MediaOperationUpdateManyMutationInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationUpdateManyMutationInput>;
export const MediaOperationUpdateManyMutationInputObjectZodSchema = makeSchema();
