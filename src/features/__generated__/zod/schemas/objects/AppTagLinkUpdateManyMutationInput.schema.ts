import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { AppTagTargetTypeSchema } from '../enums/AppTagTargetType.schema';
import { EnumAppTagTargetTypeFieldUpdateOperationsInputObjectSchema as EnumAppTagTargetTypeFieldUpdateOperationsInputObjectSchema } from './EnumAppTagTargetTypeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  targetType: z.union([AppTagTargetTypeSchema, z.lazy(() => EnumAppTagTargetTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  targetId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const AppTagLinkUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.AppTagLinkUpdateManyMutationInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkUpdateManyMutationInput>;
export const AppTagLinkUpdateManyMutationInputObjectZodSchema = makeSchema();
