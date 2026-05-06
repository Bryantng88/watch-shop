import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { WatchReviewActionSchema } from '../enums/WatchReviewAction.schema';
import { EnumWatchReviewActionFieldUpdateOperationsInputObjectSchema as EnumWatchReviewActionFieldUpdateOperationsInputObjectSchema } from './EnumWatchReviewActionFieldUpdateOperationsInput.schema';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema';
import { NullableEnumWatchReviewStatusFieldUpdateOperationsInputObjectSchema as NullableEnumWatchReviewStatusFieldUpdateOperationsInputObjectSchema } from './NullableEnumWatchReviewStatusFieldUpdateOperationsInput.schema';
import { EnumWatchReviewStatusFieldUpdateOperationsInputObjectSchema as EnumWatchReviewStatusFieldUpdateOperationsInputObjectSchema } from './EnumWatchReviewStatusFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { WatchReviewStateUpdateOneRequiredWithoutWatchReviewLogNestedInputObjectSchema as WatchReviewStateUpdateOneRequiredWithoutWatchReviewLogNestedInputObjectSchema } from './WatchReviewStateUpdateOneRequiredWithoutWatchReviewLogNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  action: z.union([WatchReviewActionSchema, z.lazy(() => EnumWatchReviewActionFieldUpdateOperationsInputObjectSchema)]).optional(),
  fromStatus: z.union([WatchReviewStatusSchema, z.lazy(() => NullableEnumWatchReviewStatusFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  toStatus: z.union([WatchReviewStatusSchema, z.lazy(() => EnumWatchReviewStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  actorId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  note: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  reviewState: z.lazy(() => WatchReviewStateUpdateOneRequiredWithoutWatchReviewLogNestedInputObjectSchema).optional()
}).strict();
export const WatchReviewLogUpdateInputObjectSchema: z.ZodType<Prisma.WatchReviewLogUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewLogUpdateInput>;
export const WatchReviewLogUpdateInputObjectZodSchema = makeSchema();
