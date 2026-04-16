import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutAcquisitionItemInputObjectSchema as ProductUpdateWithoutAcquisitionItemInputObjectSchema } from './ProductUpdateWithoutAcquisitionItemInput.schema';
import { ProductUncheckedUpdateWithoutAcquisitionItemInputObjectSchema as ProductUncheckedUpdateWithoutAcquisitionItemInputObjectSchema } from './ProductUncheckedUpdateWithoutAcquisitionItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutAcquisitionItemInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutAcquisitionItemInput>;
export const ProductUpdateToOneWithWhereWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
