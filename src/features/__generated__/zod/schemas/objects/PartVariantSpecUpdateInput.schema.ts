import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartTypeSchema } from '../enums/PartType.schema';
import { EnumPartTypeFieldUpdateOperationsInputObjectSchema as EnumPartTypeFieldUpdateOperationsInputObjectSchema } from './EnumPartTypeFieldUpdateOperationsInput.schema';
import { ProductVariantUpdateOneRequiredWithoutPartSpecNestedInputObjectSchema as ProductVariantUpdateOneRequiredWithoutPartSpecNestedInputObjectSchema } from './ProductVariantUpdateOneRequiredWithoutPartSpecNestedInput.schema'

const makeSchema = () => z.object({
  partType: z.union([PartTypeSchema, z.lazy(() => EnumPartTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  variant: z.lazy(() => ProductVariantUpdateOneRequiredWithoutPartSpecNestedInputObjectSchema).optional()
}).strict();
export const PartVariantSpecUpdateInputObjectSchema: z.ZodType<Prisma.PartVariantSpecUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecUpdateInput>;
export const PartVariantSpecUpdateInputObjectZodSchema = makeSchema();
