import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutAcquisitionSpecJobInputObjectSchema as ProductCreateWithoutAcquisitionSpecJobInputObjectSchema } from './ProductCreateWithoutAcquisitionSpecJobInput.schema';
import { ProductUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema as ProductUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema } from './ProductUncheckedCreateWithoutAcquisitionSpecJobInput.schema';
import { ProductCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema as ProductCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema } from './ProductCreateOrConnectWithoutAcquisitionSpecJobInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutAcquisitionSpecJobInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutAcquisitionSpecJobInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutAcquisitionSpecJobInput>;
export const ProductCreateNestedOneWithoutAcquisitionSpecJobInputObjectZodSchema = makeSchema();
