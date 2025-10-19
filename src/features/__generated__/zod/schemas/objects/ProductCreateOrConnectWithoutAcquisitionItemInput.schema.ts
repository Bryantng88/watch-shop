import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutAcquisitionItemInputObjectSchema as ProductCreateWithoutAcquisitionItemInputObjectSchema } from './ProductCreateWithoutAcquisitionItemInput.schema';
import { ProductUncheckedCreateWithoutAcquisitionItemInputObjectSchema as ProductUncheckedCreateWithoutAcquisitionItemInputObjectSchema } from './ProductUncheckedCreateWithoutAcquisitionItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutAcquisitionItemInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutAcquisitionItemInput>;
export const ProductCreateOrConnectWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
