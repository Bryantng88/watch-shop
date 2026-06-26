import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { AppTagTargetTypeSchema } from '../enums/AppTagTargetType.schema';
import { EnumAppTagTargetTypeFieldUpdateOperationsInputObjectSchema as EnumAppTagTargetTypeFieldUpdateOperationsInputObjectSchema } from './EnumAppTagTargetTypeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { AppTagUpdateOneRequiredWithoutLinksNestedInputObjectSchema as AppTagUpdateOneRequiredWithoutLinksNestedInputObjectSchema } from './AppTagUpdateOneRequiredWithoutLinksNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  targetType: z.union([AppTagTargetTypeSchema, z.lazy(() => EnumAppTagTargetTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  targetId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  tag: z.lazy(() => AppTagUpdateOneRequiredWithoutLinksNestedInputObjectSchema).optional()
}).strict();
export const AppTagLinkUpdateInputObjectSchema: z.ZodType<Prisma.AppTagLinkUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkUpdateInput>;
export const AppTagLinkUpdateInputObjectZodSchema = makeSchema();
