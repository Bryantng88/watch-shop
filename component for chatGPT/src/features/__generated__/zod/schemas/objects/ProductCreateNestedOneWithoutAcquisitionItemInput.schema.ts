import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutAcquisitionItemInputObjectSchema as ProductCreateWithoutAcquisitionItemInputObjectSchema } from './ProductCreateWithoutAcquisitionItemInput.schema';
import { ProductUncheckedCreateWithoutAcquisitionItemInputObjectSchema as ProductUncheckedCreateWithoutAcquisitionItemInputObjectSchema } from './ProductUncheckedCreateWithoutAcquisitionItemInput.schema';
import { ProductCreateOrConnectWithoutAcquisitionItemInputObjectSchema as ProductCreateOrConnectWithoutAcquisitionItemInputObjectSchema } from './ProductCreateOrConnectWithoutAcquisitionItemInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutAcquisitionItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutAcquisitionItemInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutAcquisitionItemInput>;
export const ProductCreateNestedOneWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
