import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductContentUpdatespecBulletsInputObjectSchema as ProductContentUpdatespecBulletsInputObjectSchema } from './ProductContentUpdatespecBulletsInput.schema';
import { ProductContentUpdatehashtagsInputObjectSchema as ProductContentUpdatehashtagsInputObjectSchema } from './ProductContentUpdatehashtagsInput.schema';
import { ProductUpdateOneRequiredWithoutContentNestedInputObjectSchema as ProductUpdateOneRequiredWithoutContentNestedInputObjectSchema } from './ProductUpdateOneRequiredWithoutContentNestedInput.schema'

const makeSchema = () => z.object({
  titleSnapshot: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  brandSnapshot: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  refSnapshot: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  sizeSnapshot: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  movementSnapshot: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  glassSnapshot: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  strapClaspSnapshot: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  modelSnapshot: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  yearSnapshot: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  generatedContent: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  promptNote: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  generatedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  specBullets: z.union([z.lazy(() => ProductContentUpdatespecBulletsInputObjectSchema), z.string().array()]).optional(),
  hashtags: z.union([z.lazy(() => ProductContentUpdatehashtagsInputObjectSchema), z.string().array()]).optional(),
  Product: z.lazy(() => ProductUpdateOneRequiredWithoutContentNestedInputObjectSchema).optional()
}).strict();
export const ProductContentUpdateInputObjectSchema: z.ZodType<Prisma.ProductContentUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductContentUpdateInput>;
export const ProductContentUpdateInputObjectZodSchema = makeSchema();
