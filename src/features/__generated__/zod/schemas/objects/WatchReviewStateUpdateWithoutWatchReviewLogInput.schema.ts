import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { WatchReviewTargetTypeSchema } from '../enums/WatchReviewTargetType.schema';
import { EnumWatchReviewTargetTypeFieldUpdateOperationsInputObjectSchema as EnumWatchReviewTargetTypeFieldUpdateOperationsInputObjectSchema } from './EnumWatchReviewTargetTypeFieldUpdateOperationsInput.schema';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema';
import { EnumWatchReviewStatusFieldUpdateOperationsInputObjectSchema as EnumWatchReviewStatusFieldUpdateOperationsInputObjectSchema } from './EnumWatchReviewStatusFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { WatchUpdateOneRequiredWithoutReviewStatesNestedInputObjectSchema as WatchUpdateOneRequiredWithoutReviewStatesNestedInputObjectSchema } from './WatchUpdateOneRequiredWithoutReviewStatesNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  productId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  targetType: z.union([WatchReviewTargetTypeSchema, z.lazy(() => EnumWatchReviewTargetTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([WatchReviewStatusSchema, z.lazy(() => EnumWatchReviewStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  submittedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  submittedById: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  reviewedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  reviewedById: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  reviewNote: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  watch: z.lazy(() => WatchUpdateOneRequiredWithoutReviewStatesNestedInputObjectSchema).optional()
}).strict();
export const WatchReviewStateUpdateWithoutWatchReviewLogInputObjectSchema: z.ZodType<Prisma.WatchReviewStateUpdateWithoutWatchReviewLogInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateUpdateWithoutWatchReviewLogInput>;
export const WatchReviewStateUpdateWithoutWatchReviewLogInputObjectZodSchema = makeSchema();
