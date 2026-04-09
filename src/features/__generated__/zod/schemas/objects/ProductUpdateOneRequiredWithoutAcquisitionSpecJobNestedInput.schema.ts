import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutAcquisitionSpecJobInputObjectSchema as ProductCreateWithoutAcquisitionSpecJobInputObjectSchema } from './ProductCreateWithoutAcquisitionSpecJobInput.schema';
import { ProductUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema as ProductUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema } from './ProductUncheckedCreateWithoutAcquisitionSpecJobInput.schema';
import { ProductCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema as ProductCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema } from './ProductCreateOrConnectWithoutAcquisitionSpecJobInput.schema';
import { ProductUpsertWithoutAcquisitionSpecJobInputObjectSchema as ProductUpsertWithoutAcquisitionSpecJobInputObjectSchema } from './ProductUpsertWithoutAcquisitionSpecJobInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutAcquisitionSpecJobInputObjectSchema as ProductUpdateToOneWithWhereWithoutAcquisitionSpecJobInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutAcquisitionSpecJobInput.schema';
import { ProductUpdateWithoutAcquisitionSpecJobInputObjectSchema as ProductUpdateWithoutAcquisitionSpecJobInputObjectSchema } from './ProductUpdateWithoutAcquisitionSpecJobInput.schema';
import { ProductUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema as ProductUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema } from './ProductUncheckedUpdateWithoutAcquisitionSpecJobInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutAcquisitionSpecJobInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => ProductUpdateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneRequiredWithoutAcquisitionSpecJobNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutAcquisitionSpecJobNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneRequiredWithoutAcquisitionSpecJobNestedInput>;
export const ProductUpdateOneRequiredWithoutAcquisitionSpecJobNestedInputObjectZodSchema = makeSchema();
