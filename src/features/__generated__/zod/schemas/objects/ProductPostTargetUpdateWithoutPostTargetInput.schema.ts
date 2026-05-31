import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductUpdateOneRequiredWithoutPostTargetsNestedInputObjectSchema as ProductUpdateOneRequiredWithoutPostTargetsNestedInputObjectSchema } from './ProductUpdateOneRequiredWithoutPostTargetsNestedInput.schema'

const makeSchema = () => z.object({
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutPostTargetsNestedInputObjectSchema).optional()
}).strict();
export const ProductPostTargetUpdateWithoutPostTargetInputObjectSchema: z.ZodType<Prisma.ProductPostTargetUpdateWithoutPostTargetInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetUpdateWithoutPostTargetInput>;
export const ProductPostTargetUpdateWithoutPostTargetInputObjectZodSchema = makeSchema();
