import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartTypeSchema } from '../enums/PartType.schema';
import { EnumPartTypeFieldUpdateOperationsInputObjectSchema as EnumPartTypeFieldUpdateOperationsInputObjectSchema } from './EnumPartTypeFieldUpdateOperationsInput.schema';
import { ProductVariantUpdateOneRequiredWithoutPartVariantSpecNestedInputObjectSchema as ProductVariantUpdateOneRequiredWithoutPartVariantSpecNestedInputObjectSchema } from './ProductVariantUpdateOneRequiredWithoutPartVariantSpecNestedInput.schema'

const makeSchema = () => z.object({
  partType: z.union([PartTypeSchema, z.lazy(() => EnumPartTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  ProductVariant: z.lazy(() => ProductVariantUpdateOneRequiredWithoutPartVariantSpecNestedInputObjectSchema).optional()
}).strict();
export const PartVariantSpecUpdateInputObjectSchema: z.ZodType<Prisma.PartVariantSpecUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecUpdateInput>;
export const PartVariantSpecUpdateInputObjectZodSchema = makeSchema();
