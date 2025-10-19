import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductUpdateWithoutAcquisitionItemInputObjectSchema as ProductUpdateWithoutAcquisitionItemInputObjectSchema } from './ProductUpdateWithoutAcquisitionItemInput.schema';
import { ProductUncheckedUpdateWithoutAcquisitionItemInputObjectSchema as ProductUncheckedUpdateWithoutAcquisitionItemInputObjectSchema } from './ProductUncheckedUpdateWithoutAcquisitionItemInput.schema';
import { ProductCreateWithoutAcquisitionItemInputObjectSchema as ProductCreateWithoutAcquisitionItemInputObjectSchema } from './ProductCreateWithoutAcquisitionItemInput.schema';
import { ProductUncheckedCreateWithoutAcquisitionItemInputObjectSchema as ProductUncheckedCreateWithoutAcquisitionItemInputObjectSchema } from './ProductUncheckedCreateWithoutAcquisitionItemInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutAcquisitionItemInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutAcquisitionItemInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutAcquisitionItemInput>;
export const ProductUpsertWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
