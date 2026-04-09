import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutAcquisitionSpecJobInputObjectSchema as ProductCreateWithoutAcquisitionSpecJobInputObjectSchema } from './ProductCreateWithoutAcquisitionSpecJobInput.schema';
import { ProductUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema as ProductUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema } from './ProductUncheckedCreateWithoutAcquisitionSpecJobInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutAcquisitionSpecJobInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutAcquisitionSpecJobInput>;
export const ProductCreateOrConnectWithoutAcquisitionSpecJobInputObjectZodSchema = makeSchema();
