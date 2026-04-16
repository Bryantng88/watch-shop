import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductUpdateWithoutAcquisitionSpecJobInputObjectSchema as ProductUpdateWithoutAcquisitionSpecJobInputObjectSchema } from './ProductUpdateWithoutAcquisitionSpecJobInput.schema';
import { ProductUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema as ProductUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema } from './ProductUncheckedUpdateWithoutAcquisitionSpecJobInput.schema';
import { ProductCreateWithoutAcquisitionSpecJobInputObjectSchema as ProductCreateWithoutAcquisitionSpecJobInputObjectSchema } from './ProductCreateWithoutAcquisitionSpecJobInput.schema';
import { ProductUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema as ProductUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema } from './ProductUncheckedCreateWithoutAcquisitionSpecJobInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutAcquisitionSpecJobInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutAcquisitionSpecJobInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutAcquisitionSpecJobInput>;
export const ProductUpsertWithoutAcquisitionSpecJobInputObjectZodSchema = makeSchema();
