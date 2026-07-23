import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { MediaOwnerTypeSchema } from '../enums/MediaOwnerType.schema';
import { EnumMediaOwnerTypeFieldUpdateOperationsInputObjectSchema as EnumMediaOwnerTypeFieldUpdateOperationsInputObjectSchema } from './EnumMediaOwnerTypeFieldUpdateOperationsInput.schema';
import { MediaRoleSchema } from '../enums/MediaRole.schema';
import { EnumMediaRoleFieldUpdateOperationsInputObjectSchema as EnumMediaRoleFieldUpdateOperationsInputObjectSchema } from './EnumMediaRoleFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { AudienceSegmentSchema } from '../enums/AudienceSegment.schema';
import { EnumAudienceSegmentFieldUpdateOperationsInputObjectSchema as EnumAudienceSegmentFieldUpdateOperationsInputObjectSchema } from './EnumAudienceSegmentFieldUpdateOperationsInput.schema';
import { MediaBindingLifecycleSchema } from '../enums/MediaBindingLifecycle.schema';
import { EnumMediaBindingLifecycleFieldUpdateOperationsInputObjectSchema as EnumMediaBindingLifecycleFieldUpdateOperationsInputObjectSchema } from './EnumMediaBindingLifecycleFieldUpdateOperationsInput.schema';
import { MediaPipelineKeySchema } from '../enums/MediaPipelineKey.schema';
import { NullableEnumMediaPipelineKeyFieldUpdateOperationsInputObjectSchema as NullableEnumMediaPipelineKeyFieldUpdateOperationsInputObjectSchema } from './NullableEnumMediaPipelineKeyFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  mediaObjectId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  ownerType: z.union([MediaOwnerTypeSchema, z.lazy(() => EnumMediaOwnerTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  ownerId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  role: z.union([MediaRoleSchema, z.lazy(() => EnumMediaRoleFieldUpdateOperationsInputObjectSchema)]).optional(),
  sortOrder: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  audienceSegment: z.union([AudienceSegmentSchema, z.lazy(() => EnumAudienceSegmentFieldUpdateOperationsInputObjectSchema)]).optional(),
  lifecycle: z.union([MediaBindingLifecycleSchema, z.lazy(() => EnumMediaBindingLifecycleFieldUpdateOperationsInputObjectSchema)]).optional(),
  pipelineKey: z.union([MediaPipelineKeySchema, z.lazy(() => NullableEnumMediaPipelineKeyFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const MediaBindingUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.MediaBindingUncheckedUpdateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingUncheckedUpdateManyInput>;
export const MediaBindingUncheckedUpdateManyInputObjectZodSchema = makeSchema();
