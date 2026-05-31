import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductUpdateOneRequiredWithoutPostTargetsNestedInputObjectSchema as ProductUpdateOneRequiredWithoutPostTargetsNestedInputObjectSchema } from './ProductUpdateOneRequiredWithoutPostTargetsNestedInput.schema';
import { PostTargetUpdateOneRequiredWithoutProductsNestedInputObjectSchema as PostTargetUpdateOneRequiredWithoutProductsNestedInputObjectSchema } from './PostTargetUpdateOneRequiredWithoutProductsNestedInput.schema'

const makeSchema = () => z.object({
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutPostTargetsNestedInputObjectSchema).optional(),
  postTarget: z.lazy(() => PostTargetUpdateOneRequiredWithoutProductsNestedInputObjectSchema).optional()
}).strict();
export const ProductPostTargetUpdateInputObjectSchema: z.ZodType<Prisma.ProductPostTargetUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetUpdateInput>;
export const ProductPostTargetUpdateInputObjectZodSchema = makeSchema();
