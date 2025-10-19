import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { PartTypeSchema } from '../enums/PartType.schema';
import { EnumPartTypeFieldUpdateOperationsInputObjectSchema as EnumPartTypeFieldUpdateOperationsInputObjectSchema } from './EnumPartTypeFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  variantId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  partType: z.union([PartTypeSchema, z.lazy(() => EnumPartTypeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const PartVariantSpecUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.PartVariantSpecUncheckedUpdateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecUncheckedUpdateManyInput>;
export const PartVariantSpecUncheckedUpdateManyInputObjectZodSchema = makeSchema();
