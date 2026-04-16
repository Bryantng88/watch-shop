import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutAcquisitionSpecJobInputObjectSchema as ProductUpdateWithoutAcquisitionSpecJobInputObjectSchema } from './ProductUpdateWithoutAcquisitionSpecJobInput.schema';
import { ProductUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema as ProductUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema } from './ProductUncheckedUpdateWithoutAcquisitionSpecJobInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutAcquisitionSpecJobInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutAcquisitionSpecJobInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutAcquisitionSpecJobInput>;
export const ProductUpdateToOneWithWhereWithoutAcquisitionSpecJobInputObjectZodSchema = makeSchema();
