import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { PostTargetUpdateOneRequiredWithoutProductsNestedInputObjectSchema as PostTargetUpdateOneRequiredWithoutProductsNestedInputObjectSchema } from './PostTargetUpdateOneRequiredWithoutProductsNestedInput.schema'

const makeSchema = () => z.object({
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  postTarget: z.lazy(() => PostTargetUpdateOneRequiredWithoutProductsNestedInputObjectSchema).optional()
}).strict();
export const ProductPostTargetUpdateWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductPostTargetUpdateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetUpdateWithoutProductInput>;
export const ProductPostTargetUpdateWithoutProductInputObjectZodSchema = makeSchema();
